import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="luxnav navbar navbar-expand-lg sticky-top shadow-sm">
      <div className="container">

        {/* Brand: "Lux" bold gold + "Stay" plain white — v2 style */}
        <Link className="navbar-brand" to="/">
          <span className="brand-lux">Lux</span><span className="brand-stay">Stay</span>
        </Link>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
        >
          <i className="bi bi-list text-gold fs-4" />
        </button>

        <div className="collapse navbar-collapse" id="mainNav">

          {/* Left links */}
          <ul className="navbar-nav me-auto ms-4 gap-1 mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/hotels">Hotels</NavLink>
            </li>
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/my-bookings">My Bookings</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/profile">Profile</NavLink>
                </li>
                {user?.role === 'ADMIN' && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/admin">
                      <i className="bi bi-shield-check me-1 text-gold" />Admin
                    </NavLink>
                  </li>
                )}
              </>
            )}
          </ul>

          {/* Right side */}
          <div className="d-flex align-items-center gap-3 mb-2 mb-lg-0">
            {isLoggedIn ? (
              <>
                <div className="user-chip">
                  <i className="bi bi-person-circle" />
                  <span>{user?.username}</span>
                </div>
                {/* Red-tinted logout button — v2 style */}
                <button className="btn-nav-logout" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink className="btn btn-sm btn-nav-outline px-3 py-2" to="/login">
                  Sign In
                </NavLink>
                <NavLink className="btn btn-sm btn-gold px-3 py-2" to="/register">
                  Register
                </NavLink>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  )
}
