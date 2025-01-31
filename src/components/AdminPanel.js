import React, { useState, useEffect } from "react";
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

  let interval;

  const handleSetTeams = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/scoreboard/set-teams", null, {
        params: { team1, team2 },
      });
      setScores(response.data.scores);
      setPlayers(response.data.players);
    } catch (error) {
      alert("Error setting teams: " + error.message); // Show user-friendly error
    }
  };

  const handleUpdateScore = async (team, delta) => {
    try {
      const response = await axios.post("http://localhost:8080/api/scoreboard/update-score", null, {
        params: { team, delta },
      });
      setScores(response.data);
    } catch (error) {
      alert("Error updating score: " + error.message); // Show user-friendly error
    }
  };

  const togglePlayerStatus = async (team, index) => {
    try {
      const response = await axios.post("http://localhost:8080/api/scoreboard/toggle-player", null, {
        params: { team, index },
      });
      setPlayers(response.data.players);  // Sync player state with backend
    } catch (error) {
      alert("Error toggling player status: " + error.message); // Show user-friendly error
    }
  };

  const handleTimeChange = (e) => {
    setTime(parseInt(e.target.value) * 60);
  };

  const setTimer = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/scoreboard/set-timer", null, {
        params: { minutes: time / 60 },
      });
      setTime(response.data.matchTime);
    } catch (error) {
      alert("Error setting timer: " + error.message); // Show user-friendly error
    }
  };

  const toggleTimer = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/scoreboard/toggle-timer");
      setTimerRunning(response.data.timerRunning);
    } catch (error) {
      alert("Error toggling timer: " + error.message); // Show user-friendly error
    }
  };

  useEffect(() => {
    if (timerRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timerRunning]);

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
        <input type="number" className="form-control mb-2"  onChange={handleTimeChange} />
        <h3 className={timerRunning ? "text-success" : "text-danger"}>{Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}</h3>
        <button className="btn btn-success" onClick={toggleTimer} disabled={timerRunning}>Start</button>
        <button className="btn btn-danger" onClick={toggleTimer} disabled={!timerRunning}>Stop</button>
        <button className="btn btn-info" onClick={setTimer}>Set Timer</button>
      </div>

      {[team1, team2].map((team) => (
        <div key={team} className="mb-4 p-3 border rounded shadow">
          <h3>{team}: <span className="badge bg-primary">{scores[team]}</span></h3>
          <button className="btn btn-success me-2" onClick={() => handleUpdateScore(team, 1)}>+1</button>
          <button className="btn btn-danger" onClick={() => handleUpdateScore(team, -1)}>-1</button>

          <div className="mt-3">
            <h5>Players</h5>
            <div className="d-flex gap-2">
              {players[team]?.map((active, index) => (
               <BsPersonFill
                 key={index}
                 size={30}
                 style={{
                   cursor: "pointer",
                   color: active ? "gray" : "red",
                   border: index === 0 && active ? "2px solid green" : "none", // Highlight first player
                 }}
                 onClick={() => togglePlayerStatus(team, index)}
               />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;
