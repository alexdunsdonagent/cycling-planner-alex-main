export default function DestGrid({
  destPage,
  DEST_PAGES,
  ROUTE_SEO_PAGES,
  setDestPage,
  setRoutePage,
  reset,
  detectedCity,
  setV,
  i18n,
}) {
  if (!destPage) return null;

  const p = DEST_PAGES.find((d) => d.slug === destPage);
  if (!p) return null;

  const destRoutes = ROUTE_SEO_PAGES.filter(
    (r) =>
      r.dest ===
        p.slug
          .replace("-cycling", "")
          .split("-")
          .map((w) => w[0].toUpperCase() + w.slice(1))
          .join(" ") ||
      p.title.includes(r.dest) ||
      r.dest ===
        p.slug
          .replace("-cycling", "")
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
  );
  const displayRoutes =
    destRoutes.length > 0
      ? destRoutes
      : (p.routes || []).map((r) => ({ ...r, slug: null }));

  const handleStartOver = () => {
    setDestPage(null);
    reset();
    setTimeout(() => {
      if (detectedCity) setV("from", detectedCity);
    }, 100);
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#080807" }}>
      {/* Hero */}
      <div
        style={{ position: "relative", height: "340px", overflow: "hidden" }}
      >
        <img
          src={p.hero}
          alt={p.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.5,
            filter: "saturate(1.1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg,rgba(8,8,7,0.3) 0%,rgba(8,8,7,0.85) 70%,#080807 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "60px",
            right: "60px",
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono','Courier New',monospace",
              fontSize: "10px",
              color: "#C9A96E",
              letterSpacing: "2px",
              marginBottom: "10px",
            }}
          >
            {p.region?.toUpperCase()}
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: "clamp(28px,4vw,52px)",
              fontWeight: "900",
              color: "#f5f2ec",
              lineHeight: 1.05,
              letterSpacing: "-1px",
              margin: "0 0 10px",
            }}
          >
            {p.title}
          </h1>
          <p
            style={{
              fontFamily: "Georgia,serif",
              fontSize: "18px",
              color: "#C9A96E",
              fontStyle: "italic",
              margin: 0,
            }}
          >
            {p.tagline}
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "40px 40px 80px",
        }}
      >
        {/* Quick stats */}
        {p.stats && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))",
              gap: "12px",
              marginBottom: "40px",
            }}
          >
            {p.stats.map((s) => (
              <div
                key={s.l}
                style={{
                  background: "#111110",
                  border: "1px solid #2e2e2b",
                  borderRadius: "8px",
                  padding: "12px 16px",
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Mono','Courier New',monospace",
                    fontSize: "9px",
                    color: "#7a7a74",
                    letterSpacing: "2px",
                    marginBottom: "4px",
                  }}
                >
                  {s.l.toUpperCase()}
                </div>
                <div
                  style={{
                    fontFamily: "Georgia,serif",
                    fontSize: "14px",
                    color: "#f0ede8",
                    fontWeight: "600",
                  }}
                >
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Intro */}
        {p.intro && (
          <p
            style={{
              fontFamily: "Georgia,serif",
              fontSize: "17px",
              color: "#bbb",
              lineHeight: 1.8,
              marginBottom: "36px",
            }}
          >
            {p.intro}
          </p>
        )}

        {/* Highlights + Routes 2-col */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "36px",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'DM Mono','Courier New',monospace",
                fontSize: "10px",
                color: "#C9A96E",
                letterSpacing: "2px",
                marginBottom: "14px",
              }}
            >
              WHAT TO RIDE
            </div>
            {p.highlights &&
              p.highlights.map((h, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "10px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      background: "#2D9B83",
                      flexShrink: 0,
                      marginTop: "8px",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "Georgia,serif",
                      fontSize: "14px",
                      color: "#ccc",
                      lineHeight: 1.5,
                    }}
                  >
                    {h}
                  </span>
                </div>
              ))}
          </div>
          <div>
            <div
              style={{
                fontFamily: "'DM Mono','Courier New',monospace",
                fontSize: "10px",
                color: "#C9A96E",
                letterSpacing: "2px",
                marginBottom: "14px",
              }}
            >
              OUT-AND-BACK ROUTES
            </div>
            {displayRoutes.map((r, i) => (
              <div
                key={i}
                style={{
                  background: "#111110",
                  border: "1px solid #2e2e2b",
                  borderRadius: "8px",
                  padding: "14px 16px",
                  marginBottom: "10px",
                  cursor: r.slug ? "pointer" : "default",
                  transition: "border-color 0.15s",
                }}
                onClick={
                  r.slug
                    ? () => {
                        setRoutePage(r.slug);
                        window.scrollTo(0, 0);
                      }
                    : undefined
                }
                onMouseEnter={
                  r.slug
                    ? (e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(232,184,75,0.3)";
                      }
                    : undefined
                }
                onMouseLeave={
                  r.slug
                    ? (e) => {
                        e.currentTarget.style.borderColor = "#2e2e2b";
                      }
                    : undefined
                }
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Playfair Display',Georgia,serif",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#f0ede8",
                      marginBottom: "4px",
                    }}
                  >
                    {r.title || r.name}
                  </div>
                  {r.slug && (
                    <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                      <path
                        d="M1 1l4 4-4 4"
                        stroke="#C9A96E"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono','Courier New',monospace",
                    fontSize: "10px",
                    color: "#e8b84b",
                    marginBottom: "4px",
                  }}
                >
                  {r.dist}
                  {r.elev ? ` · ${r.elev}` : ""}
                  {r.difficulty ? ` · ${r.difficulty}` : ""}
                </div>
                {r.desc && (
                  <div
                    style={{
                      fontFamily: "Georgia,serif",
                      fontSize: "12px",
                      color: "#888",
                      lineHeight: 1.5,
                    }}
                  >
                    {r.desc}
                  </div>
                )}
                {r.slug && (
                  <div
                    style={{
                      fontFamily: "'DM Mono','Courier New',monospace",
                      fontSize: "9px",
                      color: "#C9A96E",
                      marginTop: "6px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    View full route guide →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Food & Stay */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          {p.food && (
            <div
              style={{
                background: "#111110",
                border: "1px solid #2e2e2b",
                borderRadius: "10px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Mono','Courier New',monospace",
                  fontSize: "10px",
                  color: "#E8944B",
                  letterSpacing: "2px",
                  marginBottom: "10px",
                }}
              >
                ☕ FOOD & FUEL
              </div>
              <p
                style={{
                  fontFamily: "Georgia,serif",
                  fontSize: "14px",
                  color: "#aaa",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {p.food}
              </p>
            </div>
          )}
          {p.stayZone && (
            <div
              style={{
                background: "#111110",
                border: "1px solid #2e2e2b",
                borderRadius: "10px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Mono','Courier New',monospace",
                  fontSize: "10px",
                  color: "#4B9BE8",
                  letterSpacing: "2px",
                  marginBottom: "10px",
                }}
              >
                📍 WHERE TO STAY
              </div>
              <p
                style={{
                  fontFamily: "Georgia,serif",
                  fontSize: "14px",
                  color: "#aaa",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {p.stayZone}
              </p>
              {p.nearby && (
                <>
                  <div
                    style={{
                      marginTop: "12px",
                      fontFamily: "'DM Mono','Courier New',monospace",
                      fontSize: "10px",
                      color: "#7a7a74",
                    }}
                  >
                    Nearby destinations:
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      flexWrap: "wrap",
                      marginTop: "6px",
                    }}
                  >
                    {p.nearby.map((n) => (
                      <span
                        key={n}
                        style={{
                          fontFamily: "'DM Mono','Courier New',monospace",
                          fontSize: "10px",
                          color: "#9a9a94",
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid #2e2e2b",
                          borderRadius: "4px",
                          padding: "3px 8px",
                        }}
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* CTA */}
        <div
          style={{
            background: "linear-gradient(135deg,#111009 0%,#1a1508 100%)",
            border: "1px solid rgba(232,184,75,0.2)",
            borderRadius: "16px",
            padding: "36px 40px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono','Courier New',monospace",
              fontSize: "10px",
              color: "#C9A96E",
              letterSpacing: "2px",
              marginBottom: "12px",
            }}
          >
            PLAN YOUR TRIP TO{" "}
            {p.title.split("Cycling in ")[1]?.toUpperCase() ||
              p.title.toUpperCase()}
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: "28px",
              fontWeight: "700",
              color: "#f5f2ec",
              marginBottom: "10px",
              lineHeight: 1.2,
            }}
          >
            Get matched hotels, routes & local intel — free
          </h2>
          <p
            style={{
              fontFamily: "Georgia,serif",
              fontSize: "15px",
              color: "#9a9a94",
              marginBottom: "24px",
              lineHeight: 1.6,
            }}
          >
            Answer 8 quick questions about your ability, timing and priorities.
            We score 278 cycling destinations including{" "}
            {p.title.split("Cycling in ")[1] || p.title} against your exact
            profile in 60 seconds.
          </p>
          <button
            onClick={handleStartOver}
            style={{
              background:
                "linear-gradient(180deg,#F0C654 0%,#E8B84B 55%,#D4A23E 100%)",
              border: "none",
              borderRadius: "10px",
              color: "#0a0a08",
              padding: "16px 40px",
              cursor: "pointer",
              fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: "16px",
              fontWeight: "700",
              boxShadow: "0 6px 28px rgba(232,184,75,0.4)",
              transition: "all 0.2s",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 8px 36px rgba(232,184,75,0.6)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 6px 28px rgba(232,184,75,0.4)";
            }}
          >
            <svg width="18" height="12" viewBox="0 0 32 22" fill="none">
              <circle
                cx="6"
                cy="16"
                r="5"
                stroke="#0a0a08"
                strokeWidth="1.8"
                fill="none"
              />
              <circle
                cx="26"
                cy="16"
                r="5"
                stroke="#0a0a08"
                strokeWidth="1.8"
                fill="none"
              />
              <path
                d="M6 16 L13 5 L20 10 L26 16"
                stroke="#0a0a08"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13 5 L16 2 L20 6 L20 10"
                stroke="#0a0a08"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="16" cy="2" r="1.5" fill="#0a0a08" />
            </svg>
            Find My Perfect Cycling Trip
          </button>
          <div
            style={{
              fontFamily: "'DM Mono','Courier New',monospace",
              fontSize: "10px",
              color: "#555",
              marginTop: "12px",
            }}
          >
            {i18n?.ctaSub}
          </div>
        </div>

        {/* Other destinations */}
        <div style={{ marginTop: "40px" }}>
          <div
            style={{
              fontFamily: "'DM Mono','Courier New',monospace",
              fontSize: "10px",
              color: "#7a7a74",
              letterSpacing: "2px",
              marginBottom: "16px",
            }}
          >
            ALSO EXPLORE
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
              gap: "10px",
            }}
          >
            {DEST_PAGES.filter((d) => d.slug !== destPage)
              .slice(0, 4)
              .map((d) => (
                <button
                  key={d.slug}
                  onClick={() => {
                    setDestPage(d.slug);
                    window.scrollTo(0, 0);
                  }}
                  style={{
                    background: "#111110",
                    border: "1px solid #2e2e2b",
                    borderRadius: "8px",
                    padding: "14px 16px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(232,184,75,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#2e2e2b";
                  }}
                >
                  <div
                    style={{
                      fontFamily: "Georgia,serif",
                      fontSize: "13px",
                      color: "#ddd",
                      fontWeight: "600",
                      marginBottom: "3px",
                    }}
                  >
                    {d.title?.replace("Cycling in ", "")}
                  </div>
                  {d.stats?.[0] && (
                    <div
                      style={{
                        fontFamily: "'DM Mono','Courier New',monospace",
                        fontSize: "9px",
                        color: "#7a7a74",
                      }}
                    >
                      {d.stats[0].v}
                    </div>
                  )}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
