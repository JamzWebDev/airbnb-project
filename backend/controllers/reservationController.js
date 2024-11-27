const Reservation = require("../models/Reservation");
const Accommodation = require("../models/Accommodation");
const moment = require("moment");

// Create a new reservation
exports.createReservation = async (req, res) => {
  try {
    const { accommodationId, checkIn, checkOut, guests } = req.body;

    const reservation = new Reservation({
      accommodation: accommodationId,
      checkIn,
      checkOut,
      guests,
      bookedBy: req.user.username,
      user: req.user.id,
    });

    const savedReservation = await reservation.save();
    res.status(201).json(savedReservation);
  } catch (error) {
    res.status(500).json({ message: "Error creating reservation.", error });
  }
};

// Get reservations for the authenticated user
exports.getReservationsByUser = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id })
      .populate("accommodation", "title location")
      .populate("user", "username");

    const formattedReservations = reservations.map((reservation) => ({
      ...reservation._doc,
      checkIn: moment(reservation.checkIn).format("MM/DD/YYYY"),
      checkOut: moment(reservation.checkOut).format("MM/DD/YYYY"),
    }));

    res.json(formattedReservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ message: "Error fetching reservations.", error });
  }
};

// Get reservations for accommodations owned by the host
exports.getReservationsByHost = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate({
        path: "accommodation",
        match: { host: req.user.id }, // Ensure accommodations belong to the logged-in host
        select: "title location",
      })
      .populate("user", "username"); // Populate the username of the user who made the reservation

    // Filter out reservations where the accommodation is null (not owned by the host)
    const filteredReservations = reservations.filter(
      (res) => res.accommodation
    );

    const formattedReservations = filteredReservations.map((reservation) => ({
      ...reservation._doc,
      checkIn: moment(reservation.checkIn).format("MM/DD/YYYY"),
      checkOut: moment(reservation.checkOut).format("MM/DD/YYYY"),
    }));

    res.json(formattedReservations);
  } catch (error) {
    console.error("Error fetching host reservations:", error);
    res
      .status(500)
      .json({ message: "Error fetching host reservations.", error });
  }
};

// Delete a reservation by ID
exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    await Reservation.findByIdAndDelete(id);
    res.json({ message: "Reservation deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting reservation.", error });
  }
};
