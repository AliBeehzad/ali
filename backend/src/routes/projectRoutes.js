const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
getProjects,
createProject,
updateProject,
deleteProject,
} = require("../controllers/projectController");

router.get("/", getProjects);
router.post("/", upload.single("image"), createProject);
router.put("/:id", upload.single("image"), updateProject);
router.delete("/:id", deleteProject);

module.exports = router;
