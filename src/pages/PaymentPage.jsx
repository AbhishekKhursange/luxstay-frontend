import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { paymentApi } from '../api/paymentApi'
import { getErrorMsg } from '../utils/errorUtils'
import { bookingApi } from '../api/bookingApi'
import Loader from '../components/Loader'

export default function PaymentPage() {
  const { bookingId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [booking, setBooking] = useState(location.state?.booking || null)
  const [fetchingBooking, setFetchingBooking] = useState(!location.state?.booking)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [paymentMethod, setPaymentMethod] = useState('card')
  const [upiId, setUpiId] = useState('')
  const [bank, setBank] = useState('')
  const [upiError, setUpiError] = useState('')
  const [cardForm, setCardForm] = useState({
    cardNumber: '', expiry: '', cvv: '', cardHolder: ''
  })
  const [cardError, setCardError] = useState('')
  const [processingMsg, setProcessingMsg] = useState('')

  useEffect(() => {
    if (booking) {
      setFetchingBooking(false)  // ← ADD this
      return
    }
    bookingApi.getBookingById(bookingId)
      .then(data => { setBooking(data); setFetchingBooking(false) })
      .catch(() => navigate('/my-bookings'))
  }, [bookingId])

  if (fetchingBooking) return <Loader text="Loading booking details..." />
  if (!booking) return (
    <div className="container py-5 text-center">
      <div className="empty-state-icon"><i className="bi bi-exclamation-circle" /></div>
      <p className="text-muted">Booking details not found.</p>
      <button className="btn btn-gold mt-2" onClick={() => navigate('/my-bookings')}>
        My Bookings
      </button>
    </div>
  )

  const handlePay = async () => {
    setCardError(''); setUpiError('')

    // Validate based on selected method
    if (paymentMethod === 'card') {
      if (cardForm.cardNumber.replace(/\s/g, '').length < 16) {
        setCardError('Please enter a valid 16-digit card number.'); return
      }
      if (!cardForm.expiry || cardForm.expiry.length < 5) {
        setCardError('Please enter a valid expiry date.'); return
      }
      if (cardForm.cvv.length < 3) {
        setCardError('Please enter a valid CVV.'); return
      }
      if (!cardForm.cardHolder.trim()) {
        setCardError('Please enter the cardholder name.'); return
      }
    }

    if (paymentMethod === 'upi') {
      if (!upiId.includes('@') || upiId.length < 5) {
        setUpiError('Please enter a valid UPI ID (e.g. name@gpay)'); return
      }
    }

    if (paymentMethod === 'netbanking') {
      if (!bank) {
        setUpiError('Please select a bank.'); return
      }
    }

    setLoading(true)

    // Show method-specific processing message
    if (paymentMethod === 'upi') {
      setProcessingMsg('Verifying UPI ID and processing payment...')
    } else if (paymentMethod === 'netbanking') {
      setProcessingMsg(`Connecting to ${bank} securely...`)
    } else {
      setProcessingMsg('Verifying card details...')
    }

    try {
      await paymentApi.pay({ bookingId: booking.bookingId, amount: booking.totalPrice })
      setSuccess(true)
      setTimeout(() => navigate('/my-bookings'), 2500)
    } catch (err) {
      setError(getErrorMsg(err, 'Payment failed. Please try again.'))
    } finally {
      setLoading(false)
      setProcessingMsg('')
    }
  }

  if (success) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="text-center p-4">
          <div className="payment-success-icon">
            <i className="bi bi-check-lg" />
          </div>
          <h2 className="font-display mb-2">Payment Successful!</h2>
          <p className="text-muted mb-4">
            Booking <strong>#{booking.bookingId}</strong> confirmed. Redirecting...
          </p>
          <div className="spinner-gold mx-auto" />
        </div>
      </div>
    )
  }

  const handleCardChange = e => {
    let { name, value } = e.target
    if (name === 'cardNumber') {
      // Auto-format: 1234 5678 9012 3456
      value = value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
    }
    if (name === 'expiry') {
      // Auto-format: MM/YY
      value = value.replace(/\D/g, '').slice(0, 4)
      if (value.length >= 3) value = value.slice(0, 2) + '/' + value.slice(2)
    }
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3)
    }
    setCardForm(f => ({ ...f, [name]: value }))
  }

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <div className="lux-breadcrumb mb-2">
            <Link to="/">Home</Link>
            <span className="sep"><i className="bi bi-chevron-right" /></span>
            <Link to="/my-bookings">My Bookings</Link>
            <span className="sep"><i className="bi bi-chevron-right" /></span>
            <span className="current">Payment</span>
          </div>
          <h1 className="page-header-title mb-1">Complete Payment</h1>
          <p className="page-header-sub mb-0">Secure checkout for Booking #{booking.bookingId}</p>
        </div>
      </div>

      <div className="container pb-5">
        <div className="row justify-content-center">
          <div className="col-lg-5">

            {error && (
              <div className="alert-lux-danger mb-4">
                <i className="bi bi-exclamation-triangle me-2" />{error}
              </div>
            )}

            <div className="card payment-card shadow border-0">

              {/* Amount header */}
              <div className="payment-header">
                <p className="text-white-50 small text-uppercase mb-1"
                  style={{ fontSize: '0.75rem', letterSpacing: 2 }}>
                  Total Due
                </p>
                <div className="payment-amount">
                  ₹{booking.totalPrice?.toLocaleString('en-IN')}
                </div>
                <div className="payment-booking-id">Booking #{booking.bookingId}</div>
              </div>

              <div className="card-body p-4">
                <h6 className="font-display mb-3">Booking Summary</h6>

                <div className="payment-row">
                  <span className="payment-row-label">Guest</span>
                  <span className="payment-row-value">{booking.username}</span>
                </div>
                <div className="payment-row">
                  <span className="payment-row-label">Room Type</span>
                  <span className="payment-row-value">{booking.roomType || '—'}</span>
                </div>
                <div className="payment-row">
                  <span className="payment-row-label">Duration</span>
                  <span className="payment-row-value">
                    {booking.days} {booking.days === 1 ? 'night' : 'nights'}
                  </span>
                </div>
                <div className="payment-row">
                  <span className="payment-row-label">Room ID</span>
                  <span className="payment-row-value">#{booking.roomId}</span>
                </div>
                <div className="payment-row payment-row-total">
                  <span>Total</span>
                  <span className="payment-row-total-value text-gold">
                    ₹{booking.totalPrice?.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Security badges */}
                <div className="d-flex gap-2 flex-wrap justify-content-center my-4">
                  {['SSL Secured', 'Encrypted', 'Safe Checkout'].map(b => (
                    <span key={b} className="security-badge">
                      <i className="bi bi-shield-lock-fill me-1" />{b}
                    </span>
                  ))}
                </div>

                {/* Payment Method Selector */}
                <div className="mb-4">
                  <h6 className="font-display mb-3">
                    <i className="bi bi-wallet2 me-2 text-gold" />Payment Method
                  </h6>
                  <div className="d-flex gap-2">
                    {[
                      { id: 'card', icon: 'bi-credit-card', label: 'Card' },
                      { id: 'upi', icon: 'bi-phone', label: 'UPI' },
                      { id: 'netbanking', icon: 'bi-bank', label: 'Net Banking' },
                    ].map(m => (
                      <button key={m.id} type="button"
                        className={`btn flex-fill ${paymentMethod === m.id ? 'btn-gold' : 'btn-outline-secondary'}`}
                        style={{ fontSize: '0.85rem', padding: '8px 4px' }}
                        onClick={() => { setPaymentMethod(m.id); setCardError(''); setUpiError('') }}>
                        <i className={`bi ${m.icon} me-1`} />{m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error for UPI/NetBanking */}
                {upiError && (
                  <div className="alert-lux-danger mb-3">
                    <i className="bi bi-exclamation-triangle me-2" />{upiError}
                  </div>
                )}

                {/* Card Form */}
                {paymentMethod === 'card' && (
                  <div className="mb-4">
                    <h6 className="font-display mb-3">
                      <i className="bi bi-credit-card me-2 text-gold" />Card Details
                    </h6>
                    {cardError && (
                      <div className="alert-lux-danger mb-3">
                        <i className="bi bi-exclamation-triangle me-2" />{cardError}
                      </div>
                    )}
                    <div className="mb-3">
                      <label className="form-label-lux">Card Number</label>
                      <div className="input-group mt-1">
                        <span className="input-group-text bg-white">
                          <i className="bi bi-credit-card text-muted" />
                        </span>
                        <input
                          className="form-control"
                          type="text"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardForm.cardNumber}
                          onChange={handleCardChange}
                          maxLength={19}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label-lux">Cardholder Name</label>
                      <input
                        className="form-control-lux mt-1"
                        type="text"
                        name="cardHolder"
                        placeholder="Name as on card"
                        value={cardForm.cardHolder}
                        onChange={handleCardChange}
                      />
                    </div>

                    <div className="row g-3">
                      <div className="col-6">
                        <label className="form-label-lux">Expiry Date</label>
                        <input
                          className="form-control-lux mt-1"
                          type="text"
                          name="expiry"
                          placeholder="MM/YY"
                          value={cardForm.expiry}
                          onChange={handleCardChange}
                          maxLength={5}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label-lux">CVV</label>
                        <input
                          className="form-control-lux mt-1"
                          type="password"
                          name="cvv"
                          placeholder="•••"
                          value={cardForm.cvv}
                          onChange={handleCardChange}
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI Form */}
                {paymentMethod === 'upi' && (
                  <div className="mb-4">
                    <h6 className="font-display mb-3">
                      <i className="bi bi-phone me-2 text-gold" />UPI Payment
                    </h6>

                    {/* UPI ID input — unchanged */}
                    <label className="form-label-lux">UPI ID</label>
                    <input className="form-control-lux mt-1" type="text"
                      placeholder="yourname@gpay / @paytm / @ybl"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)} />
                    <small className="text-muted mt-1 d-block">
                      <i className="bi bi-check-circle-fill text-success me-1" />
                      Supported: Google Pay, PhonePe, Paytm, BHIM
                    </small>

                    {/* OR divider */}
                    <div className="d-flex align-items-center gap-2 my-3">
                      <hr className="flex-grow-1 m-0" />
                      <small className="text-muted px-1">OR</small>
                      <hr className="flex-grow-1 m-0" />
                    </div>

                    {/* ← Only this part changes: add text-center */}
                    <div className="text-center">
                      <small className="text-muted d-block mb-2">Scan QR code with any UPI app</small>
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=upi://pay?pa=abhishekkhursange139@okaxis%26pn=LuxStay%26am=${booking.totalPrice}%26tn=Booking${booking.bookingId}`}
                        alt="UPI QR Code"
                        style={{ width: 110, height: 110, border: '2px solid #e0d9c8', borderRadius: 10, padding: 6, background: 'white' }}
                      />
                      <small className="text-muted d-block mt-2">
                        Scan to pay ₹{booking.totalPrice?.toLocaleString('en-IN')}
                      </small>
                    </div>

                  </div>
                )}

                {/* Net Banking Form */}
                {paymentMethod === 'netbanking' && (
                  <div className="mb-4">
                    <h6 className="font-display mb-3">
                      <i className="bi bi-bank me-2 text-gold" />Net Banking
                    </h6>
                    <label className="form-label-lux">Select Bank</label>
                    <select className="form-select-lux mt-1"
                      value={bank} onChange={e => setBank(e.target.value)}>
                      <option value="">— Choose your bank —</option>
                      {['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank',
                        'Kotak Mahindra', 'PNB', 'Bank of Baroda', 'Canara Bank'].map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                    </select>

                    {/* Show info after bank selected */}
                    {bank && (
                      <div className="mt-3 p-3 rounded-3"
                        style={{ background: '#f0f7ff', border: '1px solid #d0e8ff' }}>
                        <div className="d-flex align-items-start gap-2">
                          <i className="bi bi-info-circle-fill text-primary mt-1" />
                          <div>
                            <div style={{ fontSize: '0.87rem', fontWeight: 600, color: '#1a3a5c' }}>
                              Redirecting to {bank}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#555', marginTop: 2 }}>
                              Click "Pay via Net Banking" and you will be securely
                              redirected to {bank}'s internet banking portal to complete
                              your payment of ₹{booking.totalPrice?.toLocaleString('en-IN')}.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button className="btn btn-gold w-100 py-2 mb-2"
                  onClick={handlePay} disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      {processingMsg || 'Processing...'}
                    </>
                  ) : paymentMethod === 'upi'
                    ? <><i className="bi bi-phone me-2" />Pay via UPI ₹{booking.totalPrice?.toLocaleString('en-IN')}</>
                    : paymentMethod === 'netbanking'
                      ? <><i className="bi bi-bank me-2" />Pay via Net Banking ₹{booking.totalPrice?.toLocaleString('en-IN')}</>
                      : <><i className="bi bi-credit-card me-2" />Pay ₹{booking.totalPrice?.toLocaleString('en-IN')}</>
                  }
                </button>

                <button
                  className="btn btn-link text-muted w-100 text-decoration-none"
                  onClick={() => navigate('/my-bookings')}
                >
                  ← Cancel and go back
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}