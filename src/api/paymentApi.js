import axios from 'axios'
import { getAccessToken } from '../utils/tokenUtils'

const auth = () => ({ headers: { Authorization: `Bearer ${getAccessToken()}` } })

export const paymentApi = {
  pay: (data) => axios.post('/payment', data, auth()).then(r => r.data),
}