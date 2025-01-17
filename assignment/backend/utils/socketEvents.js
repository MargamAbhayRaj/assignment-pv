const emitEventUpdate = (io, event, type) => {
  // Emit to all connected clients
  io.emit(`event_${type}`, event)
  
  // Emit to event room if it's an attendance update
  if (type === 'attendance') {
    io.to(event._id.toString()).emit('attendance_updated', {
      eventId: event._id,
      attendeeCount: event.attendees.length
    })
  }
}

module.exports = {
  emitEventUpdate
} 