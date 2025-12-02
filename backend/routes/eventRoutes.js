const express = require('express');
const router = express.Router();
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');

const { protect } = require('../middleware/authMiddleware');

// ✅ Event CRUD Routes (protected)
router.route('/')
  .get(protect, getEvents)     // Get all events (only for logged-in users)
  .post(protect, createEvent); // Create new event

router.route('/:id')
  .put(protect, updateEvent)   // Update event by ID
  .delete(protect, deleteEvent); // Delete event by ID

// ✅ No AI route here — AI routes are handled separately in aiRoutes.js

module.exports = router;

