const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const { protect } = require('../middleware/authMiddleware'); // Import the middleware

// Get all listings
router.get('/', listingController.getListings);

// Get single listing
router.get('/:id', listingController.getListing);

// Create listing route
router.post('/', listingController.createListing);

// Update listing
router.put('/:id', listingController.updateListing);

// Delete listing
router.delete('/:id', listingController.deleteListing);

// Protect the purchase route
router.post('/purchase/:id', protect, listingController.purchaseListing);

// Rent listing
router.post('/rent/:id', protect, listingController.rentListing);

module.exports = router;