import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./App.css";
import HotelListPage from "./pages/HotelListPage";
import AddHotelPage from "./pages/AddHotelPage";
import EditHotelPage from "./pages/EditHotelPage";
import HotelDetailPage from "./pages/HotelDetailPage";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <div className="header-container">
            <div className="header-brand-group">
              <Link to="/" className="brand-link">
                <span className="brand-text">Namlatic</span>
              </Link>
            </div>

            <div className="header-nav-group">
              <Link to="/add" className="btn-header-add">
                + Add Hotel
              </Link>
            </div>
          </div>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<HotelListPage />} />
            <Route path="/add" element={<AddHotelPage />} />
            <Route path="/edit/:id" element={<EditHotelPage />} />
            <Route path="/hotel/:id" element={<HotelDetailPage />} />
            <Route
              path="*"
              element={
                <div className="not-found-page">
                  <Helmet>
                    <title>Page Not Found</title>
                    <meta
                      name="description"
                      content="The requested hotel page could not be found."
                    />
                  </Helmet>
                  <h2>Page not found.</h2>
                  <p>The page you are looking for does not exist.</p>
                  <Link to="/" className="btn-back">
                    ← Back to Hotel Listings
                  </Link>
                </div>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
