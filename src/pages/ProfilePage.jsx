import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import { userApi } from '../api/userApi'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (user?.username) {
      userApi.getByUsername(user.username)
        .then(setProfile)
        .catch(() => {})
    }
  }, [user])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const userPrivileges  = ['Browse Hotels', 'Book Rooms', 'Make Payments', 'View Bookings', 'Manage Profile']
  const adminPrivileges = ['View All Hotels', 'Manage Rooms', 'Add New Hotels', 'View All Bookings', 'Delete Hotels', 'Manage Users']
  const privileges      = user?.role === 'ADMIN' ? adminPrivileges : userPrivileges

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <div className="lux-breadcrumb mb-2">
            <Link to="/">Home</Link>
            <span className="sep"><i className="bi bi-chevron-right" /></span>
            <span className="current">Profile</span>
          </div>
          <h1 className="page-header-title mb-1">My Profile</h1>
          <p className="page-header-sub mb-0">Your account details and settings</p>
        </div>
      </div>

      <div className="container pb-5">
        <div className="row g-4">

          {/* Left column */}
          <div className="col-lg-4">

            {/* Avatar card */}
            <div className="profile-hero-card mb-4">
              <div className="profile-avatar">
                <i className="bi bi-person-fill" />
              </div>
              <div className="profile-name">{user?.username}</div>
              <div className="profile-role-badge">{user?.role}</div>
            </div>

            {/* Quick actions */}
            <div className="card info-card shadow-sm">
              <div className="card-body p-3">
                <h6 className="font-display mb-3">Quick Actions</h6>
                <div className="d-flex flex-column gap-2">
                  <button
                    className="btn btn-outline-dark text-start"
                    onClick={() => navigate('/my-bookings')}
                  >
                    <i className="bi bi-calendar-check me-2" />My Bookings
                  </button>
                  <button
                    className="btn btn-outline-dark text-start"
                    onClick={() => navigate('/hotels')}
                  >
                    <i className="bi bi-building me-2" />Browse Hotels
                  </button>
                  <button
                    className="btn btn-outline-danger text-start"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-2" />Sign Out
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Right column */}
          <div className="col-lg-8">

            {/* Account Info */}
            <div className="card info-card shadow-sm mb-4">
              <div className="card-body p-4">
                <h6 className="font-display mb-1">Account Information</h6>
                <div className="gold-divider" />

                {[
                  { icon: 'bi-person',       label: 'Username',        value: user?.username },
                  { icon: 'bi-shield-check', label: 'Account Role',    value: user?.role },
                  { icon: 'bi-envelope',     label: 'Email',           value: profile?.email    || '—' },
                  { icon: 'bi-telephone',    label: 'Phone',           value: profile?.phone    || '—' },
                ].map(row => (
                  <div key={row.label} className="d-flex align-items-center gap-3 py-3 border-bottom">
                    <div className="info-row-icon">
                      <i className={`bi ${row.icon}`} />
                    </div>
                    <div>
                      <div className="info-label">{row.label}</div>
                      <div className="info-value">{row.value}</div>
                    </div>
                  </div>
                ))}

                <div className="d-flex align-items-center gap-3 pt-3">
                  <div className="info-row-icon">
                    <i className="bi bi-patch-check" />
                  </div>
                  <div>
                    <div className="info-label">Account Status</div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="bg-success rounded-circle d-inline-block"
                            style={{ width: 8, height: 8 }} />
                      <span className="info-value">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Privileges */}
            <div className="card info-card shadow-sm">
              <div className="card-body p-4">
                <h6 className="font-display mb-1">Your Privileges</h6>
                <div className="gold-divider" />
                <div className="row g-2">
                  {privileges.map(p => (
                    <div key={p} className="col-6 col-md-4">
                      <div className="privilege-item">
                        <i className="bi bi-check-circle-fill text-success flex-shrink-0" />
                        {p}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}