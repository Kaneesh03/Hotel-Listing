import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import "./HotelDetailPage.css";

function HotelDetailPage() {
  const { id } = useParams();

  const hotels = useSelector(function(state) {
    return state.hotels.hotels;
  });

  const reduxHotel = hotels.find(function(item) {
    return item.id === Number(id);
  });

  const [hotel, setHotel] = useState(reduxHotel || null);
  const [loading, setLoading] = useState(!reduxHotel);
  const [userLocation, setUserLocation] = useState(null);
  const [geoStatus, setGeoStatus] = useState("loading");

  useEffect(function() {
    if (reduxHotel) {
      setHotel(reduxHotel);
      setLoading(false);
      return;
    }

    async function fetchHotelById() {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/hotels/${id}`);
        if (!response.ok) {
          setHotel(null);
          setLoading(false);
          return;
        }
        const data = await response.json();
        if (data.image && data.image.startsWith("/uploads/")) {
          data.image = "http://localhost:5000" + data.image;
        }
        setHotel(data);
      } catch (err) {
        setHotel(null);
      } finally {
        setLoading(false);
      }
    }

    fetchHotelById();
  }, [id, reduxHotel]);

  useEffect(function() {
    if (!hotel) {
      return;
    }

    if (!navigator.geolocation) {
      setGeoStatus("unsupported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      function(position) {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setGeoStatus("granted");
      },
      function() {
        setGeoStatus("denied");
      }
    );
  }, [hotel]);

  if (loading) {
    return (
      <div className="hotel-detail-page">
        <div className="page-nav-bar">
          <Link to="/" className="btn-back">
            ← Back to List
          </Link>
        </div>
        <p style={{ textAlign: "center", marginTop: "40px" }}>Loading hotel details...</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="hotel-detail-page">
        <Helmet>
          <title>Hotel Details</title>
          <meta
            name="description"
            content="Detailed information about the selected hotel."
          />
        </Helmet>

        <div className="page-nav-bar">
          <Link to="/" className="btn-back">
            ← Back to List
          </Link>
        </div>

        <div className="hotel-not-found">
          <h2>Hotel not found.</h2>
          <p>No hotel found with ID: {id}</p>
        </div>
      </div>
    );
  }

  // Calculate coordinates for embedded map bounding box
  const hotelLat = Number(hotel.latitude);
  const hotelLng = Number(hotel.longitude);

  return (
    <div className="hotel-detail-page">
      <Helmet>
        <title>{`${hotel.title} - Hotel Details`}</title>
        <meta
          name="description"
          content={`Explore details, amenities, price, and location map for ${hotel.title}.`}
        />
      </Helmet>

      <div className="page-nav-bar">
        <Link to="/" className="btn-back">
          ← Back to List
        </Link>
      </div>

      <div className="hotel-detail-card">
        <div className="hotel-detail-image-wrapper">
          {hotel.image ? (
            <img
              src={hotel.image}
              alt={hotel.title}
              className="hotel-detail-image"
            />
          ) : (
            <div className="hotel-detail-image-placeholder">
              <span>No Image Available</span>
            </div>
          )}
        </div>

        <div className="hotel-detail-info">
          <h1 className="hotel-detail-title">{hotel.title}</h1>

          <p className="hotel-detail-price">
            <span className="price-amount">${hotel.price}</span> / night
          </p>

          <div className="hotel-detail-section">
            <h3>Description</h3>
            <p className="hotel-detail-description">{hotel.description}</p>
          </div>

          <div className="hotel-detail-section location-section">
            <h3>Location</h3>
            <div className="coordinates-grid">
              <div className="coordinate-item">
                <span className="coordinate-label">Latitude:</span>
                <span className="coordinate-value">{hotel.latitude}</span>
              </div>
              <div className="coordinate-item">
                <span className="coordinate-label">Longitude:</span>
                <span className="coordinate-value">{hotel.longitude}</span>
              </div>
            </div>

            {geoStatus === "loading" && (
              <p className="user-location-info muted">
                Getting your current location...
              </p>
            )}
            {geoStatus === "granted" && userLocation && (
              <p className="user-location-info">
                📍 Your current location: {userLocation.latitude}, {userLocation.longitude}
              </p>
            )}
            {(geoStatus === "denied" || geoStatus === "unsupported") && (
              <p className="user-location-info muted">
                Current location is unavailable.
              </p>
            )}

            <div className="map-container">
              <iframe
                title={`Map location of ${hotel.title}`}
                className="hotel-map-iframe"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${hotelLng - 0.02}%2C${hotelLat - 0.02}%2C${hotelLng + 0.02}%2C${hotelLat + 0.02}&layer=mapnik&marker=${hotelLat}%2C${hotelLng}`}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelDetailPage;
