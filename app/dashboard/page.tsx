"use client";
import { useState, useEffect } from "react";

// ────────────────────────────────────────────────────────────────────────────
// THEME
// ────────────────────────────────────────────────────────────────────────────

const LIGHT = {
  bg: "#f6f6f6",
  cardBg: "#ffffff",
  cardText: "#000000",
  accent: "#FACC15",
  text: "#000000",
  subtext: "#6b7280",
  border: "#000000",
  sidebarBg: "#f6f6f6",
  sidebarHeaderBg: "#ffffff",
  navbarBg: "#ffffff",
  error: "#dc2626",
  mapFilter: "grayscale(100%) contrast(1.1) brightness(1.1)",
};

const DARK = {
  bg: "#0a0a0a",
  cardBg: "#ffffff",
  cardText: "#000000",
  accent: "#FF3333",
  text: "#ffffff",
  subtext: "#a1a1aa",
  border: "#ffffff",
  sidebarBg: "#0a0a0a",
  sidebarHeaderBg: "#111111",
  navbarBg: "#111111",
  error: "#FF3333",
  mapFilter: "invert(100%) hue-rotate(180deg) brightness(85%) contrast(120%)",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'JetBrains Mono', monospace;
  }

  html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.3); }
`;

// ────────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ────────────────────────────────────────────────────────────────────────────

export default function CampusBotDashboard() {
  const [dark, setDark] = useState(false);
  const [activeNav, setActiveNav] = useState("DASHBOARD");
  const [userName, setUserName] = useState("Operator");
  const t = dark ? DARK : LIGHT;

  useEffect(() => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const parsed = JSON.parse(user);
        if (parsed.name) setUserName(parsed.name);
      }
    } catch { /* ignore */ }
  }, []);

  const navItems = [
    { icon: "dashboard", label: "DASHBOARD" },
    { icon: "map", label: "LIVE MAP" },
    { icon: "local_shipping", label: "DELIVERIES" },
    { icon: "precision_manufacturing", label: "FLEET STATUS" },
    { icon: "analytics", label: "ANALYTICS" },
  ];

  const cardShadow = `4px 4px 0px 0px ${t.border}`;
  const bigShadow = `8px 8px 0px 0px ${t.border}`;

  return (
    <>
      <style>{css}</style>
      <div style={{
        display: "flex", flexDirection: "column",
        width: "100vw", height: "100vh",
        background: t.bg, color: t.text,
        transition: "all 0.3s ease",
      }}>

        {/* ══════════════ TOP NAVBAR ══════════════ */}
        <nav style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "0 24px", height: 72,
          background: t.navbarBg,
          borderBottom: `4px solid ${t.border}`,
          boxShadow: cardShadow,
          position: "sticky", top: 0, zIndex: 50,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <span style={{
              fontSize: 20, fontWeight: 900, letterSpacing: "-0.04em",
              textTransform: "uppercase", color: dark ? t.accent : t.text,
            }}>
              SRM CAMPUS DELIVERY
            </span>
            <div style={{ display: "flex", gap: 20 }}>
              {["DASHBOARD", "FLEET", "HISTORY"].map(item => (
                <a
                  key={item}
                  href="#"
                  onClick={e => { e.preventDefault(); }}
                  style={{
                    fontSize: 12, fontWeight: 700, textTransform: "uppercase",
                    letterSpacing: "-0.02em", textDecoration: "none",
                    color: item === "DASHBOARD" ? (dark ? t.accent : t.text) : t.subtext,
                    borderBottom: item === "DASHBOARD" ? `4px solid ${t.accent}` : "none",
                    paddingBottom: 4,
                    transition: "all 0.15s",
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Theme toggle */}
            <button
              onClick={() => setDark(d => !d)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: 900, color: dark ? t.accent : t.text,
                padding: "6px 12px",
              }}
            >
              {dark ? "☀️" : "🌙"}
            </button>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}>
              <span className="material-symbols-outlined" style={{ color: dark ? t.accent : t.text }}>notifications</span>
            </button>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}>
              <span className="material-symbols-outlined" style={{ color: dark ? t.accent : t.text }}>settings</span>
            </button>
            <div style={{
              width: 40, height: 40, border: `4px solid ${t.border}`,
              background: t.accent, display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: 14, color: "#000",
            }}>
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </nav>

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* ══════════════ SIDEBAR ══════════════ */}
          <aside style={{
            width: 256, flexShrink: 0,
            background: t.sidebarBg,
            borderRight: `4px solid ${t.border}`,
            display: "flex", flexDirection: "column",
            overflow: "hidden",
          }}>

            {/* Logo */}
            <div style={{
              padding: "20px 24px",
              borderBottom: `4px solid ${t.border}`,
              background: t.sidebarHeaderBg,
            }}>
              <div style={{ fontSize: 20, fontWeight: 900, fontStyle: "italic", color: dark ? t.accent : t.text }}>
                SRM BOT
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: t.subtext }}>V2.0-INDUSTRIAL</div>
            </div>

            {/* Nav Items */}
            <nav style={{ flex: 1, paddingTop: 16, overflowY: "auto" }}>
              {navItems.map(item => {
                const isActive = activeNav === item.label;
                return (
                  <div
                    key={item.label}
                    onClick={() => setActiveNav(item.label)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "14px 16px", margin: isActive ? "0 8px 4px" : "0 0 2px",
                      fontSize: 13, fontWeight: 700, cursor: "pointer",
                      transition: "all 0.1s",
                      ...(isActive ? {
                        background: t.accent,
                        color: "#000",
                        border: `4px solid ${t.border}`,
                        boxShadow: cardShadow,
                      } : {
                        color: dark ? "#fff" : "#000",
                        border: "4px solid transparent",
                      }),
                    }}
                    onMouseEnter={e => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.background = dark ? "#1a1a1a" : "#e5e7eb";
                    }}
                    onMouseLeave={e => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent";
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </nav>

            {/* Bottom */}
            <div style={{ padding: 16, borderTop: `4px solid ${t.border}` }}>
              <button
                style={{
                  width: "100%", padding: "14px 0",
                  background: t.accent, border: `4px solid ${t.border}`,
                  fontWeight: 900, fontSize: 12, cursor: "pointer",
                  boxShadow: cardShadow, transition: "all 0.1s",
                  color: "#000", textTransform: "uppercase",
                }}
                onMouseDown={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translate(2px, 2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
                onMouseUp={e => {
                  (e.currentTarget as HTMLElement).style.transform = "";
                  (e.currentTarget as HTMLElement).style.boxShadow = cardShadow;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "";
                  (e.currentTarget as HTMLElement).style.boxShadow = cardShadow;
                }}
              >
                START MISSION
              </button>
              <div
                style={{
                  marginTop: 16, padding: 8, display: "flex", alignItems: "center", gap: 12,
                  fontSize: 11, fontWeight: 700, color: t.subtext, opacity: 0.6,
                  cursor: "pointer", transition: "opacity 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "0.6"; }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
                <span>LOGOUT</span>
              </div>
            </div>
          </aside>

          {/* ══════════════ MAIN CONTENT ══════════════ */}
          <main style={{
            flex: 1, padding: 32, overflowY: "auto",
            background: dark ? "#0d0d0d" : "#f0f1f1",
          }}>

            {/* Header */}
            <header style={{ marginBottom: 32 }}>
              <h1 style={{ fontSize: 32, fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.04em", marginBottom: 8 }}>
                SYSTEM DASHBOARD [01]
              </h1>
              <p style={{ fontSize: 12, fontWeight: 700, opacity: 0.6 }}>
                BOT STATUS: ACTIVE | SIGNAL: 98% | LATENCY: 12MS
              </p>
            </header>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 32 }}>

              {/* ── LEFT COLUMN ── */}
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

                {/* Live Map */}
                <div style={{
                  position: "relative", background: "#000",
                  border: `4px solid ${t.border}`, boxShadow: bigShadow,
                  overflow: "hidden", aspectRatio: "16/9",
                }}>
                  {/* Dot grid overlay */}
                  <div style={{
                    position: "absolute", inset: 0, opacity: 0.3, mixBlendMode: "screen", pointerEvents: "none",
                    backgroundImage: "radial-gradient(circle at 2px 2px, #333 1px, transparent 0)",
                    backgroundSize: "24px 24px",
                  }} />

                  {/* Map */}
                  <iframe
                    src="https://maps.google.com/maps?q=SRM+Institute+of+Science+and+Technology,+Kattankulathur&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    style={{
                      width: "100%", height: "100%", border: 0,
                      filter: "grayscale(100%) brightness(50%) contrast(125%)",
                    }}
                    loading="lazy"
                  />

                  {/* Coordinate overlay */}
                  <div style={{
                    position: "absolute", top: 20, left: 20,
                    padding: "12px 16px",
                    background: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(12px)",
                    border: `4px solid ${dark ? t.accent : "#000"}`,
                    boxShadow: cardShadow,
                  }}>
                    <h3 style={{ fontSize: 12, fontWeight: 900, marginBottom: 4, color: "#000" }}>COORDINATES</h3>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#333" }}>X: 12.823 | Y: 80.044</p>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#333" }}>ALT: 12M</p>
                  </div>

                  {/* Live target badge */}
                  <div style={{
                    position: "absolute", bottom: 20, right: 20,
                    padding: "10px 16px",
                    background: t.accent, border: `4px solid ${dark ? t.accent : "#000"}`,
                    boxShadow: cardShadow,
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <div style={{
                      width: 10, height: 10, background: dark ? "#000" : "#dc2626",
                      border: "2px solid #000",
                      animation: "pulse-dot 1.5s ease infinite",
                    }} />
                    <span style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase", color: "#000" }}>
                      Live Target: Bot-04
                    </span>
                  </div>
                </div>

                {/* Fleet Status Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>

                  {/* Battery */}
                  <div style={{
                    background: t.cardBg, color: t.cardText, border: `4px solid ${t.border}`,
                    padding: 24, boxShadow: cardShadow,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 36 }}>battery_charging_80</span>
                      <span style={{
                        fontSize: 24, fontWeight: 900, color: t.accent,
                        textShadow: dark ? "none" : "1px 1px 0px #000",
                      }}>82%</span>
                    </div>
                    <h4 style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: t.subtext }}>
                      Battery Level
                    </h4>
                    <div style={{ marginTop: 8, height: 6, background: dark ? "#222" : "#e5e7eb", border: `2px solid ${t.border}` }}>
                      <div style={{ height: "100%", background: t.accent, width: "82%" }} />
                    </div>
                  </div>

                  {/* Speed */}
                  <div style={{
                    background: t.cardBg, color: t.cardText, border: `4px solid ${t.border}`,
                    padding: 24, boxShadow: cardShadow,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 36 }}>speed</span>
                      <span style={{ fontSize: 24, fontWeight: 900 }}>
                        4.2<span style={{ fontSize: 12 }}>km/h</span>
                      </span>
                    </div>
                    <h4 style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: t.subtext }}>
                      Avg Speed
                    </h4>
                    <p style={{ fontSize: 10, fontWeight: 700, marginTop: 8 }}>+0.4 from last hour</p>
                  </div>

                  {/* Pending */}
                  <div style={{
                    background: t.cardBg, color: t.cardText, border: `4px solid ${t.border}`,
                    padding: 24, boxShadow: cardShadow,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 36 }}>package_2</span>
                      <span style={{ fontSize: 24, fontWeight: 900 }}>12</span>
                    </div>
                    <h4 style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: t.subtext }}>
                      Pending Deliveries
                    </h4>
                    <p style={{ fontSize: 10, fontWeight: 700, marginTop: 8, color: t.error, textTransform: "uppercase" }}>
                      3 Priority Tasks
                    </p>
                  </div>
                </div>
              </div>

              {/* ── RIGHT COLUMN ── */}
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

                {/* Predicted Arrival */}
                <div style={{
                  background: t.accent, border: `4px solid ${t.border}`,
                  padding: 24, boxShadow: bigShadow, color: "#000",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 900, textTransform: "uppercase",
                      letterSpacing: "-0.02em",
                      background: "#000", color: t.accent, padding: "4px 8px",
                    }}>PREDICTED_ARRIVAL</span>
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>schedule</span>
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.7, textTransform: "uppercase", marginBottom: 4 }}>
                    ETA_REMAINING
                  </div>
                  <div style={{
                    fontSize: 44, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em",
                  }}>
                    08:45 <span style={{ fontSize: 16 }}>MIN</span>
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, marginTop: 8, opacity: 0.7 }}>
                    MISSION #ASC-402 → PARI HOSTEL BLOCK A
                  </div>
                </div>

                {/* Efficiency Index */}
                <div style={{
                  background: t.cardBg, color: t.cardText, border: `4px solid ${t.border}`,
                  padding: 24, boxShadow: bigShadow,
                }}>
                  <h3 style={{
                    fontSize: 16, fontWeight: 900, textTransform: "uppercase",
                    borderBottom: `4px solid ${t.border}`, paddingBottom: 8, marginBottom: 24,
                  }}>
                    Efficiency Index
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {[
                      { name: "BOT-01", value: 94 },
                      { name: "BOT-02", value: 78 },
                      { name: "BOT-03", value: 86 },
                      { name: "BOT-04", value: 62 },
                    ].map(bot => (
                      <div key={bot.name}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
                          <span>{bot.name}</span>
                          <span>{bot.value}%</span>
                        </div>
                        <div style={{
                          height: 20, background: dark ? "#1a1a1a" : "#f3f4f6",
                          border: `2px solid ${t.border}`, position: "relative",
                        }}>
                          <div style={{
                            position: "absolute", height: "100%",
                            background: t.accent, width: `${bot.value}%`,
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Routes */}
                <div style={{
                  background: dark ? "#111" : "#e1e3e3",
                  border: `4px solid ${t.border}`,
                  padding: 24, boxShadow: bigShadow,
                }}>
                  <h3 style={{ fontSize: 16, fontWeight: 900, textTransform: "uppercase", marginBottom: 20 }}>
                    Active Routes
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { from: "HUB_A", to: "ENG_BUILDING", eta: "4 MINS", active: true },
                      { from: "LIB_NORTH", to: "DORM_C", eta: "12 MINS", active: false },
                      { from: "FOOD_CRT", to: "ADMIN_B", eta: "8 MINS", active: false },
                    ].map((route, i) => (
                      <div key={i} style={{
                        background: t.cardBg, color: t.cardText, border: `4px solid ${t.border}`,
                        padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
                      }}>
                        <div style={{
                          padding: 8,
                          background: route.active ? t.accent : (dark ? "#222" : "#000"),
                          color: route.active ? "#000" : "#fff",
                          border: `2px solid ${t.border}`,
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>route</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 12, fontWeight: 900 }}>{route.from} → {route.to}</p>
                          <p style={{ fontSize: 10, fontWeight: 700, color: t.subtext, fontStyle: "italic" }}>
                            ETA: {route.eta}
                          </p>
                        </div>
                        <span className="material-symbols-outlined" style={{ color: t.subtext, fontSize: 20 }}>chevron_right</span>
                      </div>
                    ))}
                  </div>

                  <button
                    style={{
                      width: "100%", marginTop: 20, padding: "10px 0",
                      background: t.cardBg, border: `4px solid ${t.border}`,
                      fontWeight: 900, fontSize: 11, cursor: "pointer",
                      boxShadow: cardShadow, transition: "all 0.1s",
                      color: t.cardText, textTransform: "uppercase",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = t.accent; (e.currentTarget as HTMLElement).style.color = "#000"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = t.cardBg; (e.currentTarget as HTMLElement).style.color = t.cardText; }}
                    onMouseDown={e => {
                      (e.currentTarget as HTMLElement).style.transform = "translate(2px, 2px)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    }}
                    onMouseUp={e => {
                      (e.currentTarget as HTMLElement).style.transform = "";
                      (e.currentTarget as HTMLElement).style.boxShadow = cardShadow;
                    }}
                  >
                    VIEW ALL ROUTES
                  </button>
                </div>
              </div>
            </div>

            {/* ══════════════ FOOTER TASK BAR ══════════════ */}
            <footer style={{
              marginTop: 32, padding: 16,
              background: t.cardBg, color: t.cardText, border: `4px solid ${t.border}`,
              boxShadow: bigShadow,
              display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 24,
            }}>
              <div style={{ display: "flex", gap: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", color: t.subtext }}>Total Missions:</span>
                  <span style={{ fontSize: 14, fontWeight: 900 }}>1,204</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", color: t.subtext }}>System Uptime:</span>
                  <span style={{ fontSize: 14, fontWeight: 900 }}>99.98%</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", color: t.subtext }}>Error Rate:</span>
                  <span style={{ fontSize: 14, fontWeight: 900, color: t.error }}>0.02%</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex" }}>
                  {["#d1d5db", "#9ca3af", "#6b7280", "#000"].map((bg, i) => (
                    <div key={i} style={{
                      width: 28, height: 28, border: `2px solid ${t.border}`,
                      background: bg, marginLeft: i > 0 ? -6 : 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      ...(i === 3 ? { color: "#fff", fontSize: 9, fontWeight: 900 } : {}),
                    }}>
                      {i === 3 ? "+4" : ""}
                    </div>
                  ))}
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>Online Operators</span>
              </div>
            </footer>

          </main>
        </div>
      </div>
    </>
  );
}