import { useState } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { bookingApi } from '../api/bookingApi'
import { useAuth } from '../context/AuthContext'
import { getErrorMsg } from '../utils/errorUtils'

export default function BookingPage() {
  const { roomId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  const room = location.state?.room
  const hotelId = location.state?.hotelId

  const [days, setDays] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!room) {
    return (
      <div className="container py-5 text-center">
        <div className="empty-state-icon"><i className="bi bi-exclamation-circle" /></div>
        <p className="text-muted">Room details not found.</p>
        <button className="btn btn-gold mt-2" onClick={() => navigate('/hotels')}>
          Browse Hotels
        </button>
      </div>
    )
  }

  if (user?.role === 'ADMIN') {
    return (
      <div className="container py-5 text-center">
        <div className="empty-state-icon"><i className="bi bi-shield-x" /></div>
        <h5 className="font-display">Admins Cannot Book Rooms</h5>
        <p className="text-muted">Please use a guest account to make bookings.</p>
        <button className="btn btn-gold mt-2" onClick={() => navigate('/hotels')}>
          Browse Hotels
        </button>
      </div>
    )
  }

  const total = room.pricePerNight * days

  const handleBook = async () => {
    setError('')
    setLoading(true)
    try {
      const booking = await bookingApi.create({ roomId: room.id, days })
      navigate('/my-bookings', { state: { newBooking: booking } })
    } catch (err) {
      setError(getErrorMsg(err, 'Booking failed. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <div className="lux-breadcrumb mb-2">
            <Link to="/">Home</Link>
            <span className="sep"><i className="bi bi-chevron-right" /></span>
            <Link to="/hotels">Hotels</Link>
            <span className="sep"><i className="bi bi-chevron-right" /></span>
            <Link to={`/hotels/${hotelId}`}>Hotel</Link>
            <span className="sep"><i className="bi bi-chevron-right" /></span>
            <span className="current">Book Room</span>
          </div>
          <h1 className="page-header-title mb-1">Complete Your Booking</h1>
          <p className="page-header-sub mb-0">Review details and confirm your reservation</p>
        </div>
      </div>

      <div className="container pb-5">
        <div className="row justify-content-center">
          <div className="col-lg-7">

            {error && (
              <div className="alert-lux-danger mb-4">
                <i className="bi bi-exclamation-triangle me-2" />{error}
              </div>
            )}

            {/* Room Summary Card */}
            <div className="booking-detail-card shadow-sm mb-4">
              <div className="booking-summary-header">
                <small className="text-white-50 text-uppercase d-block mb-1"
                  style={{ fontSize: '0.7rem', letterSpacing: 1 }}>
                  Your Room
                </small>
                <h4 className="font-display text-white mb-0">{room.roomType}</h4>
              </div>
              <div className="p-4">
                <div className="row g-3">
                  <div className="col-6">
                    <div className="booking-detail-label">Price Per Night</div>
                    <div className="room-price">
                      ₹{room.pricePerNight?.toLocaleString('en-IN')}
                      <small>/night</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="booking-detail-label">Booked By</div>
                    <div className="booking-detail-value">{user?.username}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Days Selector */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body p-4">
                <h6 className="font-display mb-3">
                  <i className="bi bi-calendar3 text-gold me-2" />Select Duration
                </h6>
                <label className="booking-detail-label d-block mb-2">Number of Nights</label>
                <div className="d-flex align-items-center gap-3">
                  <button
                    className="days-counter-btn"
                    onClick={() => setDays(d => Math.max(1, d - 1))}
                  >−</button>
                  <span className="days-counter-num">{days}</span>
                  <button
                    className="days-counter-btn"
                    onClick={() => setDays(d => Math.min(30, d + 1))}
                  >+</button>
                  <span className="text-muted small">{days === 1 ? 'night' : 'nights'}</span>
                </div>
              </div>
            </div>

            {/* Total & Confirm */}
            <div className="booking-total-card shadow-sm p-4">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <div className="booking-detail-label mb-1">Total Amount</div>
                  <div className="total-amount">₹{total.toLocaleString('en-IN')}</div>
                  <small className="text-muted">
                    ₹{room.pricePerNight?.toLocaleString('en-IN')} × {days} {days === 1 ? 'night' : 'nights'}
                  </small>
                </div>
              </div>

              <button
                className="btn btn-gold w-100 py-2 mb-2"
                onClick={handleBook}
                disabled={loading}
              >
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2" />Confirming...</>
                  : <><i className="bi bi-check-circle me-2" />Confirm Booking</>
                }
              </button>
              <p className="text-center text-muted small mb-0">
                <i className="bi bi-shield-check me-1" />
                Free cancellation · No prepayment required
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}