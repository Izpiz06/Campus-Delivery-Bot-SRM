"use client";
import { useState, useEffect } from "react";

// ────────────────────────────────────────────────────────────────────────────
// LIVE TRACKING PAGE
// ────────────────────────────────────────────────────────────────────────────

export default function LiveTrackingPage() {
  const [seconds, setSeconds] = useState(525); // 8:45 in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");

  const shadow = "10px 10px 0px 0px rgba(0,0,0,1)";
  const shadowSm = "4px 4px 0px 0px rgba(0,0,0,1)";

  return (
    <div>
      {/* ══════════════ HEADER DASHBOARD CARDS ══════════════ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
          marginBottom: 24,
        }}
        className="header-grid"
      >
        {/* Mission ID */}
        <div
          style={{
            background: "#fff",
            border: "4px solid #000",
            padding: 20,
            boxShadow: shadow,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#5e5e5e",
              textTransform: "uppercase",
            }}
          >
            MISSION_ID
          </span>
          <span style={{ fontSize: 24, fontWeight: 900 }}>#ASC-402</span>
        </div>

        {/* Drop-off Point */}
        <div
          style={{
            background: "#fff",
            border: "4px solid #000",
            padding: 20,
            boxShadow: shadow,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#5e5e5e",
              textTransform: "uppercase",
            }}
          >
            DROP-OFF POINT
          </span>
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            Pari Hostel - Block A
          </span>
        </div>

        {/* System Health */}
        <div
          style={{
            background: "#fff",
            border: "4px solid #000",
            padding: 20,
            boxShadow: shadow,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#5e5e5e",
                textTransform: "uppercase",
                display: "block",
              }}
            >
              SYSTEM HEALTH
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 4,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  background: "#22c55e",
                  border: "1px solid #000",
                }}
              />
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#22c55e",
                  textTransform: "uppercase",
                }}
              >
                Green
              </span>
            </div>
          </div>
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 40, color: "#000" }}
          >
            shield_with_heart
          </span>
        </div>
      </div>

      {/* ══════════════ MAP + SIDE PANEL ══════════════ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 1fr",
          gap: 24,
        }}
        className="map-grid"
      >
        {/* Map Area */}
        <div
          style={{
            border: "4px solid #000",
            background: "#fff",
            position: "relative",
            height: 600,
            overflow: "hidden",
            boxShadow: shadow,
          }}
        >
          {/* Google Maps embed */}
          <iframe
            src="https://maps.google.com/maps?q=SRM+Institute+of+Science+and+Technology,+Kattankulathur&t=&z=16&ie=UTF8&iwloc=&output=embed"
            style={{
              width: "100%",
              height: "100%",
              border: 0,
              filter: "grayscale(100%) contrast(125%) brightness(90%)",
              opacity: 0.5,
            }}
            loading="lazy"
          />

          {/* Bot Tracker Overlay */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "33%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                background: "#FF5F15",
                color: "#fff",
                padding: "8px 12px",
                border: "2px solid #000",
                fontSize: 11,
                fontWeight: 900,
                boxShadow: shadowSm,
                marginBottom: 8,
              }}
            >
              BOT-04 [MOVING]
            </div>
            <div
              style={{
                width: 48,
                height: 48,
                background: "#FF5F15",
                border: "4px solid #000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  color: "#fff",
                  fontSize: 28,
                  fontVariationSettings: "'FILL' 1",
                  animation: "pulse-dot 1.5s ease infinite",
                }}
              >
                smart_toy
              </span>
            </div>
            {/* Path line */}
            <div
              style={{
                position: "absolute",
                top: 56,
                left: 24,
                width: 1,
                height: 128,
                borderLeft: "2px dashed #000",
                transform: "rotate(-45deg)",
              }}
            />
          </div>

          {/* Coordinate overlay */}
          <div
            style={{
              position: "absolute",
              bottom: 24,
              left: 24,
              border: "4px solid #000",
              background: "#fff",
              padding: 12,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <span style={{ fontSize: 9, fontWeight: 900 }}>ZOOM: 1.5X</span>
            <span style={{ fontSize: 9, fontWeight: 900 }}>
              LAT: 12.8231° N
            </span>
            <span style={{ fontSize: 9, fontWeight: 900 }}>
              LON: 80.0442° E
            </span>
          </div>
        </div>

        {/* Side Panel */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: 24 }}
        >
          {/* ── ETA Card ── */}
          <div
            style={{
              background: "#FF5F15",
              border: "4px solid #000",
              padding: 24,
              boxShadow: shadow,
              color: "#fff",
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                display: "block",
                marginBottom: 8,
              }}
            >
              Estimated Arrival
            </span>
            <div
              style={{
                fontSize: 48,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.04em",
              }}
            >
              {mins}:{secs}
            </div>
            <span style={{ fontSize: 22, fontWeight: 900, display: "block" }}>
              MIN
            </span>
          </div>

          {/* ── Bot Telemetry ── */}
          <div
            style={{
              background: "#fff",
              border: "4px solid #000",
              padding: 16,
              boxShadow: shadow,
            }}
          >
            <h3
              style={{
                fontSize: 12,
                fontWeight: 900,
                textTransform: "uppercase",
                borderBottom: "4px solid #000",
                marginBottom: 16,
                paddingBottom: 4,
              }}
            >
              Bot Telemetry
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {/* Bot ID */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "#5e5e5e",
                  }}
                >
                  Bot ID
                </span>
                <span style={{ fontSize: 13, fontWeight: 900 }}>BOT-04</span>
              </div>

              {/* Battery */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "#5e5e5e",
                  }}
                >
                  Battery
                </span>
                <div
                  style={{
                    width: 96,
                    height: 16,
                    background: "#e5e2db",
                    border: "2px solid #000",
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      background: "#22c55e",
                      width: "75%",
                      borderRight: "2px solid #000",
                      height: "100%",
                    }}
                  />
                </div>
              </div>

              {/* Internal Temp */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "#5e5e5e",
                  }}
                >
                  Internal Temp
                </span>
                <span style={{ fontSize: 13, fontWeight: 900 }}>42°C</span>
              </div>

              {/* Speed */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "#5e5e5e",
                  }}
                >
                  Speed
                </span>
                <span style={{ fontSize: 13, fontWeight: 900 }}>1.2 M/S</span>
              </div>
            </div>
          </div>

          {/* ── Mission Flow Stepper ── */}
          <div
            style={{
              background: "#fff",
              border: "4px solid #000",
              padding: 16,
              boxShadow: shadow,
              flex: 1,
            }}
          >
            <h3
              style={{
                fontSize: 12,
                fontWeight: 900,
                textTransform: "uppercase",
                borderBottom: "4px solid #000",
                marginBottom: 16,
                paddingBottom: 4,
              }}
            >
              Mission Flow
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 24,
                position: "relative",
                marginLeft: 16,
              }}
            >
              {/* Vertical line */}
              <div
                style={{
                  position: "absolute",
                  left: -5,
                  top: 8,
                  bottom: 8,
                  width: 2,
                  background: "#000",
                }}
              />

              {/* CONFIRMED */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    background: "#000",
                    border: "2px solid #000",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#5e5e5e",
                    textDecoration: "line-through",
                  }}
                >
                  CONFIRMED
                </span>
              </div>

              {/* LOADING */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    background: "#000",
                    border: "2px solid #000",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#5e5e5e",
                    textDecoration: "line-through",
                  }}
                >
                  LOADING
                </span>
              </div>

              {/* TRANSIT (active) */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    background: "#FF5F15",
                    border: "2px solid #000",
                    marginLeft: -4,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 900,
                    color: "#a93800",
                    textTransform: "uppercase",
                  }}
                >
                  Transit
                </span>
              </div>

              {/* ARRIVAL */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    background: "#fff",
                    border: "2px solid #000",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#5e5e5e",
                    opacity: 0.5,
                  }}
                >
                  ARRIVAL
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════ RESPONSIVE CSS ══════════════ */}
      <style>{`
        @media (max-width: 768px) {
          .header-grid {
            grid-template-columns: 1fr !important;
          }
          .map-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 1024px) {
          .header-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
