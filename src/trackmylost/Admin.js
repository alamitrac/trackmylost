import { useState, useEffect, useRef } from "react";

const ORANGE = "#e8572a";
const ORANGE_LIGHT = "#fff4f0";
const GREEN = "#3a9e6e";
const GREEN_LIGHT = "#edf7f2";
const SIDEBAR_W = 200;

const reports = [
  {
    id: 1,
    title: "Sac à dos noir Nike — Ain Diab",
    location: "Casablanca",
    date: "28 Fév · 14h22",
    author: "Ahmed Banali",
    tag: null,
    imgBg: "#d4e8d0",
    scores: { authenticity: 88, content: 91, urgency: 42 },
    verdict: "approved",
    confidence: 90,
    reason: "Contenu authentique, description précise, pas de signaux suspects.",
  },
  {
    id: 2,
    title: "Youssef, 8 ans — Disparu",
    location: "Rabat",
    date: "27 Fév · 09h10",
    author: "Fatima Ziani",
    tag: "Urgent",
    imgBg: "#f5d5c8",
    scores: { authenticity: 72, content: 65, urgency: 98 },
    verdict: "review",
    confidence: 68,
    reason: "Cas de personne disparue — nécessite validation humaine obligatoire.",
  },
  {
    id: 3,
    title: "Samsung Galaxy S24 — Trouvé",
    location: "Casa-Voyageurs",
    date: "26 Fév · 16h45",
    author: "Karim Moussaoui",
    tag: null,
    imgBg: "#c8ddf5",
    scores: { authenticity: 94, content: 88, urgency: 30 },
    verdict: "approved",
    confidence: 93,
    reason: "Publication standard, métadonnées cohérentes, aucun doublon détecté.",
  },
  {
    id: 4,
    title: "Portefeuille brun — Medina Marrakech",
    location: "Marrakech",
    date: "25 Fév · 11h30",
    author: "Sara Benhadou",
    tag: null,
    imgBg: "#e8d8c4",
    scores: { authenticity: 31, content: 28, urgency: 20 },
    verdict: "rejected",
    confidence: 82,
    reason: "Doublon détecté (3 publications similaires). Compte signalé pour abus.",
  },
];

const sideLinks = [
  { label: "Tableau de bord", icon: "▦" },
  { label: "Signalements", icon: "●", active: true },
  { label: "Postes validés", icon: "✓" },
  { label: "Utilisateurs", icon: "👥" },
  { label: "Paramètres", icon: "⚙" },
];

function ScoreBar({ value }) {
  const color = value >= 70 ? GREEN : value >= 45 ? "#e8a020" : "#c0392b";
  return (
    <div style={{ flex: 1 }}>
      <div
        style={{
          height: 4,
          background: "#e8e8e8",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${value}%`,
            background: color,
            borderRadius: 2,
            transition: "width 1.2s ease",
          }}
        />
      </div>
      <div style={{ fontSize: 10, color, marginTop: 2, fontWeight: 500 }}>
        {value}%
      </div>
    </div>
  );
}

function VerdictBadge({ verdict, isProcessing }) {
  if (isProcessing) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            border: `1.5px solid #e0e0e0`,
            borderTopColor: ORANGE,
            animation: "spin 0.7s linear infinite",
          }}
        />
        <span style={{ fontSize: 11, color: "#888" }}>Analyse en cours…</span>
      </div>
    );
  }

  const config = {
    approved: { bg: GREEN_LIGHT, color: GREEN, text: "Approuvé automatiquement" },
    rejected: { bg: "#ffeaea", color: "#c0392b", text: "Rejeté automatiquement" },
    review: { bg: "#fff8e0", color: "#b07d00", text: "Envoyé en révision humaine" },
  };

  const c = config[verdict];
  return (
    <span
      style={{
        background: c.bg,
        color: c.color,
        borderRadius: 5,
        padding: "3px 10px",
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      {c.text}
    </span>
  );
}

function ReportCard({ report, state }) {
  const bars = state === "processing"
    ? [0, 0, 0]
    : [report.scores.authenticity, report.scores.content, report.scores.urgency];
  const labels = ["Authenticité", "Qualité contenu", "Urgence"];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 10,
        border: "1px solid #f0f0f0",
        padding: "14px 16px",
        opacity: state === "done" ? 0.55 : 1,
        transition: "opacity 0.4s",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 8,
            background: report.imgBg,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            color: "#999",
          }}
        >
          Photo
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: 13,
                color: "#1a1a2e",
              }}
            >
              {report.title}
            </span>
            {report.tag && (
              <span
                style={{
                  background: ORANGE_LIGHT,
                  color: ORANGE,
                  borderRadius: 4,
                  fontSize: 10,
                  padding: "1px 6px",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                ⚡ {report.tag}
              </span>
            )}
          </div>

          <div
            style={{
              fontSize: 11,
              color: "#888",
              marginBottom: 8,
            }}
          >
            📍 {report.location} · 🕐 {report.date} · 👤 {report.author}
          </div>

          <div
            style={{
              background: "#f7f8fa",
              borderRadius: 6,
              padding: "8px 10px",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "#aaa",
                marginBottom: 6,
                fontWeight: 600,
                letterSpacing: "0.5px",
              }}
            >
              ANALYSE IA
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {labels.map((lbl, i) => (
                <div key={lbl} style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: "#999", marginBottom: 3 }}>
                    {lbl}
                  </div>
                  <ScoreBar value={bars[i]} />
                </div>
              ))}
            </div>
            {state === "done" && (
              <div
                style={{
                  fontSize: 10,
                  color: "#999",
                  marginTop: 6,
                  lineHeight: 1.4,
                }}
              >
                {report.reason}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <VerdictBadge
              verdict={report.verdict}
              isProcessing={state === "processing"}
            />
            {state === "done" && (
              <span style={{ fontSize: 10, color: "#bbb", marginLeft: "auto" }}>
                Confiance: {report.confidence}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PulsingDot() {
  return (
    <span
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: GREEN,
        animation: "pulse 1.5s ease-in-out infinite",
        flexShrink: 0,
      }}
    />
  );
}

export default function AdminAutoModeration() {
  const [cardStates, setCardStates] = useState({});
  const [stats, setStats] = useState({ pending: reports.length, approved: 0, rejected: 0, review: 0 });
  const [log, setLog] = useState([]);
  const [badgeCount, setBadgeCount] = useState(reports.length);
  const cycleRef = useRef(null);

  const addLog = (text, type) => {
    const time = new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLog((prev) => [{ text, type, time }, ...prev].slice(0, 6));
  };

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  const runCycle = async () => {
    setCardStates({});
    setStats({ pending: reports.length, approved: 0, rejected: 0, review: 0 });
    setLog([]);
    setBadgeCount(reports.length);

    let approved = 0, rejected = 0, review = 0;

    for (let i = 0; i < reports.length; i++) {
      const r = reports[i];

      await sleep(800 + i * 300);
      setCardStates((s) => ({ ...s, [r.id]: "processing" }));
      addLog(`Analyse de: "${r.title.substring(0, 30)}…"`, "amber");

      await sleep(1800 + Math.random() * 600);
      setCardStates((s) => ({ ...s, [r.id]: "done" }));

      if (r.verdict === "approved") {
        approved++;
        addLog(`Approuvé: "${r.title.substring(0, 28)}…" (${r.confidence}%)`, "green");
      } else if (r.verdict === "rejected") {
        rejected++;
        addLog(`Rejeté: "${r.title.substring(0, 28)}…" (${r.confidence}%)`, "red");
      } else {
        review++;
        addLog(`Révision requise: "${r.title.substring(0, 25)}…"`, "amber");
      }

      const pending = reports.length - i - 1;
      setBadgeCount(pending);
      setStats({ pending, approved, rejected, review });
    }

    addLog("File traitée. Attente de nouveaux signalements…", "green");
    cycleRef.current = setTimeout(runCycle, 7000);
  };

  useEffect(() => {
    runCycle();
    return () => clearTimeout(cycleRef.current);
  }, []);

  const logDotColor = { green: GREEN, red: "#c0392b", amber: ORANGE };

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
      `}</style>

      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          background: "#f4f5f7",
          fontFamily: "'Segoe UI', Arial, sans-serif",
          fontSize: 13,
        }}
      >
        {/* SIDEBAR */}
        <aside
          style={{
            width: SIDEBAR_W,
            background: "#fff",
            borderRight: "1px solid #eee",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              padding: "16px 18px",
              borderBottom: "1px solid #f0f0f0",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontWeight: 800,
              fontSize: 14,
              color: "#1a1a2e",
            }}
          >
            <span style={{ color: ORANGE, fontSize: 16 }}>◉</span>
            TrackMyLost
          </div>

          <nav style={{ flex: 1, padding: "10px 0" }}>
            {sideLinks.map((link, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 18px",
                  background: link.active ? ORANGE_LIGHT : "transparent",
                  borderLeft: link.active ? `3px solid ${ORANGE}` : "3px solid transparent",
                  color: link.active ? ORANGE : "#555",
                  fontWeight: link.active ? 700 : 400,
                  cursor: "pointer",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, color: link.active ? ORANGE : "#aaa" }}>
                    {link.icon}
                  </span>
                  {link.label}
                </span>
                {link.active && (
                  <span
                    style={{
                      background: ORANGE,
                      color: "#fff",
                      borderRadius: 10,
                      fontSize: 10,
                      padding: "1px 6px",
                      fontWeight: 700,
                    }}
                  >
                    {badgeCount}
                  </span>
                )}
              </div>
            ))}
          </nav>

          <div
            style={{
              padding: "12px 16px",
              borderTop: "1px solid #f0f0f0",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "#aaa",
                marginBottom: 6,
                fontWeight: 600,
              }}
            >
          
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#bbb",
                lineHeight: 1.5,
              }}
            >
      
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* TOPBAR */}
          <header
            style={{
              background: "#fff",
              borderBottom: "1px solid #eee",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 24px",
              height: 50,
              flexShrink: 0,
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 14, color: "#1a1a2e" }}>
              Modération automatique
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "#f4f5f7",
                border: "1px solid #eee",
                borderRadius: 20,
                padding: "4px 12px",
                fontSize: 11,
                color: "#555",
              }}
            >
              <PulsingDot />
          
            </div>
          </header>

          {/* CONTENT */}
          <div style={{ padding: "20px 24px", flex: 1, overflowY: "auto" }}>
            {/* Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 12,
                marginBottom: 22,
              }}
            >
              {[
                { label: "En file", value: stats.pending, color: "#1a1a2e" },
                { label: "Approuvés auto", value: stats.approved, color: GREEN },
                { label: "Rejetés auto", value: stats.rejected, color: "#c0392b" },
                { label: "Révision humaine", value: stats.review, color: "#b07d00" },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: "#fff",
                    borderRadius: 10,
                    border: "1px solid #f0f0f0",
                    padding: "14px 16px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 22,
                      color: s.color,
                      lineHeight: 1,
                    }}
                  >
                    {s.value}
                  </div>
                  <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Section header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 15, color: "#1a1a2e" }}>
                File de modération
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  background: "#edf7f2",
                  color: GREEN,
                  borderRadius: 12,
                  padding: "3px 10px",
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                <PulsingDot />
                
              </div>
            </div>

            {/* Report cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {reports.map((r) => (
                <ReportCard
                  key={r.id}
                  report={r}
                  state={cardStates[r.id] || "waiting"}
                />
              ))}
            </div>

            {/* Activity log */}
            <div style={{ marginTop: 20 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#aaa",
                  marginBottom: 8,
                  letterSpacing: "0.3px",
                }}
              >
                JOURNAL D'ACTIVITÉ IA
              </div>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 10,
                  border: "1px solid #f0f0f0",
                  overflow: "hidden",
                }}
              >
                {log.length === 0 && (
                  <div
                    style={{
                      padding: "12px 16px",
                      fontSize: 12,
                      color: "#ccc",
                    }}
                  >
                    En attente…
                  </div>
                )}
                {log.map((entry, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 16px",
                      borderBottom: i < log.length - 1 ? "1px solid #f8f8f8" : "none",
                      fontSize: 11,
                      color: "#666",
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: logDotColor[entry.type] || "#aaa",
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ flex: 1 }}>{entry.text}</span>
                    <span style={{ color: "#ccc", fontSize: 10 }}>{entry.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
