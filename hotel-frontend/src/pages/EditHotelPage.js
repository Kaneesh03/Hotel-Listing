import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import HotelForm from "../components/HotelForm";

function EditHotelPage() {
  const { id } = useParams();

  const hotels = useSelector(function(state) {
    return state.hotels.hotels;
  });

  const reduxHotel = hotels.find(function(hotel) {
    return hotel.id === Number(id);
  });

  const [hotelToEdit, setHotelToEdit] = useState(reduxHotel || null);
  const [loading, setLoading] = useState(!reduxHotel);

  useEffect(function() {
    if (reduxHotel) {
      setHotelToEdit(reduxHotel);
      setLoading(false);
      return;
    }

    async function fetchHotelById() {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/hotels/${id}`);
        if (!response.ok) {
          setHotelToEdit(null);
          setLoading(false);
          return;
        }
        const data = await response.json();
        if (data.image && data.image.startsWith("/uploads/")) {
          data.image = "http://localhost:5000" + data.image;
        }
        setHotelToEdit(data);
      } catch (err) {
        setHotelToEdit(null);
      } finally {
        setLoading(false);
      }
    }

    fetchHotelById();
  }, [id, reduxHotel]);

  if (loading) {
    return (
      <div className="edit-hotel-page">
        <div className="page-nav-bar">
          <Link to="/" className="btn-back">
            ← Back to List
          </Link>
        </div>
        <p style={{ textAlign: "center", marginTop: "40px" }}>Loading hotel...</p>
      </div>
    );
  }

  if (!hotelToEdit) {
    return (
      <div className="edit-hotel-page">
        <Helmet>
          <title>Edit Hotel</title>
          <meta
            name="description"
            content="Edit hotel details."
          />
        </Helmet>

        <div className="page-nav-bar">
          <Link to="/" className="btn-back">
            ← Back to List
          </Link>
        </div>
        <div className="hotel-not-found">
          <h2>Hotel not found.</h2>
          <p>No hotel exists with ID: {id}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-hotel-page">
      <Helmet>
        <title>{`Edit Hotel - ${hotelToEdit.title}`}</title>
        <meta
          name="description"
          content={`Edit information, pricing, and coordinates for ${hotelToEdit.title}.`}
        />
      </Helmet>

      <div className="page-nav-bar">
        <Link to="/" className="btn-back">
          ← Back to List
        </Link>
      </div>

      <HotelForm hotel={hotelToEdit} />
    </div>
  );
}

export default EditHotelPage;
