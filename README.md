# HotelHub — Hotel Management Application

A full-stack Hotel Management web application allowing users to view, search, filter, paginate, add, edit, and delete hotel listings with coordinates and interactive maps.

---

## Technology Stack

### Frontend
- **Framework:** React (Create React App)
- **State Management:** Redux Toolkit & React-Redux
- **Routing:** React Router v7
- **Styling:** Vanilla CSS (responsive, clean, professional)
- **Metadata / SEO:** React Helmet
- **Geolocation:** Native Browser Geolocation API
- **Map:** Embedded OpenStreetMap

### Backend
- **Runtime:** Node.js & Express
- **Database:** PostgreSQL (with native `pg` client pool and parameterized queries)
- **Image Uploads:** Multer (local disk storage in `uploads/`)
- **CORS:** Enabled for local frontend access (`cors`)
- **Environment:** Configured via `.env` (`dotenv`)

---

## Getting Started

No personal `.env` file is required for the default local setup. All default connection values (`host: localhost`, `port: 5433`, `user: hotel_admin`, `password: hotel_secure_password`, `database: hotel_db`) are pre-configured. TAEF is completely independent and is NOT required.

### 1. Database Setup (Docker PostgreSQL)

Hotel Listing uses a dedicated Docker container named `hotel-postgres` running on host port **5433** (internally mapped to PostgreSQL port `5432`).

1. Ensure Docker Desktop is running.
2. In the project root, start the PostgreSQL container:
   ```bash
   docker compose up -d
   ```
   *(This starts `hotel-postgres` on port `5433` with database `hotel_db` and persistent volume `hotel-postgres-data`. On a fresh Docker volume, `hotel-backend/database.sql` automatically creates the `hotel_db` database, `hotels` table, constraints, and seeds the 6 initial hotel records).*

---

### 2. Backend Setup & Run

1. Navigate to the `hotel-backend` directory:
   ```bash
   cd hotel-backend
   ```
2. Install dependencies and start the backend:
   ```bash
   npm install
   npm start
   ```
3. The backend server will run at: `http://localhost:5000`

*(Optional: To customize ports or credentials, copy `.env.example` to `.env` in `hotel-backend` and root, and adjust as desired).*

---

### 3. Frontend Setup & Run

1. Open a new terminal and navigate to `hotel-frontend`:
   ```bash
   cd hotel-frontend
   ```
2. Install dependencies and start the React development server:
   ```bash
   npm install
   npm start
   ```
3. The frontend application will open at: `http://localhost:3000`

---

## Main API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check endpoint returning `{ status: "ok" }` |
| `GET` | `/api/hotels` | List hotels with optional query filters (`title`, `minPrice`, `maxPrice`, `offset`, `limit`) |
| `POST` | `/api/hotels` | Create a new hotel with multipart/form-data (including image file upload) |
| `PUT` | `/api/hotels/:id` | Update hotel fields with optional new image file replacement |
| `DELETE` | `/api/hotels/:id` | Delete a hotel by ID and remove its local image from disk |

---

## Features

- **Hotel Listings:** Displays cards with title, price, description, and location coordinates.
- **Search & Filters:** Real-time title search and price range filters with client validation.
- **Server Pagination:** 3 hotels per page with previous/next and dynamic page numbers.
- **Add & Edit Hotels:** Reusable form supporting text inputs, coordinate validation, image previews, and file uploads.
- **Delete Hotel:** Delete with browser confirmation dialog, automatic pagination adjustment, and error handling.
- **Detail View & Map:** Dedicated view for each hotel featuring an embedded OpenStreetMap and current visitor geolocation status.
