import { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { Search, X } from "lucide-react";

const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY || "";
const GIPHY_API = "https://api.giphy.com/v1/gifs";

const FALLBACK_GIFS = [
  { id: "gif-1", title: "Excited", url: "https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif" },
  { id: "gif-2", title: "Party", url: "https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif" },
  { id: "gif-3", title: "Celebrate", url: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif" },
  { id: "gif-4", title: "Smile", url: "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" },
  { id: "gif-5", title: "Thumbs Up", url: "https://media.giphy.com/media/7kn27lnYSAE9O/giphy.gif" },
  { id: "gif-6", title: "Dance", url: "https://media.giphy.com/media/26BRsKfUc7KzTJlmM/giphy.gif" },
  { id: "gif-7", title: "Wave", url: "https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif" },
  { id: "gif-8", title: "Happy", url: "https://media.giphy.com/media/3o7TKsQ0kzG5Qf2yqY/giphy.gif" },
  { id: "gif-9", title: "Love", url: "https://media.giphy.com/media/3orieUe6e5M5oV2Gly/giphy.gif" },
  { id: "gif-10", title: "Wow", url: "https://media.giphy.com/media/12XMGIWtrHBl5e/giphy.gif" },
];

const EmojiGifPicker = ({ onEmojiSelect, onGifSelect, theme = "dark" }) => {
  const [activeTab, setActiveTab] = useState("emoji");
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState(FALLBACK_GIFS);
  const [isLoadingGifs, setIsLoadingGifs] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (activeTab === "gif") fetchGifs("");
  }, [activeTab]);

  const fetchGifs = async (searchQuery) => {
    setIsLoadingGifs(true);
    try {
      if (!GIPHY_API_KEY) {
        setGifs(FALLBACK_GIFS);
        return;
      }

      const endpoint = searchQuery
        ? `${GIPHY_API}/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(searchQuery)}&limit=20&rating=g&lang=en`
        : `${GIPHY_API}/trending?api_key=${GIPHY_API_KEY}&limit=20&rating=g`;

      const res = await fetch(endpoint);
      if (!res.ok) {
        throw new Error(`Giphy fetch failed: ${res.status}`);
      }

      const data = await res.json();
      const results = (data.data || [])
        .map((gif) => ({
          id: gif.id,
          title: gif.title || "GIF",
          url: gif.images?.fixed_height?.url || gif.images?.downsized_medium?.url || gif.images?.original?.url,
        }))
        .filter((gif) => gif.url);

      setGifs(results.length > 0 ? results : FALLBACK_GIFS);
    } catch {
      setGifs(FALLBACK_GIFS);
    } finally {
      setIsLoadingGifs(false);
    }
  };

  const visibleGifs = query
    ? gifs.filter((gif) => gif.title.toLowerCase().includes(query.toLowerCase()))
    : gifs;

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchGifs(val), 350);
  };

  /* ── Tab bar shared style ── */
  const tabStyle = (tab) => ({
    flex: 1,
    padding: "10px 0",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    border: "none",
    background: "transparent",
    color: activeTab === tab ? "#f59e0b" : "rgba(255,255,255,0.5)",
    borderTop: activeTab === tab ? "2px solid #f59e0b" : "2px solid transparent",
    transition: "all 0.18s",
    letterSpacing: "0.03em",
    lineHeight: 1.4,
  });

  return (
    <div style={{
      width: 340,
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
      border: "1px solid rgba(255,255,255,0.09)",
      backgroundColor: "#1a1a2e",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* ─── Content area ─── */}

      {/* Emoji tab */}
      {activeTab === "emoji" && (
        <div style={{ height: 360, overflow: "hidden" }}>
          <EmojiPicker
            onEmojiClick={(e) => onEmojiSelect(e.emoji)}
            theme={theme}
            width="100%"
            height={360}
            searchPlaceholder="Search emoji..."
            skinTonesDisabled
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}

      {/* GIF tab */}
      {activeTab === "gif" && (
        <div style={{ height: 360, display: "flex", flexDirection: "column" }}>

          {/* Search bar */}
          <div style={{ padding: "8px 10px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
            <div style={{ position: "relative" }}>
              <Search size={13} style={{
                position: "absolute", left: 10, top: "50%",
                transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none",
              }} />
              <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Search GIFs…"
                style={{
                  width: "100%", padding: "7px 32px",
                  borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.06)", color: "#fff",
                  fontSize: 13, outline: "none", boxSizing: "border-box",
                }}
              />
              {query && (
                <button onClick={() => setQuery("")} style={{
                  position: "absolute", right: 8, top: "50%",
                  transform: "translateY(-50%)", background: "none",
                  border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: 0,
                }}>
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* GIF grid */}
          <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
            {isLoadingGifs ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <div style={{
                  width: 28, height: 28,
                  border: "3px solid rgba(255,255,255,0.1)",
                  borderTop: "3px solid #f59e0b",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }} />
              </div>
            ) : visibleGifs.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "rgba(255,255,255,0.3)" }}>
                <span style={{ fontSize: 32 }}>🔍</span>
                <p style={{ fontSize: 13, marginTop: 8 }}>No GIFs found</p>
              </div>
            ) : (
              <div style={{ columns: 2, gap: 6 }}>
                {visibleGifs.map((gif) => (
                  <img
                    key={gif.id}
                    src={gif.url}
                    alt={gif.title || "GIF"}
                    onClick={() => onGifSelect(gif.url)}
                    style={{
                      width: "100%", borderRadius: 8, cursor: "pointer",
                      marginBottom: 6, display: "block", objectFit: "cover",
                      transition: "opacity 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                    loading="lazy"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Giphy footer */}
          <div style={{ padding: "3px 10px", textAlign: "right", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>Powered by Giphy</span>
          </div>
        </div>
      )}

      {/* ─── Tab bar — BOTTOM so it stays visible near the input ─── */}
      <div style={{
        display: "flex",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        backgroundColor: "#13132a",
        flexShrink: 0,
      }}>
        <button style={tabStyle("emoji")} onClick={() => setActiveTab("emoji")}>
          😊 Emoji
        </button>
        <button style={tabStyle("gif")} onClick={() => setActiveTab("gif")}>
          🎬 GIFs
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default EmojiGifPicker;
