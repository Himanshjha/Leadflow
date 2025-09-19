const express = require('express');
const protect = require('../middlewares/authMiddleware');
const {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead
} = require('../controllers/leadController');

const router = express.Router();

// Create Lead
router.post('/', protect, createLead);

// Get Leads with pagination & filters
router.get('/', protect, getLeads);

// Get single Lead
router.get('/:id', protect, getLead);

// Update Lead
router.put('/:id', protect, updateLead);

// Delete Lead
router.delete('/:id', protect, deleteLead);

module.exports = router;
