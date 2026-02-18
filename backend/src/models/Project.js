const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
{
title: { type: String, required: true },
location: { type: String, required: true },
category: { type: String, required: true },
description: { type: String, required: true },
image: { type: String, required: true }, // Cloudinary URL
},
{ timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
