import { createContext, useContext, useState, useEffect } from 'react'
import { getUserFromToken, getAccessToken, setTokens, clearTokens, isTokenExpired } from '../utils/tokenUtils'
import { authApi } from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getAccessToken()
    if (token && !isTokenExpired(token)) setUser(getUserFromToken())
    else clearTokens()
    setLoading(false)
  }, [])

  const login = (accessToken, refreshToken) => {
    setTokens(accessToken, refreshToken)
    setUser(getUserFromToken())
  }

  const logout = async () => {
    const token = getAccessToken()
    if (token) { try { await authApi.logout(token) } catch {} }
    clearTokens()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)