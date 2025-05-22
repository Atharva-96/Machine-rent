const express = require("express");
const { upload, compressImage } = require("../middlewares/upload");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const router = express.Router();

// Upload Image Route
router.post("/", upload.single("image"), compressImage, async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "No image provided!" });
    }

    // Upload compressed image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "machine-rent", // Optional folder
    });

    // Delete local compressed image after upload
    fs.unlinkSync(req.file.path);

    return res.status(200).json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ error: "Image upload failed!" });
  }
});

module.exports = router;
