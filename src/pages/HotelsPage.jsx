import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { hotelApi } from '../api/hotelApi'
import HotelCard from '../components/HotelCard'
import Loader from '../components/Loader'
import { useRef } from 'react'

export default function HotelsPage() {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()
  const searchRef = useRef(null)
  const [searchParams, setSearchParams] = useSearchParams()

  // Read city from URL ?city=Mumbai
  const cityFilter = searchParams.get('city') || ''

  useEffect(() => {
    hotelApi.getAll()
      .then(setHotels)
      .catch(() => setError('Failed to load hotels. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Apply both city filter and search
  const filtered = hotels.filter(h => {
    const matchesCity = cityFilter
      ? h.location.toLowerCase().includes(cityFilter.toLowerCase())
      : true
    const matchesSearch = search
      ? h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.location.toLowerCase().includes(search.toLowerCase())
      : true
    return matchesCity && matchesSearch
  })

  const suggestions = search.trim().length > 0
    ? hotels
      .filter(h =>
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.location.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 6)
    : []

  const clearCity = () => {
    setSearchParams({})
  }

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
  <div className="container">
    <div className="lux-breadcrumb mb-2">
      <Link to="/">Home</Link>
      <span className="sep"><i className="bi bi-chevron-right" /></span>
      <span className="current">Hotels</span>
    </div>

    {/* Two column layout: title left, search right */}
    <div className="d-flex align-items-center justify-content-between gap-4 flex-wrap">

      {/* Left: Title */}
      <div>
        <h1 className="page-header-title mb-1">
          {cityFilter ? `Hotels in ${cityFilter}` : 'Our Hotels'}
        </h1>
        <p className="page-header-sub mb-0">
          {cityFilter
            ? `Showing hotels in ${cityFilter}`
            : `Discover ${hotels.length} handpicked properties worldwide`}
        </p>
      </div>

      {/* Right: Search bar */}
      <div className="position-relative" ref={searchRef} style={{ width: 360 }}>
        <div className="input-group" style={{
          borderRadius: 10,
          overflow: 'hidden',
          border: '1.5px solid rgba(255,255,255,0.25)',
          background: 'rgba(255,255,255,0.12)',
        }}>
          <span className="input-group-text border-0 bg-transparent">
            <i className="bi bi-search text-white opacity-75" />
          </span>
          <input
            type="text"
            className="form-control border-0 bg-transparent text-white"
            placeholder="Search hotels or city..."
            value={search}
            onChange={e => { setSearch(e.target.value); setShowDropdown(true) }}
            onFocus={() => search && setShowDropdown(true)}
            style={{ boxShadow: 'none', fontSize: '0.92rem' }}
          />
          {search && (
            <button className="btn border-0 bg-transparent text-white opacity-75"
              onClick={() => { setSearch(''); setShowDropdown(false) }}>
              <i className="bi bi-x-lg" style={{ fontSize: '0.8rem' }} />
            </button>
          )}
        </div>

        {/* Dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <div className="position-absolute w-100 bg-white rounded-3 mt-2"
            style={{ zIndex: 1000, border: '1.5px solid #e0d9c8', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
            {suggestions.map((h, i) => (
              <div key={h.id}
                className="d-flex align-items-center gap-3 px-3 py-2"
                style={{
                  cursor: 'pointer',
                  borderBottom: i < suggestions.length - 1 ? '1px solid #f5f0e8' : 'none',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#faf7f2'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
                onClick={() => { navigate(`/hotels/${h.id}`); setShowDropdown(false); setSearch('') }}
              >
                <i className="bi bi-building" style={{ color: '#b8975a' }} />
                <div className="flex-grow-1">
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#1a1a2e' }}>{h.name}</div>
                  <div style={{ fontSize: '0.76rem', color: '#999' }}>
                    <i className="bi bi-geo-alt me-1" />{h.location}
                  </div>
                </div>
                <i className="bi bi-arrow-right" style={{ color: '#ccc', fontSize: '0.8rem' }} />
              </div>
            ))}
          </div>
        )}

        {showDropdown && search.trim().length > 0 && suggestions.length === 0 && (
          <div className="position-absolute w-100 bg-white rounded-3 mt-2 px-3 py-3"
            style={{ zIndex: 1000, border: '1.5px solid #e0d9c8', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: '0.87rem', color: '#999' }}>
            <i className="bi bi-search me-2" />No results for "<strong>{search}</strong>"
          </div>
        )}
      </div>

    </div>
  </div>
</div>

      <div className="container pb-5">

        {/* City filter pill — shows when coming from homepage city click */}
        {cityFilter && (
          <div className="d-flex align-items-center gap-2 pt-3 mb-3">
            <span className="text-muted small">Filtered by city:</span>
            <span className="badge rounded-pill px-3 py-2"
              style={{ background: 'var(--gold)', color: '#1a1a2e', fontSize: '0.85rem' }}>
              <i className="bi bi-geo-alt me-1" />{cityFilter}
              <button
                className="btn p-0 ms-2 text-dark"
                style={{ lineHeight: 1, fontSize: '0.75rem' }}
                onClick={clearCity}>
                <i className="bi bi-x" />
              </button>
            </span>
          </div>
        )}

        {loading && <Loader text="Loading hotels..." />}

        {error && (
          <div className="alert-lux-danger mb-4">
            <i className="bi bi-exclamation-circle me-2" />{error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon"><i className="bi bi-building-x" /></div>
            <h5 className="font-display">No hotels found</h5>
            <p className="text-muted">
              {cityFilter
                ? `No hotels found in ${cityFilter}. Try a different city.`
                : search
                  ? `No results for "${search}". Try a different search.`
                  : 'No hotels available at the moment.'
              }
            </p>
            {cityFilter && (
              <button className="btn btn-gold mt-2" onClick={clearCity}>
                View All Hotels
              </button>
            )}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="row g-4">
            {filtered.map((hotel, i) => (
              <div key={hotel.id} className="col-md-6 col-lg-4">
                <HotelCard hotel={hotel} index={i} />
              </div>
            ))}
          </div>
        )}

      </div>
    </>
  )
}