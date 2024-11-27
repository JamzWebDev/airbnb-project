const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // CORS setup

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Import Routes
const accommodationRoutes = require("./routes/accommodationRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const userRoutes = require("./routes/userRoutes");

app.get("/api/locations", async (req, res) => {
  try {
    const locations = await mongoose
      .model("Accommodation")
      .distinct("location");
    res.json(locations);
  } catch (error) {
    console.error("Error fetching locations:", error.message);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

app.get("/api/listings/:location", async (req, res) => {
  try {
    const { location } = req.params;
    const query = location === "all" ? {} : { location };
    const listings = await mongoose.model("Accommodation").find(query);
    res.json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error.message);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

// Use Routes
app.use("/api/users", userRoutes); //
app.use("/api/accommodations", accommodationRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/users", userRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api", accommodationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
