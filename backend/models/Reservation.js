const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  accommodation: { type: mongoose.Schema.Types.ObjectId, ref: "Accommodation" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  checkIn: { type: Date },
  checkOut: { type: Date },
  guests: { type: Number },
  bookedBy: { type: String },
});

module.exports = mongoose.model("Reservation", reservationSchema);
