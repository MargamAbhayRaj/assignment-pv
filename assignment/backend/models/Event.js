const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['conference', 'workshop', 'social', 'other'],
    index: true
  },
  image: {
    type: String
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  maxAttendees: {
    type: Number,
    default: null
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming',
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

eventSchema.index({ name: 'text', description: 'text' })

eventSchema.virtual('isFull').get(function() {
  if (!this.maxAttendees) return false
  return this.attendees.length >= this.maxAttendees
})

eventSchema.pre('save', function(next) {
  const now = new Date()
  if (this.date < now) {
    this.status = 'completed'
  }
  next()
})

module.exports = mongoose.model('Event', eventSchema) 