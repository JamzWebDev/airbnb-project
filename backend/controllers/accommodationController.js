const Accommodation = require("../models/Accommodation");

exports.createAccommodation = async (req, res) => {
  try {
    if (req.user.role !== "host") {
      return res
        .status(403)
        .json({ message: "Only hosts can create listings" });
    }

    const {
      title,
      location,
      description,
      rooms,
      guests,
      baths,
      amenities,
      price,
    } = req.body;

    if (
      !title ||
      !location ||
      !description ||
      !rooms ||
      !baths ||
      !price ||
      !req.files.mainImage
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled in." });
    }

    const mainImage = req.files.mainImage[0].path;
    const images = req.files.images
      ? req.files.images.map((file) => file.path)
      : [];
    const amenitiesArray = Array.isArray(amenities)
      ? amenities
      : amenities.split(",");

    const accommodation = new Accommodation({
      title,
      location,
      description,
      rooms,
      guests,
      baths,
      price,
      amenities: amenitiesArray,
      mainImage,
      images,
      host: req.user._id,
    });

    await accommodation.save();
    res.status(201).json({
      message: "Accommodation created successfully.",
      accommodation: {
        ...accommodation._doc,
        mainImage: `${req.protocol}://${req.get("host")}/${
          accommodation.mainImage
        }`,
        images: accommodation.images.map(
          (img) => `${req.protocol}://${req.get("host")}/${img}`
        ),
      },
    });
  } catch (error) {
    console.error("Error creating accommodation:", error);
    res
      .status(500)
      .json({
        message: "Failed to create accommodation.",
        error: error.message,
      });
  }
};

exports.getAccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.find().populate(
      "host",
      "username"
    );
    const formattedAccommodations = accommodations.map((acc) => ({
      ...acc._doc,
      mainImage: `${req.protocol}://${req.get("host")}/${acc.mainImage}`,
      images: acc.images.map(
        (img) => `${req.protocol}://${req.get("host")}/${img}`
      ),
    }));
    res.json(formattedAccommodations);
  } catch (error) {
    console.error("Error fetching accommodations:", error);
    res.status(500).json({ message: "Failed to fetch accommodations." });
  }
};

exports.getAccommodationById = async (req, res) => {
  try {
    const { id } = req.params;
    const accommodation = await Accommodation.findById(id);
    if (!accommodation) {
      return res.status(404).json({ message: "Accommodation not found." });
    }

    const formattedAccommodation = {
      ...accommodation._doc,
      mainImage: `${req.protocol}://${req.get("host")}/${
        accommodation.mainImage
      }`,
      images: accommodation.images.map(
        (img) => `${req.protocol}://${req.get("host")}/${img}`
      ),
    };

    res.json(formattedAccommodation);
  } catch (error) {
    console.error("Error fetching accommodation by ID:", error);
    res.status(500).json({ message: "Failed to fetch accommodation." });
  }
};

exports.updateAccommodation = async (req, res) => {
  try {
    // Ensure only hosts can update listings
    if (req.user.role !== "host") {
      return res
        .status(403)
        .json({ message: "Only hosts can update listings." });
    }

    const { id } = req.params;
    const {
      title,
      location,
      description,
      rooms,
      guests,
      baths,
      amenities,
      price,
    } = req.body;

    // Ensure amenities is an array
    const parsedAmenities = Array.isArray(amenities)
      ? amenities
      : amenities.split(",");

    const updateData = {
      title,
      location,
      description,
      rooms,
      guests,
      baths,
      price,
      amenities: parsedAmenities,
    };

    // Check if new images are uploaded
    if (req.files.mainImage) {
      updateData.mainImage = req.files.mainImage[0].path;
    }
    if (req.files.images) {
      updateData.images = req.files.images.map((file) => file.path);
    }

    const accommodation = await Accommodation.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if (!accommodation) {
      return res.status(404).json({ message: "Accommodation not found." });
    }

    res.json({
      message: "Accommodation updated successfully.",
      accommodation,
    });
  } catch (error) {
    console.error("Error updating accommodation:", error);
    res
      .status(500)
      .json({
        message: "Failed to update accommodation.",
        error: error.message,
      });
  }
};

exports.deleteAccommodation = async (req, res) => {
  try {
    if (req.user.role !== "host") {
      return res
        .status(403)
        .json({ message: "Only hosts can delete listings." });
    }

    const { id } = req.params;
    const accommodation = await Accommodation.findByIdAndDelete(id);
    if (!accommodation) {
      return res.status(404).json({ message: "Accommodation not found." });
    }

    res.json({ message: "Accommodation deleted successfully." });
  } catch (error) {
    console.error("Error deleting accommodation:", error);
    res
      .status(500)
      .json({
        message: "Failed to delete accommodation.",
        error: error.message,
      });
  }
};
