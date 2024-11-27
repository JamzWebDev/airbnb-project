import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ListingsPage.css";
import { FaSearch, FaGlobe, FaUserCircle, FaBars } from "react-icons/fa";

function ListingsPage() {
  const { location } = useParams();
  const [listings, setListings] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split("T")[0];
  const [reservationDetails, setReservationDetails] = useState({
    checkIn: today,
    checkOut: today,
    guests: 1,
  });

  // Fetch listings for the selected location
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const locationParam = location === "all" ? "all" : location;
        const response = await fetch(
          `http://localhost:5000/api/listings/${locationParam}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setListings(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching listings:", error.message);
        setLoading(false);
      }
    };
    fetchListings();
  }, [location]);

  // Fetch all locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/locations");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setLocations(["All locations", ...data]);
      } catch (error) {
        console.error("Error fetching locations:", error.message);
      }
    };
    fetchLocations();
  }, []);

  // Handle location selection
  const handleLocationSelect = (selectedLocation) => {
    if (selectedLocation === "All locations") {
      navigate("/listings/all");
    } else {
      navigate(`/listings/${selectedLocation}`);
    }
    setShowLocationDropdown(false);
  };

  // Check for logged-in user
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setUsername("");
    navigate("/");
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen((prev) => !prev);
  };

  const toggleLocationDropdown = () => {
    setShowLocationDropdown((prev) => !prev);
  };

  return (
    <div className="listings-page">
      <header className="navbar">
        <div className="navbar-logo" onClick={() => navigate("/")}>
          <img
            src="https://logos-world.net/wp-content/uploads/2020/10/Airbnb-Logo-2014.png"
            alt="Airbnb Logo"
          />
        </div>
        <div className="navbar-center">
          <span>Places to stay</span>
          <span>Experiences</span>
          <span>Online Experiences</span>
        </div>
        <div className="navbar-end">
          <span className="navbar-host" onClick={() => navigate("/host-login")}>
            Become a Host
          </span>
          <FaGlobe className="icon globe-icon" />
          <div className="profile-section" onClick={toggleProfileDropdown}>
            <FaBars className="menu-icon" />
            <FaUserCircle className="user-icon" />
            {profileDropdownOpen && (
              <div className="profile-dropdown-menu">
                {isLoggedIn ? (
                  <>
                    <span onClick={() => navigate("/my-reservations")}>
                      View My Reservations
                    </span>
                    <span onClick={handleLogout}>Logout</span>
                  </>
                ) : (
                  <span onClick={() => navigate("/user-login")}>Login</span>
                )}
              </div>
            )}
          </div>
          {isLoggedIn && (
            <span className="welcome-text">Welcome, {username}</span>
          )}
        </div>
      </header>

      <section className="search-section">
        <div className="search-bar">
          <div className="search-field">
            <label>Location</label>
            <span onClick={toggleLocationDropdown} className="dropdown-link">
              Select Location
            </span>
            {showLocationDropdown && (
              <div className="location-dropdown-content">
                {locations.map((loc, index) => (
                  <span key={index} onClick={() => handleLocationSelect(loc)}>
                    {loc}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="search-field">
            <label>Check in</label>
            <input
              type="date"
              value={reservationDetails.checkIn}
              onChange={(e) =>
                setReservationDetails((prev) => ({
                  ...prev,
                  checkIn: e.target.value,
                }))
              }
            />
          </div>
          <div className="search-field">
            <label>Check out</label>
            <input
              type="date"
              value={reservationDetails.checkOut}
              onChange={(e) =>
                setReservationDetails((prev) => ({
                  ...prev,
                  checkOut: e.target.value,
                }))
              }
            />
          </div>
          <div className="search-field">
            <label>Guests</label>
            <input
              type="number"
              value={reservationDetails.guests}
              min="1"
              onChange={(e) =>
                setReservationDetails((prev) => ({
                  ...prev,
                  guests: e.target.value,
                }))
              }
            />
          </div>
          <button className="search-button">
            <FaSearch />
          </button>
        </div>
      </section>

      <section className="listings-container">
        <h2 className="listings-heading">
          {listings.length} stay/s in{" "}
          {location === "all" ? "All Locations" : location}
        </h2>
        {loading ? (
          <p>Loading listings...</p>
        ) : listings.length > 0 ? (
          listings.map((listing) => (
            <div
              key={listing._id}
              className="listing-card"
              onClick={() => navigate(`/listing/${listing._id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="listing-left">
                <img
                  src={`http://localhost:5000/${listing.mainImage}`}
                  alt={listing.title || "Listing"}
                  className="listing-image"
                />
              </div>
              <div className="listing-details">
                <h3>{listing.location}</h3>
                <h2>{listing.title}</h2>
                <div className="listing-info">
                  <span>{listing.guests} Guest/s</span>
                  <span>{listing.rooms} Room/s</span>
                  <span>{listing.baths} Bath/s</span>
                </div>
                <div className="listing-amenities">
                  <h3>Amenities:</h3>
                  <ul>
                    {listing.amenities.map((amenity, index) => (
                      <li key={index}>{amenity}</li>
                    ))}
                  </ul>
                </div>
                <div className="listing-footer">
                  <span>Rating: 5.0 ⭐</span>
                  <span className="listing-price">
                    ${listing.price} / night
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No listings found for this location.</p>
        )}
      </section>
    </div>
  );
}

export default ListingsPage;
