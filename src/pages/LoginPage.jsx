import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { authApi } from '../api/authApi'
import { useAuth } from '../context/AuthContext'
import { getErrorMsg } from '../utils/errorUtils'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await authApi.login(form)
      login(data.accessToken, data.refreshToken)
      navigate(from, { replace: true })
    } catch (err) {
      setError(getErrorMsg(err, 'Invalid username or password.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        <div className="auth-brand mb-1">LuxStay</div>
        <p className="auth-subtitle mb-4">Welcome back — sign in to your account</p>

        {location.state?.from && (
          <div className="alert-lux-info mb-4">
            <i className="bi bi-lock me-2" />Please sign in to continue
          </div>
        )}

        {error && (
          <div className="alert-lux-danger mb-4">
            <i className="bi bi-exclamation-triangle me-2" />{error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label-lux">Username</label>
            <input
              className="form-control-lux mt-1"
              type="text"
              name="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label className="form-label-lux">Password</label>
            <input
              className="form-control-lux mt-1"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-gold w-100 py-2"
            disabled={loading}
          >
            {loading
              ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</>
              : <><i className="bi bi-box-arrow-in-right me-2" />Sign In</>
            }
          </button>
        </form>

        <div className="auth-divider">or</div>

        <a
          href="https://luxstay-gateway.onrender.com/auth/oauth2/authorization/google"
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
          New to LuxStay?{' '}
          <Link to="/register" className="text-gold fw-semibold text-decoration-none">
            Create account
          </Link>
        </p>

      </div>
    </div>
  )
}