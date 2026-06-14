import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      login(token, '')   // ← same as normal login, empty string for refreshToken
      navigate('/')
    } else {
      navigate('/login')
    }
  }, [])

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="text-center">
        <div className="spinner-border mb-3" style={{ color: 'var(--gold)' }} />
        <p className="text-muted">Signing you in with Google...</p>
      </div>
    </div>
  )
}