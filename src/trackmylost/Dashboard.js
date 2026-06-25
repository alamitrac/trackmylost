import React from "react";

export default function App() {
  const data = [
    {
      title: "Sac à dos noir Nike — Ain Diab",
      location: "Casablanca",
      date: "28 Fév 2026",
      user: "Ahmed Benali",
      status: "Prioritaire",
    },
    {
      title: "Youssef, 8 ans — Disparu",
      location: "Rabat",
      date: "27 Fév 2026",
      user: "Fatima Ziani",
      status: "Urgent",
    },
    {
      title: "Samsung Galaxy S24 — Trouvé",
      location: "Casa Voyageurs",
      date: "26 Fév 2026",
      user: "Karim Moussaoui",
      status: "",
    },
  ];

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2>TrackMyLost</h2>

        <p style={styles.menuActive}>📊 Tableau de board</p>
        <p style={styles.menuActive}>📌 Signalements en attente</p>
        <p>✔ Postes validés</p>
        <p>⚙ Paramètres</p>

        <button style={styles.logout}>Déconnexion</button>
      </div>

      {/* Main */}
      <div style={styles.main}>
        {/* Topbar */}
        <div style={styles.topbar}>
          <h2>Admin Panel</h2>
          <div>Admin 👤</div>
        </div>

        {/* Stats */}
        <div style={styles.stats}>
          <StatCard title="En attente" value="12" />
          <StatCard title="Validés" value="248" />
          <StatCard title="Utilisateurs" value="5630" />
          <StatCard title="Résolus" value="842" />
        </div>

        {/* List */}
        <h3>Signalements en attente</h3>

        {data.map((item, i) => (
          <div key={i} style={styles.card}>
            <div style={styles.image}></div>

            <div style={{ flex: 1 }}>
              <h4>{item.title}</h4>
              <p style={styles.meta}>
                {item.location} • {item.date} • {item.user}
              </p>

              {item.status && (
                <span style={styles.badge}>{item.status}</span>
              )}

              <div style={styles.actions}>
                <button style={styles.approve}>Approuver</button>
                <button style={styles.reject}>Rejeter</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value }) {
  return (
    <div style={styles.statCard}>
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
  );
}

// Styles
const styles = {
  container: {
    display: "flex",
    fontFamily: "Arial",
    background: "#F5F6FA",
    height: "100vh",
  },

  sidebar: {
    width: "220px",
    background: "#fff",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  menuActive: {
    fontWeight: "bold",
    color: "#1E2A47",
  },

  logout: {
    marginTop: "auto",
    padding: "10px",
    background: "#1E2A47",
    color: "white",
    border: "none",
    borderRadius: "8px",
  },

  main: {
    flex: 1,
    padding: "20px",
  },

  topbar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },

  stats: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
  },

  statCard: {
    background: "white",
    padding: "15px",
    borderRadius: "12px",
    flex: 1,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },

  card: {
    display: "flex",
    gap: "15px",
    background: "white",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "15px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },

  image: {
    width: "60px",
    height: "60px",
    background: "#ddd",
    borderRadius: "8px",
  },

  meta: {
    color: "#6B7280",
    fontSize: "14px",
  },

  badge: {
    background: "#FF7A00",
    color: "white",
    padding: "4px 10px",
    borderRadius: "8px",
    fontSize: "12px",
    display: "inline-block",
    marginTop: "5px",
  },

  actions: {
    marginTop: "10px",
    display: "flex",
    gap: "10px",
  },

  approve: {
    background: "#1E2A47",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
  },

  reject: {
    background: "#eee",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
  },
};