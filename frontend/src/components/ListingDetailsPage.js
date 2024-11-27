import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../components/ListingDetailsPage.css";
import {
  FaStar,
  FaShareAlt,
  FaHeart,
  FaHome,
  FaCalendarAlt,
  FaDoorOpen,
  FaBroom,
  FaGlobe,
  FaUserCircle,
  FaBars,
} from "react-icons/fa";

function ListingDetailsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const today = new Date().toISOString().split("T")[0];
  const [reservationDetails, setReservationDetails] = useState({
    checkIn: today,
    checkOut: today,
    guests: 1,
  });
  const [totalCost, setTotalCost] = useState(0);
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/listing/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setListing(data);
      } catch (error) {
        console.error("Error fetching listing details:", error.message);
      }
    };

    fetchListingDetails();
  }, [id]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (storedToken && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setToken(storedToken);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername("");
    navigate("/");
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const calculateTotalCost = () => {
      if (reservationDetails.checkIn && reservationDetails.checkOut) {
        const checkInDate = new Date(reservationDetails.checkIn);
        const checkOutDate = new Date(reservationDetails.checkOut);
        const days = Math.max(
          Math.floor((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)),
          0
        );

        let subtotal = days * listing?.price || 0;

        if (reservationDetails.guests > 2) {
          const extraGuests = reservationDetails.guests - 2;
          subtotal += extraGuests * listing?.price * days;
        }

        const total = subtotal + 50 + 50 + 30;
        setTotalCost(total);
      }
    };

    calculateTotalCost();
  }, [reservationDetails, listing]);

  const handleReservation = async () => {
    if (!isLoggedIn) {
      alert("Please login to make a reservation.");
      navigate(`/user-login?redirect=/listings/${listing.location}`);
      return;
    }

    const role = localStorage.getItem("role");
    if (role === "host") {
      alert("Only users can make reservations.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          accommodationId: listing._id,
          checkIn: reservationDetails.checkIn,
          checkOut: reservationDetails.checkOut,
          guests: reservationDetails.guests,
          bookedBy: username,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Reservation failed");
      }

      const data = await response.json();
      alert("Reservation successfully created!");
    } catch (error) {
      console.error("Error making reservation:", error.message);
      alert("Failed to create reservation. Please try again.");
    }
  };

  if (!listing) {
    return <p>Loading...</p>;
  }

  const daysBetween = () => {
    if (reservationDetails.checkIn && reservationDetails.checkOut) {
      const checkInDate = new Date(reservationDetails.checkIn);
      const checkOutDate = new Date(reservationDetails.checkOut);
      return Math.max(
        Math.floor((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)),
        0
      );
    }
    return 0;
  };

  const clearDates = () => {
    setReservationDetails({
      ...reservationDetails,
      checkIn: "",
      checkOut: "",
    });
  };

  const reviews = [
    {
      profilePicture:
        "https://img.freepik.com/free-photo/people-showing-support-respect-with-yellow-background-suicide-prevention-day_23-2151607937.jpg?ga=GA1.1.1086424708.1732098994&semt=ais_hybrid",
      name: "John Doe",
      date: "Nov 2023",
      message: "Great place to stay! Very clean and cozy.",
    },
    {
      profilePicture:
        "https://img.freepik.com/free-photo/photorealistic-lawyer-day-celebration_23-2151053984.jpg?ga=GA1.1.1086424708.1732098994&semt=ais_hybrid",
      name: "Jane Smith",
      date: "Oct 2023",
      message: "Amazing location and wonderful host!",
    },
    {
      profilePicture:
        "https://img.freepik.com/premium-photo/professional-cv-photo-confident-business-woman-formal-attire_981640-67310.jpg?ga=GA1.1.1086424708.1732098994&semt=ais_hybrid",
      name: "Alice Brown",
      date: "Sept 2023",
      message: "Loved everything about it. Highly recommended!",
    },
    {
      profilePicture:
        "https://img.freepik.com/free-photo/portrait-elegant-professional-businessman_23-2150917272.jpg?ga=GA1.1.1086424708.1732098994&semt=ais_hybrid",
      name: "Mark Wilson",
      date: "Aug 2023",
      message: "Fantastic place! Will definitely come back.",
    },
    {
      profilePicture:
        "https://img.freepik.com/free-photo/medium-shot-female-nurse-outdoors_23-2150796744.jpg?ga=GA1.1.1086424708.1732098994&semt=ais_hybrid",
      name: "Emily Davis",
      date: "July 2023",
      message: "Such a peaceful and lovely home!",
    },
    {
      profilePicture:
        "https://img.freepik.com/premium-photo/man-wearing-glasses-blue-shirt-with-shirt-that-says-hes-wearing-glasses_1314467-61643.jpg?ga=GA1.1.1086424708.1732098994&semt=ais_hybrid",
      name: "Chris Green",
      date: "June 2023",
      message: "Perfect for a weekend getaway. Excellent!",
    },
  ];

  const host = {
    name: "Jamz",
    profilePicture:
      "https://img.freepik.com/premium-psd/hiphop-rapper-person-3d_716128-1290.jpg",
    joinedDate: "June 2022",
    reviews: 320,
    description: "Jamz is a super host",
    responseRate: 100,
    responseTime: "within an hour",
  };

  const houseRules = [
    "Check-in: After 4:00 PM",
    "Check-out: 10:00 AM",
    "Self check-in with lock-box",
    "Not suitable for infants (under 2 years)",
    "No smoking",
    "No pets",
    "No parties or events",
  ];

  const healthSafety = [
    "Committed to Airbnb's enhanced cleaning process.",
    "Airbnb's social distancing and other COVID-19-related guidelines apply.",
    "Carbon monoxide alarm",
    "Smoke alarm",
    "Security Deposit - If you damage the home, you may be charged up to $566",
  ];

  const cancellationPolicy = "Free cancellation before Dec 25";

  return (
    <div className="listing-details-page">
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

      <section className="details-section">
        <div className="listing-title">
          <h1>
            {listing.title} in {listing.location}
          </h1>
          <div className="listing-subtitle">
            <span>
              <FaStar className="star-icon" /> 5.0 (50 reviews) -{" "}
              {listing.location}
            </span>
            <div className="listing-actions">
              <span>
                <FaShareAlt /> Share
              </span>
              <span>
                <FaHeart /> Save
              </span>
            </div>
          </div>
        </div>

        <div className="image-gallery">
          <img
            src={`http://localhost:5000/${listing.mainImage}`}
            alt="Main"
            className="main-image"
          />
          <div className="other-images">
            {listing.images.map((image, index) => (
              <img
                key={index}
                src={`http://localhost:5000/${image}`}
                alt={`Gallery ${index + 1}`}
                className="gallery-image"
              />
            ))}
          </div>
        </div>

        <div className="info-booking-section">
          <div className="left-info">
            <h2>Entire {listing.title} hosted by Jamz</h2>
            <p>
              {listing.guests} Guests - Entire {listing.title} - {listing.rooms}{" "}
              Rooms - {listing.baths} Baths
            </p>
            <div className="host-profile">
              <img
                src="https://img.freepik.com/premium-psd/hiphop-rapper-person-3d_716128-1290.jpg"
                alt="Host"
                className="host-profile-image"
              />
            </div>

            <div className="features">
              <div>
                <FaHome /> <strong>Entire Apartment</strong>
                <p>You'll have the apartment for yourself.</p>
              </div>
              <div>
                <FaBroom /> <strong>Enhanced Cleaning</strong>
                <p>
                  This Host committed to Airbnb's 5-step enhanced cleaning
                  process.
                </p>
              </div>
              <div>
                <FaDoorOpen /> <strong>Self Check-in</strong>
                <p>Check yourself in with the keypad.</p>
              </div>
              <div>
                <FaCalendarAlt />{" "}
                <strong>Free cancellation before Dec 25</strong>
              </div>
            </div>

            <hr />
            <p className="listing-description">{listing.description}</p>
          </div>

          <div className="reservation-card">
            <h2>
              ${listing.price} / night <span>⭐ 5.0 (50)</span>
            </h2>
            <div className="booking-form">
              <div className="form-row">
                <label>Check-in</label>
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
                <label>Check-out</label>
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
              <div className="form-row">
                <label>Guests</label>
                <input
                  type="number"
                  min="1"
                  value={reservationDetails.guests}
                  onChange={(e) =>
                    setReservationDetails((prev) => ({
                      ...prev,
                      guests: e.target.value,
                    }))
                  }
                />
              </div>
              <button onClick={handleReservation}>Reserve</button>
              <p>You won't be charged yet</p>

              <div className="pricing-details">
                <div>
                  <span>
                    ${listing.price} x {daysBetween()} nights
                  </span>
                  <span>${daysBetween() * listing.price}</span>
                </div>
                <div>
                  <span>Cleaning fee</span>
                  <span>$50</span>
                </div>
                <div>
                  <span>Service fee</span>
                  <span>$50</span>
                </div>
                <div>
                  <span>Occupancy taxes and fees</span>
                  <span>$30</span>
                </div>
                <hr />
                <div>
                  <strong>Total</strong>
                  <strong>${totalCost}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="where-youll-sleep">
        <h2>Where You'll Sleep</h2>
        <img
          src={`http://localhost:5000/${listing.mainImage}`}
          alt="Spacious Bedroom"
          className="main-image"
        />
        <p className="image-caption">Spacious bedroom with comfortable bed</p>
        <p>Total Bedrooms: {listing?.rooms}</p>
        <hr />
      </section>

      <section className="what-this-place-offers">
        <h2>What this place offers</h2>
        <div className="amenities-list">
          {listing?.amenities?.map((amenity, index) => (
            <p key={index} className="amenity">
              {amenity}
            </p>
          ))}
        </div>
        <button className="view-amenities">View all 37 amenities</button>
        <hr />
      </section>

      <section className="seven-nights">
        <h2>7 Nights in {listing?.location}</h2>
        <div className="calendar-section">
          <div className="calendar">
            <h4>Check-in</h4>
            <input
              type="date"
              value={reservationDetails.checkIn}
              onChange={(e) =>
                setReservationDetails({
                  ...reservationDetails,
                  checkIn: e.target.value,
                })
              }
            />
          </div>
          <div className="calendar">
            <h4>Check-out</h4>
            <input
              type="date"
              value={reservationDetails.checkOut}
              onChange={(e) =>
                setReservationDetails({
                  ...reservationDetails,
                  checkOut: e.target.value,
                })
              }
            />
          </div>
        </div>
        <p className="calendar-text">
          Selected Dates: From {reservationDetails.checkIn} To{" "}
          {reservationDetails.checkOut}
        </p>
        <button className="clear-dates" onClick={clearDates}>
          Clear dates
        </button>
        <hr />
      </section>

      <section className="reviews-section">
        <p>⭐ 5.0 - 50 reviews</p>
        <div className="reviews">
          {reviews.slice(0, 6).map((review, index) => (
            <div className="review" key={index}>
              <img
                src={review.profilePicture}
                alt="Reviewer"
                className="reviewer-img"
              />
              <div>
                <p className="reviewer-name">{review.name}</p>
                <p className="review-date">{review.date}</p>
                <p className="review-message">{review.message}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="show-reviews">Show all 50 reviews</button>
        <hr />
      </section>

      <section className="host-info">
        <div className="host-header">
          <img
            src={host.profilePicture}
            alt="Host Profile"
            className="host-profile-picture"
          />
          <div>
            <h2>Hosted by {host.name}</h2>
            <p>Joined {host.joinedDate}</p>
          </div>
        </div>
        <div className="host-stats">
          <p>⭐ {host.reviews} Reviews</p>
          <p>✔ Identity verified</p>
          <p>🏅 Superhost</p>
        </div>
        <p>{host.description}</p>
        <p>Response rate: {host.responseRate}%</p>
        <p>Response time: {host.responseTime}</p>
        <button className="contact-host-btn">Contact Host</button>
        <p className="payment-warning">
          🛡 To protect your payment, never transfer money or communicate outside
          of the Airbnb website or app.
        </p>
      </section>

      <section className="policies-section">
        <div className="policies">
          <div className="policy-column">
            <h3>House Rules</h3>
            <ul>
              {houseRules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </div>
          <div className="policy-column">
            <h3>Health & Safety</h3>
            <ul>
              {healthSafety.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="policy-column">
            <h3>Cancellation Policy</h3>
            <p>{cancellationPolicy}</p>
            <a href="#more" className="show-more-link">
              Show more
            </a>
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

export default ListingDetailsPage;
