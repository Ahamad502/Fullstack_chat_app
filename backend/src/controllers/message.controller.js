import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import { containerClient, generateSASUrl, getBlobUrl, waitForReady, detectImageFormat } from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    // Generate fresh SAS URLs for profile pictures
    const usersWithFreshUrls = await Promise.all(
      filteredUsers.map(async (user) => {
        const userObj = user.toObject();
        if (userObj.profilePic) {
          userObj.profilePic = await getBlobUrl(userObj.profilePic);
        }
        return userObj;
      })
    );

    res.status(200).json(usersWithFreshUrls);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    // Generate fresh SAS URLs for any images at read time
    const messagesWithFreshUrls = await Promise.all(
      messages.map(async (msg) => {
        const msgObj = msg.toObject();
        if (msgObj.image) {
          msgObj.image = await getBlobUrl(msgObj.image);
        }
        return msgObj;
      })
    );

    res.status(200).json(messagesWithFreshUrls);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image, isGif } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let storedImage; // blob name for uploads, or direct URL for GIFs
    if (image) {
      // ── GIF URL path: store the direct URL, no upload needed ──
      if (isGif || image.startsWith("http")) {
        storedImage = image;
        console.log("Storing GIF URL directly:", image.substring(0, 80));
      } else {
        // ── Base64 image path: upload to Azure ──
        try {
          await waitForReady;

          let base64Data;
          if (image.includes(",")) {
            base64Data = image.split(",")[1];
          } else {
            base64Data = image;
          }

          if (!base64Data) {
            return res.status(400).json({ message: "Invalid image format" });
          }

          const imageBuffer = Buffer.from(base64Data, "base64");
          if (imageBuffer.length === 0) {
            return res.status(400).json({ message: "Image buffer is empty" });
          }

          const { ext, mime } = detectImageFormat(base64Data);
          const blobName = `message-${senderId}-${Date.now()}.${ext}`;
          const blockBlobClient = containerClient.getBlockBlobClient(blobName);
          console.log(`Uploading message image: ${blobName} (${mime})`);

          await blockBlobClient.upload(imageBuffer, imageBuffer.length, {
            blobHTTPHeaders: { blobContentType: mime },
          });

          storedImage = blobName;
          console.log(`Message image uploaded successfully: ${blobName}`);
        } catch (imageError) {
          console.error("Error uploading image:", imageError.message);
          return res.status(500).json({ message: "Failed to upload image: " + imageError.message });
        }
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: storedImage,
    });

    await newMessage.save();

    // Build response object — generate fresh SAS for Azure blobs, pass GIF URLs through
    const msgObj = newMessage.toObject();
    if (msgObj.image) {
      if (isGif || msgObj.image.startsWith("http")) {
        // GIF URL — already a valid public URL, no SAS needed
        // msgObj.image stays as-is
      } else {
        msgObj.image = await generateSASUrl(msgObj.image);
      }
    }

    console.log("Message saved:", newMessage.image?.substring(0, 80));

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", msgObj);
    }

    res.status(201).json(msgObj);
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
};
