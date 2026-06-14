import axios from 'axios'

export const authApi = {
  register: (data)          => axios.post('/auth/register', data).then(r => r.data),
  login:    (data)          => axios.post('/auth/login', data).then(r => r.data),
  refresh:  (refreshToken)  => axios.post('/auth/refresh', { refreshToken }).then(r => r.data),
  logout:   (token)         => axios.post('/auth/logout', {}, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.data),
}