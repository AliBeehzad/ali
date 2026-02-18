const Project = require("../models/Project");
const cloudinary = require("../config/cloudinaryConfig");

/* GET ALL PROJECTS */
exports.getProjects = async (req, res) => {
try {
const projects = await Project.find().sort({ createdAt: -1 });
res.json(projects);
} catch {
res.status(500).json({ message: "Failed to fetch projects" });
}
};

/* ADD PROJECT */
exports.createProject = async (req, res) => {
try {
const { title, location, category, description } = req.body;

```
if (!req.file) {
  return res.status(400).json({ message: "Image required" });
}

// upload to cloudinary
const result = await cloudinary.uploader.upload(req.file.path, {
  folder: "straterra-projects",
});

const newProject = new Project({
  title,
  location,
  category,
  description,
  image: result.secure_url,
});

await newProject.save();
res.status(201).json(newProject);
```

} catch (err) {
console.error(err);
res.status(500).json({ message: "Failed to create project" });
}
};

/* UPDATE PROJECT */
exports.updateProject = async (req, res) => {
try {
const project = await Project.findById(req.params.id);
if (!project) return res.status(404).json({ message: "Not found" });

```
let imageUrl = project.image;

if (req.file) {
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "straterra-projects",
  });
  imageUrl = result.secure_url;
}

project.title = req.body.title;
project.location = req.body.location;
project.category = req.body.category;
project.description = req.body.description;
project.image = imageUrl;

await project.save();
res.json(project);
```

} catch {
res.status(500).json({ message: "Failed to update project" });
}
};

/* DELETE PROJECT */
exports.deleteProject = async (req, res) => {
try {
await Project.findByIdAndDelete(req.params.id);
res.json({ message: "Project deleted" });
} catch {
res.status(500).json({ message: "Failed to delete project" });
}
};
