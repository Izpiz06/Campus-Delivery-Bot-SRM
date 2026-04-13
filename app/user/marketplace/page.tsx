"use client";

// ────────────────────────────────────────────────────────────────────────────
// MARKETPLACE PAGE
// ────────────────────────────────────────────────────────────────────────────

const trendingItems = [
  {
    rank: "#1",
    name: "Double Stack Burger",
    vendor: "Tech Park Canteen",
    price: "₹149",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDYBHX8ptu0Tnpv54Gl8uYpFqh8YFo5LUuWja5C4ViY-cGqiBJsp-ogW2i9EJ6m0RMa7ik210LC_5OA-7mRSoZKtcz5gJqrKidV4Zu9K2AKfxTsfR1yJU09kgNR3M2ncRv6W1iOU8jl9gKiW03qG8zK5EuG7n58YsAy5BhdZjg9bkgz_OmzyuVtrqFaU8sOK980Gcot1qQH5fxzeRJpn6VRSoCNNcfHQ01riPxsyGh3bDl4cIAsPsCnXAUxzyCSH8dHYOrer9mst_s",
  },
  {
    rank: "#2",
    name: "Iced Caramel Latte",
    vendor: "Java",
    price: "₹190",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC026QS9OWp9FkNElCEPH97LibLg5j31_VTr8lPCVM80CpMeBwkvFyiCaAZwn3zjPpKHc8c0ChK8tknZKYnS3qY-Gp8QYQM_66cI2iuJaPKI1IlwFvUD96QvaiOEanrU3dhISFTYE9JQQE18GrrDFrZCUeii_tAyFp6ioeOYRr8F0Q0j4vygtjEhXxaQBxV1uwSUk2txnDlorfzx29TmUz2PW_jVxNou-ELRgqGo6QLfpC8oAfYEi8dt7hLbJosx4HQplhburJanE4",
  },
  {
    rank: "#3",
    name: "Veggie Deluxe Sub",
    vendor: "Subway",
    price: "₹220",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCyIJXSkzvyqVQPPhTr9H7L0hTGzrMSkWyOkz8g0Ck2iCO2hQNF4XwamWsOw-S2ttfsteWf4b6Ga9X0J1Sq9OiBi2gHXXQTHZ3nKVfqUkX5KybjuDcqVnhd8qQge-79-4ASTzrv-sLK4WvehReOQHf8e-m-BgPnNREKIOQMyvi7Mt98dD28eofpovvCkZKjH8uP5mG-YhZ09VVmDLKYyK387BTjm7e60IwU3IQSSN7F9Qfjpu_RJwvRhnGXLU0gcOztUEDXZM6W_oY",
  },
];

const vendors = [
  {
    name: "Tech Park Canteen",
    location: "MAIN HUB / SECTOR 4",
    rating: 4.8,
    tags: ["Indian", "Chinese"],
    busy: "HIGH",
    busyColor: "#ba1a1a",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAn8lHckRE80HjPoIdq8-07TN1v8ng2X1bNJDZUNKVI1zfUhWxiGiV5wDwEix22fagoRgtaQoTDdm0SrnbsJklCkUN9q9D3slxPmqocnjLVVVzg_nX27aqyzdHsQznXqHQm5qdHTKnHSCm1WnrlAWnXpslEpplElG_MgPMs3AqjUMdQvxzUXyN77g2HoXTJxfMYmNOUQtLYydGyaFzkiMIug5U6-fPCMaRqLXshzf_gESDDygjKRKW31_fr2ua3xc2zOXSeHS_Odew",
  },
  {
    name: "Java",
    location: "CENTRAL PLAZA",
    rating: 4.5,
    tags: ["Beverages", "Pastries"],
    busy: "MED",
    busyColor: "#a93800",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAnQUe26P6x36ZVYaMXaG3fN5D9rq418MRk4JHti20PRvewn1Omzj731o7uMYW4I8QWFgPENiE71cZUvG6HwdTf2LNg-Ekme2ljQWriX06aTtp2DTuplpia955xkn1gNnL_X4kCDFEO6wKN6zufnWdeiXqBimPl48HnrVweh08WuifeCztrnA7aYV-ggEZi_MSGzQCwGblJF4tNATo4__hvmz5X0vVtzDahHQvUeL_KQguvBXavZD5SFU_qu5IDjH2ap2VNFJgiCEE",
  },
  {
    name: "Subway",
    location: "SOUTH GATE",
    rating: 4.2,
    tags: ["Healthy", "Fast Food"],
    busy: "LOW",
    busyColor: "#22c55e",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC3P7LgWdAEVn8RxX5PYMh5dQB0qYKENFqTsFtFzgZMMK5Pl7dq2OBgoTfPRgu7vtZHVSMwB27t8OSbNapWldJSWbt2_ibPmOITXTG6eKltYovGCR-iLBFJTNrfcQZf3vbLWDttz3ZM6NXMI3NLa0g8g-zc9A54uocBJugOTrTh-r-0ViNoM7gM4Lnbc-FCPFsOOO1iZ5F2QuWEqkVmYzb3hLWc2s0vXJFa1zTqCQXydksbW5ZbzaWtcjotTAo-OlYmw8A4fIxnYxQ",
  },
];

const categories = [
  { icon: "fastfood", label: "QUICK SNACKS" },
  { icon: "restaurant", label: "FULL MEALS" },
  { icon: "local_cafe", label: "BEVERAGES" },
  { icon: "edit_note", label: "STATIONERY" },
];

export default function MarketplacePage() {
  const shadow = "10px 10px 0px 0px rgba(0,0,0,1)";
  const shadowSm = "4px 4px 0px 0px rgba(0,0,0,1)";

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", paddingBottom: 96 }}>
      {/* ══════════════ HERO / CATEGORY SECTION ══════════════ */}
      <section style={{ marginBottom: 48 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            borderBottom: "4px solid #000",
            paddingBottom: 8,
            marginBottom: 24,
          }}
        >
          <h1
            style={{
              fontSize: 48,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.04em",
            }}
            className="page-title"
          >
            CATALOG_SCAN
          </h1>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              background: "#FF5F15",
              color: "#fff",
              padding: "4px 8px",
            }}
          >
            LIVE_FEED
          </span>
        </div>

        {/* Category Buttons */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
          className="cat-grid"
        >
          {categories.map((cat) => (
            <button
              key={cat.label}
              style={{
                background: "#fff",
                border: "4px solid #000",
                padding: 16,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: shadowSm,
                transition: "none",
                fontWeight: 900,
                fontSize: 12,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#FF5F15";
                (e.currentTarget as HTMLElement).style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#fff";
                (e.currentTarget as HTMLElement).style.color = "#000";
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "translate(4px, 4px)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 0 0 0 rgba(0,0,0,1)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "";
                (e.currentTarget as HTMLElement).style.boxShadow = shadowSm;
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 32, marginBottom: 8 }}
              >
                {cat.icon}
              </span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ══════════════ POPULAR RIGHT NOW ══════════════ */}
      <section style={{ marginBottom: 48 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ color: "#FF5F15" }}
          >
            bolt
          </span>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
            }}
          >
            POPULAR RIGHT NOW
          </h2>
          <div
            style={{ flexGrow: 1, height: 2, background: "#000" }}
          />
        </div>

        {/* Horizontal Scroll */}
        <div
          className="no-scrollbar"
          style={{
            display: "flex",
            overflowX: "auto",
            gap: 24,
            paddingBottom: 16,
          }}
        >
          {trendingItems.map((item) => (
            <div
              key={item.name}
              style={{
                minWidth: 300,
                background: "#fff",
                border: "4px solid #000",
                boxShadow: shadow,
                flexShrink: 0,
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "100%",
                  height: 160,
                  objectFit: "cover",
                  borderBottom: "4px solid #000",
                }}
              />
              <div style={{ padding: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 900,
                      background: "#000",
                      color: "#fff",
                      padding: "2px 8px",
                    }}
                  >
                    TRENDING {item.rank}
                  </span>
                  <span
                    style={{
                      fontWeight: 900,
                      color: "#FF5F15",
                      fontSize: 16,
                    }}
                  >
                    {item.price}
                  </span>
                </div>
                <h3
                  style={{
                    fontWeight: 900,
                    fontSize: 16,
                    textTransform: "uppercase",
                  }}
                >
                  {item.name}
                </h3>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#5e5e5e",
                    textTransform: "uppercase",
                    marginTop: 4,
                  }}
                >
                  {item.vendor}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ VENDOR GRID ══════════════ */}
      <section>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 24,
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ color: "#FF5F15" }}
          >
            list_alt
          </span>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
            }}
          >
            VENDORS_OFFLINE_AND_LIVE
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 32,
          }}
          className="vendor-grid"
        >
          {vendors.map((vendor, idx) => (
            <article
              key={vendor.name}
              style={{
                background: "#fff",
                border: "4px solid #000",
                boxShadow: shadow,
              }}
            >
              {/* Image */}
              <div style={{ position: "relative" }}>
                <img
                  src={vendor.image}
                  alt={vendor.name}
                  style={{
                    width: "100%",
                    height: 192,
                    objectFit: "cover",
                    borderBottom: "4px solid #000",
                    filter: idx === 0 ? "grayscale(50%)" : "none",
                    transition: "filter 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLImageElement).style.filter =
                      "grayscale(0%)")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLImageElement).style.filter =
                      idx === 0 ? "grayscale(50%)" : "none")
                  }
                />
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    background: vendor.busyColor,
                    color: "#fff",
                    fontWeight: 900,
                    padding: "4px 12px",
                    border: "2px solid #000",
                    fontSize: 10,
                    textTransform: "uppercase",
                  }}
                >
                  BUSY: {vendor.busy}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: 24 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: 22,
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {vendor.name}
                    </h3>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#5e5e5e",
                        textTransform: "uppercase",
                      }}
                    >
                      {vendor.location}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      color: "#FF5F15",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontVariationSettings: "'FILL' 1",
                        fontSize: 18,
                      }}
                    >
                      star
                    </span>
                    <span style={{ fontWeight: 900, fontSize: 14 }}>
                      {vendor.rating}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginBottom: 24,
                  }}
                >
                  {vendor.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        border: "2px solid #000",
                        padding: "2px 8px",
                        fontSize: 9,
                        fontWeight: 900,
                        textTransform: "uppercase",
                        background: "#f1eee7",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <button
                  style={{
                    width: "100%",
                    background: "#FF5F15",
                    color: "#000",
                    fontWeight: 900,
                    padding: "12px 0",
                    border: "4px solid #000",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    fontSize: 13,
                    transition: "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "#000";
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "#FF5F15";
                    (e.currentTarget as HTMLElement).style.color = "#000";
                  }}
                  onMouseDown={(e) => {
                    (e.currentTarget as HTMLElement).style.transform =
                      "translate(1px, 1px)";
                  }}
                  onMouseUp={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "";
                  }}
                >
                  VIEW_MENU_{String(idx + 1).padStart(3, "0")}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ══════════════ RESPONSIVE CSS ══════════════ */}
      <style>{`
        @media (max-width: 768px) {
          .page-title { font-size: 28px !important; }
          .cat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .vendor-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .vendor-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
