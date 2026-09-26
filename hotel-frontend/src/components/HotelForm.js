import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HotelForm.css";

function HotelForm({ hotel }) {
  const navigate = useNavigate();

  const isEditMode = hotel !== undefined && hotel !== null;

  const [formData, setFormData] = useState({
    title:       isEditMode ? hotel.title       : "",
    description: isEditMode ? hotel.description : "",
    latitude:    isEditMode ? hotel.latitude    : "",
    longitude:   isEditMode ? hotel.longitude   : "",
    price:       isEditMode ? hotel.price       : "",
    image:       null,
  });

  const [imagePreview, setImagePreview] = useState(
    isEditMode && hotel.image ? hotel.image : ""
  );

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function validateForm() {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Hotel title is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Hotel description is required.";
    }

    if (formData.latitude === "" || formData.latitude === null || formData.latitude === undefined) {
      newErrors.latitude = "Latitude is required.";
    } else if (
      isNaN(Number(formData.latitude)) ||
      Number(formData.latitude) < -90 ||
      Number(formData.latitude) > 90
    ) {
      newErrors.latitude = "Latitude must be between -90 and 90.";
    }

    if (formData.longitude === "" || formData.longitude === null || formData.longitude === undefined) {
      newErrors.longitude = "Longitude is required.";
    } else if (
      isNaN(Number(formData.longitude)) ||
      Number(formData.longitude) < -180 ||
      Number(formData.longitude) > 180
    ) {
      newErrors.longitude = "Longitude must be between -180 and 180.";
    }

    if (formData.price === "" || formData.price === null || formData.price === undefined) {
      newErrors.price = "Price is required.";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0.";
    }

    if (!isEditMode && !formData.image) {
      newErrors.image = "Hotel image is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  }

  function handleImageChange(event) {
    const file = event.target.files[0];

    if (file) {
      setFormData({
        ...formData,
        image: file,
      });

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      if (errors.image) {
        setErrors({
          ...errors,
          image: "",
        });
      }
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title.trim());
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("latitude", formData.latitude);
      formDataToSend.append("longitude", formData.longitude);
      formDataToSend.append("price", formData.price);

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const url = isEditMode
        ? "http://localhost:5000/api/hotels/" + hotel.id
        : "http://localhost:5000/api/hotels";

      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        body: formDataToSend,
      });

      if (!response.ok) {
        let errorMessage = isEditMode
          ? "Unable to update hotel."
          : "Unable to add hotel.";

        try {
          const data = await response.json();
          if (data && data.error) {
            errorMessage = data.error;
          }
        } catch (parseError) {
          /* Keep default errorMessage */
        }

        setSubmitError(errorMessage);
        setIsSubmitting(false);
        return;
      }

      navigate("/");
    } catch (error) {
      setSubmitError(
        isEditMode ? "Unable to update hotel." : "Unable to add hotel."
      );
      setIsSubmitting(false);
    }
  }

  return (
    <div className="hotel-form-wrapper">
      <form className="hotel-form" onSubmit={handleSubmit}>
        <h2 className="hotel-form-title">
          {isEditMode ? "Edit Hotel" : "Add Hotel"}
        </h2>

        <div className="form-group">
          <label htmlFor="hotel-image">Hotel Image</label>
          <input
            id="hotel-image"
            type="file"
            accept="image/*"
            className="form-input-file"
            onChange={handleImageChange}
          />
          {errors.image && <p className="field-error">{errors.image}</p>}

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Hotel preview" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="hotel-title">Hotel Title</label>
          <input
            id="hotel-title"
            type="text"
            name="title"
            placeholder="e.g. Grand Ocean Resort"
            className={`form-input ${errors.title ? "input-error" : ""}`}
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <p className="field-error">{errors.title}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="hotel-description">Description</label>
          <textarea
            id="hotel-description"
            name="description"
            placeholder="Describe the hotel..."
            className={`form-textarea ${errors.description ? "input-error" : ""}`}
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
          {errors.description && <p className="field-error">{errors.description}</p>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="hotel-latitude">Latitude</label>
            <input
              id="hotel-latitude"
              type="number"
              name="latitude"
              placeholder="e.g. 3.1569"
              className={`form-input ${errors.latitude ? "input-error" : ""}`}
              value={formData.latitude}
              onChange={handleChange}
              step="any"
            />
            {errors.latitude && <p className="field-error">{errors.latitude}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="hotel-longitude">Longitude</label>
            <input
              id="hotel-longitude"
              type="number"
              name="longitude"
              placeholder="e.g. 101.712"
              className={`form-input ${errors.longitude ? "input-error" : ""}`}
              value={formData.longitude}
              onChange={handleChange}
              step="any"
            />
            {errors.longitude && <p className="field-error">{errors.longitude}</p>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="hotel-price">Price per Night ($)</label>
          <input
            id="hotel-price"
            type="number"
            name="price"
            placeholder="e.g. 150"
            className={`form-input ${errors.price ? "input-error" : ""}`}
            value={formData.price}
            onChange={handleChange}
            step="any"
          />
          {errors.price && <p className="field-error">{errors.price}</p>}
        </div>

        <div className="form-buttons">
          <button
            type="submit"
            className="btn-form-submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? (isEditMode ? "Updating..." : "Adding...")
              : (isEditMode ? "Update Hotel" : "Add Hotel")}
          </button>
          <button
            type="button"
            className="btn-form-cancel"
            onClick={function() { navigate("/"); }}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>

        {submitError && (
          <p className="form-submit-error">{submitError}</p>
        )}

      </form>
    </div>
  );
}

export default HotelForm;
