import axios from 'axios'
import { getAccessToken } from '../utils/tokenUtils'

const auth = () => ({ headers: { Authorization: `Bearer ${getAccessToken()}` } })

export const userApi = {
  getByUsername: (username) => axios.get(`/user/${username}`, auth()).then(r => r.data),
  getAll: () => axios.get('/user', auth()).then(r => r.data),
}
