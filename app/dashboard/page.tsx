"use client";
import { useState } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  
  *, *::before, *::after { 
    box-sizing: border-box; 
    margin: 0; 
    padding: 0; 
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  /* Force full screen, hide native scrollbars */
  html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: var(--bg);
  }

  ::-webkit-scrollbar { width: 6px; height: 6px; background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(139, 92, 246, 0.3); border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(139, 92, 246, 0.6); }

  .soft-shadow {
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.02);
  }

  .nav-pill {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 20px;
    border-radius: 99px;
    font-size: 15px;
    font-weight: 600;
    color: var(--subtext);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .nav-pill.active {
    background-color: var(--purple);
    color: white;
  }
  .nav-pill:not(.active):hover {
    background-color: var(--purple-light);
    color: var(--purple);
  }

  .icon-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: var(--icon-bg);
    color: var(--icon-color);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s;
  }
  .icon-btn:hover { transform: scale(1.05); }

  .timeline-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    border: 2px solid var(--border);
    background: var(--card);
    position: relative;
    z-index: 2;
  }
  .timeline-dot.active {
    border-color: var(--purple);
    background: var(--purple);
    box-shadow: 0 0 0 4px var(--purple-light);
  }
  
  /* Segmented Circular Gauge */
  .speed-gauge {
    transform: rotate(135deg);
  }
  .gauge-bg {
    fill: none;
    stroke: var(--border);
    stroke-width: 12;
    stroke-dasharray: 4 6;
  }
  .gauge-val {
    fill: none;
    stroke: var(--purple);
    stroke-width: 12;
    stroke-dasharray: 4 6;
    stroke-dashoffset: 0;
    stroke-linecap: round;
  }
`;

// ─── MINI CHART SVGS ────────────────────────────────────────────────────────

const BarChart = ({ color }: { color: string }) => (
  <svg width="80" height="40" viewBox="0 0 80 40">
    <rect x="0" y="25" width="12" height="15" rx="3" fill="var(--border)" />
    <rect x="20" y="15" width="12" height="25" rx="3" fill="var(--border)" />
    <rect x="40" y="20" width="12" height="20" rx="3" fill="var(--border)" />
    <rect x="60" y="0" width="12" height="40" rx="3" fill={color} />
    <text x="6" y="38" fontSize="8" fill="var(--subtext)" textAnchor="middle" transform="translate(0, 10)">Feb</text>
    <text x="26" y="38" fontSize="8" fill="var(--subtext)" textAnchor="middle" transform="translate(0, 10)">Mar</text>
    <text x="46" y="38" fontSize="8" fill="var(--subtext)" textAnchor="middle" transform="translate(0, 10)">Apr</text>
    <text x="66" y="38" fontSize="8" fill="var(--subtext)" textAnchor="middle" transform="translate(0, 10)">May</text>
  </svg>
);

const WeightChart = ({ color }: { color: string }) => (
  <svg width="100" height="40" viewBox="0 0 100 40">
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <g key={i} transform={`translate(${i * 18}, 0)`}>
        <line x1="5" y1="5" x2="5" y2="35" stroke="var(--border)" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 4" />
        <circle cx="5" cy={10 + Math.random() * 20} r="3" fill={i === 2 || i === 4 ? color : "var(--subtext)"} />
      </g>
    ))}
  </svg>
);

const LineChart = ({ color }: { color: string }) => (
  <svg width="100" height="40" viewBox="0 0 100 40">
    <path d="M5,30 L25,15 L45,25 L65,5 L85,10" fill="none" stroke="var(--border)" strokeWidth="2" />
    <path d="M5,30 L25,15 L45,25 L65,5 L85,10" fill="none" stroke={color} strokeWidth="2" strokeDasharray="4 4" />
    {[[5, 30], [25, 15], [45, 25], [65, 5], [85, 10]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="3" fill={color} />
    ))}
  </svg>
);


// ─── THEMES ─────────────────────────────────────────────────────────────────

const LIGHT = {
  bg: "#f4f6fa", sidebar: "#ffffff", card: "#ffffff",
  text: "#1e1e2d", subtext: "#8c8c9a",
  border: "#f1f1f5", purple: "#8b5cf6", purpleLight: "#f3f0ff",
  iconBg: "#1e1e2d", iconColor: "#ffffff",
  mapFilter: "grayscale(100%) contrast(1.1) brightness(1.1)",
};

const DARK = {
  bg: "#0b0c10", sidebar: "#15161e", card: "#15161e",
  text: "#f8fafc", subtext: "#94a3b8",
  border: "#1f2937", purple: "#7c3aed", purpleLight: "rgba(124, 58, 237, 0.15)",
  iconBg: "#1f2937", iconColor: "#f8fafc",
  mapFilter: "invert(100%) hue-rotate(180deg) brightness(85%) contrast(120%) saturate(150%)",
};

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function CampusBotDashboard() {
  const [dark, setDark] = useState(false);
  const t = dark ? DARK : LIGHT;

  return (
    <>
      <style>{css}</style>
      <div style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        background: t.bg,
        color: t.text,
        transition: "background 0.3s",
        "--bg": t.bg, "--sidebar": t.sidebar, "--card": t.card,
        "--text": t.text, "--subtext": t.subtext, "--border": t.border,
        "--purple": t.purple, "--purple-light": t.purpleLight,
        "--icon-bg": t.iconBg, "--icon-color": t.iconColor
      } as React.CSSProperties}>

        {/* ── SIDEBAR ── */}
        <aside style={{ width: "280px", background: t.sidebar, padding: "32px 24px", display: "flex", flexDirection: "column", borderRight: `1px solid ${t.border}`, zIndex: 10, flexShrink: 0 }}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48, paddingLeft: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, #a78bfa, ${t.purple})`, position: "relative" }}>
              <div style={{ position: "absolute", inset: 8, background: t.sidebar, borderRadius: "50%", clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)" }} />
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: t.text }}>CampusBot</span>
          </div>

          {/* Navigation */}
          <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="nav-pill">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
              Dashboard
            </div>
            <div className="nav-pill active">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
              Deliveries
              <span style={{ marginLeft: "auto" }}>›</span>
            </div>
            <div className="nav-pill">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
              Fleet Status
            </div>
            <div className="nav-pill">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="10" r="3" /><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" /></svg>
              Map Overview
            </div>
            <div className="nav-pill">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              Messages
              <span style={{ marginLeft: "auto", background: t.purple, color: "white", width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>3</span>
            </div>
            <div className="nav-pill" style={{ marginTop: 16 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
              Settings
            </div>
          </nav>

          {/* User Profile & Theme Toggle */}
          <div style={{ marginTop: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, paddingLeft: 8 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: t.purple, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 16 }}>
                MI
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>Mohammad Izaan</div>
                <div style={{ fontSize: 12, color: t.subtext, marginTop: 2 }}>SRM IST, Chennai</div>
              </div>
            </div>

            <div style={{ display: "flex", background: dark ? t.border : "#f4f4f8", borderRadius: 99, padding: 6 }}>
              <button
                onClick={() => setDark(false)}
                style={{ flex: 1, padding: "10px", borderRadius: 99, border: "none", background: !dark ? t.iconBg : "transparent", color: !dark ? t.iconColor : t.subtext, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
              >Light</button>
              <button
                onClick={() => setDark(true)}
                style={{ flex: 1, padding: "10px", borderRadius: 99, border: "none", background: dark ? t.iconBg : "transparent", color: dark ? t.iconColor : t.subtext, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
              >Dark</button>
            </div>
          </div>
        </aside>


        {/* ── MAIN CONTENT AREA ── */}
        <main style={{ flex: 1, padding: "40px 56px", overflowY: "auto", display: "flex", flexDirection: "column" }}>

          <div style={{ maxWidth: "1600px", margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: 32 }}>

            {/* Header */}
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: t.text, marginBottom: 4 }}>Welcome back, Izaan!</h1>
                <p style={{ color: t.subtext, fontSize: 15 }}>You have 1 active delivery in progress.</p>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div className="icon-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg></div>
                <div className="icon-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg></div>
                <div className="icon-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg></div>
                <button style={{ padding: "14px 28px", background: t.purple, color: "white", border: "none", borderRadius: 99, fontWeight: 700, fontSize: 14, cursor: "pointer", marginLeft: 12, transition: "background 0.2s", boxShadow: "0 4px 16px rgba(139, 92, 246, 0.3)" }}>
                  Deploy New Bot
                </button>
              </div>
            </header>

            {/* Stats Row */}
            <div style={{ display: "flex", gap: 24 }}>

              {/* Stat 1 */}
              <div className="soft-shadow" style={{ flex: 1, borderRadius: 28, border: `1px solid ${t.border}`, background: t.card, padding: "24px 28px" }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: t.text, marginBottom: 16 }}>This month deliveries</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: t.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={t.iconColor} strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: 36, fontWeight: 800, color: t.text, lineHeight: 1 }}>132 <span style={{ fontSize: 13, fontWeight: 700, color: "#22c55e", verticalAlign: "middle" }}>↑ 25%</span></div>
                    </div>
                  </div>
                  <BarChart color={t.purple} />
                </div>
              </div>

              {/* Stat 2 */}
              <div className="soft-shadow" style={{ flex: 1, borderRadius: 28, border: `1px solid ${t.border}`, background: t.card, padding: "24px 28px" }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: t.text, marginBottom: 16 }}>Average payload</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: t.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={t.iconColor} strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: 36, fontWeight: 800, color: t.text, lineHeight: 1 }}>12 <span style={{ fontSize: 22 }}>kg</span> <span style={{ fontSize: 13, fontWeight: 700, color: t.subtext, verticalAlign: "middle" }}>↓ 12%</span></div>
                    </div>
                  </div>
                  <WeightChart color={t.purple} />
                </div>
              </div>

              {/* Stat 3 */}
              <div className="soft-shadow" style={{ flex: 1, borderRadius: 28, border: `1px solid ${t.border}`, background: t.card, padding: "24px 28px" }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: t.text, marginBottom: 16 }}>Distance covered</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: t.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={t.iconColor} strokeWidth="2"><polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" /></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: 36, fontWeight: 800, color: t.text, lineHeight: 1 }}>872 <span style={{ fontSize: 22 }}>km</span></div>
                    </div>
                  </div>
                  <LineChart color={t.purple} />
                </div>
              </div>
            </div>

            {/* BENTO GRID AREA */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1fr", gap: 24, flex: 1 }}>

              {/* ── COLUMN 1 ── */}
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                {/* Package Details */}
                <div className="soft-shadow" style={{ borderRadius: 28, border: `1px solid ${t.border}`, background: t.card, padding: "28px", flex: 1 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: t.text, marginBottom: 4 }}>Package Details</h3>
                  <div style={{ fontSize: 14, color: t.subtext, marginBottom: 28 }}>Electronics  |  In progress</div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 36 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: t.text }}>2.5 <span style={{ fontSize: 12, fontWeight: 600 }}>kg</span></div>
                      <div style={{ fontSize: 12, color: t.subtext, marginTop: 4 }}>Weight</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: t.text }}>10.0 <span style={{ fontSize: 12, fontWeight: 600 }}>cm</span></div>
                      <div style={{ fontSize: 12, color: t.subtext, marginTop: 4 }}>Width</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: t.text }}>24.0 <span style={{ fontSize: 12, fontWeight: 600 }}>cm</span></div>
                      <div style={{ fontSize: 12, color: t.subtext, marginTop: 4 }}>Length</div>
                    </div>
                  </div>

                  <h4 style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 16 }}>Receiver</h4>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: t.purpleLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🎓</div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: t.text }}>Student RA22...</div>
                      <div style={{ fontSize: 13, color: t.subtext, marginTop: 2 }}>Paari Block</div>
                    </div>
                    <div style={{ marginLeft: "auto", width: 44, height: 44, borderRadius: "50%", background: t.purpleLight, color: t.purple, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    </div>
                  </div>
                </div>

                {/* Speed Statistic */}
                <div className="soft-shadow" style={{ borderRadius: 28, border: `1px solid ${t.border}`, background: t.card, padding: "28px", display: "flex", flexDirection: "column" }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: t.text, marginBottom: 16 }}>Speed Statistic</h3>
                  <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: t.text, fontWeight: 700 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.iconBg }} /> Average Speed
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: t.purple, fontWeight: 700 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.purple }} /> Current Speed
                    </div>
                  </div>

                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <svg width="180" height="180" viewBox="0 0 100 100" className="speed-gauge">
                      <circle cx="50" cy="50" r="40" className="gauge-bg" />
                      <circle cx="50" cy="50" r="40" className="gauge-val" strokeDasharray="4 6" strokeDashoffset="-35" />
                      <path d="M 10 50 A 40 40 0 0 1 50 10" fill="none" stroke={t.purple} strokeWidth="12" strokeDasharray="4 6" strokeLinecap="round" />
                    </svg>
                    <div style={{ position: "absolute", textAlign: "center" }}>
                      <div style={{ fontSize: 42, fontWeight: 800, color: t.text, lineHeight: 1 }}>15</div>
                      <div style={{ fontSize: 13, color: t.subtext, marginTop: 4, fontWeight: 600 }}>km / hour</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* ── COLUMN 2 ── */}
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                {/* Order Info */}
                <div className="soft-shadow" style={{ borderRadius: 28, border: `1px solid ${t.border}`, background: t.card, padding: "28px", flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: t.text }}>Route Info</h3>
                    <div style={{ fontSize: 13, color: t.subtext, fontWeight: 600, cursor: "pointer" }}>View more &gt;</div>
                  </div>

                  <div style={{ display: "flex", gap: 24 }}>
                    {/* Purple Route Card */}
                    <div style={{ flex: 1.2, background: `linear-gradient(145deg, #a78bfa, ${t.purple})`, borderRadius: 24, padding: "24px", color: "white", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 10px 20px rgba(139, 92, 246, 0.2)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 800 }}>
                        <span>MAIN</span>
                        <span>PAARI</span>
                      </div>

                      <div style={{ textAlign: "center", margin: "24px 0" }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
                        <div style={{ fontSize: 11, fontWeight: 600, marginTop: 6, opacity: 0.9 }}>BOT-02</div>
                      </div>

                      <div style={{ position: "relative", height: 3, background: "rgba(255,255,255,0.3)", borderRadius: 4, marginBottom: 14 }}>
                        <div style={{ position: "absolute", top: -4, left: "60%", width: 11, height: 11, background: "white", borderRadius: "50%", boxShadow: "0 0 0 4px rgba(255,255,255,0.2)" }} />
                        <div style={{ width: "60%", height: "100%", background: "white", borderRadius: 4 }} />
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700 }}>
                        <span>14:33 PM</span>
                        <span style={{ opacity: 0.8 }}>16:13 PM</span>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingRight: 8 }}>
                      <div style={{ fontSize: 17, fontWeight: 800, color: t.text, marginBottom: 20 }}>#CB-4523</div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "relative" }}>
                        {/* Connecting Line */}
                        <div style={{ position: "absolute", left: 4, top: 4, bottom: 4, width: 2, background: t.border, zIndex: 1 }} />

                        {[
                          { label: "Assigned", time: "10:07 AM", active: false },
                          { label: "Loaded", time: "13:18 PM", active: false },
                          { label: "Dispatched", time: "14:33 PM", active: true },
                          { label: "Arriving", time: "16:13 PM", active: false },
                        ].map((step, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <div className={`timeline-dot ${step.active ? 'active' : ''}`} />
                            <div style={{ display: "flex", justifyContent: "space-between", flex: 1, alignItems: "center" }}>
                              <span style={{ fontSize: 14, fontWeight: step.active ? 800 : 600, color: step.active ? t.text : t.subtext }}>{step.label}</span>
                              <span style={{ fontSize: 12, fontWeight: 600, color: t.subtext }}>{step.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Completion Bar */}
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 28, padding: "18px 20px", borderRadius: 20, border: `1px solid ${t.border}`, background: t.bg }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={t.purple} strokeWidth="3" strokeDasharray="40 60" transform="rotate(-90 12 12)" /></svg>
                    <div style={{ fontWeight: 800, fontSize: 15, color: t.text }}>60% Completed</div>
                    <div style={{ width: 2, height: 16, background: t.border }} />
                    <div style={{ fontSize: 14, fontWeight: 600, color: t.subtext }}>Deliveries</div>
                    <div style={{ marginLeft: "auto", fontSize: 12, color: t.text }}>▼</div>
                  </div>
                </div>

                {/* Vehicle Card */}
                <div className="soft-shadow" style={{ borderRadius: 28, background: dark ? "#1e1e2d" : "#f8f8fb", border: `1px solid ${t.border}`, padding: "28px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", height: "260px" }}>
                  <div style={{ position: "relative", zIndex: 2, width: "55%" }}>
                    <h3 style={{ fontSize: 22, fontWeight: 800, color: t.text, lineHeight: 1.2, marginBottom: 8 }}>Campus<br />Delivery Bot</h3>
                    <div style={{ fontSize: 13, fontWeight: 600, color: t.subtext, marginBottom: 28 }}>SRM-DB-02 Max</div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 12px" }}>
                      <div><div style={{ fontSize: 11, fontWeight: 600, color: t.subtext }}>Payload</div><div style={{ fontWeight: 800, fontSize: 14, color: t.text }}>15 kg</div></div>
                      <div><div style={{ fontSize: 11, fontWeight: 600, color: t.subtext }}>Load Volume</div><div style={{ fontWeight: 800, fontSize: 14, color: t.text }}>40 L</div></div>
                      <div><div style={{ fontSize: 11, fontWeight: 600, color: t.subtext }}>Dimensions</div><div style={{ fontWeight: 800, fontSize: 14, color: t.text }}>40x40 cm</div></div>
                      <div><div style={{ fontSize: 11, fontWeight: 600, color: t.subtext }}>Max Speed</div><div style={{ fontWeight: 800, fontSize: 14, color: t.text }}>20 km/h</div></div>
                    </div>
                  </div>

                  {/* Robot Image Overlay */}
                  <img
                    src="/cdb.png"
                    alt="Robot"
                    style={{ position: "absolute", bottom: -30, right: -40, width: "75%", filter: "drop-shadow(-10px 20px 30px rgba(0,0,0,0.2))" }}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />

                  {/* Slider controls */}
                  <div style={{ position: "absolute", right: 24, top: 24, display: "flex", flexDirection: "column", gap: 10, zIndex: 2 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: t.card, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", cursor: "pointer", color: t.text, fontWeight: 800 }}>^</div>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: t.card, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", cursor: "pointer", color: t.text, fontWeight: 800, transform: "rotate(180deg)" }}>^</div>
                  </div>
                </div>

              </div>

              {/* ── COLUMN 3 ── */}
              <div className="soft-shadow" style={{ borderRadius: 28, border: `1px solid ${t.border}`, background: t.card, padding: "28px", display: "flex", flexDirection: "column", position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: t.text }}>Map Overview</h3>
                  <div className="icon-btn" style={{ width: 32, height: 32, fontSize: 14, background: t.bg, color: t.text, border: `1px solid ${t.border}` }}>⛶</div>
                </div>

                <div style={{ flex: 1, borderRadius: 20, overflow: "hidden", position: "relative", background: t.bg }}>

                  {/* Map Iframe with Filter */}
                  {/* Map Iframe with Filter */}
                  <iframe
                    src="https://maps.google.com/maps?q=SRM+Institute+of+Science+and+Technology,+Kattankulathur&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, filter: t.mapFilter, transition: "filter 0.3s" }}
                    loading="lazy"
                  />

                  {/* Route SVG Overlay */}
                  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                    <path d="M 220 150 Q 180 200 150 250 T 80 400" fill="none" stroke={t.iconBg} strokeWidth="4" />
                    {/* Origin Marker */}
                    <circle cx="220" cy="150" r="5" fill={t.iconBg} />
                    {/* Destination Marker */}
                    <circle cx="80" cy="400" r="5" fill={t.iconBg} />
                    <circle cx="80" cy="400" r="12" fill="none" stroke={t.iconBg} strokeWidth="2" />
                    {/* Progress Arrow */}
                    <polygon points="150,230 160,250 140,250" fill={t.purple} transform="rotate(-30 150 250)" />
                  </svg>

                  {/* Map Labels */}
                  <div style={{ position: "absolute", top: 120, right: 30, fontSize: 14, fontWeight: 800, color: t.text, background: t.card, padding: "6px 12px", borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>MAIN</div>
                  <div style={{ position: "absolute", bottom: 120, left: 30, fontSize: 14, fontWeight: 800, color: t.text, background: t.card, padding: "6px 12px", borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>PAARI</div>

                  {/* Zoom Controls */}
                  <div style={{ position: "absolute", right: 24, bottom: 80, display: "flex", flexDirection: "column", background: t.card, borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", border: `1px solid ${t.border}` }}>
                    <button style={{ width: 40, height: 40, border: "none", background: "transparent", fontSize: 22, cursor: "pointer", color: t.text, borderBottom: `1px solid ${t.border}` }}>+</button>
                    <button style={{ width: 40, height: 40, border: "none", background: "transparent", fontSize: 22, cursor: "pointer", color: t.text }}>-</button>
                  </div>

                  {/* Expand Control */}
                  <div style={{ position: "absolute", right: 24, bottom: 24, width: 40, height: 40, background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", cursor: "pointer" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.text} strokeWidth="2"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
                  </div>
                </div>

                {/* Distance text below map */}
                <div style={{ marginTop: 24, fontSize: 20, fontWeight: 800, color: t.text }}>
                  1.2 <span style={{ fontSize: 15, fontWeight: 700, color: t.subtext }}>/ 2.4 km</span>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </>
  );
}