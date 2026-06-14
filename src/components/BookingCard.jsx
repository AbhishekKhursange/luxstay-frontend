import { useNavigate } from 'react-router-dom'

export default function BookingCard({ booking }) {
  const navigate = useNavigate()

  const statusClass = {
    CREATED: 'status-created',
    PAID: 'status-paid',
    FAILED: 'status-failed',
  }[booking.status] || 'status-created'

  return (
    <div className="card booking-card shadow-sm mb-3">

      {/* Dark header */}
      <div className="booking-card-header">
        <div>
          <div className="booking-id">Booking #{booking.bookingId}</div>
          <div className="booking-id-sub">
            {booking.hotelName
              ? <><i className="bi bi-building me-1" />{booking.hotelName}</>
              : <>Room ID: {booking.roomId}</>
            }
          </div>
        </div>
        <span className={`status-pill ${statusClass}`}>{booking.status}</span>
      </div>

      {/* Body */}
      <div className="card-body p-4">
        <div className="row g-3">
          <div className="col-6 col-md-3">
            <div className="booking-detail-label">Room Type</div>
            <div className="booking-detail-value">{booking.roomType || '—'}</div>
          </div>
          <div className="col-6 col-md-3">
            <div className="booking-detail-label">Duration</div>
            <div className="booking-detail-value">
              {booking.days} {booking.days === 1 ? 'night' : 'nights'}
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="booking-detail-label">Total</div>
            <div className="booking-total">
              ₹{booking.totalPrice?.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="booking-detail-label">Status</div>
            <span className={`status-pill ${statusClass}`}>{booking.status}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      {booking.status === 'CREATED' && (
        <div className="booking-footer-action">
          <button
            className="btn btn-gold btn-sm px-4"
            onClick={() => navigate(`/payment/${booking.bookingId}`, { state: { booking } })}
          >
            <i className="bi bi-credit-card me-2" />Pay Now
          </button>
        </div>
      )}

      {booking.status === 'PAID' && (
        <div className="booking-footer-paid">
          <i className="bi bi-check-circle-fill me-2" />
          Payment confirmed — Enjoy your stay!
        </div>
      )}

    </div>
  )
}