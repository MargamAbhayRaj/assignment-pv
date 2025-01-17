import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to EventHub</h1>
        <p>Create, manage, and discover amazing events</p>
        <div className="cta-buttons">
          <Link to="/register" className="cta-button primary">
            Get Started
          </Link>
          <Link to="/login" className="cta-button secondary">
            Sign In
          </Link>
        </div>
      </div>
      
      <section className="features">
        <h2>Platform Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Create Events</h3>
            <p>Easily create and manage your events with our intuitive tools</p>
          </div>
          <div className="feature-card">
            <h3>Real-time Updates</h3>
            <p>Get instant updates on event attendance and changes</p>
          </div>
          <div className="feature-card">
            <h3>Track Attendance</h3>
            <p>Monitor and manage your event's attendance in real-time</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home 