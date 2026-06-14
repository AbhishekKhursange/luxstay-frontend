import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { hotelApi } from '../api/hotelApi'
import HotelCard from '../components/HotelCard'
import Loader from '../components/Loader'
import { useAuth } from '../context/AuthContext'

const FEATURES = [
  { icon: 'bi-shield-check', title: 'Verified Hotels', desc: 'Every property is inspected and verified for quality standards.' },
  { icon: 'bi-lightning-charge', title: 'Instant Booking', desc: 'Confirm your reservation instantly with real-time availability.' },
  { icon: 'bi-headset', title: '24/7 Support', desc: 'Our concierge team is available around the clock for you.' },
  { icon: 'bi-tags', title: 'Best Rates', desc: 'We guarantee the best prices with our price-match promise.' },
]

const POPULAR_CITIES = [
  { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&h=400&fit=crop', hotels: 120 },
  { name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop', hotels: 95 },
  { name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&h=400&fit=crop', hotels: 80 },
  { name: 'Jaipur', image: 'https://images.unsplash.com/photo-1477587458883-47145ed31c1e?w=600&h=400&fit=crop', hotels: 65 },
  { name: 'Bangalore', image: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=600&h=400&fit=crop', hotels: 110 },
  { name: 'Chennai', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&h=400&fit=crop', hotels: 70 },
]

export default function HomePage() {
  const navigate = useNavigate()
  const { isLoggedIn, user } = useAuth()
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    hotelApi.getAll()
      .then(data => setHotels(data.slice(0, 3)))
      .catch(() => setHotels([]))
      .finally(() => setLoading(false))
  }, [])

  const handleCityClick = (cityName) => {
    navigate(`/hotels?city=${encodeURIComponent(cityName)}`)
  }

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="container hero-content py-5">
          <div className="row">
            <div className="col-lg-7">
              <p className="hero-eyebrow mb-3">
                <i className="bi bi-gem me-2" />Premium Hotel Experiences
              </p>
              <h1 className="hero-title mb-4">
                Discover Your<br /><em>Perfect Stay</em>
              </h1>
              <p className="hero-sub mb-5">
                From boutique hideaways to grand luxury resorts — find and book
                extraordinary hotels for every occasion and every budget.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <button className="btn btn-gold btn-lg px-4" onClick={() => navigate('/hotels')}>
                  <i className="bi bi-search me-2" />Explore Hotels
                </button>
                {isLoggedIn ? (
                  <button className="btn btn-outline-light btn-lg px-4" onClick={() => navigate('/my-bookings')}>
                    <i className="bi bi-calendar-check me-2" />My Bookings
                  </button>
                ) : (
                  <button className="btn btn-outline-light btn-lg px-4" onClick={() => navigate('/register')}>
                    Create Account
                  </button>
                )}
              </div>
              <div className="d-flex gap-4 mt-5 flex-wrap">
                {[['500+', 'Properties'], ['50K+', 'Happy Guests'], ['4.9★', 'Avg Rating']].map(([num, label]) => (
                  <div key={label}>
                    <div className="hero-stat-num">{num}</div>
                    <div className="hero-stat-label">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Popular Cities ── */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <p className="section-eyebrow mb-1">Browse by Destination</p>
            <h2 className="font-display display-6 fw-bold">Popular Cities</h2>
            <div className="gold-divider mx-auto" />
            <p className="text-muted">Click a city to explore available hotels</p>
          </div>
          <div className="row g-3">
            {/* First 2 cities — large cards */}
            {POPULAR_CITIES.slice(0, 2).map(city => (
              <div key={city.name} className="col-md-6">
                <div className="city-card city-card-lg" onClick={() => handleCityClick(city.name)}>
                  <img
                    src={city.image}
                    alt={city.name}
                    className="city-card-img"
                    onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=400&fit=crop' }}
                  />
                  <div className="city-card-overlay" />
                  <div className="city-card-content">
                    <div className="city-card-name">{city.name}</div>
                    <div className="city-card-count">{city.hotels} Hotels</div>
                  </div>
                </div>
              </div>
            ))}
            {/* Remaining 4 cities — smaller cards */}
            {POPULAR_CITIES.slice(2).map(city => (
              <div key={city.name} className="col-6 col-md-3">
                <div className="city-card city-card-sm" onClick={() => handleCityClick(city.name)}>
                  <img
                    src={city.image}
                    alt={city.name}
                    className="city-card-img"
                    onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=400&fit=crop' }}
                  />
                  <div className="city-card-overlay" />
                  <div className="city-card-content">
                    <div className="city-card-name">{city.name}</div>
                    <div className="city-card-count">{city.hotels} Hotels</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="text-center mb-5">
            <p className="section-eyebrow mb-1">Why LuxStay</p>
            <h2 className="font-display display-6 fw-bold">The LuxStay Difference</h2>
            <div className="gold-divider mx-auto" />
          </div>
          <div className="row g-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="col-sm-6 col-lg-3">
                <div className="feature-card h-100">
                  <div className="feature-icon">
                    <i className={`bi ${f.icon}`} />
                  </div>
                  <h5 className="font-display mb-2">{f.title}</h5>
                  <p className="text-muted small mb-0">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Hotels ── */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-3">
            <div>
              <p className="section-eyebrow mb-1">Hand-Picked</p>
              <h2 className="font-display display-6 fw-bold mb-0">Featured Hotels</h2>
              <div className="gold-divider mb-0" />
            </div>
            <button className="btn btn-outline-dark" onClick={() => navigate('/hotels')}>
              View All Hotels <i className="bi bi-arrow-right ms-1" />
            </button>
          </div>
          {loading ? (
            <Loader text="Finding finest hotels..." />
          ) : hotels.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><i className="bi bi-building" /></div>
              <p className="text-muted">No hotels found. Check back soon.</p>
            </div>
          ) : (
            <div className="row g-4">
              {hotels.map((hotel, i) => (
                <div key={hotel.id} className="col-md-6 col-lg-4">
                  <HotelCard hotel={hotel} index={i} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="cta-banner">
            <p className="section-eyebrow mb-2">Ready to explore?</p>
            <h2 className="font-display display-6 fw-bold text-white mb-3">
              Book Your Dream Stay Today
            </h2>
            <p className="text-white-50 mb-4 mx-auto" style={{ maxWidth: 480 }}>
              Join thousands of travelers who trust LuxStay for their finest hotel experiences.
            </p>
            <button className="btn btn-gold btn-lg px-5" onClick={() => navigate(isLoggedIn ? '/hotels' : '/register')}
            >
              {isLoggedIn ? 'Explore Hotels' : "Get Started — It's Free"}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}