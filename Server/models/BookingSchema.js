const mongoose = require("mongoose");

const bookingModel = new mongoose.Schema(
  {
    propertyId: { // <- Report: property
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userId: { // <- Report: user
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    userName: {
      type: String,
      required: [true, "Please provide a User Name"],
    },
    phone: {
      type: String,
      required: [true, "Please provide a Phone Number"],
    },
    startDate: { // <- Report: dates
      type: Date,
      required: true
    },
    endDate: { // <- Report: dates
      type: Date,
      required: true
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'approved', 'cancelled', 'completed'],
      default: 'pending',
      required: [true, "Please provide booking status"],
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

const bookingSchema = mongoose.model("Booking", bookingModel);
module.exports = bookingSchema;