const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 62
  },
  description: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['rent', 'sale'],
    default: 'rent'
  },
  bedrooms: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  regularPrice: {
    type: Number,
    required: true,
    min: 50
  },
  discountPrice: {
    type: Number,
    default: 0
  },
  offer: {
    type: Boolean,
    default: false
  },
  parking: {
    type: Boolean,
    default: false
  },
  furnished: {
    type: Boolean,
    default: false
  },
  imageUrls: {
    type: [String],
    required: true
  },
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false 
  }
}, { timestamps: true });

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;