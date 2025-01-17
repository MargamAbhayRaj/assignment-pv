const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const { Server } = require('socket.io')
const http = require('http')
require('dotenv').config()

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

// Make io accessible in routes
app.set('io', io)

// Middleware
app.use(cors())
app.use(express.json())
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}))

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB')
}).catch(err => {
  console.error('MongoDB connection error:', err)
})

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('join_event', (eventId) => {
    socket.join(eventId)
    console.log(`User ${socket.id} joined event ${eventId}`)
  })

  socket.on('leave_event', (eventId) => {
    socket.leave(eventId)
    console.log(`User ${socket.id} left event ${eventId}`)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/events', require('./routes/events'))

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong!' })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 