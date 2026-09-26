import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import HotelForm from "../components/HotelForm";

function AddHotelPage() {
  return (
    <div className="add-hotel-page">
      <Helmet>
        <title>Add Hotel</title>
        <meta
          name="description"
          content="Add a new hotel listing with image, coordinates, and pricing details."
        />
      </Helmet>

      <div className="page-nav-bar">
        <Link to="/" className="btn-back">
          ← Back to List
        </Link>
      </div>

      <HotelForm />
    </div>
  );
}

export default AddHotelPage;
