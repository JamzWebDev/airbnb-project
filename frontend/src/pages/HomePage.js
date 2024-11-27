import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import { FaSearch, FaGlobe, FaUserCircle, FaBars } from "react-icons/fa";

function HomePage() {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [reservationDetails, setReservationDetails] = useState({
    checkIn: today,
    checkOut: today,
    guests: 1,
  });

  // Toggle location dropdown
  const toggleLocationDropdown = () => {
    setShowLocationDropdown((prev) => !prev);
  };

  // Fetch unique locations from the server
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("https://airbnb-project-backend.onrender.com/api/locations");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setLocations(["All locations", ...data]);
        } else {
          console.error("Invalid data format:", data);
        }
      } catch (error) {
        console.error("Error fetching locations:", error.message);
      }
    };
    fetchLocations();
  }, []);

  // Handle location selection
  const handleLocationSelect = (location) => {
    if (location === "All locations") {
      navigate("/listings/all");
    } else {
      navigate(`/listings/${location}`);
    }
    setShowLocationDropdown(false);
  };

  // Check user session
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

  return (
    <div className="homepage">
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
                {locations.length > 0 ? (
                  locations.map((location, index) => (
                    <span
                      key={index}
                      className="location-option"
                      onClick={() => handleLocationSelect(location)}
                    >
                      {location}
                    </span>
                  ))
                ) : (
                  <span>Loading...</span>
                )}
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

      <section className="banner">
        <img
          src="https://cdn.pixabay.com/photo/2016/04/15/11/48/hotel-1330850_1280.jpg"
          alt="Banner"
        />
        <div className="banner-text">
          <h1>Not sure where to go? Perfect.</h1>
          <button>I'm flexible</button>
        </div>
      </section>

      <section className="trip-inspiration">
        <h2>Inspiration for your next trip</h2>
        <div className="trip-cards">
          <div className="trip-card">
            <img
              src="https://sandton-hotel.com/wp-content/uploads/2018/10/siFNPZf0-scaled.jpeg"
              alt="Sandton City Hotel"
            />
            <div className="trip-card-info">
              <h3>Sandton City Hotel</h3>
              <p>53 km away</p>
            </div>
          </div>
          <div className="trip-card">
            <img
              src="https://citylodgeroadkemptonpark.za-hotels.com/data/Photos/OriginalPhoto/12835/1283556/1283556037/photo-city-lodge-jhb-apt-barbara-rd-kempton-park-2.JPEG"
              alt="Joburg City Hotel"
            />
            <div className="trip-card-info">
              <h3>Joburg City Hotel</h3>
              <p>168 km away</p>
            </div>
          </div>
          <div className="trip-card">
            <img
              src="https://digital.ihg.com/is/image/ihg/holiday-inn-express-sandton-6530606142-4x3"
              alt="Woodmead Hotel"
            />
            <div className="trip-card-info">
              <h3>Woodmead Hotel</h3>
              <p>30 miles away</p>
            </div>
          </div>
          <div className="trip-card">
            <img
              src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/133207149.jpg?k=b86b10bcc11b387f181ec18a3ae1024544f52f436fc983b163c69295a467355f&o=&hp=1"
              alt="Hyde Park Hotel"
            />
            <div className="trip-card-info">
              <h3>Hyde Park Hotel</h3>
              <p>34 km away</p>
            </div>
          </div>
          <div className="trip-card">
            <img
              src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/41/9d/6a/welcome-to-road-lodge.jpg?w=1200&h=-1&s=1"
              alt="Hyde Park Hotel"
            />
            <div className="trip-card-info">
              <h3>Randburg Hotel</h3>
              <p>20 km away</p>
            </div>
          </div>
        </div>
      </section>

      <section className="experiences">
        <h2>Discover Airbnb Experiences</h2>
        <div className="experience-cards">
          <div className="experience-card">
            <img
              src="https://cdn.pixabay.com/photo/2024/10/06/19/35/swimming-pool-9101047_640.jpg"
              alt="Things to do on your trip"
            />
            <div className="experience-info">
              <h3>Things to do on your trip</h3>
              <button>Experiences</button>
            </div>
          </div>
          <div className="experience-card">
            <img
              src="https://cdn.pixabay.com/photo/2017/08/08/08/57/cake-2610754_1280.jpg"
              alt="Things to do from home"
            />
            <div className="experience-info">
              <h3>Things to do from home</h3>
              <button>Online Experiences</button>
            </div>
          </div>
        </div>
      </section>

      <section className="gift-cards">
        <div className="gift-card-info">
          <h2>Shop Airbnb gift cards</h2>
          <button>Learn more</button>
        </div>
        <div className="gift-card-image">
          <img
            src="https://hosttools.com/wp-content/uploads/Screen-Shot-2023-05-17-at-1.27.20-PM.png"
            alt="Gift cards"
          />
        </div>
      </section>

      <section className="hosting-questions">
        <div className="hosting-background">
          <h2>Questions about hosting?</h2>
          <button>Ask a Superhost</button>
        </div>
      </section>

      <section className="destinations-section">
        <h2>Inspiration for future getaways</h2>
        <div className="tabs">
          <button className="active">Destinations for arts & culture</button>
          <button>Destinations for outdoor adventure</button>
          <button>Mountain cabins</button>
          <button>Beach destinations</button>
          <button>Popular destinations</button>
          <button>Unique Stays</button>
        </div>
        <div className="destinations-grid">
          <div className="destination">
            <span className="city">Phoenix</span>
            <span className="state">Arizona</span>
          </div>
          <div className="destination">
            <span className="city">Hot Springs</span>
            <span className="state">Arkansas</span>
          </div>
          <div className="destination">
            <span className="city">Los Angeles</span>
            <span className="state">California</span>
          </div>
          <div className="destination">
            <span className="city">San Diego</span>
            <span className="state">California</span>
          </div>
          <div className="destination">
            <span className="city">San Francisco</span>
            <span className="state">California</span>
          </div>
          <div className="destination">
            <span className="city">Barcelona</span>
            <span className="state">Catalonia</span>
          </div>
          <div className="destination">
            <span className="city">Prague</span>
            <span className="state">Czechia</span>
          </div>
          <div className="destination">
            <span className="city">Washington</span>
            <span className="state">District of Columbia</span>
          </div>
          <div className="destination">
            <span className="city">Keswick</span>
            <span className="state">England</span>
          </div>
          <div className="destination">
            <span className="city">London</span>
            <span className="state">England</span>
          </div>
          <div className="destination">
            <span className="city">Scarborough</span>
            <span className="state">England</span>
          </div>
          <div className="destination show-more">
            <a href="#">Show more</a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-columns">
          <div className="footer-column">
            <h3>Support</h3>
            <p>Help Center</p>
            <p>Safety information</p>
            <p>Cancellation options</p>
            <p>Our COVID-19 Response</p>
            <p>Supporting people with disabilities</p>
            <p>Report a neighborhood concern</p>
          </div>
          <div className="footer-column">
            <h3>Community</h3>
            <p>Airbnb.org: disaster relief housing</p>
            <p>Support: Afghan refugees</p>
            <p>Celebrating diversity & belonging</p>
            <p>Combating discrimination</p>
          </div>
          <div className="footer-column">
            <h3>Hosting</h3>
            <p>Try hosting</p>
            <p>AirCover: protection for Hosts</p>
            <p>Explore hosting resources</p>
            <p>Visit our community forum</p>
            <p>How to host responsibly</p>
          </div>
          <div className="footer-column">
            <h3>About</h3>
            <p>Newsroom</p>
            <p>Learn about new features</p>
            <p>Letter from our founders</p>
            <p>Careers</p>
            <p>Investors</p>
            <p>Airbnb Luxe</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Airbnb, Inc. - Privacy - Terms - Sitemap</p>
          <div className="footer-icons">
            <span className="footer-icon">🌐</span>
            <div className="dropdown">
              <button className="dropdown-btn">
                English <span className="dropdown-arrow">▲</span>
              </button>
              <div className="dropdown-content dropdown-above">
                <span>Spanish</span>
                <span>French</span>
                <span>German</span>
              </div>
            </div>

            <div className="dropdown">
              <button className="dropdown-btn">
                USD <span className="dropdown-arrow">▲</span>
              </button>
              <div className="dropdown-content dropdown-above">
                <span>ZAR</span>
                <span>GBP</span>
                <span>EUR</span>
              </div>
            </div>

            <span className="footer-social-icons">
              <i className="fab fa-facebook-f"></i>
              <i className="fab fa-twitter"></i>
              <i className="fab fa-instagram"></i>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
