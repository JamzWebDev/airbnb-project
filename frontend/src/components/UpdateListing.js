import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../components/CreateListing.css";

const UpdateListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [otherImagesPreview, setOtherImagesPreview] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch existing listing data
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/accommodations/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const listing = response.data;

        if (!listing) {
          alert("Listing not found.");
          navigate("/host-dashboard");
          return;
        }

        // Populate the form with fetched data
        setForm({
          title: listing.title || "",
          location: listing.location || "",
          description: listing.description || "",
          rooms: listing.rooms?.toString() || "",
          guests: listing.guests?.toString() || "",
          baths: listing.baths?.toString() || "",
          price: listing.price?.toString() || "",
          amenities: listing.amenities?.length ? listing.amenities : [""],
        });

        setMainImagePreview(listing.mainImage);
        setOtherImagesPreview(listing.images || []);
      } catch (error) {
        console.error(
          "Error fetching listing:",
          error.response?.data || error.message
        );
        alert("Failed to fetch listing data.");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, navigate]);

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
    setMainImagePreview(URL.createObjectURL(file));
    setForm({ ...form, mainImage: file });
  };

  const handleOtherImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setOtherImagesPreview(files.map((file) => URL.createObjectURL(file)));
    setForm({ ...form, otherImages: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      // Append text fields
      Object.keys(form).forEach((key) => {
        if (key !== "mainImage" && key !== "otherImages") {
          if (Array.isArray(form[key])) {
            form[key].forEach((value) => formData.append(key, value));
          } else {
            formData.append(key, form[key]);
          }
        }
      });

      // Append files only if new ones are selected
      if (form.mainImage instanceof File) {
        formData.append("mainImage", form.mainImage);
      }
      if (form.otherImages && form.otherImages.length) {
        form.otherImages.forEach((file) => formData.append("images", file));
      }

      const response = await axios.put(
        `http://localhost:5000/api/accommodations/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Listing updated successfully!");
      navigate("/host-dashboard", {
        state: { updatedListing: response.data.accommodation },
      });
    } catch (error) {
      console.error(
        "Error updating listing:",
        error.response?.data || error.message
      );
      alert("Failed to update listing.");
    }
  };

  if (loading) {
    return <p>Loading listing data...</p>;
  }

  return (
    <div className="create-listing-container">
      <h2>Edit Listing</h2>
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
          <input type="file" onChange={handleMainImageChange} />
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

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default UpdateListing;
