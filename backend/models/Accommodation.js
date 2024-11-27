const mongoose = require("mongoose");

const AccommodationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  rooms: { type: Number, required: true },
  guests: { type: Number, required: true },
  baths: { type: Number, required: true },
  price: { type: Number, required: true },
  amenities: [String],
  mainImage: { type: String, required: true },
  images: [String],
  host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Accommodation", AccommodationSchema);
