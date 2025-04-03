require("dotenv").config();
const cloudinary = require("cloudinary").v2;

// 🔹 Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 🔹 Test Upload
cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/a3/June_odd-eyed-cat.jpg")
  .then(result => {
    console.log("✅ Cloudinary Upload Success:", result.secure_url);
  })
  .catch(error => {
    console.error("❌ Cloudinary Upload Failed:", error);
  });
