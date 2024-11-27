const express = require("express");
const auth = require("../middleware/auth");
const {
  createReservation,
  getReservationsByHost,
  getReservationsByUser,
  deleteReservation,
} = require("../controllers/reservationController");

const router = express.Router();

// Create a new reservation
router.post("/", auth, createReservation);

// Get reservations for hosts
router.get("/host", auth, getReservationsByHost);

// Get reservations for authenticated users
router.get("/user", auth, getReservationsByUser);

// Delete a reservation by ID
router.delete("/:id", auth, deleteReservation);

module.exports = router;
