import React, { useEffect, useState } from "react";
import axios from "axios";
import "../components/ViewReservations.css";

const ViewReservations = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(
          "https://airbnb-project-backend.onrender.com/api/reservations/host",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setReservations(response.data);
      } catch (error) {
        console.error("Error fetching host reservations:", error.message);
      }
    };

    fetchReservations();
  }, []);

  const handleDelete = async (reservationId) => {
    try {
      await axios.delete(
        `https://airbnb-project-backend.onrender.com/api/reservations/${reservationId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setReservations((prev) =>
        prev.filter((res) => res._id !== reservationId)
      );
    } catch (error) {
      console.error("Error deleting reservation:", error.message);
    }
  };

  return (
    <div className="reservations-container">
      <h1>Host Reservations</h1>
      <table className="reservations-table">
        <thead>
          <tr>
            <th>Booked By</th>
            <th>Property</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Guests</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((res) => (
            <tr key={res._id}>
              <td>{res.user ? res.user.username : "Unknown User"}</td>
              <td>
                {res.accommodation
                  ? `${res.accommodation.title}, ${res.accommodation.location}`
                  : "No Property Information"}
              </td>
              <td>{res.checkIn}</td>
              <td>{res.checkOut}</td>
              <td>{res.guests}</td>
              <td>
                <button
                  onClick={() => handleDelete(res._id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewReservations;
