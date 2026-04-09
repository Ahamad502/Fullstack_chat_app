import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState, useCallback } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { X, Download, ZoomIn } from "lucide-react";

// ─── Image Lightbox Modal ───────────────────────────────────────────────────
const ImageLightbox = ({ src, onClose }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Derive a filename from the URL or fall back to a default
      const urlParts = src.split("/");
      const rawName = urlParts[urlParts.length - 1].split("?")[0];
      a.download = rawName || "image.jpg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab so user can save manually
      window.open(src, "_blank");
    }
  };

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal panel — stop click from closing when clicking inside */}
      <div
        className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top action bar */}
        <div className="flex items-center gap-2 self-end">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium
                       bg-primary text-primary-content rounded-lg
                       hover:opacity-90 transition-opacity"
            title="Download image"
          >
            <Download size={16} />
            Download
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-base-300 hover:bg-base-content/20 transition-colors"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Full-size image */}
        <img
          src={src}
          alt="Full preview"
          className="max-w-[85vw] max-h-[80vh] rounded-xl object-contain shadow-2xl"
        />
      </div>
    </div>
  );
};

// ─── Main ChatContainer ─────────────────────────────────────────────────────
const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  const [lightboxSrc, setLightboxSrc] = useState(null);
  const openLightbox = useCallback((src) => setLightboxSrc(src), []);
  const closeLightbox = useCallback(() => setLightboxSrc(null), []);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <>
      {/* Lightbox overlay */}
      {lightboxSrc && (
        <ImageLightbox src={lightboxSrc} onClose={closeLightbox} />
      )}

      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              ref={messageEndRef}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <div className="relative group mb-2">
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md cursor-pointer
                                 transition-opacity group-hover:opacity-90"
                      onClick={() => openLightbox(message.image)}
                    />
                    {/* Hover overlay hint */}
                    <div
                      className="absolute inset-0 flex items-center justify-center
                                  opacity-0 group-hover:opacity-100 transition-opacity
                                  rounded-md bg-black/30 cursor-pointer"
                      onClick={() => openLightbox(message.image)}
                    >
                      <ZoomIn size={28} className="text-white drop-shadow" />
                    </div>
                  </div>
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          ))}
        </div>

        <MessageInput />
      </div>
    </>
  );
};

export default ChatContainer;
