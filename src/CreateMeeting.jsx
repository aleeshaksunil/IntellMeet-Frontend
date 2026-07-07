import axios from "axios";
import { useState } from "react";
import "./styles/CreateMeeting.css";
import Loader from "./components/Loader";
function CreateMeeting({ user }) {

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  

 async function handleMeeting() {

  if (!title || !date || !time || !description) {
    alert("Please fill all fields");
    return;
  }

  try {

    setLoading(true);

    const token = localStorage.getItem("token");

    const response = await axios.post(
      "https://intellmeet-backend-sdkg.onrender.com/meetings",
      {
        title,
        date,
        time,
        description,
        createdBy: user
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setMessage(response.data.message);

    alert(response.data.message);

    setTitle("");
    setDate("");
    setTime("");
    setDescription("");

  } catch (error) {

    console.log(error);

    alert("Error creating meeting");

  } finally {

    setLoading(false);

  }

}

   if (loading) {
  return <Loader />;
}
  return (

    <div className="create-container">

      <div className="create-card">

        <h1 className="create-title">
          📅 Create Meeting
        </h1>

        <label className="create-label">
          Meeting Title
        </label>

        <input
          className="create-input"
          type="text"
          placeholder="Enter meeting title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />

        <div className="date-time">

          <div>

            <label className="create-label">
              Date
            </label>

            <input
              className="create-input"
              type="date"
              value={date}
              onChange={(e)=>setDate(e.target.value)}
            />

          </div>

          <div>

            <label className="create-label">
              Time
            </label>

            <input
              className="create-input"
              type="time"
              value={time}
              onChange={(e)=>setTime(e.target.value)}
            />

          </div>

        </div>

        <label className="create-label">
          Description
        </label>

        <textarea
          className="create-textarea"
          placeholder="Enter meeting agenda..."
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
        />

        <button
          className="create-btn"
          onClick={handleMeeting}
        >
          🚀 Create Meeting
        </button>

        {message && (
          <p className="success-message">
            {message}
          </p>
        )}

      </div>

    </div>

  );

}

export default CreateMeeting;