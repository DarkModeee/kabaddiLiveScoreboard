import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsPersonFill } from "react-icons/bs";

const AdminPanel = () => {
  const [team1, setTeam1] = useState("Team A");
  const [team2, setTeam2] = useState("Team B");
  const [scores, setScores] = useState({ [team1]: 0, [team2]: 0 });
  const [players, setPlayers] = useState({ [team1]: Array(7).fill(false), [team2]: Array(7).fill(false) });
  const [time, setTime] = useState(1200);
  const [timerRunning, setTimerRunning] = useState(false);

  const intervalRef = useRef(null); // useRef to store the interval

  const handleSetTeams = async () => {
    try {
      const response = await axios.post("https://kabaddilivescoreboardbackend.onrender.com/api/scoreboard/set-teams", null, {
        params: { team1, team2 },
      });
      setScores(response.data.scores);
      setPlayers(response.data.players);
    } catch (error) {
      alert("Error setting teams: " + error.message);
    }
  };

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [timerRunning]);

  // Keep-alive mechanism to prevent backend from sleeping
  useEffect(() => {
    const keepAliveInterval = setInterval(() => {
      fetch("https://kabaddilivescoreboardbackend.onrender.com/keep-alive")
        .catch((err) => console.error("Keep-alive failed", err));
    }, 300000); // Every 5 minutes

    return () => clearInterval(keepAliveInterval);
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-center">Admin Panel</h1>

      <div className="mb-4 p-3 border rounded shadow">
        <h2>Set Teams</h2>
        <input className="form-control mb-2" value={team1} onChange={(e) => setTeam1(e.target.value)} placeholder="Team 1" />
        <input className="form-control mb-2" value={team2} onChange={(e) => setTeam2(e.target.value)} placeholder="Team 2" />
        <button className="btn btn-primary" onClick={handleSetTeams}>Set Teams</button>
      </div>

      <div className="mb-4 p-3 border rounded shadow text-center">
        <h2>Match Timer</h2>
        <h3 className={timerRunning ? "text-success" : "text-danger"}>
          {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}
        </h3>
      </div>
    </div>
  );
};

export default AdminPanel;
