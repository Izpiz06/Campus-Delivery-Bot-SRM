"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

// ────────────────────────────────────────────────────────────────────────────
// NAV CONFIG
// ────────────────────────────────────────────────────────────────────────────

const sideNavItems = [
  { icon: "storefront", label: "Marketplace", href: "/user/marketplace" },
  { icon: "route", label: "Live Tracking", href: "/user/tracking" },
  { icon: "lock_open", label: "Locker Access", href: "/user/tracking" },
  { icon: "settings_input_component", label: "System Health", href: "/user/tracking" },
  { icon: "receipt_long", label: "Orders", href: "/user/orders" },
  { icon: "settings", label: "Settings", href: "/user/profile" },
];

const bottomNavItems = [
  { icon: "smart_toy", label: "FLEET", href: "/user/tracking" },
  { icon: "receipt_long", label: "ORDERS", href: "/user/orders" },
  { icon: "storefront", label: "MKT_PLACE", href: "/user/marketplace" },
  { icon: "person", label: "PROFILE", href: "/user/profile" },
];

// ────────────────────────────────────────────────────────────────────────────
// LAYOUT
// ────────────────────────────────────────────────────────────────────────────

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("OPERATOR_01");

  useEffect(() => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const parsed = JSON.parse(user);
        if (parsed.name) setUserName(parsed.name.toUpperCase());
      }
    } catch { /* ignore */ }
  }, []);

  const isActive = (href: string) => pathname === href;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "#F4F1EA",
        color: "#1c1c18",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {/* ══════════════ TOP NAVBAR ══════════════ */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 24px",
          height: 72,
          background: "#F4F1EA",
          borderBottom: "4px solid #000",
          boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <span
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: "#000",
              textDecoration: "underline",
              textDecorationThickness: 4,
              textUnderlineOffset: 4,
              textTransform: "uppercase",
              letterSpacing: "-0.04em",
            }}
          >
            SRM ASCEND
          </span>

          {/* Desktop nav links */}
          <div
            className="desktop-nav"
            style={{ display: "flex", gap: 16, alignItems: "center" }}
          >
            {[
              { label: "Marketplace", href: "/user/marketplace" },
              { label: "Live Tracking", href: "/user/tracking" },
              { label: "Orders", href: "/user/orders" },
              { label: "Profile", href: "/user/profile" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(item.href);
                }}
                style={{
                  fontSize: 12,
                  fontWeight: isActive(item.href) ? 900 : 700,
                  textTransform: "uppercase",
                  letterSpacing: "-0.02em",
                  textDecoration: isActive(item.href) ? "underline" : "none",
                  color: isActive(item.href) ? "#FF5F15" : "#000",
                  padding: "4px 8px",
                  cursor: "pointer",
                  transition: "none",
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#fff",
              border: "2px solid #000",
              padding: "4px 12px",
              gap: 8,
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 14 }}
            >
              sensors
            </span>
            <span style={{ fontSize: 10, fontWeight: 700 }}>LINK_STABLE</span>
          </div>
          <span className="material-symbols-outlined" style={{ color: "#000" }}>
            location_on
          </span>
        </div>
      </nav>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* ══════════════ SIDEBAR (Desktop) ══════════════ */}
        <aside
          className="desktop-sidebar"
          style={{
            width: 256,
            flexShrink: 0,
            background: "#fff",
            borderRight: "4px solid #000",
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            top: 72,
            left: 0,
            height: "calc(100vh - 72px - 48px)",
            zIndex: 40,
          }}
        >
          {/* Profile header */}
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "4px solid #000",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 900, textTransform: "uppercase" }}>
              {userName}
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#5e5e5e", textTransform: "uppercase" }}>
              CAMPUS_SECURE_LINK
            </div>
          </div>

          {/* Nav items */}
          <nav style={{ flex: 1, overflowY: "auto" }}>
            {sideNavItems.map((item) => {
              const active = isActive(item.href);
              return (
                <div
                  key={item.label}
                  onClick={() => router.push(item.href)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "14px 16px",
                    fontSize: 13,
                    fontWeight: active ? 900 : 700,
                    cursor: "pointer",
                    textTransform: "uppercase",
                    transition: "none",
                    background: active ? "#FF5F15" : "transparent",
                    color: active ? "#fff" : "#000",
                    borderTop: active ? "2px solid #000" : "none",
                    borderBottom: active ? "2px solid #000" : "none",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: 20,
                      fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
              );
            })}
          </nav>
        </aside>

        {/* ══════════════ MAIN CONTENT ══════════════ */}
        <main
          className="user-main-content"
          style={{
            flex: 1,
            marginLeft: 256,
            padding: 24,
            overflowY: "auto",
            marginBottom: 48,
            minHeight: "calc(100vh - 72px)",
          }}
        >
          {children}
        </main>
      </div>

      {/* ══════════════ MARQUEE FOOTER ══════════════ */}
      <footer
        style={{
          background: "#F4F1EA",
          borderTop: "4px solid #000",
          width: "100%",
          height: 48,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          position: "fixed",
          bottom: 0,
          left: 0,
          zIndex: 30,
        }}
      >
        <div className="animate-marquee" style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              fontWeight: 900,
              fontSize: 14,
              padding: "0 16px",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              letterSpacing: "-0.02em",
            }}
          >
            BOT EN ROUTE TO HOSTEL // AVOID OBSTRUCTION // QUEUE POSITION: 01 // SYSTEM_STATUS: NOMINAL // SRM_ASCEND_V2.0 // OPERATIONAL_STATUS: LIVE //&nbsp;
            BOT EN ROUTE TO HOSTEL // AVOID OBSTRUCTION // QUEUE POSITION: 01 // SYSTEM_STATUS: NOMINAL // SRM_ASCEND_V2.0 // OPERATIONAL_STATUS: LIVE //&nbsp;
            BOT EN ROUTE TO HOSTEL // AVOID OBSTRUCTION // QUEUE POSITION: 01 // SYSTEM_STATUS: NOMINAL // SRM_ASCEND_V2.0 // OPERATIONAL_STATUS: LIVE
          </span>
        </div>
      </footer>

      {/* ══════════════ BOTTOM NAV (Mobile) ══════════════ */}
      <nav
        className="mobile-bottom-nav"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          zIndex: 50,
          display: "none",
          height: 64,
          background: "#F4F1EA",
          borderTop: "4px solid #000",
        }}
      >
        {bottomNavItems.map((item, i) => {
          const active = isActive(item.href);
          return (
            <div
              key={item.label}
              onClick={() => router.push(item.href)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                background: active ? "#FF5F15" : "transparent",
                color: active ? "#000" : "#000",
                borderRight: i < bottomNavItems.length - 1 ? "2px solid #000" : "none",
                transition: "none",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: 22,
                  fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {item.icon}
              </span>
              <span style={{ fontSize: 9, fontWeight: 700 }}>{item.label}</span>
            </div>
          );
        })}
      </nav>

      {/* ══════════════ RESPONSIVE CSS ══════════════ */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .desktop-nav { display: none !important; }
          .user-main-content {
            margin-left: 0 !important;
            margin-bottom: 64px !important;
            padding: 16px !important;
          }
          .mobile-bottom-nav { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
