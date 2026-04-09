import { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { Search, X } from "lucide-react";

const TENOR_KEY = "LIVDSRZULELA";
const TENOR_API = "https://api.tenor.com/v1";

const EmojiGifPicker = ({ onEmojiSelect, onGifSelect, theme = "dark" }) => {
  const [activeTab, setActiveTab] = useState("emoji");
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState([]);
  const [isLoadingGifs, setIsLoadingGifs] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (activeTab === "gif") fetchGifs("");
  }, [activeTab]);

  const fetchGifs = async (searchQuery) => {
    setIsLoadingGifs(true);
    try {
      const endpoint = searchQuery
        ? `${TENOR_API}/search?q=${encodeURIComponent(searchQuery)}&key=${TENOR_KEY}&limit=20&contentfilter=medium`
        : `${TENOR_API}/trending?key=${TENOR_KEY}&limit=20&contentfilter=medium`;
      const res = await fetch(endpoint);
      const data = await res.json();
      setGifs(data.results || []);
    } catch {
      setGifs([]);
    } finally {
      setIsLoadingGifs(false);
    }
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchGifs(val), 400);
  };

  const getGifUrl = (gif) => gif?.media?.[0]?.gif?.url || gif?.media?.[0]?.tinygif?.url || null;
  const getGifPreview = (gif) => gif?.media?.[0]?.tinygif?.url || gif?.media?.[0]?.gif?.url || null;

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
                <button onClick={() => { setQuery(""); fetchGifs(""); }} style={{
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
            ) : gifs.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "rgba(255,255,255,0.3)" }}>
                <span style={{ fontSize: 32 }}>🔍</span>
                <p style={{ fontSize: 13, marginTop: 8 }}>No GIFs found</p>
              </div>
            ) : (
              <div style={{ columns: 2, gap: 6 }}>
                {gifs.map((gif) => {
                  const preview = getGifPreview(gif);
                  const full = getGifUrl(gif);
                  if (!preview || !full) return null;
                  return (
                    <img
                      key={gif.id}
                      src={preview}
                      alt={gif.title || "GIF"}
                      onClick={() => onGifSelect(full)}
                      style={{
                        width: "100%", borderRadius: 8, cursor: "pointer",
                        marginBottom: 6, display: "block", objectFit: "cover",
                        transition: "opacity 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                      loading="lazy"
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Tenor credit */}
          <div style={{ padding: "3px 10px", textAlign: "right", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>Powered by Tenor</span>
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
