import Loader from "./components/Loader";
import axios from "axios";
import { useEffect, useState } from "react";
import "./styles/MeetingHistory.css";
import Navbar from "./components/Navbar";
import { jsPDF } from "jspdf";


function MeetingHistory({ user }) {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {

  try {

    setLoading(true);
    
    
const token = localStorage.getItem("token");

const response = await axios.get(
  "https://intellmeet-backend-sdkg.onrender.com/meetinghistory",
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
    setHistory(response.data);

  } catch (error) {

    console.log(error);

  } finally {

    setLoading(false);

  }

}
async function deleteHistory(id) {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this meeting history?"
  );

  if (!confirmDelete) {
    return;
  }

  try {

   const token = localStorage.getItem("token");

await axios.delete(
  "https://intellmeet-backend-sdkg.onrender.com/meetinghistory/${id}",
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
    fetchHistory();

  } catch (error) {

    console.log(error);

    alert("Unable to delete history.");

  }

}
  function downloadPDF(meeting) {

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("IntellMeet Meeting Report", 20, 20);

    doc.setFontSize(12);

    doc.text(`Title: ${meeting.title}`, 20, 40);
    doc.text(`Date: ${meeting.date}`, 20, 50);
    doc.text(`Time: ${meeting.time}`, 20, 60);
    doc.text(`Duration: ${meeting.duration || "00:00:00"}`, 20, 70);

    doc.text(
      `Participants: ${meeting.participants.join(", ")}`,
      20,
      80
    );

    doc.text("Summary:", 20, 100);

    const summaryLines = doc.splitTextToSize(
      meeting.summary || "No Summary",
      170
    );

    doc.text(summaryLines, 20, 110);

    let y = 110 + summaryLines.length * 8 + 10;

    doc.text("Action Items:", 20, y);

    y += 10;

    if (meeting.actionItems.length > 0) {

      meeting.actionItems.forEach((item) => {
        doc.text("• " + item, 25, y);
        y += 10;
      });

    } else {

      doc.text("No Action Items", 25, y);

    }

    doc.save(`${meeting.title}.pdf`);
  }

  const filteredHistory = history.filter((meeting) => {

    const keyword = search.toLowerCase();

    return (

      meeting.title.toLowerCase().includes(keyword) ||

      meeting.date.toLowerCase().includes(keyword) ||

      meeting.time.toLowerCase().includes(keyword) ||

      meeting.summary.toLowerCase().includes(keyword) ||

      meeting.participants.join(" ").toLowerCase().includes(keyword) ||

      meeting.actionItems.join(" ").toLowerCase().includes(keyword)

    );

  });
  if (loading) {
  return <Loader />;
}

  return (
    <>
      <Navbar user={user} />

      <div className="meeting-history-container">

        <h1 className="meeting-history-title">
          📖 Meeting History
        </h1>

        <input
          className="meeting-search"
          type="text"
          placeholder="Search by title, participant, summary..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {filteredHistory.length === 0 ? (

          <p className="no-history">
            📂 No Meeting History Found
          </p>

        ) : (

          filteredHistory.map((meeting) => (

            <div
              key={meeting._id}
              className="meeting-card"
            >

              <h2>{meeting.title}</h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(220px,1fr))",
                  gap: "15px",
                  marginBottom: "25px"
                }}
              >

                <p>
                  <strong>📅 Date</strong>
                  <br />
                  {meeting.date}
                </p>

                <p>
                  <strong>🕒 Time</strong>
                  <br />
                  {meeting.time}
                </p>

                <p>
                  <strong>⏱ Duration</strong>
                  <br />
                  {meeting.duration || "00:00:00"}
                </p>

                <p>
                  <strong>👥 Participants</strong>
                  <br />
                  {meeting.participants.join(", ")}
                </p>

              </div>

              <h3>📝 Meeting Summary</h3>

              <div className="summary-box">
                {meeting.summary || "No Summary"}
              </div>

              <h3>✅ Action Items</h3>

              {meeting.actionItems.length > 0 ? (

                <ul>
                  {meeting.actionItems.map((item, index) => (
                    <li key={index}>
                      {item}
                    </li>
                  ))}
                </ul>

              ) : (

                <p>No Action Items</p>

              )}

              <div className="meeting-buttons">

                <button
                  className="delete-btn"
                  onClick={() => deleteHistory(meeting._id)}
                >
                  🗑 Delete
                </button>

                <button
                  className="pdf-btn"
                  onClick={() => downloadPDF(meeting)}
                >
                  📄 Download PDF
                </button>

              </div>

            </div>

          ))

        )}

      </div>
    </>
  );
}

export default MeetingHistory;