const express = require("express");
const upload = require("../middleware/upload");
const {
  createAccommodation,
  getAccommodations,
  getAccommodationById,
  updateAccommodation,
  deleteAccommodation,
} = require("../controllers/accommodationController");
const authenticate = require("../middleware/auth");
const Accommodation = require("../models/Accommodation");

const router = express.Router();

router.post(
  "/",
  authenticate,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  createAccommodation
);

router.get("/", getAccommodations);
router.get("/listing/:id", async (req, res) => {
  try {
    const listing = await Accommodation.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json(listing);
  } catch (error) {
    console.error(`Error fetching listing with ID: ${req.params.id}`, error);
    res.status(500).json({ message: "Failed to fetch listing" });
  }
});

router.get("/:id", authenticate, (req, res, next) => {
  if (req.originalUrl.startsWith("/api/listing")) return next();
  getAccommodationById(req, res);
});

router.put(
  "/:id",
  authenticate,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  updateAccommodation
);

router.delete("/:id", authenticate, deleteAccommodation);

module.exports = router;
