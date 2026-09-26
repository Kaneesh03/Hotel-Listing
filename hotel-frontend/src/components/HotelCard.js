import { useNavigate } from "react-router-dom";
import "./HotelCard.css";

function HotelCard({ hotel, onDelete, isDeleting }) {
  const navigate = useNavigate();

  return (
    <article className="hotel-card">
      <div className="hotel-card-image-wrapper">
        {hotel.image ? (
          <img
            src={hotel.image}
            alt={hotel.title}
            className="hotel-card-image"
          />
        ) : (
          <div className="hotel-card-image-placeholder">
            <span>No Image</span>
          </div>
        )}
      </div>

      <div className="hotel-card-info">
        <h2 className="hotel-card-title">{hotel.title}</h2>
        <p className="hotel-card-description">{hotel.description}</p>
        <p className="hotel-card-location">
          📍 Lat: {hotel.latitude} &bull; Lng: {hotel.longitude}
        </p>
      </div>

      <div className="hotel-card-actions">
        <div className="hotel-card-price-box">
          <span className="hotel-card-price-value">${hotel.price}</span>
          <span className="hotel-card-price-unit">/ night</span>
        </div>

        <div className="hotel-card-btn-group">
          <button
            className="btn-view-details"
            onClick={function() { navigate(`/hotel/${hotel.id}`); }}
            aria-label={`View details for ${hotel.title}`}
          >
            View Details
          </button>
          <button
            className="btn-edit"
            onClick={function() { navigate(`/edit/${hotel.id}`); }}
            aria-label={`Edit ${hotel.title}`}
          >
            Edit
          </button>
          <button
            className="btn-delete"
            disabled={isDeleting}
            onClick={function() {
              if (onDelete && !isDeleting) {
                onDelete(hotel.id);
              }
            }}
            aria-label={`Delete ${hotel.title}`}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default HotelCard;
