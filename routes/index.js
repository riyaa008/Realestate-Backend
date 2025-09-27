const express = require('express');
const router = express.Router();
const formRoutes = require('./formController'); // Import the new controller

router.use('/api', formRoutes); // Use the new routes

module.exports = router; 