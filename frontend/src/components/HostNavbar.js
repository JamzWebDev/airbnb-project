import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars } from "react-icons/fa";
import "../pages/HomePage.css";

function HostNavbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const getusername = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/")}>
        <img
          src="https://logos-world.net/wp-content/uploads/2020/10/Airbnb-Logo-2014.png"
          alt="Airbnb Logo"
        />
      </div>
      <div className="navbar-end">
        <span className="welcome-text">Welcome, {getusername}</span>
        <div className="profile-section" onClick={toggleDropdown}>
          <FaBars className="menu-icon" />
          <FaUserCircle className="user-icon" />
          {dropdownOpen && (
            <div className="profile-dropdown-menu">
              <span onClick={handleLogout}>Logout</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default HostNavbar;
