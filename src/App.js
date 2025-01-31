import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from "./components/AdminPanel";
import UserPanel from "./components/UserPanel";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route for Admin Panel */}
        <Route path="/admin" element={<AdminPanel />} />

        {/* Route for User Panel */}
        <Route path="/user" element={<UserPanel />} />

        {/* Default Route (optional) */}
        <Route path="/" element={<UserPanel />} />
      </Routes>
    </Router>
  );
};

export default App;

