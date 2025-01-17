const express = require('express')
const router = express.Router()
const Event = require('../models/Event')
const auth = require('../middleware/auth')
const { uploadImage } = require('../utils/cloudinary')

// Get events with filters and search
router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      category, 
      status,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = req.query

    const query = {}

    // Search
    if (search) {
      query.$text = { $search: search }
    }

    // Category filter
    if (category) {
      query.category = category
    }

    // Status filter
    if (status) {
      query.status = status
    }

    // Date range filter
    if (startDate || endDate) {
      query.date = {}
      if (startDate) query.date.$gte = new Date(startDate)
      if (endDate) query.date.$lte = new Date(endDate)
    }

    // Pagination
    const skip = (page - 1) * limit

    const events = await Event.find(query)
      .populate('creator', 'name')
      .sort({ date: 1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Event.countDocuments(query)

    res.json({
      events,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalEvents: total
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

// Create event
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, date, time, location, category } = req.body
    let imageUrl = null

    if (req.files && req.files.image) {
      imageUrl = await uploadImage(req.files.image)
    }

    const event = new Event({
      name,
      description,
      date,
      time,
      location,
      category,
      image: imageUrl,
      creator: req.user.id
    })

    await event.save()
    
    // Emit event creation to all connected clients
    req.app.get('io').emit('event_created', event)
    
    res.json(event)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('creator', 'name')
      .populate('attendees', 'name')
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    
    res.json(event)
  } catch (err) {
    res.status(500).send('Server error')
  }
})

// Update event
router.put('/:id', auth, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id)
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    
    // Check user
    if (event.creator.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' })
    }
    
    event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
    
    // Emit event update to all connected clients
    req.app.get('io').emit('event_updated', event)
    
    res.json(event)
  } catch (err) {
    res.status(500).send('Server error')
  }
})

// Delete event
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    
    // Check user
    if (event.creator.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' })
    }
    
    await event.remove()
    
    // Emit event deletion to all connected clients
    req.app.get('io').emit('event_deleted', req.params.id)
    
    res.json({ message: 'Event removed' })
  } catch (err) {
    res.status(500).send('Server error')
  }
})

// Attend event
router.post('/:id/attend', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    
    // Check if user is already attending
    if (event.attendees.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already attending this event' })
    }
    
    event.attendees.push(req.user.id)
    await event.save()
    
    // Emit attendance update to event room
    req.app.get('io').to(req.params.id).emit('attendance_updated', {
      eventId: req.params.id,
      attendeeCount: event.attendees.length
    })
    
    res.json(event)
  } catch (err) {
    res.status(500).send('Server error')
  }
})

module.exports = router 