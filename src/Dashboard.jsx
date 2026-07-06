import Loader from "./components/Loader";
import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/Dashboard.css";
import Navbar from "./components/Navbar";

function Dashboard({
  user,
  onCreate,
  onView,
  onHistory,
  onLogout
}) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMeetings: 0,
    totalHistory: 0,
    totalMessages: 0,
    averageDuration: "00:00:00"
  });

  useEffect(() => {
    fetchStats();
  }, []);
const [loading, setLoading] = useState(true);
  async function fetchStats() {

  try {

    setLoading(true);
   

   const token = localStorage.getItem("token");

const response = await axios.get(
  "http://localhost:5000/dashboardstats",
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

    setStats(response.data);

  } catch (error) {

    console.log(error);

  } finally {

    setLoading(false);

  }

}
if (loading) {
  return <Loader />;
}

  return (
    <>
      <Navbar user={user} />

      <div className="dashboard-container">

        <div className="dashboard-content">

          <h1 className="dashboard-title">
            IntellMeet Dashboard
          </h1>

          <h2 className="dashboard-subtitle">
            Welcome back, {user} 👋
          </h2>

          <div className="dashboard-grid">

            <DashboardCard
              title="Total Users"
              value={stats.totalUsers}
              icon="👤"
            />

            <DashboardCard
              title="Meetings"
              value={stats.totalMeetings}
              icon="📅"
            />

            <DashboardCard
              title="Meeting History"
              value={stats.totalHistory}
              icon="📖"
            />

            <DashboardCard
              title="Messages"
              value={stats.totalMessages}
              icon="💬"
            />

            <DashboardCard
              title="Average Duration"
              value={stats.averageDuration}
              icon="⏱"
            />

          </div>

          <div className="dashboard-buttons">

            <button
              className="dashboard-btn"
              onClick={onCreate}
            >
              ➕ Create Meeting
            </button>

            <button
              className="dashboard-btn"
              onClick={onView}
            >
              👥 View Meetings
            </button>

            <button
              className="dashboard-btn"
              onClick={onHistory}
            >
              📖 Meeting History
            </button>

            <button
              className="dashboard-btn logout-btn"
              onClick={onLogout}
            >
              🚪 Logout
            </button>

          </div>

        </div>

      </div>
    </>
  );
}

function DashboardCard({
  title,
  value,
  icon
}) {
  return (
    <div className="dashboard-card">

      <div className="dashboard-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <h2 className="dashboard-value">
        {value}
      </h2>

    </div>
  );
}

export default Dashboard;