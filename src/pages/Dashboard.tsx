import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/auth';
import './Dashboard.css';

interface DashboardStats {
  totalAdmissions: number;
  todayAdmissions: number;
  activePatients: number;
  discharged: number;
}

interface RecentAdmission {
  id: number;
  patientName: string;
  department: string;
  admissionDate: string;
  status: 'Active' | 'Discharged' | 'Pending';
  bedNo: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalAdmissions: 1247,
    todayAdmissions: 12,
    activePatients: 89,
    discharged: 1158,
  });

  const [recentAdmissions] = useState<RecentAdmission[]>([
    {
      id: 1,
      patientName: 'Rajesh Kumar',
      department: 'Cardiology',
      admissionDate: '2024-04-21',
      status: 'Active',
      bedNo: 'A-101',
    },
    {
      id: 2,
      patientName: 'Priya Singh',
      department: 'Orthopedics',
      admissionDate: '2024-04-20',
      status: 'Active',
      bedNo: 'B-205',
    },
    {
      id: 3,
      patientName: 'Amit Patel',
      department: 'Neurology',
      admissionDate: '2024-04-19',
      status: 'Active',
      bedNo: 'C-310',
    },
    {
      id: 4,
      patientName: 'Anjali Verma',
      department: 'Gynecology',
      admissionDate: '2024-04-18',
      status: 'Discharged',
      bedNo: 'D-415',
    },
    {
      id: 5,
      patientName: 'Vikram Desai',
      department: 'General Surgery',
      admissionDate: '2024-04-17',
      status: 'Active',
      bedNo: 'E-520',
    },
  ]);

  useEffect(() => {
    // Simulate real-time data update
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        todayAdmissions: Math.floor(Math.random() * 20),
        activePatients: Math.floor(Math.random() * 100) + 50,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Active':
        return '#28a745';
      case 'Discharged':
        return '#6c757d';
      case 'Pending':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Grapes HMS</h1>
          <p className="subtitle">IP Admission Dashboard</p>
        </div>
        <div className="user-section">
          <div className="user-info">
            <p className="user-name">{user?.Username || 'User'}</p>
            <p className="user-role">{user?.Role || 'Administrator'}</p>
          </div>
          <button className="btn-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="container">
          {/* Stats Section */}
          <section className="stats-section">
            <h2>Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon total">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Total Admissions</p>
                  <p className="stat-value">{stats.totalAdmissions}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon today">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M8 4H16C17.1 4 18 4.9 18 6V20C18 21.1 17.1 22 16 22H8C6.9 22 6 21.1 6 20V6C6 4.9 6.9 4 8 4Z" />
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Today's Admissions</p>
                  <p className="stat-value">{stats.todayAdmissions}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon active">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Active Patients</p>
                  <p className="stat-value">{stats.activePatients}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon discharged">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Discharged</p>
                  <p className="stat-value">{stats.discharged}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Admissions Section */}
          <section className="recent-admissions-section">
            <div className="section-header">
              <h2>Recent Admissions</h2>
              <button className="btn-view-all">View All</button>
            </div>

            <div className="table-wrapper">
              <table className="admissions-table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Department</th>
                    <th>Bed No.</th>
                    <th>Admission Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAdmissions.map((admission) => (
                    <tr key={admission.id}>
                      <td>
                        <strong>{admission.patientName}</strong>
                      </td>
                      <td>{admission.department}</td>
                      <td>{admission.bedNo}</td>
                      <td>{admission.admissionDate}</td>
                      <td>
                        <span
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(admission.status) }}
                        >
                          {admission.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Quick Actions Section */}
          <section className="quick-actions-section">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <button className="action-card">
                <div className="action-icon">📋</div>
                <p>New Admission</p>
              </button>
              <button className="action-card">
                <div className="action-icon">👤</div>
                <p>Patient Search</p>
              </button>
              <button className="action-card">
                <div className="action-icon">📊</div>
                <p>Reports</p>
              </button>
              <button className="action-card">
                <div className="action-icon">⚙️</div>
                <p>Settings</p>
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>&copy; 2024 Grapes Innovative Solutions. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
