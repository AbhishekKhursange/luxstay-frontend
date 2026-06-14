export function decodeToken(token) {
  try { return JSON.parse(atob(token.split('.')[1])) } catch { return null }
}
export function isTokenExpired(token) {
  const d = decodeToken(token)
  if (!d?.exp) return true
  return Date.now() >= d.exp * 1000
}
export const getAccessToken  = () => localStorage.getItem('accessToken')
export const getRefreshToken = () => localStorage.getItem('refreshToken')
export function setTokens(access, refresh) {
  localStorage.setItem('accessToken', access)
  localStorage.setItem('refreshToken', refresh)
}
export function clearTokens() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}
export function getUserFromToken() {
  const token = getAccessToken()
  if (!token) return null
  const d = decodeToken(token)
  if (!d) return null
  return { username: d.sub, role: d.role }
}