const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
require("dotenv").config();

const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use("/uploads", express.static(uploadsDir));

// Multer storage for image uploads

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

// Delete local image file if it exists
function deleteFileIfExists(filePath) {
  if (!filePath) return;
  try {
    const filename = path.basename(filePath);
    const fullPath = path.join(uploadsDir, filename);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (err) {
    console.error("Failed to delete file:", err.message);
  }
}

// Validate hotel input fields
function validateHotelFields(body, isImageRequired, file) {
  const { title, description, latitude, longitude, price } = body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return "Title is required.";
  }

  if (!description || typeof description !== "string" || !description.trim()) {
    return "Description is required.";
  }

  if (latitude === undefined || latitude === null || latitude === "") {
    return "Latitude is required.";
  }
  const latNum = Number(latitude);
  if (isNaN(latNum) || latNum < -90 || latNum > 90) {
    return "Latitude must be a number between -90 and 90.";
  }

  if (longitude === undefined || longitude === null || longitude === "") {
    return "Longitude is required.";
  }
  const lngNum = Number(longitude);
  if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
    return "Longitude must be a number between -180 and 180.";
  }

  if (price === undefined || price === null || price === "") {
    return "Price is required.";
  }
  const priceNum = Number(price);
  if (isNaN(priceNum) || priceNum <= 0) {
    return "Price must be a number greater than 0.";
  }

  if (isImageRequired && !file) {
    return "Image is required.";
  }

  return null;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Create hotel
app.post("/api/hotels", upload.single("image"), async (req, res) => {
  const validationError = validateHotelFields(req.body, true, req.file);

  if (validationError) {
    // If a file was uploaded before validation failed, clean it up
    if (req.file) {
      deleteFileIfExists(req.file.path);
    }
    return res.status(400).json({ error: validationError });
  }

  const { title, description, latitude, longitude, price } = req.body;
  const imagePath = `/uploads/${req.file.filename}`;

  try {
    const query = `
      INSERT INTO hotels (title, description, latitude, longitude, price, image)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [
      title.trim(),
      description.trim(),
      Number(latitude),
      Number(longitude),
      Number(price),
      imagePath,
    ];

    const result = await pool.query(query, values);
    const createdHotel = result.rows[0];

    return res.status(201).json(createdHotel);
  } catch (err) {
    // If DB insert fails, remove the newly uploaded file
    if (req.file) {
      deleteFileIfExists(req.file.path);
    }
    console.error("Error creating hotel:", err.message);
    return res.status(500).json({ error: "Failed to create hotel." });
  }
});

// Get hotels with filters and pagination
app.get("/api/hotels", async (req, res) => {
  try {
    const { title, minPrice, maxPrice, offset = 0, limit = 10 } = req.query;

    const offsetNum = Math.max(0, parseInt(offset, 10) || 0);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));

    // Dynamic WHERE conditions with parameterized indices
    const conditions = [];
    const values = [];

    if (title && typeof title === "string" && title.trim()) {
      values.push(`%${title.trim()}%`);
      conditions.push(`title ILIKE $${values.length}`);
    }

    if (minPrice !== undefined && minPrice !== "") {
      const minNum = Number(minPrice);
      if (!isNaN(minNum)) {
        values.push(minNum);
        conditions.push(`price >= $${values.length}`);
      }
    }

    if (maxPrice !== undefined && maxPrice !== "") {
      const maxNum = Number(maxPrice);
      if (!isNaN(maxNum)) {
        values.push(maxNum);
        conditions.push(`price <= $${values.length}`);
      }
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Total count query
    const countQuery = `SELECT COUNT(*) AS total FROM hotels ${whereClause};`;
    const countResult = await pool.query(countQuery, values);
    const totalCount = parseInt(countResult.rows[0].total, 10);

    // Data query with ordering, limit, and offset
    const dataValues = [...values, limitNum, offsetNum];
    const dataQuery = `
      SELECT * FROM hotels
      ${whereClause}
      ORDER BY id ASC
      LIMIT $${dataValues.length - 1} OFFSET $${dataValues.length};
    `;
    const dataResult = await pool.query(dataQuery, dataValues);

    return res.json({
      hotels: dataResult.rows,
      totalCount: totalCount,
      limit: limitNum,
      offset: offsetNum,
    });
  } catch (err) {
    console.error("Error fetching hotels:", err.message);
    return res.status(500).json({ error: "Failed to fetch hotels." });
  }
});

// Get single hotel by ID
app.get("/api/hotels/:id", async (req, res) => {
  const hotelId = Number(req.params.id);

  if (isNaN(hotelId)) {
    return res.status(400).json({ error: "Invalid hotel ID." });
  }

  try {
    const result = await pool.query("SELECT * FROM hotels WHERE id = $1;", [hotelId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Hotel not found." });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching hotel:", err.message);
    return res.status(500).json({ error: "Failed to fetch hotel." });
  }
});

// Update hotel
app.put("/api/hotels/:id", upload.single("image"), async (req, res) => {
  const hotelId = Number(req.params.id);

  if (isNaN(hotelId)) {
    if (req.file) deleteFileIfExists(req.file.path);
    return res.status(400).json({ error: "Invalid hotel ID." });
  }

  try {
    const findResult = await pool.query("SELECT * FROM hotels WHERE id = $1;", [hotelId]);
    if (findResult.rows.length === 0) {
      if (req.file) deleteFileIfExists(req.file.path);
      return res.status(404).json({ error: "Hotel not found." });
    }

    const existingHotel = findResult.rows[0];

    const validationError = validateHotelFields(req.body, false, req.file);
    if (validationError) {
      if (req.file) deleteFileIfExists(req.file.path);
      return res.status(400).json({ error: validationError });
    }

    const { title, description, latitude, longitude, price } = req.body;

    let imagePath = existingHotel.image;
    let oldImageToDelete = null;

    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
      // Mark old local image for deletion if it exists in /uploads/
      if (existingHotel.image && existingHotel.image.startsWith("/uploads/")) {
        oldImageToDelete = existingHotel.image;
      }
    }

    const updateQuery = `
      UPDATE hotels
      SET title = $1, description = $2, latitude = $3, longitude = $4, price = $5, image = $6
      WHERE id = $7
      RETURNING *;
    `;
    const updateValues = [
      title.trim(),
      description.trim(),
      Number(latitude),
      Number(longitude),
      Number(price),
      imagePath,
      hotelId,
    ];

    const updateResult = await pool.query(updateQuery, updateValues);
    const updatedHotel = updateResult.rows[0];

    // Remove replaced image from disk
    if (oldImageToDelete) {
      deleteFileIfExists(oldImageToDelete);
    }

    return res.json(updatedHotel);
  } catch (err) {
    // If update fails, delete new uploaded file
    if (req.file) deleteFileIfExists(req.file.path);
    console.error("Error updating hotel:", err.message);
    return res.status(500).json({ error: "Failed to update hotel." });
  }
});

// Delete hotel
app.delete("/api/hotels/:id", async (req, res) => {
  const hotelId = Number(req.params.id);

  if (isNaN(hotelId)) {
    return res.status(400).json({ error: "Invalid hotel ID." });
  }

  try {
    const findResult = await pool.query("SELECT * FROM hotels WHERE id = $1;", [hotelId]);
    if (findResult.rows.length === 0) {
      return res.status(404).json({ error: "Hotel not found." });
    }

    const hotel = findResult.rows[0];

    await pool.query("DELETE FROM hotels WHERE id = $1;", [hotelId]);

    // Remove deleted hotel's image from disk if local
    if (hotel.image && hotel.image.startsWith("/uploads/")) {
      deleteFileIfExists(hotel.image);
    }

    return res.json({
      message: "Hotel deleted successfully",
      id: hotelId,
    });
  } catch (err) {
    console.error("Error deleting hotel:", err.message);
    return res.status(500).json({ error: "Failed to delete hotel." });
  }
});

app.listen(PORT, () => {
  console.log(`Hotel backend server is running on http://localhost:${PORT}`);
});

module.exports = app;
