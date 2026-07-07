import Loader from "./components/Loader";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import "./styles/ViewMeetings.css";

function ViewMeetings({ user, onJoin }) {

  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    fetchMeetings();
  }, []);
const [loading, setLoading] = useState(true);
  async function fetchMeetings() {

  try {

    setLoading(true);
    
const token = localStorage.getItem("token");

const response = await axios.get(
  "https://intellmeet-backend-sdkg.onrender.com/meetings",
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
    setMeetings(response.data);

  }

  catch (error) {

    console.log(error);

  }

  finally {

    setLoading(false);

  }

}

 async function deleteMeeting(id) {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this meeting?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
const token = localStorage.getItem("token");

await axios.delete(
  "https://intellmeet-backend-sdkg.onrender.com/meetings/${id}",
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

    fetchMeetings();

  } catch (error) {

    console.log(error);

    alert("Unable to delete meeting.");

  }

}
if (loading) {
  return <Loader />;
}
  return (
    <>
      <Navbar user={user} />

      <div className="view-container">

        <h1 className="view-title">
          👥 Available Meetings
        </h1>

        {meetings.length === 0 ? (

          <p className="no-meeting">
            No Meetings Available
          </p>

        ) : (

          meetings.map((meeting) => (

            <div
              key={meeting._id}
              className="meeting-view-card"
            >

              <h2>{meeting.title}</h2>

              <div className="meeting-info">

                <p>
                  👤 <strong>Created By:</strong> {meeting.createdBy}
                </p>

                <p>
                  📅 <strong>Date:</strong> {meeting.date}
                </p>

                <p>
                  🕒 <strong>Time:</strong> {meeting.time}
                </p>

              </div>

              <div className="meeting-description">

                <h3>Description</h3>

                <p>
                  {meeting.description}
                </p>

              </div>

              <div className="meeting-actions">

                <button
  className="join-btn"
  onClick={() => {

    if (meeting.status === "ended") {
      alert("This meeting has already ended.");
      return;
    }

    onJoin(meeting);

  }}
>
  {meeting.status === "ended"
    ? "🔴 Meeting Ended"
    : meeting.status === "active"
    ? "🟢 Join Meeting"
    : "🕒 Scheduled"}
</button>

                {
                  meeting.createdBy === user && (

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteMeeting(meeting._id)
                      }
                    >
                      🗑 Delete
                    </button>

                  )
                }

              </div>

            </div>

          ))

        )}

      </div>

    </>
  );

}

export default ViewMeetings;