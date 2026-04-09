import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Smile } from "lucide-react";
import toast from "react-hot-toast";
import EmojiGifPicker from "./EmojiGifPicker";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isGifPreview, setIsGifPreview] = useState(false); // true if preview is a GIF URL
  const [showPicker, setShowPicker] = useState(false);

  const fileInputRef = useRef(null);
  const pickerRef = useRef(null);
  const { sendMessage } = useChatStore();

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };
    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPicker]);

  // ── Handlers ─────────────────────────────────────────────

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setIsGifPreview(false);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setIsGifPreview(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Emoji selected → append to text input
  const handleEmojiSelect = (emoji) => {
    setText((prev) => prev + emoji);
  };

  // GIF selected → set as preview (GIF URL, not base64)
  const handleGifSelect = (gifUrl) => {
    setImagePreview(gifUrl);
    setIsGifPreview(true);
    setShowPicker(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
        isGif: isGifPreview,
      });
      setText("");
      setImagePreview(null);
      setIsGifPreview(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full relative">
      {/* ── Preview Area ── */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            {isGifPreview && (
              <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-black/70
                               text-white px-1 rounded">GIF</span>
            )}
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
                         flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* ── Emoji / GIF Picker Panel — opens above input, right-aligned ── */}
      {showPicker && (
        <div
          ref={pickerRef}
          className="absolute bottom-full mb-2 right-0 z-[9999]"
        >
          <EmojiGifPicker
            onEmojiSelect={handleEmojiSelect}
            onGifSelect={handleGifSelect}
          />
        </div>
      )}

      {/* ── Input Row ── */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {/* Emoji / GIF toggle button */}
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                        ${showPicker ? "text-primary" : "text-zinc-400"}`}
            onClick={() => setShowPicker((v) => !v)}
            title="Emoji & GIFs"
          >
            <Smile size={20} />
          </button>

          {/* Image attach button */}
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                        ${imagePreview && !isGifPreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
            title="Attach image"
          >
            <Image size={20} />
          </button>
        </div>

        {/* Send button */}
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
