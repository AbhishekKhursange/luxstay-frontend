import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="lux-footer">
      <div className="container">
        <div className="row g-4">

          <div className="col-lg-4">
            <div className="brand mb-2">LuxStay</div>
            <p className="small" style={{ maxWidth: 300, lineHeight: 1.7 }}>
              Premium hotel experiences curated for discerning travelers.
              Book your perfect stay with confidence.
            </p>
          </div>

          <div className="col-6 col-lg-2 offset-lg-2">
            <div className="footer-col-title">Explore</div>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/hotels">Hotels</Link></li>
            </ul>
          </div>

          <div className="col-6 col-lg-2">
            <div className="footer-col-title">Account</div>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/my-bookings">My Bookings</Link></li>
            </ul>
          </div>

          <div className="col-lg-2">
            <div className="footer-col-title">Support</div>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

        </div>

        <hr className="border-secondary mt-4" />
        <p className="footer-bottom mb-0">
          © {new Date().getFullYear()} LuxStay. All rights reserved.
        </p>
      </div>
    </footer>
  )
}