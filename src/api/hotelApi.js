import axios from 'axios'
import { getAccessToken } from '../utils/tokenUtils'

const auth = () => ({ headers: { Authorization: `Bearer ${getAccessToken()}` } })

export const hotelApi = {
  // Public
  getAll:   ()        => axios.get('/hotel').then(r => r.data),
  getById:  (id)      => axios.get(`/hotel/${id}`).then(r => r.data),
  getRooms: (hotelId) => axios.get(`/room/hotel/${hotelId}`).then(r => r.data),

  // Admin only
  createHotel: (data) => axios.post('/hotel', data, auth()).then(r => r.data),
  deleteHotel: (id)   => axios.delete(`/hotel/${id}`, auth()).then(r => r.data),
  addRoom:     (data) => axios.post('/room', data, auth()).then(r => r.data),
  deleteRoom: (id) => axios.delete(`/room/${id}`, auth()).then(r => r.data),
}
