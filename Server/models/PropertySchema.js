const mongoose = require("mongoose");

const propertyModel = new mongoose.Schema({
  title: { // propertyType madhun yeil
    type: String,
    required: [true, "Property title is required"]
  },
  address: {
    type: String,
    required: [true, "Address is required"]
  },
  description: { // additionalInfo
    type: String
  },
  price: { // propertyAmt
    type: Number,
    required: [true, "Price is required"]
  },
  type: { // propertyAdType: rent/sale
    type: String,
    enum: ['rent', 'sale'],
    required: [true, "Property type is required"]
  },
  contact: { // ownerContact - NEW ADD
    type: String
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  images: [String], // propertyImage
  amenities: [String],

  // 👇 HE NAVIN ADD KAR
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending' // owner add kelyavar pending rahil. Admin approve karel
  }

},{
  timestamps: true,
  strict: false
});

module.exports = mongoose.model("Property", propertyModel);