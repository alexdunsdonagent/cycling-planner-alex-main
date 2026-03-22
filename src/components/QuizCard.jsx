import React from "react";

// QuizCard — renders a single option within a quiz step
// type: "choice2" | "pills" | "multi2"
// Handles selection state and i18n-aware label/sub-label
export default function QuizCard({
  type,
  option,
  selected,
  onSelect,
  multiCombo,
  subId,
  max,
}) {
  const { v, l, s, tip, popular } = option;

  // choice2 card (large ability/terrain button)
  if (type === "choice2") {
    const s = selected;
    return (
      <button
        role="radio"
        aria-checked={s}
        onClick={() => onSelect(v)}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") onSelect(v);
        }}
        style={{
          background: s ? "#e8b84b" : "#0f0f0e",
          border: `2px solid ${s ? "#e8b84b" : "#252523"}`,
          borderRadius: "7px",
          color: s ? "#0a0a08" : "#bbb",
          padding: "10px 14px",
          textAlign: "left",
          cursor: "pointer",
          transition: "all 0.15s",
          boxShadow: s ? "0 4px 20px rgba(232,184,75,0.4)" : "none",
        }}
        onMouseEnter={(e) => {
          if (!s) {
            e.currentTarget.style.borderColor = "#555";
            e.currentTarget.style.background = "#1a1a18";
          }
        }}
        onMouseLeave={(e) => {
          if (!s) {
            e.currentTarget.style.borderColor = "#252523";
            e.currentTarget.style.background = "#0f0f0e";
          }
        }}
      >
        <div
          style={{
            fontFamily: "'Playfair Display',Georgia,serif",
            fontSize: "16px",
            fontWeight: "700",
            marginBottom: "2px",
          }}
        >
          {l}
        </div>
        {s && (
          <div
            style={{
              fontFamily: "'DM Mono','Courier New',monospace",
              fontSize: "11px",
              opacity: 0.7,
            }}
          >
            {option.s}
          </div>
        )}
      </button>
    );
  }

  // pills (month/days/hours/continent)
  if (type === "pills") {
    return (
      <div style={{ position: "relative" }}>
        <button
          onClick={() => onSelect(v)}
          title={tip || ""}
          style={{
            background: selected ? "rgba(45,155,131,0.15)" : "#141413",
            border: `2px solid ${selected ? "#2D9B83" : "#2a2a28"}`,
            borderRadius: "8px",
            color: selected ? "#2D9B83" : "#9a9a94",
            padding: "8px 14px",
            cursor: "pointer",
            fontFamily: "'DM Mono','Courier New',monospace",
            fontSize: "13px",
            fontWeight: selected ? "700" : "400",
            transition: "all 0.12s",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
            boxShadow: selected ? "0 2px 12px rgba(45,155,131,0.3)" : "none",
            letterSpacing: selected ? "0.3px" : "0",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            if (!selected) {
              e.currentTarget.style.borderColor = "#555";
              e.currentTarget.style.color = "#ddd";
              e.currentTarget.style.background = "#1e1e1c";
            }
          }}
          onMouseLeave={(e) => {
            if (!selected) {
              e.currentTarget.style.borderColor = "#2a2a28";
              e.currentTarget.style.color = "#888";
              e.currentTarget.style.background = "#141413";
            }
          }}
        >
          <span style={{ position: "relative" }}>
            {l}
            {popular && !selected && (
              <span
                style={{
                  position: "absolute",
                  top: "-14px",
                  right: "-8px",
                  fontFamily: "'DM Mono','Courier New',monospace",
                  fontSize: "8px",
                  color: "#C9A96E",
                  letterSpacing: "0.5px",
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                }}
              >
                ★
              </span>
            )}
          </span>
          {tip && selected && (
            <span
              style={{
                fontSize: "10px",
                opacity: 0.7,
                maxWidth: "90px",
                textAlign: "center",
                lineHeight: 1.2,
                marginTop: "1px",
              }}
            >
              {tip}
            </span>
          )}
        </button>
        {tip && !selected && (
          <div
            style={{
              position: "absolute",
              bottom: "calc(100% + 6px)",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#1a1a18",
              border: "1px solid #2a2a28",
              borderRadius: "5px",
              padding: "5px 8px",
              whiteSpace: "nowrap",
              zIndex: 10,
              fontFamily: "'DM Mono','Courier New',monospace",
              fontSize: "10px",
              color: "#9a9a94",
              pointerEvents: "none",
              opacity: 0,
              transition: "opacity 0.15s",
            }}
          >
            {tip}
          </div>
        )}
      </div>
    );
  }

  // multi2 (priorities — pick up to max)
  if (type === "multi2") {
    const selectedArr = multiCombo || [];
    const sel = selectedArr.includes(v);
    return (
      <button
        onClick={() => {
          const prev = selectedArr;
          const next = sel
            ? prev.filter((x) => x !== v)
            : prev.length < max
              ? [...prev, v]
              : prev;
          onSelect(next);
        }}
        style={{
          background: sel ? "rgba(45,155,131,0.14)" : "#0f0f0e",
          border: `2px solid ${sel ? "#2D9B83" : "#3a3a36"}`,
          borderRadius: "7px",
          color: sel ? "#2D9B83" : "#9a9a94",
          padding: "8px 14px",
          cursor: "pointer",
          fontFamily: "Georgia,serif",
          fontSize: "14px",
          fontWeight: sel ? "700" : "400",
          transition: "all 0.12s",
          boxShadow: sel ? "0 2px 12px rgba(45,155,131,0.3)" : "none",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          if (!sel) {
            e.currentTarget.style.borderColor = "#555";
            e.currentTarget.style.color = "#ddd";
            e.currentTarget.style.background = "#1a1a18";
          }
        }}
        onMouseLeave={(e) => {
          if (!sel) {
            e.currentTarget.style.borderColor = "#252523";
            e.currentTarget.style.color = "#999";
            e.currentTarget.style.background = "#0f0f0e";
          }
        }}
      >
        {l}
      </button>
    );
  }

  return null;
}
