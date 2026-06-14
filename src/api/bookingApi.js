import axios from 'axios'
import { getAccessToken } from '../utils/tokenUtils'

const auth = () => ({ headers: { Authorization: `Bearer ${getAccessToken()}` } })

export const bookingApi = {
  // User
  create:        (data) => axios.post('/booking', data, auth()).then(r => r.data),
  getMyBookings: ()     => axios.get('/booking', auth()).then(r => r.data),
  getBookingById: (id)   => axios.get(`/booking/${id}`, auth()).then(r => r.data),
  markPaid:       (id)   => axios.put(`/booking/${id}/pay`, {}, auth()).then(r => r.data),
}
