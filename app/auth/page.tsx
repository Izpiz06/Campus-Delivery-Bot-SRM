"use client";
import { useState } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* Bot drives L→R, flips, drives back */
  @keyframes botRoll {
    0%   { left: -90px;              transform: scaleX(1);  }
    44%  { left: calc(100% + 10px);  transform: scaleX(1);  }
    45%  { left: calc(100% + 10px);  transform: scaleX(-1); }
    89%  { left: -90px;              transform: scaleX(-1); }
    90%  { left: -90px;              transform: scaleX(1);  }
    100% { left: -90px;              transform: scaleX(1);  }
  }

  /* Wheels always spin */
  @keyframes wheelSpin {
    to { transform: rotate(360deg); }
  }

  /* Package sits on top of bot then vanishes right before throw */
  @keyframes pkgOnBot {
    0%,  38% { opacity: 1; }
    39%, 100% { opacity: 0; }
  }

  /* Package flies in arc (appears at 39%, arcs up-and-forward, fades) */
  @keyframes pkgThrow {
    0%,  38% { transform: translate(0px, 0px)   rotate(0deg);   opacity: 0; }
    39%       { transform: translate(0px, 0px)   rotate(0deg);   opacity: 1; }
    55%       { transform: translate(70px,-65px) rotate(160deg); opacity: 1; }
    68%       { transform: translate(140px, 0px) rotate(290deg); opacity: 0.7; }
    76%       { transform: translate(180px, 30px) rotate(360deg);opacity: 0; }
    100%      { transform: translate(180px, 30px) rotate(360deg);opacity: 0; }
  }

  /* Road dashes scroll left */
  @keyframes roadScroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-80px); }
  }

  /* Gentle float for hero bot */
  @keyframes float {
    0%,100% { transform: translateY(0); }
    50%     { transform: translateY(-8px); }
  }

  /* Card entrance */
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(18px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .bot-roll { position:absolute; bottom:0; animation: botRoll 7s linear infinite; }
  .pkg-on   { animation: pkgOnBot 7s linear infinite; }
  .pkg-fly  { position:absolute; top:-28px; left:14px; animation: pkgThrow 7s linear infinite; }
  .hero-bot { animation: float 3s ease-in-out infinite; }
  .road-dashes { display:flex; animation: roadScroll 1s linear infinite; }
  .card-anim { animation: fadeUp 0.35s ease-out both; }

  input::placeholder { color:#94a3b8; }
  input:focus { outline:none; }

  .field-input {
    width:100%;
    padding:10px 12px;
    font-family:'DM Sans',sans-serif;
    font-size:14px;
    color:#0f172a;
    background:white;
    border:1.5px solid #e2e8f0;
    border-radius:8px;
    transition:border-color 0.18s, box-shadow 0.18s;
  }
  .field-input:focus {
    border-color:#6366f1;
    box-shadow:0 0 0 3px rgba(99,102,241,0.12);
  }

  .submit-btn {
    width:100%; padding:11px;
    font-family:'DM Sans',sans-serif;
    font-size:15px; font-weight:600;
    color:white; background:#4f46e5;
    border:none; border-radius:9px;
    cursor:pointer;
    transition:background 0.18s, transform 0.12s, box-shadow 0.18s;
  }
  .submit-btn:hover { background:#4338ca; transform:translateY(-1px); box-shadow:0 6px 18px rgba(79,70,229,0.3); }
  .submit-btn:active { transform:translateY(0); }

  .tab-btn {
    flex:1; padding:8px; border:none; border-radius:8px;
    font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500;
    cursor:pointer; transition:all 0.18s; background:transparent;
  }
`;

/* ── SVG pieces ── */
function BotSVG({ scale = 1 }) {
  const w = 72 * scale, h = 68 * scale;
  return (
    <svg width={w} height={h} viewBox="0 0 72 68" fill="none">
      {/* body */}
      <rect x="8" y="20" width="56" height="36" rx="9" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5"/>
      {/* screen */}
      <rect x="14" y="26" width="44" height="22" rx="5" fill="#1e1b4b"/>
      {/* eyes */}
      <circle cx="26" cy="37" r="5.5" fill="#4f46e5"/>
      <circle cx="46" cy="37" r="5.5" fill="#4f46e5"/>
      <circle cx="26" cy="37" r="2.8" fill="#a5b4fc"/>
      <circle cx="46" cy="37" r="2.8" fill="#a5b4fc"/>
      <circle cx="27" cy="36" r="1" fill="white"/>
      <circle cx="47" cy="36" r="1" fill="white"/>
      {/* antenna */}
      <line x1="36" y1="20" x2="36" y2="12" stroke="#94a3b8" strokeWidth="2"/>
      <circle cx="36" cy="10" r="3.5" fill="#6366f1"/>
      {/* wheels */}
      <circle cx="20" cy="60" r="7" fill="#334155"/>
      <g style={{transformOrigin:"20px 60px", animation:"wheelSpin 0.4s linear infinite"}}>
        <line x1="20" y1="54" x2="20" y2="66" stroke="#94a3b8" strokeWidth="1.5"/>
        <line x1="14" y1="60" x2="26" y2="60" stroke="#94a3b8" strokeWidth="1.5"/>
        <line x1="15.8" y1="55.8" x2="24.2" y2="64.2" stroke="#94a3b8" strokeWidth="1.5"/>
        <line x1="24.2" y1="55.8" x2="15.8" y2="64.2" stroke="#94a3b8" strokeWidth="1.5"/>
      </g>
      <circle cx="20" cy="60" r="2.5" fill="#64748b"/>

      <circle cx="52" cy="60" r="7" fill="#334155"/>
      <g style={{transformOrigin:"52px 60px", animation:"wheelSpin 0.4s linear infinite"}}>
        <line x1="52" y1="54" x2="52" y2="66" stroke="#94a3b8" strokeWidth="1.5"/>
        <line x1="46" y1="60" x2="58" y2="60" stroke="#94a3b8" strokeWidth="1.5"/>
        <line x1="47.8" y1="55.8" x2="56.2" y2="64.2" stroke="#94a3b8" strokeWidth="1.5"/>
        <line x1="56.2" y1="55.8" x2="47.8" y2="64.2" stroke="#94a3b8" strokeWidth="1.5"/>
      </g>
      <circle cx="52" cy="60" r="2.5" fill="#64748b"/>
      {/* arms */}
      <rect x="0"  y="28" width="8" height="4" rx="2" fill="#cbd5e1"/>
      <rect x="64" y="28" width="8" height="4" rx="2" fill="#cbd5e1"/>
    </svg>
  );
}

function PkgSVG({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <rect x="1" y="6" width="20" height="15" rx="2.5" fill="#f59e0b" stroke="#d97706" strokeWidth="1.2"/>
      <line x1="11" y1="6" x2="11" y2="21" stroke="#d97706" strokeWidth="1.2"/>
      <line x1="1"  y1="13" x2="21" y2="13" stroke="#d97706" strokeWidth="1.2"/>
      <path d="M7 6 L11 2 L15 6" fill="#fbbf24" stroke="#d97706" strokeWidth="1"/>
    </svg>
  );
}

function Field({ label, placeholder, type = "text", value, onChange, hint, required }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
      <label style={{ fontSize:12, fontWeight:500, color:"#64748b", letterSpacing:"0.04em", textTransform:"uppercase" }}>
        {label}
      </label>
      <input
        className="field-input"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
      {hint && <span style={{ fontSize:11, color:"#94a3b8" }}>{hint}</span>}
    </div>
  );
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm]       = useState({ regNo:"", name:"", email:"", password:"" });
  const [ok, setOk]           = useState(false);

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = e => {
    e.preventDefault();
    setOk(true);
    setTimeout(() => setOk(false), 2000);
  };

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight:"100vh", display:"flex", fontFamily:"'DM Sans',sans-serif", background:"#f8fafc" }}>

        {/* ── LEFT ── */}
        <div style={{
          width:"52%", background:"#eef2ff",
          position:"relative", overflow:"hidden",
          display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center",
          padding:"48px 40px 120px",
        }}>
          {/* dot grid */}
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.3, pointerEvents:"none" }}>
            <defs>
              <pattern id="dp" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.2" fill="#818cf8"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dp)"/>
          </svg>

          {/* hero bot */}
          <div className="hero-bot" style={{ position:"relative", zIndex:2, marginBottom:20 }}>
            <BotSVG scale={1.6}/>
          </div>

          {/* text */}
          <div style={{ position:"relative", zIndex:2, textAlign:"center", marginBottom:28 }}>
            <h1 style={{ fontSize:26, fontWeight:700, color:"#1e1b4b", letterSpacing:"-0.02em", marginBottom:8 }}>
              Campus Delivery Bot
            </h1>
            <p style={{ color:"#64748b", fontSize:14, lineHeight:1.7, maxWidth:260 }}>
              Autonomous package delivery across SRM campus — fast, reliable, contactless.
            </p>
          </div>

          {/* stats */}
          <div style={{ position:"relative", zIndex:2, display:"flex", gap:12 }}>
            {[["12","Bots Active"],["2.4k","Delivered"],["4 min","Avg Time"]].map(([v,l])=>(
              <div key={l} style={{
                background:"white", borderRadius:10,
                padding:"10px 16px", textAlign:"center",
                boxShadow:"0 1px 4px rgba(0,0,0,0.06)",
                border:"1px solid #e2e8f0",
              }}>
                <div style={{ fontSize:18, fontWeight:700, color:"#4f46e5", fontFamily:"'DM Mono',monospace" }}>{v}</div>
                <div style={{ fontSize:11, color:"#94a3b8", marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* ── ROAD ── */}
          <div style={{
            position:"absolute", bottom:0, left:0, right:0, height:72,
            background:"#dde3ed",
            borderTop:"2px solid #c8d0de",
          }}>
            {/* dashes */}
            <div className="road-dashes" style={{ position:"absolute", top:"44%", left:0 }}>
              {Array.from({length:24}).map((_,i)=>(
                <div key={i} style={{ width:40, height:3, marginRight:40, background: i%2===0 ? "#aab4c8" : "transparent" }}/>
              ))}
            </div>

            {/* rolling bot + package */}
            <div className="bot-roll">
              {/* package that disappears at throw */}
              <div className="pkg-on" style={{ position:"absolute", top:-22, left:24 }}>
                <PkgSVG size={24}/>
              </div>
              {/* flying package */}
              <div className="pkg-fly">
                <PkgSVG size={24}/>
              </div>
              <BotSVG scale={0.9}/>
            </div>
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div style={{
          flex:1, display:"flex",
          alignItems:"center", justifyContent:"center",
          padding:"32px 24px",
          background:"white",
        }}>
          <div className="card-anim" key={isLogin?"l":"r"} style={{ width:"100%", maxWidth:370 }}>

            {/* logo */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:28 }}>
              <div style={{
                width:34, height:34, borderRadius:9,
                background:"#4f46e5",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:17,
              }}>🤖</div>
              <span style={{ fontWeight:600, color:"#1e293b", fontSize:15 }}>CampusBot</span>
            </div>

            <h2 style={{ fontSize:22, fontWeight:700, color:"#0f172a", marginBottom:4 }}>
              {isLogin ? "Sign in" : "Create account"}
            </h2>
            <p style={{ color:"#64748b", fontSize:13, marginBottom:24 }}>
              {isLogin ? "Welcome back. Enter your credentials." : "Register with your SRM details."}
            </p>

            {/* tabs */}
            <div style={{
              display:"flex", background:"#f1f5f9",
              borderRadius:10, padding:3, marginBottom:22,
              border:"1px solid #e2e8f0",
            }}>
              {["Sign In","Register"].map(t => {
                const active = (t==="Sign In")===isLogin;
                return (
                  <button key={t} className="tab-btn"
                    onClick={()=>setIsLogin(t==="Sign In")}
                    style={{
                      background: active ? "white" : "transparent",
                      color: active ? "#4f46e5" : "#64748b",
                      fontWeight: active ? 600 : 400,
                      boxShadow: active ? "0 1px 3px rgba(0,0,0,0.09)" : "none",
                    }}
                  >{t}</button>
                );
              })}
            </div>

            <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:13 }}>
              <Field label="Registration Number" placeholder="RA2211003011234"
                value={form.regNo} onChange={set("regNo")}
                hint="Must start with RA followed by digits" required/>

              {!isLogin && <>
                <Field label="Full Name" placeholder="John Doe"
                  value={form.name} onChange={set("name")} required/>
                <Field label="SRM Email" type="email" placeholder="ra2211003011234@srmist.edu.in"
                  value={form.email} onChange={set("email")}
                  hint="Use your @srmist.edu.in email" required/>
              </>}

              <Field label="Password" type="password" placeholder="••••••••"
                value={form.password} onChange={set("password")} required/>

              {isLogin && (
                <div style={{ textAlign:"right", marginTop:-4 }}>
                  <a href="#" style={{ fontSize:12, color:"#4f46e5", textDecoration:"none" }}>Forgot password?</a>
                </div>
              )}

              <button className="submit-btn" type="submit" style={{ marginTop:4 }}>
                {ok ? "✓ Done!" : isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            <p style={{ marginTop:18, textAlign:"center", fontSize:13, color:"#94a3b8" }}>
              {isLogin ? "No account yet?" : "Already registered?"}{" "}
              <button onClick={()=>setIsLogin(!isLogin)} style={{
                background:"none", border:"none", cursor:"pointer",
                color:"#4f46e5", fontWeight:600, fontSize:13,
                fontFamily:"'DM Sans',sans-serif",
              }}>
                {isLogin ? "Register" : "Sign in"}
              </button>
            </p>
          </div>
        </div>

      </div>
    </>
  );
}