const multer = require("multer");
const path = require("path");
const fs = require("fs");

// uploads folder nasel tar banav
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder
  },
  filename: function (req, file, cb) {
    // unique nav: timestamp + originalname
    cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
  },
});

const fileFilter = (req, file, cb) => {
  // fakt image allow kara
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};

module.exports = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});