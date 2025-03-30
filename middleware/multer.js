// multerConfig.js

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "storage";

    // Check if the folder exists, if not create it (including parent directories)
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true }); // Create folder (recursive to create parent dirs if they don't exist)
    }

    // Set the final destination folder
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using timestamp
    cb(null, Date.now() + path.extname(file.originalname)); // Example: 1634878381281.jpg
  },
});

// Multer file filter to validate file type (only allow images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Invalid file type, only JPEG, PNG are allowed."));
  }
  cb(null, true);
};

// Multer setup (with storage and fileFilter options)
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
  fileFilter,
});

module.exports = upload;
