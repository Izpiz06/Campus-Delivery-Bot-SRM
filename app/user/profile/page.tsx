"use client";
import { useState, useEffect } from "react";

// ────────────────────────────────────────────────────────────────────────────
// PROFILE & SECURITY PAGE
// ────────────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const shadow = "10px 10px 0px 0px rgba(0,0,0,1)";
  const shadowSm = "4px 4px 0px 0px rgba(0,0,0,1)";

  const [userName, setUserName] = useState("C. VASQUEZ");
  const [userRegno, setUserRegno] = useState("RA2211003010XXX");

  useEffect(() => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const parsed = JSON.parse(user);
        if (parsed.name) setUserName(parsed.name.toUpperCase());
        if (parsed.regno) setUserRegno(parsed.regno);
      }
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", paddingBottom: 96 }}>
      {/* ══════════════ HEADER ══════════════ */}
      <section style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 48,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-0.04em",
            borderBottom: "8px solid #000",
            display: "inline-block",
            paddingBottom: 8,
            marginBottom: 8,
          }}
          className="page-title"
        >
          USER_PROFILE
        </h1>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            color: "#5e5e5e",
            letterSpacing: "0.15em",
          }}
        >
          &gt; AUTHENTICATION_LEVEL: USER_ACCESS
        </p>
      </section>

      {/* ══════════════ TWO COLUMN LAYOUT ══════════════ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "7fr 5fr",
          gap: 32,
        }}
        className="profile-grid"
      >
        {/* ── LEFT COLUMN ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 32,
          }}
        >
          {/* Security Card */}
          <div
            style={{
              background: "#fff",
              border: "4px solid #000",
              boxShadow: shadow,
              overflow: "hidden",
            }}
          >
            {/* Title bar */}
            <div
              style={{
                background: "#000",
                color: "#fff",
                padding: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                }}
              >
                SECURITY_MODULE // ACCESS_CTRL
              </span>
              <span style={{ display: "flex", gap: 8 }}>
                <span
                  style={{
                    width: 12,
                    height: 12,
                    background: "#dc2626",
                    border: "1px solid #fff",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    width: 12,
                    height: 12,
                    background: "#facc15",
                    border: "1px solid #fff",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    width: 12,
                    height: 12,
                    background: "#22c55e",
                    border: "1px solid #fff",
                    display: "inline-block",
                  }}
                />
              </span>
            </div>

            {/* Content */}
            <div style={{ padding: 32 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 24,
                  marginBottom: 32,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 10,
                      fontWeight: 900,
                      color: "#5e5e5e",
                      marginBottom: 4,
                    }}
                  >
                    LOCKER_IDENTIFIER
                  </label>
                  <div style={{ fontSize: 48, fontWeight: 900 }}>B-NODE</div>
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 10,
                      fontWeight: 900,
                      color: "#5e5e5e",
                      marginBottom: 4,
                      textAlign: "right",
                    }}
                  >
                    SECURE_DYNAMIC_PIN
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["8", "4", "2", "1"].map((digit, i) => (
                      <div
                        key={i}
                        style={{
                          width: 48,
                          height: 64,
                          border: "4px solid #000",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 28,
                          fontWeight: 900,
                          background: "#f6f3ec",
                        }}
                      >
                        {digit}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Unlock Button */}
              <div style={{ position: "relative" }}>
                <button
                  disabled
                  style={{
                    width: "100%",
                    background: "#e2e2e2",
                    color: "#5e5e5e",
                    fontSize: 22,
                    fontWeight: 900,
                    padding: "24px 0",
                    border: "4px solid #000",
                    cursor: "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 16,
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 36 }}
                  >
                    lock
                  </span>
                  UNLOCK LOCKER
                </button>
                <div
                  style={{
                    position: "absolute",
                    bottom: -16,
                    right: 16,
                    background: "#ba1a1a",
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: 700,
                    padding: "4px 8px",
                    textTransform: "uppercase",
                    border: "2px solid #000",
                  }}
                >
                  STATUS: AWAITING_BOT_ARRIVAL
                </div>
              </div>
            </div>
          </div>

          {/* Impact Tracker */}
          <div
            style={{
              background: "#fff",
              border: "4px solid #000",
              boxShadow: shadow,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "#000",
                color: "#fff",
                padding: 12,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                }}
              >
                IMPACT_ANALYTICS // BOT_METRICS
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
              }}
              className="impact-grid"
            >
              <div
                style={{
                  padding: 32,
                  borderRight: "4px solid #000",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 56, color: "#FF5F15", marginBottom: 16 }}
                >
                  timer
                </span>
                <div style={{ fontSize: 44, fontWeight: 900 }}>42.5</div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    marginTop: 8,
                  }}
                >
                  WALKING HOURS SAVED
                </div>
              </div>
              <div
                style={{
                  padding: 32,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  background: "#FF5F15",
                  color: "#000",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 56,
                    marginBottom: 16,
                    fontVariationSettings: "'FILL' 1",
                  }}
                >
                  bolt
                </span>
                <div style={{ fontSize: 44, fontWeight: 900 }}>128</div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    marginTop: 8,
                  }}
                >
                  BOT STREAK (DAYS)
                </div>
              </div>
            </div>

            <div
              style={{
                padding: 12,
                background: "#f6f3ec",
                fontSize: 9,
                textAlign: "center",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "#5e5e5e",
              }}
            >
              GLOBAL_RANKING: TOP_5%_EFFICIENCY_OPERATOR
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 32,
          }}
        >
          {/* Profile Identity Card */}
          <div
            style={{
              background: "#fff",
              border: "4px solid #000",
              boxShadow: shadowSm,
              padding: 24,
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div
              style={{
                width: 96,
                height: 96,
                border: "4px solid #000",
                background: "#ebe8e1",
                overflow: "hidden",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: 56,
                  color: "#5e5e5e",
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                person
              </span>
            </div>
            <div>
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  lineHeight: 1.1,
                }}
              >
                {userName}
              </h3>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#5e5e5e",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                {userRegno}
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                {["verified_user", "workspace_premium", "military_tech"].map(
                  (icon) => (
                    <div
                      key={icon}
                      style={{
                        width: 24,
                        height: 24,
                        background: "#000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ color: "#fff", fontSize: 14 }}
                      >
                        {icon}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Wallet Card */}
          <div
            style={{
              background: "#fff",
              border: "4px solid #000",
              boxShadow: shadow,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "#000",
                color: "#fff",
                padding: 12,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                }}
              >
                CREDIT_VALUATION // WALLET
              </span>
            </div>
            <div style={{ padding: 32 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  marginBottom: 32,
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: 10,
                      fontWeight: 900,
                      color: "#5e5e5e",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                    }}
                  >
                    CAMPUS CREDITS
                  </label>
                  <div style={{ fontSize: 56, fontWeight: 900 }}>
                    <span
                      style={{
                        fontSize: 24,
                        verticalAlign: "top",
                        marginRight: 4,
                      }}
                    >
                      ₹
                    </span>
                    1,452
                  </div>
                </div>
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 48, color: "#FF5F15" }}
                >
                  account_balance_wallet
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <button
                  style={{
                    width: "100%",
                    background: "#FF5F15",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: 18,
                    padding: "16px 0",
                    border: "4px solid #000",
                    boxShadow: shadowSm,
                    cursor: "pointer",
                    transition: "all 0.1s",
                  }}
                  onMouseDown={(e) => {
                    (e.currentTarget as HTMLElement).style.transform =
                      "translate(4px, 4px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                  onMouseUp={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "";
                    (e.currentTarget as HTMLElement).style.boxShadow = shadowSm;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "";
                    (e.currentTarget as HTMLElement).style.boxShadow = shadowSm;
                  }}
                >
                  ADD FUNDS
                </button>
                <button
                  style={{
                    width: "100%",
                    background: "#fff",
                    color: "#000",
                    fontWeight: 900,
                    fontSize: 18,
                    padding: "16px 0",
                    border: "4px solid #000",
                    cursor: "pointer",
                    transition: "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "#f6f3ec";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "#fff";
                  }}
                >
                  VIEW HISTORY
                </button>
              </div>
            </div>
          </div>

          {/* System Messages */}
          <div
            style={{
              background: "#f6f3ec",
              border: "2px solid #000",
              padding: 16,
              fontSize: 11,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div
              style={{ display: "flex", alignItems: "flex-start", gap: 8 }}
            >
              <span style={{ color: "#FF5F15", fontWeight: 900 }}>SYNC:</span>
              <span>WALLET_BALANCE_ENCRYPTED_SUCCESSFULLY</span>
            </div>
            <div
              style={{ display: "flex", alignItems: "flex-start", gap: 8 }}
            >
              <span style={{ color: "#FF5F15", fontWeight: 900 }}>
                STREAK:
              </span>
              <span>CURRENT_STREAK_ACTIVE_X128_MULTIPLIER</span>
            </div>
            <div
              style={{ display: "flex", alignItems: "flex-start", gap: 8 }}
            >
              <span style={{ color: "#5e5e5e", fontWeight: 900 }}>LOG:</span>
              <span>LAST_ACCESS_GATEWAY_NODE_04_CAMPUS_WEST</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════ RESPONSIVE CSS ══════════════ */}
      <style>{`
        @media (max-width: 768px) {
          .page-title { font-size: 28px !important; }
          .profile-grid { grid-template-columns: 1fr !important; }
          .impact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
