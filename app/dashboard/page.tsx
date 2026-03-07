"use client";
import { useState, useEffect } from "react";

type BotStatus = "available" | "busy" | "charging";
interface Bot { id:number; name:string; status:BotStatus; battery:number; location:string; task?:string; eta?:number; }

const INITIAL_BOTS: Bot[] = [
  { id:1, name:"BOT-01", status:"available", battery:92, location:"Main Gate" },
  { id:2, name:"BOT-02", status:"busy",      battery:74, location:"N Block",    task:"Delivering to Paari",   eta:180 },
  { id:3, name:"BOT-03", status:"busy",      battery:58, location:"A Block",    task:"Delivering to M Block", eta:320 },
  { id:4, name:"BOT-04", status:"available", battery:85, location:"Cafeteria" },
  { id:5, name:"BOT-05", status:"charging",  battery:31, location:"Charging Bay" },
];

const STATUS_META = {
  available: { label:"Available",   color:"#22c55e", bg:"#dcfce7", dot:"#16a34a" },
  busy:      { label:"On Delivery", color:"#f59e0b", bg:"#fef3c7", dot:"#d97706" },
  charging:  { label:"Charging",    color:"#6366f1", bg:"#eef2ff", dot:"#4f46e5" },
};

function fmt(sec:number) {
  const m=Math.floor(sec/60), s=sec%60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

const LIGHT = {
  bg:"#f8fafc", card:"white", border:"#e2e8f0",
  heading:"#0f172a", subtext:"#64748b", muted:"#94a3b8",
  shadow:"0 1px 4px rgba(0,0,0,0.06)",
  topbar:"white", topbarBorder:"#e2e8f0",
  roadBg:"#e8edf5", roadDash:"#c0c8d8", thead:"#f8fafc",
};
const DARK = {
  bg:"#0a0a14", card:"#13132a", border:"#1e1e38",
  heading:"#f1f5f9", subtext:"#94a3b8", muted:"#475569",
  shadow:"0 1px 4px rgba(0,0,0,0.3)",
  topbar:"#0f0f1e", topbarBorder:"#1e1e38",
  roadBg:"#1a1a2e", roadDash:"#2d2d4a", thead:"rgba(255,255,255,0.03)",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'DM Sans',sans-serif; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes botWalk {
    0%  { left:-65px; transform:scaleX(1); }
    45% { left:calc(100% + 10px); transform:scaleX(1); }
    46% { left:calc(100% + 10px); transform:scaleX(-1); }
    91% { left:-65px; transform:scaleX(-1); }
    92% { left:-65px; transform:scaleX(1); }
    100%{ left:-65px; transform:scaleX(1); }
  }
  @keyframes wheelSpin { to { transform:rotate(360deg); } }
  @keyframes pkgOnBot  { 0%,38%{opacity:1} 39%,100%{opacity:0} }
  @keyframes pkgThrow  {
    0%,38% { transform:translate(0,0) rotate(0deg); opacity:0; }
    39%    { transform:translate(0,0) rotate(0deg); opacity:1; }
    55%    { transform:translate(60px,-50px) rotate(150deg); opacity:1; }
    68%    { transform:translate(120px,0) rotate(280deg); opacity:.7; }
    75%    { transform:translate(150px,25px) rotate(340deg); opacity:0; }
    100%   { opacity:0; }
  }
  @keyframes roadScroll { from{transform:translateX(0)} to{transform:translateX(-80px)} }
  .ca  { animation:fadeUp .4s ease-out both; }
  .bw  { position:absolute; bottom:0; animation:botWalk 9s linear infinite; }
  .po  { animation:pkgOnBot 9s linear infinite; }
  .pf  { position:absolute; top:-22px; left:12px; animation:pkgThrow 9s linear infinite; }
  .rd  { display:flex; animation:roadScroll 1s linear infinite; }
  .tk  { position:absolute; top:3px; left:3px; width:14px; height:14px; border-radius:50%; background:white; transition:transform .25s cubic-bezier(.34,1.56,.64,1); box-shadow:0 1px 3px rgba(0,0,0,.2); }
  .tk.on { transform:translateX(16px); }
  tr:hover td { background:rgba(99,102,241,0.04); }
  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:99px; }
`;

function BBar({ pct }: { pct:number }) {
  const color = pct > 60 ? "#22c55e" : pct > 30 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
      <div style={{ flex:1, height:5, background:"#e2e8f0", borderRadius:99, overflow:"hidden" }}>
        <div style={{ width:`${pct}%`, height:"100%", background:color, borderRadius:99, transition:"width .4s" }}/>
      </div>
      <span style={{ fontSize:11, color:"#64748b", minWidth:28, textAlign:"right" }}>{pct}%</span>
    </div>
  );
}

function BotCard({ bot, dark }: { bot:Bot; dark:boolean }) {
  const m = STATUS_META[bot.status];
  const t = dark ? DARK : LIGHT;
  return (
    <div style={{ background:t.card, border:`1.5px solid ${bot.status==="available"?"rgba(34,197,94,0.3)":t.border}`, borderRadius:16, padding:"20px 20px 18px", display:"flex", flexDirection:"column", gap:12, transition:"all .25s", boxShadow:bot.status==="available"?"0 0 0 3px rgba(34,197,94,0.08)":t.shadow, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:m.color, borderRadius:"16px 16px 0 0", opacity:.8 }}/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:dark?"#1e1e38":"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, border:`1px solid ${t.border}` }}>🤖</div>
          <div>
            <div style={{ fontWeight:700, fontSize:15, color:t.heading, fontFamily:"'DM Mono',monospace", letterSpacing:"0.04em" }}>{bot.name}</div>
            <div style={{ fontSize:12, color:t.muted, marginTop:1 }}>📍 {bot.location}</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 10px", background:dark?"rgba(255,255,255,0.06)":m.bg, borderRadius:20, border:`1px solid ${m.color}33` }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:m.dot, boxShadow:bot.status==="available"?`0 0 6px ${m.dot}`:"none", animation:bot.status==="available"?"pulse 2s ease-in-out infinite":"none" }}/>
          <span style={{ fontSize:11, fontWeight:600, color:dark?m.color:m.dot }}>{m.label}</span>
        </div>
      </div>
      {bot.status==="busy" && bot.task && (
        <div style={{ background:dark?"rgba(245,158,11,0.08)":"#fffbeb", border:"1px solid rgba(245,158,11,0.25)", borderRadius:8, padding:"8px 12px" }}>
          <div style={{ fontSize:12, color:dark?"#fcd34d":"#92400e", fontWeight:500 }}>📦 {bot.task}</div>
          <div style={{ fontSize:11, color:dark?"#fbbf24":"#a16207", marginTop:3 }}>⏱ ETA: <strong>{bot.eta ? fmt(bot.eta) : "—"}</strong></div>
        </div>
      )}
      {bot.status==="charging" && (
        <div style={{ background:dark?"rgba(99,102,241,0.08)":"#eef2ff", border:"1px solid rgba(99,102,241,0.2)", borderRadius:8, padding:"8px 12px" }}>
          <div style={{ fontSize:12, color:dark?"#a5b4fc":"#4338ca", fontWeight:500 }}>⚡ Charging in progress</div>
          <div style={{ fontSize:11, color:dark?"#818cf8":"#6366f1", marginTop:3 }}>Est. ready in ~{Math.round((100-bot.battery)*1.2)} min</div>
        </div>
      )}
      <div>
        <div style={{ fontSize:11, color:t.muted, marginBottom:5, fontWeight:500 }}>BATTERY</div>
        <BBar pct={bot.battery}/>
      </div>
    </div>
  );
}

function BotSVG({ s=1 }: { s?:number }) {
  return (
    <svg width={60*s} height={56*s} viewBox="0 0 60 56" fill="none">
      <rect x="6" y="14" width="48" height="30" rx="7" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.2"/>
      <rect x="11" y="19" width="38" height="18" rx="4" fill="#1e1b4b"/>
      <circle cx="22" cy="28" r="4.5" fill="#4f46e5"/><circle cx="38" cy="28" r="4.5" fill="#4f46e5"/>
      <circle cx="22" cy="28" r="2.2" fill="#a5b4fc"/><circle cx="38" cy="28" r="2.2" fill="#a5b4fc"/>
      <line x1="30" y1="14" x2="30" y2="8" stroke="#94a3b8" strokeWidth="1.5"/>
      <circle cx="30" cy="6" r="2.5" fill="#6366f1"/>
      <circle cx="16" cy="48" r="6" fill="#334155"/>
      <g style={{ transformOrigin:"16px 48px", animation:"wheelSpin 0.4s linear infinite" }}>
        <line x1="16" y1="43" x2="16" y2="53" stroke="#94a3b8" strokeWidth="1.2"/>
        <line x1="11" y1="48" x2="21" y2="48" stroke="#94a3b8" strokeWidth="1.2"/>
        <line x1="12.5" y1="44.5" x2="19.5" y2="51.5" stroke="#94a3b8" strokeWidth="1.2"/>
        <line x1="19.5" y1="44.5" x2="12.5" y2="51.5" stroke="#94a3b8" strokeWidth="1.2"/>
      </g>
      <circle cx="16" cy="48" r="2" fill="#64748b"/>
      <circle cx="44" cy="48" r="6" fill="#334155"/>
      <g style={{ transformOrigin:"44px 48px", animation:"wheelSpin 0.4s linear infinite" }}>
        <line x1="44" y1="43" x2="44" y2="53" stroke="#94a3b8" strokeWidth="1.2"/>
        <line x1="39" y1="48" x2="49" y2="48" stroke="#94a3b8" strokeWidth="1.2"/>
        <line x1="40.5" y1="44.5" x2="47.5" y2="51.5" stroke="#94a3b8" strokeWidth="1.2"/>
        <line x1="47.5" y1="44.5" x2="40.5" y2="51.5" stroke="#94a3b8" strokeWidth="1.2"/>
      </g>
      <circle cx="44" cy="48" r="2" fill="#64748b"/>
    </svg>
  );
}

function PkgSVG({ n=18 }: { n?:number }) {
  return (
    <svg width={n} height={n} viewBox="0 0 20 20" fill="none">
      <rect x="1" y="5" width="18" height="14" rx="2" fill="#f59e0b" stroke="#d97706" strokeWidth="1"/>
      <line x1="10" y1="5" x2="10" y2="19" stroke="#d97706" strokeWidth="1"/>
      <line x1="1" y1="12" x2="19" y2="12" stroke="#d97706" strokeWidth="1"/>
      <path d="M6 5 L10 2 L14 5" fill="#fbbf24" stroke="#d97706" strokeWidth=".8"/>
    </svg>
  );
}

export default function Dashboard() {
  const [dark, setDark] = useState(false);
  const [bots, setBots] = useState<Bot[]>(INITIAL_BOTS);
  const t = dark ? DARK : LIGHT;

  useEffect(() => {
    const iv = setInterval(() => {
      setBots(prev => prev.map(b =>
        b.status === "busy" && b.eta && b.eta > 0
          ? { ...b, eta: b.eta - 1, ...(b.eta - 1 <= 0 ? { status:"available" as BotStatus, eta:undefined, task:undefined } : {}) }
          : b
      ));
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const avail   = bots.filter(b => b.status === "available").length;
  const busy    = bots.filter(b => b.status === "busy").length;
  const chg     = bots.filter(b => b.status === "charging").length;
  const etas    = bots.filter(b => b.status === "busy" && b.eta).map(b => b.eta!);
  const nextEta = etas.length ? Math.min(...etas) : null;

  const stats = [
    { label:"Total Bots",  value:bots.length, icon:"🤖", color:"#6366f1", bg:dark?"rgba(99,102,241,0.12)":"#eef2ff" },
    { label:"Available",   value:avail,        icon:"✅", color:"#22c55e", bg:dark?"rgba(34,197,94,0.10)":"#dcfce7" },
    { label:"On Delivery", value:busy,         icon:"📦", color:"#f59e0b", bg:dark?"rgba(245,158,11,0.10)":"#fef9c3" },
    { label:"Charging",    value:chg,          icon:"⚡", color:"#6366f1", bg:dark?"rgba(99,102,241,0.10)":"#e0e7ff" },
  ];

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight:"100vh", background:t.bg, fontFamily:"'DM Sans',sans-serif", color:t.heading, transition:"background .25s, color .25s" }}>

        {/* TOP BAR */}
        <div style={{ background:t.topbar, borderBottom:`1px solid ${t.topbarBorder}`, padding:"0 32px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50, transition:"all .25s" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:"#4f46e5", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🤖</div>
            <span style={{ fontWeight:700, fontSize:16, color:t.heading }}>CampusBot</span>
            <span style={{ fontSize:12, color:t.muted, background:dark?"rgba(255,255,255,0.06)":"#f1f5f9", padding:"2px 8px", borderRadius:20, marginLeft:4 }}>Dashboard</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:t.subtext }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 6px #22c55e", animation:"pulse 2s ease-in-out infinite" }}/>
              Live
            </div>
            <button onClick={() => setDark(d => !d)} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 10px 5px 5px", borderRadius:99, border:"none", background:dark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.05)", color:t.subtext, cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"'DM Sans',sans-serif" }}>
              <div style={{ width:36, height:20, borderRadius:99, background:dark?"#4f46e5":"#cbd5e1", position:"relative" }}>
                <div className={`tk ${dark ? "on" : ""}`}/>
              </div>
              {dark ? "🌙 Dark" : "☀️ Light"}
            </button>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:"white", fontWeight:700 }}>U</div>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ padding:"28px 32px", maxWidth:1200, margin:"0 auto" }}>

          <div style={{ marginBottom:24 }}>
            <h1 style={{ fontSize:22, fontWeight:700, marginBottom:4 }}>Bot Fleet Overview</h1>
            <p style={{ fontSize:14, color:t.subtext }}>Real-time status of all 5 campus delivery bots</p>
          </div>

          {/* STAT CARDS */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
            {stats.map((s, i) => (
              <div key={s.label} className="ca" style={{ animationDelay:`${i*0.07}s`, background:t.card, border:`1.5px solid ${t.border}`, borderRadius:14, padding:"18px 20px", boxShadow:t.shadow, transition:"all .25s" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                  <div style={{ width:38, height:38, borderRadius:10, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{s.icon}</div>
                  <span style={{ fontSize:11, color:t.muted, fontFamily:"'DM Mono',monospace" }}>0{i+1}</span>
                </div>
                <div style={{ fontSize:32, fontWeight:700, color:s.color, fontFamily:"'DM Mono',monospace", lineHeight:1 }}>{s.value}</div>
                <div style={{ fontSize:12, color:t.subtext, marginTop:4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* STATUS BANNER */}
          {avail === 0 && nextEta !== null ? (
            <div className="ca" style={{ background:dark?"rgba(245,158,11,0.08)":"#fffbeb", border:"1.5px solid rgba(245,158,11,0.35)", borderRadius:14, padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:40, height:40, borderRadius:10, background:"rgba(245,158,11,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>⏳</div>
                <div>
                  <div style={{ fontWeight:700, color:dark?"#fcd34d":"#92400e", fontSize:14 }}>All bots are currently busy</div>
                  <div style={{ fontSize:13, color:dark?"#fbbf24":"#a16207", marginTop:2 }}>Next bot available in approximately</div>
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:32, fontWeight:700, color:"#f59e0b", fontFamily:"'DM Mono',monospace", lineHeight:1 }}>{fmt(nextEta)}</div>
                <div style={{ fontSize:11, color:dark?"#fbbf24":"#a16207", marginTop:3 }}>estimated wait time</div>
              </div>
            </div>
          ) : avail > 0 ? (
            <div className="ca" style={{ background:dark?"rgba(34,197,94,0.07)":"#f0fdf4", border:"1.5px solid rgba(34,197,94,0.3)", borderRadius:14, padding:"14px 20px", display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 8px #22c55e", animation:"pulse 2s ease-in-out infinite", flexShrink:0 }}/>
              <span style={{ fontWeight:600, color:dark?"#86efac":"#166534", fontSize:14 }}>
                {avail} bot{avail > 1 ? "s are" : " is"} ready for delivery right now!
              </span>
            </div>
          ) : null}

          {/* BOT CARDS */}
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:13, fontWeight:600, color:t.muted, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:14 }}>Individual Bot Status</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
              {bots.map((bot, i) => (
                <div key={bot.id} className="ca" style={{ animationDelay:`${i*0.08}s` }}>
                  <BotCard bot={bot} dark={dark}/>
                </div>
              ))}
            </div>
          </div>

          {/* LIVE ROAD */}
          <div className="ca" style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:16, overflow:"hidden", marginBottom:24, boxShadow:t.shadow, transition:"all .25s" }}>
            <div style={{ padding:"16px 20px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:13, fontWeight:600, color:t.muted, letterSpacing:"0.06em", textTransform:"uppercase" }}>Live Bot Tracker</span>
              <span style={{ fontSize:12, color:t.muted, fontFamily:"'DM Mono',monospace" }}>SRM Campus</span>
            </div>
            <div style={{ position:"relative", height:100, marginTop:12, background:t.roadBg, borderTop:`1px solid ${t.border}` }}>
              <div className="rd" style={{ position:"absolute", top:"46%", left:0 }}>
                {Array.from({length:28}).map((_, i) => (
                  <div key={i} style={{ width:36, height:3, marginRight:36, background:i%2===0?t.roadDash:"transparent" }}/>
                ))}
              </div>
              <div className="bw">
                <div className="po" style={{ position:"absolute", top:-18, left:14 }}><PkgSVG n={20}/></div>
                <div className="pf"><PkgSVG n={20}/></div>
                <BotSVG s={0.85}/>
              </div>
              {["Main Gate","A Block","Cafeteria","N Block","Charging Bay"].map((loc, i) => (
                <div key={loc} style={{ position:"absolute", bottom:8, left:`${10+i*20}%`, fontSize:9, color:t.muted, textAlign:"center", transform:"translateX(-50%)", whiteSpace:"nowrap" }}>
                  <div style={{ width:1, height:8, background:t.border, margin:"0 auto 3px" }}/>
                  {loc}
                </div>
              ))}
            </div>
          </div>

          {/* SUMMARY TABLE */}
          <div className="ca" style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:16, overflow:"hidden", boxShadow:t.shadow, transition:"all .25s" }}>
            <div style={{ padding:"16px 20px", borderBottom:`1px solid ${t.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:13, fontWeight:600, color:t.muted, letterSpacing:"0.06em", textTransform:"uppercase" }}>Fleet Summary</span>
              <span style={{ fontSize:11, color:t.muted, fontFamily:"'DM Mono',monospace" }}>Updated every second</span>
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:t.thead }}>
                    {["Bot","Status","Location","Battery","Task / ETA"].map(h => (
                      <th key={h} style={{ padding:"10px 20px", textAlign:"left", fontSize:11, fontWeight:600, color:t.muted, letterSpacing:"0.08em", textTransform:"uppercase", borderBottom:`1px solid ${t.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bots.map((bot, i) => {
                    const m = STATUS_META[bot.status];
                    return (
                      <tr key={bot.id} style={{ borderBottom:i < bots.length-1 ? `1px solid ${t.border}` : "none", transition:"background .15s" }}>
                        <td style={{ padding:"12px 20px", fontWeight:600, color:t.heading, fontFamily:"'DM Mono',monospace", fontSize:13 }}>{bot.name}</td>
                        <td style={{ padding:"12px 20px" }}>
                          <div style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 9px", background:dark?"rgba(255,255,255,0.05)":m.bg, borderRadius:20, border:`1px solid ${m.color}33` }}>
                            <div style={{ width:5, height:5, borderRadius:"50%", background:m.dot, animation:bot.status==="available"?"pulse 2s ease-in-out infinite":"none" }}/>
                            <span style={{ fontSize:11, fontWeight:600, color:dark?m.color:m.dot }}>{m.label}</span>
                          </div>
                        </td>
                        <td style={{ padding:"12px 20px", fontSize:13, color:t.subtext }}>📍 {bot.location}</td>
                        <td style={{ padding:"12px 20px", minWidth:130 }}><BBar pct={bot.battery}/></td>
                        <td style={{ padding:"12px 20px", fontSize:13 }}>
                          {bot.status === "busy" && bot.eta
                            ? <span style={{ color:"#f59e0b", fontFamily:"'DM Mono',monospace", fontWeight:600 }}>⏱ {fmt(bot.eta)}</span>
                            : bot.status === "available"
                              ? <span style={{ color:"#22c55e", fontWeight:500 }}>Ready to deploy</span>
                              : <span style={{ color:"#6366f1" }}>Charging…</span>
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}