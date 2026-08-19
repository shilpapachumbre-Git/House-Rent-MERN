const multer = require("multer");
const cloudinary = require("../config/cloudinary"); // config/cloudinary.js file pahije
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// 1. Cloudinary Storage banavla - ata uploads folder chi garaj nahi
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "house-rent-properties", // Cloudinary madhe ha folder banvel
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    public_id: (req, file) => Date.now() + "-" + file.originalname.replace(/\s/g, ""),
  },
});

// 2. Image filter - same
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};

// 3. Multer export
module.exports = multer({ 
  storage: storage, // ata diskStorage nahi
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});