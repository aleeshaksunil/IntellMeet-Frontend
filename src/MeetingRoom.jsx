import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import AISummary, { generateSummary } from "./AISummary";
import ActionItems, { generateActions } from "./ActionItems";
import "./styles/MeetingRoom.css";
const socket = io("http://localhost:5000", {
  auth: {
    token: localStorage.getItem("token")
  }
});

function MeetingRoom({
  user,
  meeting,
  onLeave
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);

  const [isMuted, setIsMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);

  // Meeting Timer
  const [seconds, setSeconds] = useState(0);

  const joinedRef = useRef(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (!joinedRef.current) {
      socket.emit("join_room", {
  username: user,
  meetingId: meeting._id
});
    }

    socket.on("receive_message", (data) => {
      setMessages((old) => [...old, data]);
    });

    socket.on("update_participants", (users) => {
      setParticipants(users);
    });

    socket.on("system_message", (data) => {
      setMessages((old) => [
        ...old,
        {
          user: "System",
          text: data.text
        }
      ]);
    });

    startCamera();

    return () => {
      socket.off("receive_message");
      socket.off("update_participants");
      socket.off("system_message");

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach(track => track.stop());
      }
    };
  }, []);

  // Meeting Duration Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function formatTime() {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return (
      String(hrs).padStart(2, "0") +
      ":" +
      String(mins).padStart(2, "0") +
      ":" +
      String(secs).padStart(2, "0")
    );
  }

  async function startCamera() {

  try {

    console.log("startCamera called");

    // Stop previous stream if any
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: "user"
      },
      audio: true
    });

    console.log("Camera Stream:", stream);
    console.log("Video Track:", stream.getVideoTracks());

    streamRef.current = stream;

    if (videoRef.current) {

      videoRef.current.srcObject = stream;

      videoRef.current.onloadedmetadata = async () => {
        try {
          await videoRef.current.play();
          console.log("Camera started successfully");
        } catch (err) {
          console.log("Play Error:", err);
        }
      };

    }

    setCameraOn(true);

  } catch (err) {

  console.log("Camera Error:", err);
  console.log("Error Name:", err.name);
  console.log("Error Message:", err.message);

  alert(err.name + "\n" + err.message);

}
}

  function handleSend() {
    if (message === "") return;

    socket.emit("send_message", {
      user,
      text: message
    });

    setMessage("");
  }

  function toggleMute() {
    if (streamRef.current) {
      streamRef.current
        .getAudioTracks()
        .forEach(track => {
          track.enabled = isMuted;
        });
    }

    setIsMuted(!isMuted);
  }

  function toggleCamera() {
    if (streamRef.current) {
      streamRef.current
        .getVideoTracks()
        .forEach(track => {
          track.enabled = !cameraOn;
        });
    }

    setCameraOn(!cameraOn);
  }

  async function toggleScreenShare() {

    if (!screenSharing) {

      try {

        const screenStream =
          await navigator.mediaDevices.getDisplayMedia({
            video: true
          });

        streamRef.current = screenStream;

        if (videoRef.current) {
          videoRef.current.srcObject = screenStream;
        }

        setScreenSharing(true);

        screenStream.getVideoTracks()[0].onended =
          async () => {
            setScreenSharing(false);
            await startCamera();
          };

      } catch (err) {
        console.log(err);
      }

    } else {

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach(track => track.stop());
      }

      setScreenSharing(false);

      await startCamera();
    }
  }

  async function handleLeave() {

  try {

    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/meetinghistory",
      {
        title: meeting.title,
        participants,
        messages,
        summary: generateSummary(messages),
        actionItems: generateActions(messages),
        date: meeting.date,
        time: meeting.time,
        duration: formatTime()
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

   socket.emit("leave_room", {
  username: user,
  meetingId: meeting._id
});

    if (streamRef.current) {

      streamRef.current
        .getTracks()
        .forEach(track => track.stop());

    }

    onLeave();

  } catch (err) {
  console.log(err);
  console.log(err.response);

  alert(
    err.response?.data?.message ||
    err.message
  );
}

}

      
  return (
  <div className="meeting-container">

    <h1 className="meeting-title">
      🎥 IntellMeet Meeting Room
    </h1>

    <div className="meeting-header">

      <div className="meeting-details">

        <h2>{meeting?.title}</h2>

        <p>
          📅 {meeting?.date}
        </p>

        <p>
          🕒 {meeting?.time}
        </p>

        <p>
          ⏱ Duration : {formatTime()}
        </p>

      </div>

    </div>

    <div className="meeting-main">

      <div className="video-section">

        <h3>Your Camera</h3>

        <video
  ref={videoRef}
  autoPlay
  playsInline
  muted
  controls={false}
  className="meeting-video"
  style={{
    width: "100%",
    height: "400px",
    objectFit: "cover",
    background: "#000",
    borderRadius: "12px"
  }}
/>

        <div className="controls">

          <button
            className="control-btn"
            onClick={toggleMute}
          >
            {isMuted ? "🔇 Unmute" : "🎤 Mute"}
          </button>

          <button
            className="control-btn"
            onClick={toggleCamera}
          >
            {cameraOn ? "📷 Camera Off" : "📷 Camera On"}
          </button>

          <button
            className="control-btn"
            onClick={toggleScreenShare}
          >
            {screenSharing
              ? "🛑 Stop Sharing"
              : "🖥 Share Screen"}
          </button>

        </div>

      </div>

      <div className="participants-section">

        <h3>Participants</h3>

        {participants.length === 0 ? (

          <p>No participants</p>

        ) : (

          participants.map((person, index) => (

            <div
              key={index}
              className="participant-card"
            >
              👤 {person}
            </div>

          ))

        )}

      </div>

    </div>

    <div className="chat-section">

      <h3>💬 Team Chat</h3>

      <div className="chat-box">

        {messages.map((msg, index) => (

          <div
            key={index}
            className={
              msg.user === user
                ? "my-message"
                : "other-message"
            }
          >

            <strong>{msg.user}</strong>

            <p>{msg.text}</p>

          </div>

        ))}

      </div>

      <div className="chat-input">

        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={handleSend}
        >
          Send
        </button>

      </div>

    </div>

    <AISummary messages={messages} />

    <ActionItems messages={messages} />

    <div
      style={{
        textAlign: "center",
        marginTop: "30px"
      }}
    >

      <button
        className="leave-btn"
        onClick={handleLeave}
      >
        🚪 Leave Meeting
      </button>

    </div>

  </div>
);
}

export default MeetingRoom;