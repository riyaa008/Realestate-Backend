const Listing = require('../models/Listing');
const multer = require('multer');
const path = require('path');
const { errorHandler } = require('../utils/error');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(errorHandler(400, 'Only images are allowed'));
    }
  }
}).array('images', 6);

exports.createListing = async (req, res) => {
  try {
    console.log('Received data:', req.body); // Debug log

    // Validate required fields
    if (!req.body.name || !req.body.description || !req.body.address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create new listing
    const listing = new Listing({
      name: req.body.name,
      description: req.body.description,
      address: req.body.address,
      type: req.body.type,
      bedrooms: parseInt(req.body.bedrooms),
      bathrooms: parseInt(req.body.bathrooms),
      regularPrice: parseFloat(req.body.regularPrice),
      discountPrice: parseFloat(req.body.discountPrice),
      offer: req.body.offer,
      parking: req.body.parking,
      furnished: req.body.furnished,
      imageUrls: req.body.imageUrls,
      userRef: '65c9e95e8d9f4d3c1c6a1234' // Temporary user ID
    });

    const savedListing = await listing.save();
    
    res.status(201).json({
      success: true,
      data: savedListing
    });
  } catch (error) {
    console.error('Error creating listing:', error); // Debug log
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong!'
    });
  }
};

// Update a listing
exports.updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedListing
    });
  } catch (error) {
    console.error('Error updating listing:', error);
    next(error);
  }
};

// Delete a listing
exports.deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting listing:', error);
    next(error);
  }
};

// Get listing by ID
exports.getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    res.status(200).json(listing);
  } catch (error) {
    console.error('Error fetching listing:', error);
    next(error);
  }
};

// Get all listings with search functionality
exports.getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    
    const query = {};
    
    if (req.query.offer !== undefined) {
      query.offer = req.query.offer === 'true';
    }
    if (req.query.furnished !== undefined) {
      query.furnished = req.query.furnished === 'true';
    }
    if (req.query.parking !== undefined) {
      query.parking = req.query.parking === 'true';
    }
    if (req.query.type && req.query.type !== 'all') {
      query.type = req.query.type;
    }
    if (req.query.searchTerm) {
      query.name = { $regex: req.query.searchTerm, $options: 'i' };
    }

    const listings = await Listing.find(query)
      .sort({ [req.query.sort || 'createdAt']: req.query.order || 'desc' })
      .limit(limit)
      .skip(startIndex);

    // Send response in a consistent format
    res.status(200).json(listings);
  } catch (error) {
    console.error('Error in getListings:', error);
    next(error);
  }
};

// Purchase endpoint
exports.purchaseListing = async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Logic to handle purchase (e.g., update status, create order, etc.)
    listing.status = 'sold'; // Example of updating the status
    await listing.save();

    res.status(200).json({ message: 'Purchase successful' });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ message: 'Failed to process purchase' });
  }
};

// Rent endpoint
exports.rentListing = async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Logic to handle rental application (e.g., create application, etc.)
    listing.status = 'rented'; // Example of updating the status
    await listing.save();

    res.status(200).json({ message: 'Rental application successful' });
  } catch (error) {
    console.error('Rental error:', error);
    res.status(500).json({ message: 'Failed to process rental' });
  }
}; 