"use client";

// ────────────────────────────────────────────────────────────────────────────
// ORDER MANAGEMENT PAGE
// ────────────────────────────────────────────────────────────────────────────

const frequentOrders = [
  {
    name: "Double_Stack_V2",
    source: "Main Canteen • 14 Orders",
    price: "₹149",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAUnhtABfOXJJgKfEcrY3h567BrdGmElWIof2-BCTZDucw8G-MVw_ZEGrfH7dOL-6fmJF-Q5AkgBZh1TXNXQotXyYiSx3K1B7KHM7HJ-i5qHXZDXxWfBLJ5LA9iWdizrhBXq4hllyoNvBEnRYa7BVzwWd-2W3sVtm2AcEmNtC2MHx3AnK6jmovJJd9tLbxDNhnOfMB60RuM_KP-kjFEpDs52OHEWrgwkY_GTi-zg0_6xT_YP8doPtGBJI81lFRibW2O3MB2IawotiE",
  },
  {
    name: "Caffeine_Injection",
    source: "The Grind Station • 28 Orders",
    price: "₹90",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCNpHs9uRJSZ71nSw21uSftV1kWUnbHuOYi_e9C6F1HHipjmbUU2P7Tof3YrJXL92cuZco_-KavpCnWLwb9pgDMOKapu6oRPL_KqRBMZmnXOTgtpyytaYO2V1agTiRyPjVRJv39WbZg2i4Bj2u7cTFflI01JrYDj6peHqBbuaRNjW2StEvu2fphaLM2gZvaWpy--0Aj8kVcQ7ruWyxlRr6OX7A-9SB7TVNTp2vBOeuWr1Yrow-QMr9BXzO0a-rn_73QzF-AB9RZvcs",
  },
  {
    name: "Nutrient_Fuel_Box",
    source: "Green Field Cafe • 8 Orders",
    price: "₹180",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA1mWP0QS7WjoTAEOdJa6mT3JmUYy-9yQ2GlK3ENhYGP71qFDSKJjYuupKmhGjz1Ac1mUhbl_BLG1qpYBqhd_XV9gB7KXKjCpeVj5ayUljm0kDTUN4KD6O86Ieks4gJFSNB-jqN8jr2CBeuAj9mLDY5_Xab_APrr2yLZx1yZp0-OjTgYQUbPOe1QmSxVioZgk3oOmbpgLAtLa6S_3WEUt_-u0FvoBfWAZfSAwgH7_Kamayb4TO1TV0nOlCOt53VAnSvfq9FBvSWXtc",
  },
];

const orderLogs = [
  {
    id: "#SRM-09882",
    timestamp: "OCT 24, 2023 12:44",
    entity: "Main_Canteen_V4",
    price: "₹498",
  },
  {
    id: "#SRM-09841",
    timestamp: "OCT 23, 2023 09:15",
    entity: "The_Grind_Station",
    price: "₹250",
  },
  {
    id: "#SRM-09799",
    timestamp: "OCT 22, 2023 19:30",
    entity: "Pizza_Forge",
    price: "₹762",
  },
  {
    id: "#SRM-09752",
    timestamp: "OCT 21, 2023 13:02",
    entity: "Green_Field_Cafe",
    price: "₹300",
  },
];

export default function OrdersPage() {
  const shadow = "10px 10px 0px 0px rgba(0,0,0,1)";
  const shadowSm = "4px 4px 0px 0px rgba(0,0,0,1)";

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", paddingBottom: 96 }}>
      {/* ══════════════ HEADER ══════════════ */}
      <div style={{ marginBottom: 48 }}>
        <h1
          style={{
            fontSize: 48,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-0.04em",
            fontStyle: "italic",
            marginBottom: 8,
          }}
          className="page-title"
        >
          Order_Management
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              background: "#000",
              color: "#fff",
              padding: "4px 8px",
              fontSize: 11,
              letterSpacing: "0.1em",
            }}
          >
            SYSTEM_STATUS: ACTIVE
          </span>
          <span
            style={{
              background: "#FF5F15",
              color: "#000",
              padding: "4px 8px",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            OPERATOR_ID: 01
          </span>
        </div>
      </div>

      {/* ══════════════ FREQUENT ORDERS ══════════════ */}
      <section style={{ marginBottom: 64 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "4px solid #000",
            marginBottom: 24,
            paddingBottom: 8,
          }}
        >
          <h2
            style={{
              fontSize: 22,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span className="material-symbols-outlined">history</span>
            Frequent_Orders
          </h2>
          <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.6 }}>
            PULL_TO_REFRESH &gt;&gt;
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 32,
          }}
          className="freq-grid"
        >
          {frequentOrders.map((order) => (
            <div
              key={order.name}
              style={{
                background: "#fff",
                border: "4px solid #000",
                boxShadow: shadow,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Image */}
              <div
                style={{
                  position: "relative",
                  height: 192,
                  borderBottom: "4px solid #000",
                  overflow: "hidden",
                }}
              >
                <img
                  src={order.image}
                  alt={order.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "grayscale(100%)",
                    transition: "filter 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLImageElement).style.filter =
                      "grayscale(0%)")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLImageElement).style.filter =
                      "grayscale(100%)")
                  }
                />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    background: "#FF5F15",
                    color: "#000",
                    fontWeight: 900,
                    padding: "4px 12px",
                    borderLeft: "4px solid #000",
                    borderBottom: "4px solid #000",
                    fontSize: 14,
                  }}
                >
                  {order.price}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: 16, flexGrow: 1 }}>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  {order.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#5e5e5e",
                    marginBottom: 16,
                    textTransform: "uppercase",
                  }}
                >
                  {order.source}
                </div>
                <button
                  style={{
                    width: "100%",
                    background: "#FF5F15",
                    color: "#000",
                    fontWeight: 900,
                    padding: "16px 0",
                    border: "4px solid #000",
                    boxShadow: shadowSm,
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "-0.02em",
                    fontSize: 13,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: "none",
                  }}
                  onMouseDown={(e) => {
                    (e.currentTarget as HTMLElement).style.transform =
                      "translate(2px, 2px)";
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
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    bolt
                  </span>
                  Reorder_in_1-Tap
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ ORDER HISTORY / FULL LOGS ══════════════ */}
      <section>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "4px solid #000",
            marginBottom: 24,
            paddingBottom: 8,
          }}
        >
          <h2
            style={{
              fontSize: 22,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span className="material-symbols-outlined">receipt_long</span>
            Full_Logs
          </h2>
          <div style={{ display: "flex", gap: 16 }}>
            <button
              style={{
                background: "#000",
                color: "#fff",
                fontSize: 10,
                fontWeight: 700,
                padding: "4px 12px",
                border: "none",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Sort: Date_Desc
            </button>
            <button
              style={{
                background: "#000",
                color: "#fff",
                fontSize: 10,
                fontWeight: 700,
                padding: "4px 12px",
                border: "none",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Filter: ALL
            </button>
          </div>
        </div>

        {/* Table */}
        <div
          style={{
            background: "#fff",
            border: "4px solid #000",
            boxShadow: shadow,
            overflow: "hidden",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#000",
                  color: "#fff",
                  fontSize: 10,
                  textTransform: "uppercase",
                }}
              >
                <th
                  style={{
                    padding: "16px 24px",
                    textAlign: "left",
                    borderRight: "1px solid #333",
                  }}
                >
                  Order_ID
                </th>
                <th
                  style={{
                    padding: "16px 24px",
                    textAlign: "left",
                    borderRight: "1px solid #333",
                  }}
                >
                  Timestamp
                </th>
                <th
                  style={{
                    padding: "16px 24px",
                    textAlign: "left",
                    borderRight: "1px solid #333",
                  }}
                >
                  Entity/Canteen
                </th>
                <th
                  style={{
                    padding: "16px 24px",
                    textAlign: "left",
                    borderRight: "1px solid #333",
                  }}
                >
                  Unit_Price
                </th>
                <th style={{ padding: "16px 24px", textAlign: "right" }}>
                  Operational_Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orderLogs.map((order, i) => (
                <tr
                  key={order.id}
                  style={{
                    borderBottom:
                      i < orderLogs.length - 1
                        ? "4px solid #000"
                        : "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "#f6f3ec")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "#fff")
                  }
                >
                  <td
                    style={{
                      padding: "24px",
                      fontWeight: 700,
                      borderRight: "4px solid #000",
                    }}
                  >
                    {order.id}
                  </td>
                  <td
                    style={{
                      padding: "24px",
                      borderRight: "4px solid #000",
                      opacity: 0.8,
                    }}
                  >
                    {order.timestamp}
                  </td>
                  <td
                    style={{
                      padding: "24px",
                      borderRight: "4px solid #000",
                      textTransform: "uppercase",
                      fontWeight: 900,
                    }}
                  >
                    {order.entity}
                  </td>
                  <td
                    style={{
                      padding: "24px",
                      borderRight: "4px solid #000",
                      fontWeight: 900,
                    }}
                  >
                    {order.price}
                  </td>
                  <td style={{ padding: "24px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 12,
                      }}
                    >
                      <button
                        style={{
                          background: "#fcf9f2",
                          border: "2px solid #000",
                          fontWeight: 900,
                          padding: "8px 16px",
                          fontSize: 10,
                          textTransform: "uppercase",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          transition: "none",
                        }}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: 14 }}
                        >
                          description
                        </span>
                        View_Receipt
                      </button>
                      <button
                        style={{
                          background: "#ba1a1a",
                          border: "2px solid #000",
                          color: "#fff",
                          fontWeight: 900,
                          padding: "8px 16px",
                          fontSize: 10,
                          textTransform: "uppercase",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          transition: "none",
                        }}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: 14 }}
                        >
                          report
                        </span>
                        Report_Issue
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Load More */}
        <div
          style={{
            marginTop: 32,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            style={{
              background: "#000",
              color: "#fff",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              padding: "16px 48px",
              border: "4px solid #000",
              boxShadow: "6px 6px 0px 0px rgba(255,95,21,1)",
              cursor: "pointer",
              transition: "none",
              fontSize: 13,
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLElement).style.transform =
                "translate(2px, 2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "6px 6px 0px 0px rgba(255,95,21,1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "6px 6px 0px 0px rgba(255,95,21,1)";
            }}
          >
            Load_More_Logs_ (EOF_Reached)
          </button>
        </div>
      </section>

      {/* ══════════════ RESPONSIVE CSS ══════════════ */}
      <style>{`
        @media (max-width: 768px) {
          .page-title { font-size: 28px !important; }
          .freq-grid { grid-template-columns: 1fr !important; }
          table { font-size: 11px !important; }
          table td, table th { padding: 12px !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .freq-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
