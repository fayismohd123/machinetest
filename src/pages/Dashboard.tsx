import React, { useState } from "react";
import "./Dashboard.css";
import { useAuth } from "../services/auth";

const Dashboard = () => {
  const { user, hospital } = useAuth();
  const [open, setOpen] = useState(true);

  return (
    <div className="dash">

      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">
        <div className="logo-box">
          <img src="/grapeslogo.png" alt="logo" />
        </div>

        <div className="menu-toggle" onClick={() => setOpen(!open)}>
          <p className="menu-title">Dashboard</p>
          <span className={`arrow ${open ? "open" : ""}`}>⌄</span>
        </div>

        {open && (
          <>
            <p className="section-label">LIVE METRICS</p>

            <div className="metric-card">
              <span>Today's Appointments</span>
              <h2>42</h2>
              <small className="positive">+5</small>
            </div>

            <div className="metric-card">
              <span>Pending Appointments</span>
              <h2>28</h2>
              <small className="negative">+3</small>
            </div>

            <div className="metric-card">
              <span>Available Beds</span>
              <h2>156</h2>
              <small className="positive">+12</small>
            </div>

            <div className="metric-card">
              <span>Insurance Pending</span>
              <h2>34</h2>
              <small className="positive">+8</small>
            </div>
          </>
        )}
      </aside>

      {/* ===== MAIN ===== */}
      <main className="main">

        {/* HEADER */}
        <div className="header">
          <div>
            <h1>Admission Discharge Desk</h1>
            <p>{hospital?.hospital_name || "Hospital"} • Real-time insights</p>
          </div>

          <div className="header-right">
            <div className="icon-btn">🔔</div>
            <div className="icon-btn">⚙️</div>

            <div className="profile">
              <div className="avatar">
                {user?.Username?.charAt(0) || "U"}
              </div>
              <div>
                <p>{user?.Username || "User"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="search-bar">
          <input placeholder="Ask AI anything..." />
          <button>✦ AI</button>
        </div>

        {/* ===== TRENDS PANEL ===== */}
        <div className="trends">

          {/* HEADER */}
          <div className="trends-header">
            <div className="trends-left">
              <div className="trend-icon">📈</div>
              <div>
                <h2>Trends</h2>
                <span>AI-powered analytics & insights</span>
              </div>
            </div>

            <div className="trends-right">
              <div className="trend-input"></div>
              <div className="ai-badge">✨ AI</div>
            </div>
          </div>

          {/* CARDS */}
          <div className="trends-cards">

            <div className="trend-card">
              <div className="icon">👥</div>
              <p>Expected Patient Count</p>
              <h1>284</h1>
              <span className="sub">Today</span>
              <span className="positive">+12%</span>
            </div>

            <div className="trend-card">
              <div className="icon">⏱</div>
              <p>Peak Time</p>
              <h1>2:30 PM</h1>
              <span className="sub">Highest traffic</span>
              <span className="link">Next: 6:45 PM</span>
            </div>

            <div className="trend-card">
              <div className="icon">💓</div>
              <p>Patient Admissions</p>
              <h1>156</h1>
              <span className="sub">This Week</span>
              <span className="positive">+8%</span>
            </div>

            <div className="trend-card">
              <div className="icon">🛏</div>
              <p>Total Beds</p>
              <h1>450</h1>
              <span className="sub">156 available</span>
              <span className="info">65% occupied</span>
            </div>

          </div>

          {/* FOOTER */}
          <div className="trends-footer">
            <span>Weekly Overview</span>
            <span>⌄</span>
          </div>

        </div>

        {/* ===== BOTTOM ===== */}
        <div className="bottom">

          <div className="bed-box">
            <h2>Bed Occupancy</h2>
            <span className="sub">Real-time bed status</span>

            <div className="bed-grid">
              {Array.from({ length: 24 }).map((_, i) => {
                const status = i % 3 === 0 ? "AVL" : i % 3 === 1 ? "OCC" : "MNT";

                return (
                  <div className="bed" key={i}>
                    <span>B-{i + 101}</span>
                    <div className={`status ${status.toLowerCase()}`}>
                      {status}
                    </div>
                    <small>
                      {status === "OCC"
                        ? "John"
                        : status === "AVL"
                        ? "Free"
                        : "Maintenance"}
                    </small>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="queue">
            <h2>Patient Queue</h2>
            <span className="sub">6 patients waiting</span>

            {[
  { name: "Robert Martinez", priority: "high", time: "15 min" },
  { name: "Emily Chen", priority: "medium", time: "28 min" },
  { name: "David Wilson", priority: "high", time: "8 min" },
  { name: "Aisha Khan", priority: "medium", time: "22 min" },

].map((p, i) => (
              <div className="patient-card" key={i}>

  {/* TOP */}
  <div className="patient-top">
    <div className="patient-name">
      {p.name}
      <span className={`tag ${p.priority}`}>{p.priority}</span>
    </div>

    <div className="patient-time">⏱ {p.time}</div>
  </div>

  {/* META */}
  <div className="patient-meta">
    <span>P-{1024 + i}</span>
    <span>•</span>
    <span>Age {40 + i}</span>
  </div>

  {/* DIVIDER */}
  <div className="divider"></div>

  {/* BOTTOM */}
  <div className="patient-bottom">
    <span>Emergency</span>
    <span>Chest pain</span>
  </div>

</div>
            ))}
          </div>

        </div>

      </main>
    </div>
  );
};

export default Dashboard;