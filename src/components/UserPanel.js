import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsPersonFill } from "react-icons/bs";
import "./UserPanel.css"; // Updated CSS file

const UserPanel = () => {
  const [scores, setScores] = useState({});
  const [teams, setTeams] = useState({});
  const [players, setPlayers] = useState({});
  const [time, setTime] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/scoreboard-websocket");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("Connected to WebSocket");

        stompClient.subscribe("/topic/scoreboard", (message) => {
          const updatedData = JSON.parse(message.body);
          console.log("Received WebSocket Update:", updatedData);

          setScores(updatedData.scores || {});
          setTeams(updatedData.teams || {});
          setPlayers(updatedData.players || {});
          setTime(updatedData.matchTime ?? 0); // Default time to 0 (shows "00:00")
          setTimerRunning(updatedData.timerRunning || false);
        });
      },
      onStompError: (frame) => console.error("Stomp error:", frame),
    });

    stompClient.activate();

    return () => {
      if (stompClient && stompClient.active) {
        stompClient.deactivate().then(() =>
          console.log("WebSocket Disconnected")
        );
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="container mt-4">
      {/* Scoreboard Section */}
      <div className="scoreboard-container">
        {/* Left Team */}
        <div className="team-box">
          <span>{teams.team1 || "Team 1"}</span>
          <span className="badge">{scores[teams.team1] || 0}</span>
        </div>

        {/* Timer - Defaults to "00:00" */}
        <div className={`timer ${timerRunning ? "text-success" : "text-danger"}`}>
          {formatTime(time ?? 0)}
        </div>

        {/* Right Team */}
        <div className="team-box">
          <span>{teams.team2 || "Team 2"}</span>
          <span className="badge">{scores[teams.team2] || 0}</span>
        </div>
      </div>

      {/* Player Icons Section */}
      <div className="players-section">
        {/* Left Team Players */}
        <div className="players-container-1">
          {players[teams.team1]?.map((active, index) => (
            <BsPersonFill
              key={index}
              size={28}
              className={`player-icon ${active ? "active" : "inactive"}`}
            />
          ))}
        </div>

        {/* Right Team Players */}
        <div className="players-container-2">
          {players[teams.team2]?.map((active, index) => (
            <BsPersonFill
              key={index}
              size={28}
              className={`player-icon ${active ? "active" : "inactive"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserPanel;
