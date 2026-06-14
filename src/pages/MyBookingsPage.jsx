import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { bookingApi } from '../api/bookingApi'
import BookingCard from '../components/BookingCard'
import Loader from '../components/Loader'

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const location = useLocation()
  const newBooking = location.state?.newBooking

  useEffect(() => {
    bookingApi.getMyBookings()
      .then(setBookings)
      .catch(() => setError('Could not load bookings. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  const paid    = bookings.filter(b => b.status === 'PAID')
  const pending = bookings.filter(b => b.status !== 'PAID')

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <div className="lux-breadcrumb mb-2">
            <Link to="/">Home</Link>
            <span className="sep"><i className="bi bi-chevron-right" /></span>
            <span className="current">My Bookings</span>
          </div>
          <h1 className="page-header-title mb-1">My Bookings</h1>
          <p className="page-header-sub mb-0">Manage and track all your reservations</p>
        </div>
      </div>

      <div className="container pb-5">

        {newBooking && (
          <div className="alert-lux-success mb-4">
            <i className="bi bi-check-circle me-2" />
            Booking <strong>#{newBooking.bookingId}</strong> confirmed! Click <strong>Pay Now</strong> to complete.
          </div>
        )}

        {loading && <Loader text="Loading your bookings..." />}

        {error && (
          <div className="alert-lux-danger mb-4">
            <i className="bi bi-exclamation-circle me-2" />{error}
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon"><i className="bi bi-calendar-x" /></div>
            <h5 className="font-display mb-2">No bookings yet</h5>
            <p className="text-muted mb-4">Start exploring and book your first hotel stay.</p>
            <Link to="/hotels" className="btn btn-gold">
              <i className="bi bi-building me-2" />Browse Hotels
            </Link>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <>
            {/* Stats */}
            <div className="row g-3 mb-5">
              {[
                { label: 'Total Bookings',  value: bookings.length, icon: 'bi-calendar-check', bg: 'bg-dark text-white' },
                { label: 'Confirmed Paid',  value: paid.length,     icon: 'bi-check-circle',   bg: 'bg-success text-white' },
                { label: 'Pending Payment', value: pending.length,  icon: 'bi-clock',          bg: 'bg-warning text-dark' },
              ].map(s => (
                <div key={s.label} className="col-6 col-md-4">
                  <div className="card stat-card shadow-sm">
                    <div className="card-body d-flex align-items-center gap-3 p-3">
                      <div className={`stat-icon rounded-3 ${s.bg}`}>
                        <i className={`bi ${s.icon}`} />
                      </div>
                      <div>
                        <div className="stat-num">{s.value}</div>
                        <small className="text-muted">{s.label}</small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pending */}
            {pending.length > 0 && (
              <>
                <h5 className="font-display mb-3">
                  <i className="bi bi-clock text-gold me-2" />Awaiting Payment
                </h5>
                {pending.map(b => <BookingCard key={b.bookingId} booking={b} />)}
              </>
            )}

            {/* Paid */}
            {paid.length > 0 && (
              <div className={pending.length > 0 ? 'mt-4' : ''}>
                <h5 className="font-display mb-3">
                  <i className="bi bi-check-circle text-success me-2" />Confirmed Stays
                </h5>
                {paid.map(b => <BookingCard key={b.bookingId} booking={b} />)}
              </div>
            )}
          </>
        )}

      </div>
    </>
  )
}