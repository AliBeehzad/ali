const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const connectDB = require("./config/db");
const serviceRoutes = require("./src/routes/serviceRoutes");
const projectRoutes = require("./src/routes/projectRoutes");

const app = express();

// Connect MongoDB
connectDB();

/* =======================
   MIDDLEWARE
======================= */

// Allow Next.js frontend (localhost:3000) to talk to backend
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json());

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Serve images from public folder
app.use("/uploads", express.static(path.join(__dirname, "public")));

/* =======================
   ROUTES
======================= */

// Services API
app.use("/api/services", serviceRoutes);
app.use("/api/projects", projectRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Straterra Backend API is running 🚀");
});

/* =======================
   SERVER
======================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
