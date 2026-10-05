# Namlatic — Hotel Management Application

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

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [PostgreSQL](https://www.postgresql.org/download/) (v14 or later)

---

## Getting Started

### 1. Database Setup

1. Open **pgAdmin** or **psql** and connect to your PostgreSQL server.
2. Create the database user:
   ```sql
   CREATE USER hotel_admin WITH PASSWORD 'hotel_secure_password';
   ```
3. Create the database:
   ```sql
   CREATE DATABASE hotel_db OWNER hotel_admin;
   ```
4. Run the seed file to create the `hotels` table and insert 12 initial hotel records:
   ```bash
   psql -U hotel_admin -d hotel_db -f hotel-backend/database.sql
   ```

---

### 2. Backend Setup & Run

1. Navigate to the `hotel-backend` directory:
   ```bash
   cd hotel-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. *(Optional)* Copy `.env.example` to `.env` and adjust values if your PostgreSQL setup differs from the defaults:
   ```bash
   cp .env.example .env
   ```
4. Start the backend server:
   ```bash
   npm start
   ```
5. The backend server will run at: `http://localhost:5000`

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
| `GET` | `/api/hotels/:id` | Get a single hotel by ID |
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
