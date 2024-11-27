import React, { useEffect, useState } from "react";
import axios from "axios";
import "../components/ViewListings.css";
import { useLocation } from "react-router-dom";

const ViewListings = () => {
  const location = useLocation();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    if (location.state?.updatedListing) {
      setListings((prevListings) =>
        prevListings.map((listing) =>
          listing._id === location.state.updatedListing._id
            ? location.state.updatedListing
            : listing
        )
      );
    }
  }, [location.state]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/accommodations",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setListings(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch listings:",
          error.response?.data || error.message
        );
      }
    };

    fetchListings();
  }, []);

  const handleDelete = async (listingId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:5000/api/accommodations/${listingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setListings((prevListings) =>
          prevListings.filter((listing) => listing._id !== listingId)
        );
      }
    } catch (error) {
      console.error(
        "Failed to delete listing:",
        error.response?.data || error.message
      );
    }
  };

  const redirectToEditForm = (listingId) => {
    window.location.href = `/edit-listing/${listingId}`;
  };

  return (
    <div className="listings-container">
      <h3>My Hotel List</h3>
      {Array.isArray(listings) && listings.length > 0 ? (
        listings.map((listing) => (
          <div key={listing._id} className="listing-card">
            <div className="listing-left">
              <img
                src={listing.mainImage || "/default-thumbnail.jpg"}
                alt="Listing"
                className="listing-image"
              />
              <div className="listing-buttons">
                <button
                  onClick={() => redirectToEditForm(listing._id)}
                  className="update-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(listing._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="listing-details">
              <h3>{listing.location}</h3>
              <h2>{listing.title}</h2>
              <div className="listing-info">
                <p>{listing.guests || 0} Guest/s</p>
                <p>{listing.rooms || 0} Room/s</p>
                <p>{listing.baths || 0} Bath/s</p>
              </div>
              <div className="listing-amenities">
                <h4>Amenities:</h4>
                <ul>
                  {listing.amenities.map((amenity, index) => (
                    <li key={index}>{amenity}</li>
                  ))}
                </ul>
              </div>
              <div className="listing-footer">
                <span>Rating: 5.0 ⭐</span>
                <span className="listing-price">${listing.price} / night</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No listings available.</p>
      )}
    </div>
  );
};

export default ViewListings;
