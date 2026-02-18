const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const serviceController = require("../controllers/serviceController");

// ---------- Multer Config (temporary local storage) ----------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads";
    // create folder if not exist
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
router.get("/", serviceController.getServices);
router.post("/", upload.single("image"), serviceController.createService);
router.put("/:id", upload.single("image"), serviceController.updateService);  // ✏️ EDIT
router.delete("/:id", serviceController.deleteService); // 🗑 DELETE

// ---------- Routes ----------
router.get("/", serviceController.getServices);

// Add service (image upload)
router.post("/", upload.single("image"), serviceController.createService);

// Delete service
router.delete("/:id", serviceController.deleteService);

module.exports = router;
