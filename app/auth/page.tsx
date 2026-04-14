"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ────────────────────────────────────────────────────────────────────────────
// THEME SETTINGS
// ────────────────────────────────────────────────────────────────────────────

const LIGHT = {
  bg: "#f6f6f6",
  cardBg: "#ffffff",
  accent: "#FACC15",
  text: "#000000",
  subtext: "#6b7280",
  inputBg: "#ffffff",
  border: "#000000",
  panelBg: "#000000",
  panelText: "#FACC15",
  errorBg: "rgba(220, 38, 38, 0.08)",
  errorBorder: "rgba(220, 38, 38, 0.3)",
  errorText: "#dc2626",
  successBg: "rgba(22, 163, 74, 0.08)",
  successBorder: "rgba(22, 163, 74, 0.3)",
  successText: "#16a34a",
  linkColor: "#000000",
};

const DARK = {
  bg: "#0a0a0a",
  cardBg: "#111111",
  accent: "#FF3333",
  text: "#ffffff",
  subtext: "#a1a1aa",
  inputBg: "#1a1a1a",
  border: "#FF3333",
  panelBg: "#0a0a0a",
  panelText: "#FF3333",
  errorBg: "rgba(255, 51, 51, 0.1)",
  errorBorder: "rgba(255, 51, 51, 0.4)",
  errorText: "#FF3333",
  successBg: "rgba(34, 197, 94, 0.1)",
  successBorder: "rgba(34, 197, 94, 0.3)",
  successText: "#22c55e",
  linkColor: "#FF3333",
};

// ────────────────────────────────────────────────────────────────────────────
// CONSTANTS & HELPERS
// ────────────────────────────────────────────────────────────────────────────

const HOSTELS = { Male: ["N Block", "Paari", "Kaari", "Oori"], Female: ["M Block", "Meenakshi"] };

const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'JetBrains Mono', monospace;
  }

  input, select, button, textarea {
    font-family: 'JetBrains Mono', monospace;
    outline: none;
  }

  .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.4s ease both; }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-8px); max-height: 0; }
    to { opacity: 1; transform: translateY(0); max-height: 200px; }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes blink {
    50% { opacity: 0; }
  }

  @keyframes pulse-glow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .typing-cursor::after {
    content: '_';
    animation: blink 1s step-end infinite;
    font-weight: 900;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-thumb { background: #000; }

  /* Responsive */
  @media (max-width: 768px) {
    .auth-grid { grid-template-columns: 1fr !important; }
    .auth-left-panel { display: none !important; }
  }
`;

function useTypewriter(text: string, speed = 80) {
  const [displayText, setDisplayText] = useState("");
  useEffect(() => {
    let i = 0;
    setDisplayText("");
    const timer = setInterval(() => {
      i++;
      setDisplayText(text.substring(0, i));
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return displayText;
}

// ────────────────────────────────────────────────────────────────────────────
// MAIN AUTH PAGE
// ────────────────────────────────────────────────────────────────────────────

export default function AuthPage() {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ regNo: "", name: "", email: "", password: "", gender: "", hostel: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpRegNo, setOtpRegNo] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const headingText = useTypewriter("SRM BOT", 120);
  const t = dark ? DARK : LIGHT;

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.value;
    setError(""); setSuccess("");
    setForm(p => ({ ...p, [k]: val, ...(k === "gender" ? { hostel: "" } : {}) }));
  };

  const switchTab = (toLogin: boolean) => {
    setIsLogin(toLogin); setError(""); setSuccess(""); setShowPw(false); setShowOtp(false); setOtp("");
    setForm({ regNo: "", name: "", email: "", password: "", gender: "", hostel: "", phone: "" });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);

    try {
      if (isLogin) {
        const res = await fetch("/api/auth/login", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ regno: form.regNo, password: form.password }),
        });
        const data = await res.json();
        if (!data.success) setError(data.message || "Login failed");
        else {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          router.push("/dashboard");
        }
      } else {
        const res = await fetch("/api/auth/register", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ regno: form.regNo, name: form.name, email: form.email, password: form.password, phone: form.phone || undefined, hostel: form.hostel || undefined }),
        });
        const data = await res.json();
        if (!data.success) setError(data.message || "Registration failed");
        else {
          setOtpRegNo(form.regNo); setShowOtp(true); setResendCooldown(60);
          setSuccess(data.message || "OTP sent to your email!");
        }
      }
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    setError(""); setSuccess("");
    if (otp.length !== 6) { setError("Enter a valid 6-digit OTP"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regno: otpRegNo, otp }),
      });
      const data = await res.json();
      if (!data.success) setError(data.message || "Verification failed");
      else {
        setSuccess("Email verified! Redirecting to login...");
        setTimeout(() => { switchTab(true); setSuccess(""); }, 1500);
      }
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  const resendOtp = async () => {
    if (resendCooldown > 0) return;
    setError(""); setSuccess(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regno: otpRegNo }),
      });
      const data = await res.json();
      if (!data.success) setError(data.message || "Failed to resend OTP");
      else { setResendCooldown(60); setSuccess("New OTP sent to your email!"); }
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  const hostels: string[] = HOSTELS[form.gender as keyof typeof HOSTELS] || [];

  // ── Shared neo-brutalist styles ──
  const inputStyle: React.CSSProperties = {
    width: "100%", background: t.inputBg, border: `4px solid ${t.border}`,
    padding: "14px 16px", fontSize: 13, fontWeight: 700, color: t.text,
    transition: "all 0.15s ease",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const,
    letterSpacing: "0.1em", color: t.subtext, display: "block", marginBottom: 6,
  };

  const btnStyle: React.CSSProperties = {
    width: "100%", background: t.accent, border: `4px solid ${t.border}`,
    padding: "16px", fontSize: 13, fontWeight: 900, textTransform: "uppercase" as const,
    letterSpacing: "0.05em", cursor: "pointer", color: dark ? "#000" : "#000",
    boxShadow: `4px 4px 0px 0px ${t.border}`, transition: "all 0.1s ease",
  };

  return (
    <>
      <style>{css}</style>
      <div style={{
        minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column",
        background: t.bg, color: t.text, transition: "all 0.3s ease",
      }}>

        {/* ── MAIN CONTENT ── */}
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div
            className="auth-grid"
            style={{
              width: "100%", maxWidth: 900, display: "grid",
              gridTemplateColumns: "1fr 1fr",
              border: `4px solid ${t.border}`, background: t.cardBg,
              boxShadow: `4px 4px 0px 0px ${t.border}`,
            }}
          >

            {/* ── LEFT PANEL (Branding) ── */}
            <div
              className="auth-left-panel"
              style={{
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                padding: 40, background: t.panelBg, color: t.panelText,
                position: "relative", overflow: "hidden",
              }}
            >
              <div style={{ zIndex: 1 }}>
                <h1 className="typing-cursor" style={{
                  fontSize: 44, fontWeight: 900, fontStyle: "italic",
                  letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 8,
                }}>
                  {headingText}
                </h1>
                <p style={{ fontSize: 12, fontWeight: 700, opacity: 0.8 }}>
                  V2.0-INDUSTRIAL CAMPUS DELIVERY
                </p>
              </div>

              <div style={{ zIndex: 1, marginTop: 48 }}>
                <div style={{
                  borderLeft: `4px solid ${t.panelText}`, paddingLeft: 24, paddingTop: 8, paddingBottom: 8,
                }}>
                  <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 8 }}>
                    Terminal Status
                  </p>
                  <p style={{ fontSize: 28, fontWeight: 900, marginBottom: 16, lineHeight: 1.1 }}>
                    ACTIVE<br/>CONNECTION
                  </p>
                  <p style={{ fontSize: 12, lineHeight: 1.8, opacity: 0.85, maxWidth: 280 }}>
                    ESTABLISHING SECURE UPLINK TO THE CAMPUS LOGISTICS NETWORK. PLEASE VERIFY OPERATOR CREDENTIALS TO INITIALIZE MISSION PARAMETERS.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 32, zIndex: 1 }}>
                <div style={{
                  padding: "6px 12px", border: `2px solid ${t.panelText}`,
                  fontSize: 10, fontWeight: 700,
                }}>
                  LAT: 12.8230° N
                </div>
                <div style={{
                  padding: "6px 12px", border: `2px solid ${t.panelText}`,
                  fontSize: 10, fontWeight: 700,
                }}>
                  LONG: 80.0444° E
                </div>
              </div>

              {/* Large background icon */}
              <span
                className="material-symbols-outlined"
                style={{
                  position: "absolute", bottom: -20, right: -20,
                  fontSize: 240, opacity: 0.08, pointerEvents: "none",
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                precision_manufacturing
              </span>
            </div>

            {/* ── RIGHT PANEL (Form) ── */}
            <div style={{
              padding: "32px 36px", display: "flex", flexDirection: "column", justifyContent: "center",
              overflowY: "auto", maxHeight: "90vh",
            }}>

              {/* Title */}
              <div style={{ marginBottom: 28 }}>
                <h2 style={{
                  fontSize: 22, fontWeight: 900, textTransform: "uppercase",
                  letterSpacing: "-0.03em", marginBottom: 4,
                }}>
                  {isLogin ? "OPERATOR_LOGIN" : "INITIALIZE_ACCOUNT"}
                </h2>
                <div style={{ height: 4, width: 48, background: t.accent }} />
              </div>

              {/* Tab Toggle */}
              <div style={{
                display: "flex", border: `4px solid ${t.border}`, marginBottom: 24,
              }}>
                <button
                  onClick={() => switchTab(true)}
                  style={{
                    flex: 1, padding: "12px 0", border: "none", fontWeight: 900,
                    fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em",
                    cursor: "pointer", transition: "all 0.15s",
                    background: isLogin ? t.accent : "transparent",
                    color: isLogin ? "#000" : t.subtext,
                  }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => switchTab(false)}
                  style={{
                    flex: 1, padding: "12px 0", border: "none",
                    borderLeft: `4px solid ${t.border}`,
                    fontWeight: 900, fontSize: 11, textTransform: "uppercase",
                    letterSpacing: "0.05em", cursor: "pointer", transition: "all 0.15s",
                    background: !isLogin ? t.accent : "transparent",
                    color: !isLogin ? "#000" : t.subtext,
                  }}
                >
                  Register
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="fade-up" style={{
                  padding: "12px 16px", marginBottom: 16, fontSize: 11, fontWeight: 700,
                  background: t.errorBg, border: `2px solid ${t.errorBorder}`, color: t.errorText,
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                {/* Registration Number */}
                <div>
                  <label style={labelStyle}>
                    {isLogin ? "Username_Field" : "Registration_Number"}
                  </label>
                  <input
                    style={inputStyle}
                    placeholder="ENTER ID"
                    value={form.regNo}
                    onChange={set("regNo")}
                    required
                  />
                </div>

                {/* Register-only fields */}
                {!isLogin && (
                  <>
                    <div style={{ animation: "slideDown 0.35s ease both" }}>
                      <label style={labelStyle}>Full_Name</label>
                      <input style={inputStyle} placeholder="JOHN DOE" value={form.name} onChange={set("name")} required />
                    </div>
                    <div style={{ animation: "slideDown 0.35s ease both", animationDelay: "0.05s" }}>
                      <label style={labelStyle}>SRM_Email</label>
                      <input style={inputStyle} type="email" placeholder="MI7136@SRMIST.EDU.IN" value={form.email} onChange={set("email")} required />
                    </div>
                    <div style={{ animation: "slideDown 0.35s ease both", animationDelay: "0.1s" }}>
                      <label style={labelStyle}>Phone_Number</label>
                      <input style={inputStyle} type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} required />
                    </div>

                    <div style={{ display: "flex", gap: 10, animation: "slideDown 0.35s ease both", animationDelay: "0.15s" }}>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Gender</label>
                        <div style={{ position: "relative" }}>
                          <select
                            style={{ ...inputStyle, cursor: "pointer", appearance: "none" as const, paddingRight: 36 }}
                            value={form.gender} onChange={set("gender")} required
                          >
                            <option value="" disabled>SELECT</option>
                            <option value="Male">MALE</option>
                            <option value="Female">FEMALE</option>
                          </select>
                          <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", fontSize: 10, color: t.subtext }}>▼</span>
                        </div>
                      </div>

                      {form.gender && (
                        <div style={{ flex: 1, animation: "slideDown 0.25s ease both" }}>
                          <label style={labelStyle}>Hostel_Block</label>
                          <div style={{ position: "relative" }}>
                            <select
                              style={{ ...inputStyle, cursor: "pointer", appearance: "none" as const, paddingRight: 36 }}
                              value={form.hostel} onChange={set("hostel")} required
                            >
                              <option value="" disabled>BLOCK</option>
                              {hostels.map((h: string) => <option key={h} value={h}>{h.toUpperCase()}</option>)}
                            </select>
                            <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", fontSize: 10, color: t.subtext }}>▼</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Password */}
                <div>
                  <label style={labelStyle}>Password_Field</label>
                  <div style={{ position: "relative" }}>
                    <input
                      style={{ ...inputStyle, paddingRight: 44 }}
                      type={showPw ? "text" : "password"}
                      placeholder="********"
                      value={form.password}
                      onChange={set("password")}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(v => !v)}
                      style={{
                        position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer",
                        fontSize: 14, color: t.subtext, padding: 4,
                      }}
                    >
                      {showPw ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                {/* Remember / Recovery (login only) */}
                {isLogin && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                      <div style={{
                        width: 18, height: 18, border: `2px solid ${t.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <input type="checkbox" style={{ display: "none" }} className="peer" />
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>Remember_Session</span>
                    </label>
                    <a href="#" style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: t.linkColor, textDecoration: "underline" }}>
                      Recovery_Key?
                    </a>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || showOtp}
                  style={{
                    ...btnStyle,
                    marginTop: 4,
                    opacity: loading || showOtp ? 0.7 : 1,
                    cursor: loading || showOtp ? "not-allowed" : "pointer",
                  }}
                  onMouseDown={e => {
                    if (!loading && !showOtp) {
                      (e.currentTarget as HTMLElement).style.transform = "translate(4px, 4px)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 0 black";
                    }
                  }}
                  onMouseUp={e => {
                    (e.currentTarget as HTMLElement).style.transform = "";
                    (e.currentTarget as HTMLElement).style.boxShadow = "";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = "";
                    (e.currentTarget as HTMLElement).style.boxShadow = "";
                  }}
                >
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{
                        display: "inline-block", width: 16, height: 16,
                        border: "2.5px solid rgba(0,0,0,0.2)", borderTopColor: "#000",
                        borderRadius: "50%", animation: "spin 0.7s linear infinite",
                        marginRight: 8,
                      }} />
                      PROCESSING...
                    </span>
                  ) : isLogin ? "SIGN IN" : "CREATE ACCOUNT"}
                </button>
              </form>

              {/* OTP Verification */}
              {showOtp && (
                <div style={{
                  marginTop: 20, padding: 20,
                  border: `4px solid ${t.border}`,
                  background: dark ? "rgba(255,51,51,0.05)" : "rgba(250,204,21,0.08)",
                  animation: "slideDown 0.35s ease both",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 900, textTransform: "uppercase", marginBottom: 4 }}>
                    📧 VERIFY_EMAIL
                  </div>
                  <p style={{ fontSize: 10, color: t.subtext, marginBottom: 14, fontWeight: 700 }}>
                    ENTER THE 6-DIGIT OTP SENT TO YOUR SRM EMAIL.
                  </p>
                  <input
                    style={{
                      ...inputStyle, letterSpacing: "0.3em", textAlign: "center" as const,
                      fontSize: 20, fontWeight: 900,
                    }}
                    placeholder="000000"
                    value={otp}
                    onChange={e => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
                    maxLength={6}
                  />
                  <button
                    onClick={verifyOtp}
                    disabled={loading || otp.length !== 6}
                    style={{
                      ...btnStyle, marginTop: 12,
                      opacity: loading || otp.length !== 6 ? 0.7 : 1,
                      cursor: loading || otp.length !== 6 ? "not-allowed" : "pointer",
                    }}
                  >
                    {loading ? (
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{
                          display: "inline-block", width: 16, height: 16,
                          border: "2.5px solid rgba(0,0,0,0.2)", borderTopColor: "#000",
                          borderRadius: "50%", animation: "spin 0.7s linear infinite",
                          marginRight: 8,
                        }} />
                        VERIFYING...
                      </span>
                    ) : "VERIFY OTP ✓"}
                  </button>
                  <div style={{ marginTop: 12, textAlign: "center", fontSize: 10, color: t.subtext, fontWeight: 700 }}>
                    DIDN&apos;T RECEIVE IT?{" "}
                    <button
                      onClick={resendOtp}
                      disabled={resendCooldown > 0 || loading}
                      style={{
                        background: "none", border: "none", cursor: resendCooldown > 0 ? "not-allowed" : "pointer",
                        color: resendCooldown > 0 ? t.subtext : t.linkColor,
                        fontWeight: 900, fontSize: 10, textDecoration: "underline", textUnderlineOffset: "3px",
                        opacity: resendCooldown > 0 ? 0.5 : 1,
                      }}
                    >
                      {resendCooldown > 0 ? `RESEND IN ${resendCooldown}S` : "RESEND OTP"}
                    </button>
                  </div>
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="fade-up" style={{
                  marginTop: 16, padding: "12px 16px", fontSize: 11, fontWeight: 700,
                  background: t.successBg, border: `2px solid ${t.successBorder}`, color: t.successText,
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span>✅</span> {success}
                </div>
              )}

              {/* Divider */}
              <div style={{
                display: "flex", alignItems: "center", gap: 16,
                margin: "20px 0 16px",
              }}>
                <div style={{ height: 2, flex: 1, background: t.border, opacity: 0.1 }} />
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: t.subtext }}>
                  {isLogin ? "EXTERNAL_UPLINK" : "OR"}
                </span>
                <div style={{ height: 2, flex: 1, background: t.border, opacity: 0.1 }} />
              </div>

              {/* Switch auth mode */}
              <div style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: t.subtext, textTransform: "uppercase" }}>
                {isLogin ? "New Operator? " : "Already registered? "}
                <button
                  onClick={() => switchTab(!isLogin)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: t.linkColor, fontWeight: 900, fontSize: 10,
                    textDecoration: "underline", textUnderlineOffset: "4px",
                  }}
                >
                  {isLogin ? "Initialize_Account" : "Sign_In"}
                </button>
              </div>

            </div>
          </div>
        </main>

        {/* ── FOOTER ── */}
        <footer style={{ padding: 24, textAlign: "center" }}>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.35 }}>
            © 2024 SRM CAMPUS DELIVERY PROTOCOL // INDUSTRIAL PRECISION V2
          </p>
        </footer>

        {/* ── FLOATING BADGES ── */}
        <div style={{ position: "fixed", top: 24, right: 24, display: "flex", flexDirection: "column", gap: 8, zIndex: 50 }}>
          <button
            onClick={() => setDark(d => !d)}
            style={{
              background: t.panelBg, color: t.panelText,
              padding: "6px 12px", fontSize: 9, fontWeight: 700,
              border: `2px solid ${t.border}`,
              boxShadow: `4px 4px 0px 0px ${t.border}`,
              cursor: "pointer", transition: "all 0.1s",
              textTransform: "uppercase",
            }}
          >
            {dark ? "☀️ LIGHT" : "🌙 DARK"}
          </button>
          <div style={{
            background: t.panelBg, color: t.panelText,
            padding: "4px 12px", fontSize: 9, fontWeight: 700,
            boxShadow: `4px 4px 0px 0px ${t.border}`,
          }}>
            ENCRYPTION: AES-256
          </div>
          <div style={{
            background: t.panelBg, color: t.panelText,
            padding: "4px 12px", fontSize: 9, fontWeight: 700,
            boxShadow: `4px 4px 0px 0px ${t.border}`,
          }}>
            SIGNAL: OPTIMAL
          </div>
        </div>

        {/* ── SRM LOGO ── */}
        <img
          src="/srm-logo.png"
          alt="SRM Logo"
          style={{
            position: "fixed", bottom: 24, right: 24,
            height: 40, objectFit: "contain", zIndex: 30,
            filter: dark ? "invert(1) brightness(2)" : "none",
            transition: "filter 0.3s",
          }}
        />
      </div>
    </>
  );
}