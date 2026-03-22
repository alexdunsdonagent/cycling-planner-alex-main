const INTEL_TABS = [
  { id: "food", labelKey: "tabFood", icon: "☕", tc: "#E8944B" },
  { id: "airport", labelKey: "tabGetting", icon: "✈", tc: "#4B9BE8" },
  { id: "knowledge", labelKey: "tabKnowledge", icon: "📍", tc: "#9B7BDB" },
  { id: "warnings", labelKey: "tabWarnings", icon: "⚠", tc: "#DB7B7B" },
];

const FOOD_SLOTS = [
  { label: "PRE-RIDE", icon: "🌅", color: "#C9A96E", key: "preRide" },
  { label: "MID-RIDE", icon: "⚡", color: "#e8b84b", key: "midRide" },
  { label: "POST-RIDE", icon: "🍷", color: "#2D9B83", key: "postRide" },
  { label: "LOCAL FUEL", icon: "🥐", color: "#E8944B", key: "localFuel" },
];

function parseFoodText(text) {
  if (!text) return [];
  const parts = text.split(/(?<=\. )/);
  return parts.map((sentence, si) => {
    const m = sentence.match(
      /^([^\-–—(for|in|at)][^—\-]{2,40}?)(?:\s(?:for|in|at|—|–|-|\())/i,
    );
    if (m) {
      const venue = m[1].trim();
      const rest = sentence.slice(venue.length);
      return { type: "venue", venue, rest, si };
    }
    return { type: "plain", text: sentence, si };
  });
}

function FoodTab({ intel }) {
  if (!intel?.food) return null;
  return (
    <div style={{ padding: "16px 28px", background: "#090908" }}>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}
      >
        {FOOD_SLOTS.map(({ label, icon, color, key }) => {
          const text = intel.food[key] || "";
          const parsed = parseFoodText(text);
          const rgb =
            color === "#e8b84b"
              ? "232,184,75"
              : color === "#2D9B83"
                ? "45,155,131"
                : color === "#E8944B"
                  ? "232,148,75"
                  : "201,169,110";
          return (
            <div
              key={key}
              style={{
                padding: "14px 16px",
                background: "#0c0c0b",
                borderRadius: "8px",
                border: `1px solid rgba(${rgb},0.18)`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontSize: "13px" }}>{icon}</span>
                <span
                  style={{
                    fontFamily: "'DM Mono','Courier New',monospace",
                    fontSize: "10px",
                    color,
                    letterSpacing: "1.5px",
                    fontWeight: "600",
                  }}
                >
                  {label}
                </span>
              </div>
              {parsed.map((item) =>
                item.type === "venue" ? (
                  <div
                    key={item.si}
                    style={{
                      marginBottom: item.si < parsed.length - 1 ? "6px" : 0,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Playfair Display',Georgia,serif",
                        fontSize: "13px",
                        fontWeight: "700",
                        color: "#ddd",
                      }}
                    >
                      {item.venue}
                    </span>
                    <span
                      style={{
                        fontFamily: "Georgia,serif",
                        fontSize: "13px",
                        color: "#888",
                        lineHeight: 1.6,
                      }}
                    >
                      {item.rest}
                    </span>
                  </div>
                ) : (
                  <p
                    key={item.si}
                    style={{
                      fontFamily: "Georgia,serif",
                      fontSize: "13px",
                      color: "#888",
                      lineHeight: 1.6,
                      margin: "0 0 4px 0",
                    }}
                  >
                    {item.text}
                  </p>
                ),
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AirportTab({ intel, LOCATION_META, AIRPORT_INFO, ans }) {
  if (!intel?.airport) return null;
  return (
    <div
      style={{
        padding: "16px 28px",
        background: "#090908",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <div
        style={{
          background: "#0c0c0b",
          border: "1px solid rgba(74,158,255,0.15)",
          borderRadius: "8px",
          padding: "14px",
        }}
      >
        <div
          style={{
            fontFamily: "'DM Mono','Courier New',monospace",
            fontSize: "10px",
            color: "#4a9eff",
            letterSpacing: "1.5px",
            marginBottom: "6px",
          }}
        >
          PRIMARY AIRPORT
        </div>
        <p
          style={{
            fontSize: "14px",
            color: "#ccc",
            fontFamily: "Georgia,serif",
            margin: 0,
          }}
        >
          {intel.airport.primary}
        </p>
      </div>
      {intel.airport.secondary && (
        <div
          style={{
            padding: "12px 14px",
            background: "#0c0c0b",
            borderRadius: "6px",
            border: "1px solid #1a1a18",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              color: "#9a9a94",
              fontFamily: "Georgia,serif",
              margin: 0,
            }}
          >
            {intel.airport.secondary}
          </p>
        </div>
      )}
      <div
        style={{
          padding: "12px 14px",
          background: "#0c0c0b",
          borderRadius: "6px",
          border: "1px solid rgba(74,170,64,0.12)",
        }}
      >
        <div
          style={{
            fontFamily: "'DM Mono','Courier New',monospace",
            fontSize: "10px",
            color: "#4aaa40",
            letterSpacing: "1.5px",
            marginBottom: "5px",
          }}
        >
          BIKE TRANSPORT
        </div>
        <p
          style={{
            fontSize: "13px",
            color: "#9a9a94",
            fontFamily: "Georgia,serif",
            margin: "0 0 6px 0",
          }}
        >
          {intel.airport.bikeNote}
        </p>
      </div>
    </div>
  );
}

function KnowledgeTab({ intel }) {
  if (!intel?.localKnowledge && !intel?.weather) return null;
  return (
    <div style={{ padding: "16px 28px", background: "#090908" }}>
      {intel.localKnowledge && (
        <div
          style={{
            marginBottom: "12px",
            padding: "14px 16px",
            background: "#0c0c0b",
            borderRadius: "6px",
            border: "1px solid rgba(232,184,75,0.12)",
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono','Courier New',monospace",
              fontSize: "10px",
              color: "#e8b84b",
              letterSpacing: "1.5px",
              marginBottom: "8px",
            }}
          >
            LOCAL INSIDER KNOWLEDGE
          </div>
          <p
            style={{
              fontSize: "14px",
              color: "#999",
              lineHeight: 1.75,
              fontFamily: "Georgia,serif",
              margin: 0,
            }}
          >
            {intel.localKnowledge}
          </p>
        </div>
      )}
      {intel.weather && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
            gap: "8px",
          }}
        >
          {[
            ["Best months", intel.weather.months],
            ["Temperature", intel.weather.avgTemp],
            ["Rain", intel.weather.rain],
            ["Tip", intel.weather.sunriseRide],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                padding: "10px 12px",
                background: "#0c0c0b",
                borderRadius: "6px",
                border: "1px solid #1a1a18",
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Mono','Courier New',monospace",
                  fontSize: "10px",
                  color: "#7a7a74",
                  letterSpacing: "1px",
                  marginBottom: "4px",
                }}
              >
                {k.toUpperCase()}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#aaa",
                  fontFamily: "Georgia,serif",
                }}
              >
                {v}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WarningsTab({ intel }) {
  if (!intel?.warnings) return null;
  return (
    <div style={{ padding: "16px 28px", background: "#090908" }}>
      <div
        style={{
          padding: "14px 16px",
          background: "rgba(160,50,50,0.06)",
          borderRadius: "6px",
          border: "1px solid rgba(160,50,50,0.2)",
        }}
      >
        <div
          style={{
            fontFamily: "'DM Mono','Courier New',monospace",
            fontSize: "10px",
            color: "#c05050",
            letterSpacing: "1.5px",
            marginBottom: "8px",
          }}
        >
          WHAT COULD GO WRONG
        </div>
        <p
          style={{
            fontSize: "14px",
            color: "#999",
            lineHeight: 1.75,
            fontFamily: "Georgia,serif",
            margin: 0,
          }}
        >
          {intel.warnings}
        </p>
      </div>
    </div>
  );
}

export default function IntelTabs({
  base,
  intel,
  i18n,
  LOCATION_META,
  AIRPORT_INFO,
  ans,
  expandedIntel,
  setExpandedIntel,
}) {
  const current = expandedIntel?.[base?.name] || null;

  const tabs = INTEL_TABS.map((t) => ({
    ...t,
    label: i18n[t.labelKey] || t.id,
  }));

  const handleTabClick = (tabId) => {
    setExpandedIntel((prev) => ({
      ...prev,
      [base.name]: prev[base.name] === tabId ? null : tabId,
    }));
  };

  return (
    <div style={{ borderBottom: "1px solid #1a1a18" }}>
      <div
        style={{
          display: "flex",
          gap: "0",
          overflowX: "auto",
          padding: "0 28px",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTabClick(t.id)}
            style={{
              fontFamily: "'DM Mono','Courier New',monospace",
              fontSize: "11px",
              padding: "10px 16px",
              background: "transparent",
              border: "none",
              borderBottom:
                current === t.id
                  ? `2px solid ${t.tc}`
                  : "2px solid transparent",
              color: current === t.id ? t.tc : "#7a7a74",
              cursor: "pointer",
              whiteSpace: "nowrap",
              letterSpacing: "0.5px",
              transition: "all 0.15s",
            }}
          >
            <span
              style={{
                filter: current === t.id ? "none" : "grayscale(0.3)",
                transition: "filter 0.15s",
              }}
            >
              {t.icon}
            </span>{" "}
            {t.label}
          </button>
        ))}
      </div>

      {current === "food" && <FoodTab intel={intel} />}
      {current === "airport" && (
        <AirportTab
          intel={intel}
          LOCATION_META={LOCATION_META}
          AIRPORT_INFO={AIRPORT_INFO}
          ans={ans}
        />
      )}
      {current === "knowledge" && <KnowledgeTab intel={intel} />}
      {current === "warnings" && <WarningsTab intel={intel} />}
    </div>
  );
}
