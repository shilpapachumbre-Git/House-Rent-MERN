const mongoose = require("mongoose");

const userModel = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    set: function (value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minlength: 6
  },
  role: { 
    type: String,
    enum: ['admin', 'owner', 'renter'], // <-- "user" kadhun takla
    required: [true, "role is required"]
    // default kadhun takla
  },
  isGranted: { // owner approve sathi
    type: Boolean,
    default: false
  }
},{
  timestamps: true,
  strict: false
});

const userSchema = mongoose.model("User", userModel);
module.exports = userSchema;