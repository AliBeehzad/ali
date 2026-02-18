const Service = require("../models/Service");
const cloudinary = require("../config/cloudinaryConfig"); // your Cloudinary config
const multer = require("multer");

// ================= CREATE SERVICE =================
exports.createService = async (req, res) => {
  try {
    const { title, slug, description } = req.body;

    if (!title || !slug || !description || !req.file) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check duplicate slug
    const existing = await Service.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: "Slug already exists" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "services",
    });

    const newService = new Service({
      title,
      slug,
      description,
      image: result.secure_url, // Save Cloudinary URL
    });

    await newService.save();

    res.status(201).json({
      message: "Service created successfully",
      service: newService,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create service" });
  }
};

// ================= GET ALL SERVICES =================
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

// ================= DELETE SERVICE =================
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await Service.findByIdAndDelete(id);
    res.json({ message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete service" });
  }
};
/* ================= UPDATE SERVICE ================= */
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, description } = req.body;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // If a new image is uploaded → upload to cloudinary
    if (req.file) {
      const cloudinary = require("../config/cloudinaryConfig");

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "straterra/services",
      });

      service.image = result.secure_url;
    }

    service.title = title || service.title;
    service.slug = slug || service.slug;
    service.description = description || service.description;

    await service.save();

    res.json({
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update service" });
  }
};
