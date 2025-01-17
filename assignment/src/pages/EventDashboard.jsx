import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './EventDashboard.css'

function EventDashboard({ user }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, upcoming, past
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/events', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const data = await response.json()
      setEvents(data)
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch events:', err)
      setLoading(false)
    }
  }

  const filterEvents = () => {
    let filteredEvents = [...events]
    const now = new Date()

    if (filter === 'upcoming') {
      filteredEvents = filteredEvents.filter(
        event => new Date(event.date) > now
      )
    } else if (filter === 'past') {
      filteredEvents = filteredEvents.filter(
        event => new Date(event.date) < now
      )
    }

    if (categoryFilter !== 'all') {
      filteredEvents = filteredEvents.filter(
        event => event.category === categoryFilter
      )
    }

    return filteredEvents
  }

  if (loading) {
    return <div className="loading">Loading events...</div>
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Events Dashboard</h2>
        <Link to="/create-event" className="create-event-btn">
          Create Event
        </Link>
      </div>

      <div className="filters">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Events</option>
          <option value="upcoming">Upcoming Events</option>
          <option value="past">Past Events</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          <option value="conference">Conference</option>
          <option value="workshop">Workshop</option>
          <option value="social">Social</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="events-grid">
        {filterEvents().map((event) => (
          <div key={event._id} className="event-card">
            <img
              src={event.image || 'default-event-image.jpg'}
              alt={event.name}
              className="event-image"
            />
            <div className="event-details">
              <h3>{event.name}</h3>
              <p>{new Date(event.date).toLocaleDateString()}</p>
              <p>{event.attendees?.length || 0} attendees</p>
              <Link to={`/event/${event._id}`} className="view-event-btn">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EventDashboard 