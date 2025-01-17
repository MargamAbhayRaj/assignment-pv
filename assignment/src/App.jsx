import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import EventDashboard from './pages/EventDashboard'
import CreateEvent from './pages/CreateEvent'
import EventDetails from './pages/EventDetails'
import './App.css'

function App() {
  const [user, setUser] = useState(null)

  return (
    <Router>
      <div className="app">
        <Navbar user={user} setUser={setUser} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/dashboard" element={<EventDashboard user={user} />} />
            <Route path="/create-event" element={<CreateEvent user={user} />} />
            <Route path="/event/:id" element={<EventDetails user={user} />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
