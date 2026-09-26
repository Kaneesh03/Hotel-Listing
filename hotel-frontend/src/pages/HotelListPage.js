import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import "./HotelListPage.css";
import HotelCard from "../components/HotelCard";
import Pagination from "../components/Pagination";
import { setHotels } from "../store/hotelSlice";

// Show 3 hotels per page so pagination is visible
const ITEMS_PER_PAGE = 3;

function HotelListPage() {
  const dispatch = useDispatch();

  const hotels = useSelector(function(state) {
    return state.hotels.hotels;
  });

  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [searchText, setSearchText] = useState("");
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [priceError, setPriceError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  useEffect(function() {
    async function fetchHotels() {
      setLoading(true);
      setFetchError("");

      try {
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        const params = new URLSearchParams();

        if (searchText.trim() !== "") {
          params.append("title", searchText.trim());
        }

        if (minPrice !== "") {
          params.append("minPrice", minPrice);
        }

        if (maxPrice !== "") {
          params.append("maxPrice", maxPrice);
        }

        params.append("offset", offset);
        params.append("limit", ITEMS_PER_PAGE);

        const url = "http://localhost:5000/api/hotels?" + params.toString();
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch hotels");
        }

        const data = await response.json();

        // Prepend backend URL for locally uploaded image paths
        const formattedHotels = data.hotels.map(function(hotel) {
          if (hotel.image && hotel.image.startsWith("/uploads/")) {
            return {
              ...hotel,
              image: "http://localhost:5000" + hotel.image,
            };
          }
          return hotel;
        });

        dispatch(setHotels(formattedHotels));
        setTotalCount(data.totalCount);
        setLoading(false);
      } catch (error) {
        dispatch(setHotels([]));
        setTotalCount(0);
        setFetchError("Unable to load hotels.");
        setLoading(false);
      }
    }

    fetchHotels();
  }, [searchText, minPrice, maxPrice, currentPage, refreshTrigger, dispatch]);

  useEffect(function() {
    if (deleteMessage) {
      const timer = setTimeout(function() {
        setDeleteMessage("");
      }, 4000);
      return function() {
        clearTimeout(timer);
      };
    }
  }, [deleteMessage]);

  useEffect(function() {
    if (deleteError) {
      const timer = setTimeout(function() {
        setDeleteError("");
      }, 4000);
      return function() {
        clearTimeout(timer);
      };
    }
  }, [deleteError]);

  useEffect(function() {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // Delete hotel by ID
  async function handleDeleteHotel(id) {
    const isConfirmed = window.confirm("Are you sure you want to delete this hotel?");
    if (!isConfirmed) {
      return;
    }

    setDeletingId(id);
    setDeleteError("");
    setDeleteMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/hotels/" + id, {
        method: "DELETE",
      });

      if (!response.ok) {
        let errorMessage = "Unable to delete hotel.";
        try {
          const data = await response.json();
          if (data && data.error) {
            errorMessage = data.error;
          }
        } catch (parseError) {
          /* Keep default errorMessage */
        }

        setDeleteError(errorMessage);
        setDeletingId(null);
        return;
      }

      setDeleteMessage("Hotel deleted successfully.");

      if (hotels.length === 1 && currentPage > 1) {
        setCurrentPage(function(prevPage) {
          return prevPage - 1;
        });
      } else {
        setRefreshTrigger(function(prev) {
          return prev + 1;
        });
      }
    } catch (error) {
      setDeleteError("Unable to delete hotel.");
    } finally {
      setDeletingId(null);
    }
  }

  function handleSearchChange(event) {
    setSearchText(event.target.value);
    setCurrentPage(1);
  }

  function handleApplyFilter() {
    const min = minPriceInput;
    const max = maxPriceInput;

    if (min !== "" && Number(min) < 0) {
      setPriceError("Minimum price cannot be negative.");
      return;
    }
    if (max !== "" && Number(max) < 0) {
      setPriceError("Maximum price cannot be negative.");
      return;
    }
    if (min !== "" && max !== "" && Number(min) > Number(max)) {
      setPriceError("Minimum price cannot be greater than maximum price.");
      return;
    }

    setPriceError("");
    setMinPrice(min);
    setMaxPrice(max);
    setCurrentPage(1);
  }

  function handleClear() {
    setSearchText("");
    setMinPriceInput("");
    setMaxPriceInput("");
    setMinPrice("");
    setMaxPrice("");
    setPriceError("");
    setCurrentPage(1);
  }

  return (
    <div className="hotel-list-page">
      <Helmet>
        <title>Hotel Listings</title>
        <meta
          name="description"
          content="Browse, filter, and search available hotels with pricing and location details."
        />
      </Helmet>

      <section className="section-banner">
        <div className="section-banner-container">
          <h1 className="section-banner-title">Hotels</h1>
        </div>
      </section>

      <div className="hotel-container">
        {deleteMessage && (
          <div className="success-banner" role="status">
            <span>{deleteMessage}</span>
            <button
              className="success-banner-close"
              onClick={function() { setDeleteMessage(""); }}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        )}

        {deleteError && (
          <div className="error-banner" role="alert">
            <span>{deleteError}</span>
            <button
              className="error-banner-close"
              onClick={function() { setDeleteError(""); }}
              aria-label="Close error notification"
            >
              ×
            </button>
          </div>
        )}

        <div className="page-content">
          <aside className="filter-sidebar" aria-label="Hotel Filters">
            <div className="filter-section">
              <h3 className="filter-section-title">Search</h3>
              <div className="filter-group">
                <label htmlFor="search-title">Hotel Name</label>
                <input
                  id="search-title"
                  type="text"
                  placeholder="Search hotels..."
                  className="filter-input"
                  value={searchText}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            <div className="filter-section">
              <h3 className="filter-section-title">Price Range</h3>
              <div className="filter-group">
                <label htmlFor="min-price">Min Price ($)</label>
                <input
                  id="min-price"
                  type="number"
                  placeholder="Min"
                  className="filter-input"
                  value={minPriceInput}
                  onChange={function(event) { setMinPriceInput(event.target.value); }}
                />
              </div>

              <div className="filter-group">
                <label htmlFor="max-price">Max Price ($)</label>
                <input
                  id="max-price"
                  type="number"
                  placeholder="Max"
                  className="filter-input"
                  value={maxPriceInput}
                  onChange={function(event) { setMaxPriceInput(event.target.value); }}
                />
              </div>

              {priceError && (
                <p className="price-error">{priceError}</p>
              )}

              <div className="filter-button-group">
                <button className="btn-filter" onClick={handleApplyFilter}>
                  Apply Filter
                </button>
                <button className="btn-clear" onClick={handleClear}>
                  Clear
                </button>
              </div>
            </div>

            <div className="filter-section filter-section-guide">
              <h3 className="filter-section-title">Listing Info</h3>
              <p className="sidebar-guide-text">
                All prices are per night in USD. Tax and service charges included at checkout.
              </p>
            </div>
          </aside>

          <section className="hotel-list-area" aria-label="Hotel Listings">
            {!loading && !fetchError && (
              <div className="results-header-bar">
                <p className="result-count">
                  <strong>{totalCount}</strong> {totalCount === 1 ? "hotel" : "hotels"} found
                </p>
              </div>
            )}

            {loading ? (
              <div className="no-results">
                <p>Loading hotels...</p>
              </div>
            ) : fetchError ? (
              <div className="no-results">
                <p>{fetchError}</p>
              </div>
            ) : totalCount === 0 ? (
              <div className="no-results">
                <p>No hotels found. Try changing your search or price range.</p>
              </div>
            ) : (
              hotels.map(function(hotel) {
                return (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    onDelete={handleDeleteHotel}
                    isDeleting={deletingId === hotel.id}
                  />
                );
              })
            )}

            {!loading && !fetchError && totalCount > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={function(newPage) { setCurrentPage(newPage); }}
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default HotelListPage;
