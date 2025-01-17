import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

function Login({ setUser }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        localStorage.setItem('token', data.token)
        setUser(data.user)
        navigate('/dashboard')
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to login. Please try again.')
    }
  }

  const handleGuestLogin = () => {
    setUser({ name: 'Guest User', email: 'guest@example.com', role: 'guest' })
    navigate('/dashboard')
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="login-btn">
          Login
        </button>
        <button
          type="button"
          onClick={handleGuestLogin}
          className="guest-login-btn"
        >
          Continue as Guest
        </button>
      </form>
    </div>
  )
}

export default Login 