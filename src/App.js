import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AdminPanel from "./components/AdminPanel";
import UserPanel from "./components/UserPanel";

const App = () => {
  return (
    <Router>
      <div>
        {/* Navigation Links */}
        <nav>
          <ul>
            <li>
              <Link to="/user">User Panel</Link>
            </li>
            <li>
              <Link to="/admin">Admin Panel</Link>
            </li>
          </ul>
        </nav>

        {/* Define Routes */}
        <Routes>
          {/* Route for Admin Panel */}
          <Route path="/admin" element={<AdminPanel />} />

          {/* Route for User Panel */}
          <Route path="/user" element={<UserPanel />} />

          {/* Default Route */}
          <Route path="/" />
        </Routes>
      </div>
    </Router>
  );
};

export default App;


