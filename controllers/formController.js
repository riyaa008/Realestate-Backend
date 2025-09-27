const express = require('express');
const router = express.Router();

// Handle form submission
router.post('/submit', async (req, res) => {
  const { name, phone, listingId } = req.body;
  console.log("Received submission:", req.body); // Debugging log
  // Here you can add logic to save the data to the database
  res.status(201).json({ success: true, message: 'Data submitted successfully' });
});

module.exports = router; 