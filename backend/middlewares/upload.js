const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer to store images in disk (not memory)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit: 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    }
    cb(new Error("Only JPEG, JPG, and PNG images are allowed!"));
  },
});

// Middleware to compress images
const compressImage = async (req, res, next) => {
  if (!req.file) return next();

  const compressedImagePath = `${req.file.path}-compressed.jpg`;

  try {
    await sharp(req.file.path)
      .resize(800) // Resize width to 800px
      .jpeg({ quality: 70 }) // Compress to 70% quality
      .toFile(compressedImagePath);

    // Delete the original file after compression
    fs.unlinkSync(req.file.path);
    req.file.path = compressedImagePath;

    next();
  } catch (error) {
    console.error("Image compression error:", error);
    return res.status(500).json({ error: "Image compression failed!" });
  }
};

module.exports = { upload, compressImage };
