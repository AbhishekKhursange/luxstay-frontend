import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { authApi } from '../api/authApi'
import { getErrorMsg } from '../utils/errorUtils'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '', email: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      await authApi.register(form)
      setSuccess('Account created successfully! Redirecting to login...')
      setTimeout(() => navigate('/login', { state: { from: location.state?.from } }), 1800)
    } catch (err) {
      setError(getErrorMsg(err, 'Registration failed. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        <div className="auth-brand mb-1">LuxStay</div>
        <p className="auth-subtitle mb-4">Create your account and start exploring</p>

        {error && (
          <div className="alert-lux-danger mb-4">
            <i className="bi bi-exclamation-triangle me-2" />{error}
          </div>
        )}
        {success && (
          <div className="alert-lux-success mb-4">
            <i className="bi bi-check-circle me-2" />{success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label-lux">Username</label>
            <input
              className="form-control-lux mt-1"
              type="text"
              name="username"
              placeholder="Choose a username"
              value={form.username}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="mb-3">
            <label className="form-label-lux">Password</label>
            <input
              className="form-control-lux mt-1"
              type="password"
              name="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label-lux">Email Address</label>
            <input
              className="form-control-lux mt-1"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label-lux">Phone Number</label>
            <input
              className="form-control-lux mt-1"
              type="tel"
              name="phone"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-gold w-100 py-2"
            disabled={loading}
          >
            {loading
              ? <><span className="spinner-border spinner-border-sm me-2" />Creating...</>
              : <><i className="bi bi-person-plus me-2" />Create Account</>
            }
          </button>
        </form>

        <div className="auth-divider">or</div>

        <a
          href="http://localhost:8082/oauth2/authorization/google"
          className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2 mb-3"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            width={20} height={20}
            alt="Google"
          />
          Continue with Google
        </a>

        <p className="text-center text-muted small mb-0">
          Already have an account?{' '}
          <Link to="/login" className="text-gold fw-semibold text-decoration-none">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}