"use client";
import { useState } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes botRoll {
    0%   { left: -90px;             transform: scaleX(1);  }
    44%  { left: calc(100% + 10px); transform: scaleX(1);  }
    45%  { left: calc(100% + 10px); transform: scaleX(-1); }
    89%  { left: -90px;             transform: scaleX(-1); }
    90%  { left: -90px;             transform: scaleX(1);  }
    100% { left: -90px;             transform: scaleX(1);  }
  }
  @keyframes wheelSpin  { to { transform: rotate(360deg); } }
  @keyframes pkgOnBot   { 0%,38%{opacity:1} 39%,100%{opacity:0} }
  @keyframes pkgThrow   {
    0%,38%  { transform:translate(0,0) rotate(0deg);          opacity:0; }
    39%     { transform:translate(0,0) rotate(0deg);          opacity:1; }
    55%     { transform:translate(70px,-65px) rotate(160deg); opacity:1; }
    68%     { transform:translate(140px,0) rotate(290deg);    opacity:.7; }
    76%     { transform:translate(180px,30px) rotate(360deg); opacity:0; }
    100%    { transform:translate(180px,30px) rotate(360deg); opacity:0; }
  }
  @keyframes roadScroll { from{transform:translateX(0)} to{transform:translateX(-80px)} }
  @keyframes float      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes fadeUp     { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

  .bot-roll    { position:absolute; bottom:0; animation:botRoll 7s linear infinite; }
  .pkg-on      { animation:pkgOnBot 7s linear infinite; }
  .pkg-fly     { position:absolute; top:-28px; left:14px; animation:pkgThrow 7s linear infinite; }
  .hero-bot    { animation:float 3s ease-in-out infinite; }
  .road-dashes { display:flex; animation:roadScroll 1s linear infinite; }
  .card-anim   { animation:fadeUp 0.35s ease-out both; }

  input:focus, select:focus { outline:none; }
  input, select, button { font-family:'DM Sans',sans-serif; }

  .tab-btn {
    flex:1; padding:8px; border:none; border-radius:8px;
    font-size:14px; font-weight:500; cursor:pointer;
    transition:all .18s; background:transparent;
  }
  .submit-btn {
    width:100%; padding:11px; font-size:15px; font-weight:600;
    color:white; background:#4f46e5; border:none; border-radius:9px; cursor:pointer;
    transition:background .18s, transform .12s, box-shadow .18s;
    display:flex; align-items:center; justify-content:center; gap:8px;
  }
  .submit-btn:hover  { background:#4338ca; transform:translateY(-1px); box-shadow:0 6px 18px rgba(79,70,229,.3); }
  .submit-btn:active { transform:translateY(0); }
  .select-wrap { position:relative; }
  .select-wrap::after {
    content:'▾'; position:absolute; right:12px; top:50%; transform:translateY(-50%);
    color:#64748b; pointer-events:none; font-size:13px;
  }
  .theme-toggle {
    position:absolute; top:16px; right:16px; z-index:20;
    display:flex; align-items:center; gap:8px; padding:6px 10px 6px 6px;
    border-radius:99px; border:none; cursor:pointer;
    font-size:12px; font-weight:600;
    transition:background .25s, color .25s; user-select:none;
  }
  .toggle-track {
    width:36px; height:20px; border-radius:99px;
    position:relative; transition:background .25s; flex-shrink:0;
  }
  .toggle-knob {
    position:absolute; top:3px; left:3px;
    width:14px; height:14px; border-radius:50%; background:white;
    transition:transform .25s cubic-bezier(.34,1.56,.64,1);
    box-shadow:0 1px 3px rgba(0,0,0,.2);
  }
  .toggle-knob.on { transform:translateX(16px); }
`;

const LIGHT = {
  leftBg:"#eef2ff", leftDot:"#818cf8",
  roadBg:"#dde3ed", roadBorder:"#c8d0de", roadDash:"#aab4c8",
  rightBg:"white",
  heading:"#0f172a", subtext:"#64748b", label:"#64748b", hint:"#94a3b8",
  border:"#e2e8f0", inputBg:"white", inputText:"#0f172a",
  tabBg:"#f1f5f9", tabBorder:"#e2e8f0", tabActive:"white", tabActiveTxt:"#4f46e5",
  tabInactive:"#64748b", tabShadow:"0 1px 3px rgba(0,0,0,.09)",
  statBg:"white", statBorder:"#e2e8f0", statShadow:"0 1px 4px rgba(0,0,0,.06)", statText:"#94a3b8",
  otpSendBg:"#eef2ff", otpSendTxt:"#4f46e5",
  prefixBg:"#f8fafc", prefixBorder:"#e2e8f0", prefixTxt:"#64748b",
  phoneBg:"white", phoneTxt:"#0f172a",
  logoBg:"#4f46e5", logoTxt:"#1e293b", h1:"#1e1b4b",
  toggleBg:"rgba(0,0,0,0.06)", toggleTxt:"#475569", trackBg:"#cbd5e1",
  verifyDis:"#e2e8f0", verifyDisTxt:"#94a3b8",
  otpBg:"white", otpTxt:"#0f172a",
};

const DARK = {
  leftBg:"#0f0f1a", leftDot:"#4f46e5",
  roadBg:"#1a1a2e", roadBorder:"#2d2d4a", roadDash:"#3d3d5c",
  rightBg:"#0d0d1a",
  heading:"#f1f5f9", subtext:"#94a3b8", label:"#94a3b8", hint:"#64748b",
  border:"#2d2d4a", inputBg:"#1a1a2e", inputText:"#f1f5f9",
  tabBg:"#1a1a2e", tabBorder:"#2d2d4a", tabActive:"#2d2d4a", tabActiveTxt:"#a5b4fc",
  tabInactive:"#64748b", tabShadow:"0 1px 3px rgba(0,0,0,.4)",
  statBg:"#1a1a2e", statBorder:"#2d2d4a", statShadow:"0 1px 4px rgba(0,0,0,.3)", statText:"#64748b",
  otpSendBg:"#2d2d4a", otpSendTxt:"#a5b4fc",
  prefixBg:"#1a1a2e", prefixBorder:"#2d2d4a", prefixTxt:"#64748b",
  phoneBg:"#1a1a2e", phoneTxt:"#f1f5f9",
  logoBg:"#4f46e5", logoTxt:"#e2e8f0", h1:"#c7d2fe",
  toggleBg:"rgba(255,255,255,0.06)", toggleTxt:"#94a3b8", trackBg:"#4f46e5",
  verifyDis:"#1a1a2e", verifyDisTxt:"#475569",
  otpBg:"#1a1a2e", otpTxt:"#f1f5f9",
};

const HOSTELS = {
  Male:   ["N Block","Paari","Kaari","Oori"],
  Female: ["M Block","Meenakshi"],
};

const SRM_EMAIL_RE = /^[a-zA-Z0-9._%+-]+@srmist\.edu\.in$/;

// ── Stable components defined OUTSIDE AuthPage so React never remounts them ──

function FW({ children }) {
  return <div style={{ display:"flex", flexDirection:"column", gap:5 }}>{children}</div>;
}

function Label({ children, color }) {
  return (
    <label style={{ fontSize:12, fontWeight:500, color, letterSpacing:"0.04em", textTransform:"uppercase", transition:"color .25s" }}>
      {children}
    </label>
  );
}

function Hint({ children, color }) {
  return <span style={{ fontSize:11, color, transition:"color .25s" }}>{children}</span>;
}

function SendBtn({ disabled, sending, countdown, sent, verified, onClick, t }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || verified || countdown > 0}
      style={{
        padding:"0 14px", height:"100%", minWidth:84,
        fontSize:13, fontWeight:600,
        color: (verified || countdown > 0 || disabled) ? t.hint : t.otpSendTxt,
        background:t.otpSendBg, border:"none",
        borderLeft:`1.5px solid ${t.border}`, borderRadius:"0 7px 7px 0",
        cursor: (disabled || verified || countdown > 0) ? "not-allowed" : "pointer",
        whiteSpace:"nowrap", transition:"all .25s",
      }}
    >
      {verified ? "✓ Done" : sending ? "Sending…" : countdown > 0 ? `${countdown}s` : sent ? "Resend" : "Send OTP"}
    </button>
  );
}

function OtpEntry({ value, onChange, onVerify, error, hint, t }) {
  return (
    <>
      <div style={{ display:"flex", gap:8, marginTop:2 }}>
        <input
          style={{
            flex:1, padding:"10px 12px",
            fontFamily:"'DM Mono',monospace", fontSize:18, fontWeight:500,
            letterSpacing:".35em", textAlign:"center",
            color:t.otpTxt, background:t.otpBg,
            border:`1.5px solid ${t.border}`, borderRadius:8,
            transition:"all .18s",
          }}
          placeholder="· · · ·"
          maxLength={4}
          value={value}
          onChange={e => onChange(e.target.value.replace(/\D/g,""))}
        />
        <button
          type="button"
          onClick={onVerify}
          disabled={value.length < 4}
          style={{
            padding:"10px 18px", borderRadius:8, border:"none",
            background: value.length < 4 ? t.verifyDis : "#4f46e5",
            color: value.length < 4 ? t.verifyDisTxt : "white",
            fontSize:14, fontWeight:600,
            cursor: value.length < 4 ? "not-allowed" : "pointer",
            transition:"all .15s", whiteSpace:"nowrap",
          }}
        >Verify</button>
      </div>
      {error && <span style={{ fontSize:12, color:"#ef4444" }}>⚠ {error}</span>}
      <Hint color={t.hint}>{hint}</Hint>
    </>
  );
}

function BotSVG({ scale = 1 }) {
  return (
    <svg width={72*scale} height={68*scale} viewBox="0 0 72 68" fill="none">
      <rect x="8" y="20" width="56" height="36" rx="9" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5"/>
      <rect x="14" y="26" width="44" height="22" rx="5" fill="#1e1b4b"/>
      <circle cx="26" cy="37" r="5.5" fill="#4f46e5"/>
      <circle cx="46" cy="37" r="5.5" fill="#4f46e5"/>
      <circle cx="26" cy="37" r="2.8" fill="#a5b4fc"/>
      <circle cx="46" cy="37" r="2.8" fill="#a5b4fc"/>
      <circle cx="27" cy="36" r="1" fill="white"/>
      <circle cx="47" cy="36" r="1" fill="white"/>
      <line x1="36" y1="20" x2="36" y2="12" stroke="#94a3b8" strokeWidth="2"/>
      <circle cx="36" cy="10" r="3.5" fill="#6366f1"/>
      <circle cx="20" cy="60" r="7" fill="#334155"/>
      <g style={{ transformOrigin:"20px 60px", animation:"wheelSpin 0.4s linear infinite" }}>
        <line x1="20" y1="54" x2="20" y2="66" stroke="#94a3b8" strokeWidth="1.5"/>
        <line x1="14" y1="60" x2="26" y2="60" stroke="#94a3b8" strokeWidth="1.5"/>
        <line x1="15.8" y1="55.8" x2="24.2" y2="64.2" stroke="#94a3b8" strokeWidth="1.5"/>
        <line x1="24.2" y1="55.8" x2="15.8" y2="64.2" stroke="#94a3b8" strokeWidth="1.5"/>
      </g>
      <circle cx="20" cy="60" r="2.5" fill="#64748b"/>
      <circle cx="52" cy="60" r="7" fill="#334155"/>
      <g style={{ transformOrigin:"52px 60px", animation:"wheelSpin 0.4s linear infinite" }}>
        <line x1="52" y1="54" x2="52" y2="66" stroke="#94a3b8" strokeWidth="1.5"/>
        <line x1="46" y1="60" x2="58" y2="60" stroke="#94a3b8" strokeWidth="1.5"/>
        <line x1="47.8" y1="55.8" x2="56.2" y2="64.2" stroke="#94a3b8" strokeWidth="1.5"/>
        <line x1="56.2" y1="55.8" x2="47.8" y2="64.2" stroke="#94a3b8" strokeWidth="1.5"/>
      </g>
      <circle cx="52" cy="60" r="2.5" fill="#64748b"/>
      <rect x="0"  y="28" width="8"  height="4" rx="2" fill="#cbd5e1"/>
      <rect x="64" y="28" width="8"  height="4" rx="2" fill="#cbd5e1"/>
    </svg>
  );
}

function PkgSVG({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <rect x="1" y="6" width="20" height="15" rx="2.5" fill="#f59e0b" stroke="#d97706" strokeWidth="1.2"/>
      <line x1="11" y1="6"  x2="11" y2="21" stroke="#d97706" strokeWidth="1.2"/>
      <line x1="1"  y1="13" x2="21" y2="13" stroke="#d97706" strokeWidth="1.2"/>
      <path d="M7 6 L11 2 L15 6" fill="#fbbf24" stroke="#d97706" strokeWidth="1"/>
    </svg>
  );
}

// ────────────────────────────────────────────────────────────────────────────

export default function AuthPage() {
  const [dark,    setDark]    = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [form,    setForm]    = useState({ regNo:"", name:"", email:"", password:"", gender:"", hostel:"", phone:"" });
  const [ok,      setOk]      = useState(false);

  // Phone OTP
  const [phoneSent,      setPhoneSent]      = useState(false);
  const [phoneOtp,       setPhoneOtp]       = useState("");
  const [phoneVerified,  setPhoneVerified]  = useState(false);
  const [phoneErr,       setPhoneErr]       = useState("");
  const [phoneSending,   setPhoneSending]   = useState(false);
  const [phoneCountdown, setPhoneCountdown] = useState(0);

  // Email OTP
  const [emailSent,      setEmailSent]      = useState(false);
  const [emailOtp,       setEmailOtp]       = useState("");
  const [emailVerified,  setEmailVerified]  = useState(false);
  const [emailErr,       setEmailErr]       = useState("");
  const [emailSending,   setEmailSending]   = useState(false);
  const [emailCountdown, setEmailCountdown] = useState(0);
  const [emailFmtErr,    setEmailFmtErr]    = useState("");

  const t = dark ? DARK : LIGHT;

  const fiStyle = (extra = {}) => ({
    width:"100%", padding:"10px 12px",
    fontSize:14, color:t.inputText, background:t.inputBg,
    border:`1.5px solid ${t.border}`, borderRadius:8,
    transition:"border-color .18s, box-shadow .18s, background .25s, color .25s",
    appearance:"none",
    ...extra,
  });

  const focusOn  = e => { e.target.style.borderColor="#6366f1"; e.target.style.boxShadow="0 0 0 3px rgba(99,102,241,.12)"; };
  const focusOff = (border) => e => { e.target.style.borderColor = border || t.border; e.target.style.boxShadow="none"; };

  const set = k => e => {
    const val = e.target.value;
    setForm(p => ({ ...p, [k]: val, ...(k === "gender" ? { hostel:"" } : {}) }));
    if (k === "email") {
      setEmailFmtErr(""); setEmailSent(false);
      setEmailVerified(false); setEmailOtp(""); setEmailErr("");
    }
  };

  const switchTab = toLogin => {
    setIsLogin(toLogin);
    setForm({ regNo:"", name:"", email:"", password:"", gender:"", hostel:"", phone:"" });
    setPhoneSent(false); setPhoneOtp(""); setPhoneVerified(false); setPhoneErr(""); setPhoneCountdown(0);
    setEmailSent(false); setEmailOtp(""); setEmailVerified(false); setEmailErr(""); setEmailCountdown(0); setEmailFmtErr("");
  };

  const startCountdown = (setter) => {
    let c = 30; setter(c);
    const iv = setInterval(() => { c--; setter(c); if (c <= 0) clearInterval(iv); }, 1000);
  };

  const sendPhoneOtp = () => {
    if (form.phone.length < 10) return;
    setPhoneSending(true);
    setTimeout(() => {
      setPhoneSending(false); setPhoneSent(true); setPhoneErr(""); setPhoneVerified(false); setPhoneOtp("");
      startCountdown(setPhoneCountdown);
    }, 1200);
  };

  const sendEmailOtp = () => {
    if (!SRM_EMAIL_RE.test(form.email)) {
      setEmailFmtErr("Please enter a valid @srmist.edu.in email address.");
      return;
    }
    setEmailFmtErr("");
    setEmailSending(true);
    setTimeout(() => {
      setEmailSending(false); setEmailSent(true); setEmailErr(""); setEmailVerified(false); setEmailOtp("");
      startCountdown(setEmailCountdown);
    }, 1200);
  };

  const submit = e => { e.preventDefault(); setOk(true); setTimeout(() => setOk(false), 2200); };

  const hostels = HOSTELS[form.gender] || [];

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight:"100vh", display:"flex", background:t.rightBg, transition:"background .25s" }}>

        {/* ── LEFT PANEL ── */}
        <div style={{
          width:"48%", background:t.leftBg, position:"relative", overflow:"hidden",
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
          padding:"48px 40px 120px", transition:"background .25s",
        }}>
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity: dark ? 0.15 : 0.3, pointerEvents:"none", transition:"opacity .25s" }}>
            <defs>
              <pattern id="dp" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.2" fill={t.leftDot}/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dp)"/>
          </svg>

          <div className="hero-bot" style={{ position:"relative", zIndex:2, marginBottom:20 }}>
            <BotSVG scale={1.6}/>
          </div>

          <div style={{ position:"relative", zIndex:2, textAlign:"center", marginBottom:28 }}>
            <h1 style={{ fontSize:26, fontWeight:700, color:t.h1, letterSpacing:"-0.02em", marginBottom:8, transition:"color .25s" }}>
              Campus Delivery Bot
            </h1>
            <p style={{ color:t.subtext, fontSize:14, lineHeight:1.7, maxWidth:260, transition:"color .25s" }}>
              Autonomous package delivery across SRM campus — fast, reliable, contactless.
            </p>
          </div>

          <div style={{ position:"relative", zIndex:2, display:"flex", gap:12 }}>
            {[["12","Bots Active"],["2.4k","Delivered"],["4 min","Avg Time"]].map(([v,l]) => (
              <div key={l} style={{ background:t.statBg, borderRadius:10, padding:"10px 16px", textAlign:"center", boxShadow:t.statShadow, border:`1px solid ${t.statBorder}`, transition:"all .25s" }}>
                <div style={{ fontSize:18, fontWeight:700, color:"#4f46e5", fontFamily:"'DM Mono',monospace" }}>{v}</div>
                <div style={{ fontSize:11, color:t.statText, marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Road */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:72, background:t.roadBg, borderTop:`2px solid ${t.roadBorder}`, transition:"background .25s, border-color .25s" }}>
            <div className="road-dashes" style={{ position:"absolute", top:"44%", left:0 }}>
              {Array.from({length:24}).map((_,i) => (
                <div key={i} style={{ width:40, height:3, marginRight:40, background: i%2===0 ? t.roadDash : "transparent", transition:"background .25s" }}/>
              ))}
            </div>
            <div className="bot-roll">
              <div className="pkg-on" style={{ position:"absolute", top:-22, left:24 }}><PkgSVG size={24}/></div>
              <div className="pkg-fly"><PkgSVG size={24}/></div>
              <BotSVG scale={0.9}/>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"24px", background:t.rightBg, overflowY:"auto", position:"relative", transition:"background .25s" }}>

          {/* Theme toggle */}
          <button className="theme-toggle" onClick={() => setDark(d => !d)} style={{ background:t.toggleBg, color:t.toggleTxt }}>
            <div className="toggle-track" style={{ background:t.trackBg }}>
              <div className={`toggle-knob ${dark ? "on" : ""}`}/>
            </div>
            <span>{dark ? "🌙 Dark" : "☀️ Light"}</span>
          </button>

          <div className="card-anim" key={isLogin?"l":"r"} style={{ width:"100%", maxWidth:390, paddingTop:8, paddingBottom:8 }}>

            {/* Logo */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
              <div style={{ width:34, height:34, borderRadius:9, background:t.logoBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>🤖</div>
              <span style={{ fontWeight:600, color:t.logoTxt, fontSize:15, transition:"color .25s" }}>CampusBot</span>
            </div>

            <h2 style={{ fontSize:22, fontWeight:700, color:t.heading, marginBottom:4, transition:"color .25s" }}>
              {isLogin ? "Sign in" : "Create account"}
            </h2>
            <p style={{ color:t.subtext, fontSize:13, marginBottom:20, transition:"color .25s" }}>
              {isLogin ? "Welcome back. Enter your credentials." : "Register with your SRM details."}
            </p>

            {/* Tabs */}
            <div style={{ display:"flex", background:t.tabBg, borderRadius:10, padding:3, marginBottom:20, border:`1px solid ${t.tabBorder}`, transition:"all .25s" }}>
              {["Sign In","Register"].map(tab => {
                const active = (tab === "Sign In") === isLogin;
                return (
                  <button key={tab} className="tab-btn" onClick={() => switchTab(tab === "Sign In")}
                    style={{ background: active ? t.tabActive : "transparent", color: active ? t.tabActiveTxt : t.tabInactive, fontWeight: active ? 600 : 400, boxShadow: active ? t.tabShadow : "none" }}
                  >{tab}</button>
                );
              })}
            </div>

            <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:13 }}>

              {/* Reg No */}
              <FW>
                <Label color={t.label}>Registration Number</Label>
                <input style={fiStyle()} placeholder="RA2211003011234" value={form.regNo} onChange={set("regNo")} onFocus={focusOn} onBlur={focusOff()} required/>
                <Hint color={t.hint}>Must start with RA followed by digits</Hint>
              </FW>

              {!isLogin && (
                <>
                  {/* Name */}
                  <FW>
                    <Label color={t.label}>Full Name</Label>
                    <input style={fiStyle()} placeholder="John Doe" value={form.name} onChange={set("name")} onFocus={focusOn} onBlur={focusOff()} required/>
                  </FW>

                  {/* SRM Email */}
                  <FW>
                    <Label color={t.label}>SRM Email</Label>
                    <div style={{ display:"flex", border:`1.5px solid ${emailFmtErr ? "#ef4444" : t.border}`, borderRadius:8, overflow:"hidden", transition:"border-color .18s" }}>
                      <input
                        style={{ flex:1, padding:"10px 12px", fontSize:14, color:t.phoneTxt, border:"none", outline:"none", background:t.phoneBg, transition:"all .25s" }}
                        placeholder="am5464@srmist.edu.in"
                        value={form.email}
                        onChange={set("email")}
                        disabled={emailVerified}
                        required
                      />
                      <SendBtn disabled={form.email.trim().length < 5} sending={emailSending} countdown={emailCountdown} sent={emailSent} verified={emailVerified} onClick={sendEmailOtp} t={t}/>
                    </div>
                    {emailFmtErr
                      ? <span style={{ fontSize:12, color:"#ef4444" }}>⚠ {emailFmtErr}</span>
                      : emailVerified
                        ? <span style={{ fontSize:11, color:"#16a34a", fontWeight:500 }}>✓ Email verified</span>
                        : <Hint color={t.hint}>e.g. am5464@srmist.edu.in · Must be your SRM email</Hint>
                    }
                    {emailSent && !emailVerified && (
                      <OtpEntry value={emailOtp} onChange={v => { setEmailOtp(v); setEmailErr(""); }} onVerify={() => { if (emailOtp === "1234") { setEmailVerified(true); setEmailErr(""); } else setEmailErr("Incorrect OTP. Please try again."); }} error={emailErr} hint="Enter the OTP sent to your email · Demo: 1234" t={t}/>
                    )}
                  </FW>

                  {/* Gender */}
                  <FW>
                    <Label color={t.label}>Gender</Label>
                    <div className="select-wrap">
                      <select style={fiStyle({ paddingRight:32, cursor:"pointer" })} value={form.gender} onChange={set("gender")} required>
                        <option value="" disabled>Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </FW>

                  {/* Hostel */}
                  {form.gender && (
                    <FW>
                      <Label color={t.label}>Hostel Block</Label>
                      <div className="select-wrap">
                        <select style={fiStyle({ paddingRight:32, cursor:"pointer" })} value={form.hostel} onChange={set("hostel")} required>
                          <option value="" disabled>Select hostel</option>
                          {hostels.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                      </div>
                      <Hint color={t.hint}>{form.gender === "Male" ? "Male: N Block, Paari, Kaari, Oori" : "Female: M Block, Meenakshi"}</Hint>
                    </FW>
                  )}

                  {/* Phone */}
                  <FW>
                    <Label color={t.label}>Phone Number</Label>
                    <div style={{ display:"flex", border:`1.5px solid ${t.border}`, borderRadius:8, overflow:"hidden", transition:"border-color .18s" }}>
                      <span style={{ padding:"10px 10px 10px 12px", fontSize:14, background:t.prefixBg, borderRight:`1.5px solid ${t.prefixBorder}`, color:t.prefixTxt, userSelect:"none", transition:"all .25s" }}>+91</span>
                      <input
                        style={{ flex:1, padding:"10px 8px", fontSize:14, color:t.phoneTxt, border:"none", outline:"none", background:t.phoneBg, transition:"all .25s" }}
                        placeholder="9876543210" maxLength={10}
                        value={form.phone} onChange={set("phone")}
                        disabled={phoneVerified} required
                      />
                      <SendBtn disabled={form.phone.length < 10} sending={phoneSending} countdown={phoneCountdown} sent={phoneSent} verified={phoneVerified} onClick={sendPhoneOtp} t={t}/>
                    </div>
                    {phoneVerified
                      ? <span style={{ fontSize:11, color:"#16a34a", fontWeight:500 }}>✓ Phone number verified</span>
                      : <Hint color={t.hint}>We'll send a 4-digit OTP to verify your number</Hint>
                    }
                    {phoneSent && !phoneVerified && (
                      <OtpEntry value={phoneOtp} onChange={v => { setPhoneOtp(v); setPhoneErr(""); }} onVerify={() => { if (phoneOtp === "1234") { setPhoneVerified(true); setPhoneErr(""); } else setPhoneErr("Incorrect OTP. Please try again."); }} error={phoneErr} hint="Demo OTP is 1234" t={t}/>
                    )}
                  </FW>
                </>
              )}

              {/* Password */}
              <FW>
                <Label color={t.label}>Password</Label>
                <input style={fiStyle()} type="password" placeholder="••••••••" value={form.password} onChange={set("password")} onFocus={focusOn} onBlur={focusOff()} required/>
              </FW>

              {isLogin && (
                <div style={{ textAlign:"right", marginTop:-4 }}>
                  <a href="#" style={{ fontSize:12, color:"#6366f1", textDecoration:"none" }}>Forgot password?</a>
                </div>
              )}

              <button className="submit-btn" type="submit" style={{ marginTop:4 }}>
                {ok ? "✓ Done!" : isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            <p style={{ marginTop:16, textAlign:"center", fontSize:13, color:t.hint, transition:"color .25s" }}>
              {isLogin ? "No account yet?" : "Already registered?"}{" "}
              <button onClick={() => switchTab(!isLogin)} style={{ background:"none", border:"none", cursor:"pointer", color:"#6366f1", fontWeight:600, fontSize:13 }}>
                {isLogin ? "Register" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}