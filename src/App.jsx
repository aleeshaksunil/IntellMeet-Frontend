import { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import CreateMeeting from "./CreateMeeting";
import ViewMeetings from "./ViewMeetings";
import Dashboard from "./Dashboard";
import MeetingRoom from "./MeetingRoom";
import MeetingHistory from "./MeetingHistory";
import "./styles/Common.css";
import "./App.css";
import SplashScreen from "./SplashScreen";

function App() {
  const [showLogin, setShowLogin] = useState(true);

  const [user, setUser] = useState("");

  const [page, setPage] = useState("login");

  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token && username) {
      setUser(username);
      setPage("dashboard");
    }
  }, []);
useEffect(() => {

  const token = localStorage.getItem("token");

  if (
    !token &&
    page !== "login"
  ) {
    setPage("login");
  }

}, [page]);

useEffect(() => {

  const timer = setTimeout(() => {
    setShowSplash(false);
  }, 2500);

  return () => clearTimeout(timer);

}, []);
  function handleLogin(username) {
    localStorage.setItem("username", username);

    setUser(username);
    setPage("dashboard");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    setUser("");
    setSelectedMeeting(null);
    setPage("login");
  }

  if (showSplash) {
  return <SplashScreen />;
}

  if (page === "dashboard") {
    return (
      <Dashboard
        user={user}
        onCreate={() => setPage("create")}
        onView={() => setPage("view")}
        onHistory={() => setPage("history")}
        onLogout={handleLogout}
      />
    );
  }

  if (page === "create") {
    return (
      <div>
        <button
          className="back-btn"
          onClick={() => setPage("dashboard")}
        >
          ← Back to Dashboard
        </button>

        <CreateMeeting user={user} />
      </div>
    );
  }

  if (page === "view") {
    return (
      <div>
        <button
          className="back-btn"
          onClick={() => setPage("dashboard")}
        >
          ← Back to Dashboard
        </button>

        <ViewMeetings
          user={user}
          onJoin={(meeting) => {
            setSelectedMeeting(meeting);
            setPage("meeting");
          }}
        />
      </div>
    );
  }

  if (page === "history") {
    return (
      <div>
        <button
          className="back-btn"
          onClick={() => setPage("dashboard")}
        >
          ← Back to Dashboard
        </button>

        <MeetingHistory user={user} />
      </div>
    );
  }

  if (page === "meeting") {
    return (
      <MeetingRoom
        user={user}
        meeting={selectedMeeting}
        onLeave={() => {
          setSelectedMeeting(null);
          setPage("dashboard");
        }}
      />
    );
  }

  return (
    <div className="auth-page">

      <div className="auth-switch">

        <button
          className={showLogin ? "switch-btn active" : "switch-btn"}
          onClick={() => setShowLogin(true)}
        >
          Login
        </button>

        <button
          className={!showLogin ? "switch-btn active" : "switch-btn"}
          onClick={() => setShowLogin(false)}
        >
          Register
        </button>

      </div>

      {showLogin ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Register onRegister={() => setShowLogin(true)} />
      )}

    </div>
  );
}

export default App;