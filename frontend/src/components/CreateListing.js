import React, { useState } from "react";
import axios from "axios";
import "../components/CreateListing.css";

const CreateListing = ({ onListingCreated = () => {} }) => {
  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
    rooms: "",
    guests: "",
    baths: "",
    price: "",
    amenities: [""],
  });

  const [mainImage, setMainImage] = useState(null);
  const [otherImages, setOtherImages] = useState([]);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [otherImagesPreview, setOtherImagesPreview] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddAmenity = () => {
    setForm({ ...form, amenities: [...form.amenities, ""] });
  };

  const handleAmenityChange = (index, value) => {
    const updatedAmenities = form.amenities.map((amenity, i) =>
      i === index ? value : amenity
    );
    setForm({ ...form, amenities: updatedAmenities });
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    setMainImage(file);
    setMainImagePreview(URL.createObjectURL(file));
  };

  const handleOtherImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setOtherImages(files);
    setOtherImagesPreview(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.location ||
      !form.description ||
      !form.rooms ||
      !form.baths ||
      !form.price ||
      !mainImage
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));
      formData.append("mainImage", mainImage);
      otherImages.forEach((file) => formData.append("images", file));

      const response = await axios.post(
        "https://airbnb-project-backend.onrender.com/api/accommodations",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Accommodation created successfully!");
      onListingCreated(response.data.accommodation);
      setForm({
        title: "",
        location: "",
        description: "",
        rooms: "",
        guests: "",
        baths: "",
        price: "",
        amenities: [""],
      });
      setMainImage(null);
      setOtherImages([]);
      setMainImagePreview(null);
      setOtherImagesPreview([]);
    } catch (error) {
      console.error("Failed to create accommodation:", error);
      alert("Failed to create accommodation.");
    }
  };

  return (
    <div className="create-listing-container">
      <h2>Create Listing</h2>
      <form className="create-listing-form-horizontal" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Location *</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label>Guests *</label>
          <input
            type="number"
            name="guests"
            value={form.guests}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Rooms *</label>
          <input
            type="number"
            name="rooms"
            value={form.rooms}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Baths *</label>
          <input
            type="number"
            name="baths"
            value={form.baths}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Price per Night ($) *</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Amenities</label>
          {form.amenities.map((amenity, index) => (
            <input
              key={index}
              type="text"
              value={amenity}
              onChange={(e) => handleAmenityChange(index, e.target.value)}
            />
          ))}
          <button type="button" onClick={handleAddAmenity}>
            Add Amenity
          </button>
        </div>

        <div className="form-group">
          <label>Upload Main Image *</label>
          <input type="file" onChange={handleMainImageChange} required />
          {mainImagePreview && (
            <img src={mainImagePreview} alt="Main preview" />
          )}
        </div>

        <div className="form-group">
          <label>Upload Other Images</label>
          <input type="file" multiple onChange={handleOtherImagesChange} />
          <div className="image-preview">
            {otherImagesPreview.map((src, index) => (
              <img key={index} src={src} alt={`Other preview ${index}`} />
            ))}
          </div>
        </div>

        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateListing;
