import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ROOM_TYPE_IMAGES = {
  'Standard': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=220&fit=crop',
  'Deluxe': 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=220&fit=crop',
  'Suite': 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=600&h=220&fit=crop',
  'Presidential Suite': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=220&fit=crop',
  'Studio': 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=220&fit=crop',
  'Family Room': 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&h=220&fit=crop',
}
const DEFAULT_ROOM_IMG = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=220&fit=crop'

// Map amenity text to bootstrap icon
const AMENITY_ICONS = {
  'WiFi': 'bi-wifi', 'AC': 'bi-wind', 'TV': 'bi-tv',
  'Mini Bar': 'bi-cup-straw', 'Safe': 'bi-shield-lock',
  'Jacuzzi': 'bi-droplet', 'Bathtub': 'bi-droplet-half',
  'Balcony': 'bi-door-open', 'Kitchen': 'bi-fire',
  'Sofa': 'bi-columns-gap', 'Desk': 'bi-laptop',
  'Iron': 'bi-wrench', 'Hairdryer': 'bi-wind',
}

export default function RoomCard({ room, hotelId, index = 0 }) {
  const navigate = useNavigate()
  const { isLoggedIn, user } = useAuth()
  const [showDetails, setShowDetails] = useState(false)
  const [imgIndex, setImgIndex] = useState(0)

  const soldOut = room.availableRooms <= 0
  const lowStock = !soldOut && room.availableRooms <= 3

  const availBadgeClass = soldOut
    ? 'avail-badge badge-avail-none'
    : lowStock ? 'avail-badge badge-avail-low'
      : 'avail-badge badge-avail-ok'

  const availText = soldOut ? 'Sold Out'
    : lowStock ? `Only ${room.availableRooms} left`
      : `${room.availableRooms} Available`

  const roomImg = room.imageUrl || ROOM_TYPE_IMAGES[room.roomType] || DEFAULT_ROOM_IMG

  // Parse amenities — stored as comma-separated string
  const amenityList = room.amenities
    ? room.amenities.split(',').map(a => a.trim()).filter(Boolean)
    : []

  // Parse extra images — stored as comma-separated URLs
  const extraImgs = room.extraImageUrls
    ? room.extraImageUrls.split(',').map(u => u.trim()).filter(Boolean)
    : []

  // All images for the detail popup slider
  const allImgs = [roomImg, ...extraImgs]

  const handleBook = () => {
    if (!isLoggedIn) {
      navigate('/register', { state: { from: { pathname: `/hotels/${hotelId}` } } })
      return
    }
    navigate(`/book/${room.id}`, { state: { room, hotelId } })
  }

  // Keyboard navigation for room image slider
  useEffect(() => {
    if (!showDetails) return

    const handleKey = (e) => {
      if (e.key === 'ArrowRight') setImgIndex(i => (i + 1) % allImgs.length)
      if (e.key === 'ArrowLeft') setImgIndex(i => (i - 1 + allImgs.length) % allImgs.length)
      if (e.key === 'Escape') setShowDetails(false)
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [showDetails, allImgs.length])

  return (
    <>
      <div className="card room-card h-100 shadow-sm">

        {/* Room image with availability badge */}
        <div className="room-card-img-wrapper">
          <img
            src={roomImg}
            alt={room.roomType}
            className="room-card-img"
            onError={e => { e.target.onerror = null; e.target.src = DEFAULT_ROOM_IMG }}
          />
          <span className={`room-card-avail-badge ${availBadgeClass}`}>
            {availText}
          </span>
        </div>

        <div className="card-body">
          <span className="room-type-badge mb-2 d-inline-block">{room.roomType}</span>

          <div className="room-price mb-2">
            ₹{room.pricePerNight?.toLocaleString('en-IN')}
            <small>/night</small>
          </div>

          {/* Key info row */}
          <div className="d-flex gap-3 room-meta mb-3 flex-wrap">
            {room.bedType && (
              <span><i className="bi bi-columns-gap me-1" />{room.bedType}</span>
            )}
            {room.maxOccupancy > 0 && (
              <span><i className="bi bi-people me-1" />{room.maxOccupancy} Guests</span>
            )}
            {room.roomSizeSqm > 0 && (
              <span><i className="bi bi-aspect-ratio me-1" />{room.roomSizeSqm} sqm</span>
            )}
          </div>

          {/* First 3 amenities */}
          {amenityList.length > 0 && (
            <div className="d-flex gap-2 flex-wrap mb-3">
              {amenityList.slice(0, 3).map(a => (
                <span key={a} className="tag-chip">
                  <i className={`bi ${AMENITY_ICONS[a] || 'bi-check-circle'}`} />
                  {a}
                </span>
              ))}
              {amenityList.length > 3 && (
                <span className="tag-chip text-gold">+{amenityList.length - 3} more</span>
              )}
            </div>
          )}

          <p className="room-total-label mb-0">
            <i className="bi bi-grid-3x3-gap me-1" />{room.totalRooms} total rooms
          </p>
        </div>

        <div className="card-footer bg-light border-0 pt-0 pb-3 px-3 d-flex gap-2">
          <button
            className="btn btn-outline-secondary btn-sm flex-shrink-0"
            onClick={() => { setImgIndex(0); setShowDetails(true) }}
          >
            <i className="bi bi-info-circle me-1" />Details
          </button>
          {user?.role === 'ADMIN' ? (
            <div className="w-100 text-center text-muted small d-flex align-items-center justify-content-center">
              <i className="bi bi-shield-check me-1 text-gold" />Admin view only
            </div>
          ) : (
            <button
              className="btn btn-gold w-100"
              onClick={handleBook}
              disabled={soldOut}
            >
              {soldOut ? 'Unavailable' : 'Book Now'}
            </button>
          )}
        </div>
      </div>

      {/* ── Room Detail Popup ── */}
      {showDetails && (
        <div className="lux-modal-backdrop" onClick={() => setShowDetails(false)}>
          <div className="room-detail-popup" onClick={e => e.stopPropagation()}>

            {/* Close */}
            <button className="lux-modal-close-sm" onClick={() => setShowDetails(false)}>
              <i className="bi bi-x-lg" />
            </button>

            {/* Image slider */}
            <div className="room-detail-img-wrap">
              <img
                src={allImgs[imgIndex]}
                alt={room.roomType}
                className="room-detail-img"
                onError={e => { e.target.onerror = null; e.target.src = DEFAULT_ROOM_IMG }}
              />
              {allImgs.length > 1 && (
                <>
                  <button
                    className="gallery-nav gallery-prev"
                    onClick={() => setImgIndex(i => (i - 1 + allImgs.length) % allImgs.length)}
                  ><i className="bi bi-chevron-left" /></button>
                  <button
                    className="gallery-nav gallery-next"
                    onClick={() => setImgIndex(i => (i + 1) % allImgs.length)}
                  ><i className="bi bi-chevron-right" /></button>
                  <div className="gallery-counter">{imgIndex + 1} / {allImgs.length}</div>
                </>
              )}
            </div>

            <div className="room-detail-body">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
                <div>
                  <span className="room-type-badge">{room.roomType}</span>
                  <div className="room-price mt-2">
                    ₹{room.pricePerNight?.toLocaleString('en-IN')}
                    <small>/night</small>
                  </div>
                </div>
                <span className={availBadgeClass}>{availText}</span>
              </div>

              {room.description && (
                <p className="text-muted small mb-3">{room.description}</p>
              )}

              {/* Section 1 — Bed & Occupancy */}
              <div className="room-detail-section">
                <div className="room-detail-section-title">
                  <i className="bi bi-moon-stars me-2 text-gold" />Bed & Occupancy
                </div>
                <div className="row g-2">
                  {room.bedType && (
                    <div className="col-6">
                      <div className="room-detail-item">
                        <i className="bi bi-columns-gap me-2" />
                        <span>{room.bedType} Bed</span>
                      </div>
                    </div>
                  )}
                  {room.numberOfBeds > 0 && (
                    <div className="col-6">
                      <div className="room-detail-item">
                        <i className="bi bi-columns-gap me-2" />
                        <span>{room.numberOfBeds} {room.numberOfBeds === 1 ? 'Bed' : 'Beds'}</span>
                      </div>
                    </div>
                  )}
                  {room.maxOccupancy > 0 && (
                    <div className="col-6">
                      <div className="room-detail-item">
                        <i className="bi bi-people me-2" />
                        <span>Max {room.maxOccupancy} Guests</span>
                      </div>
                    </div>
                  )}
                  {room.roomSizeSqm > 0 && (
                    <div className="col-6">
                      <div className="room-detail-item">
                        <i className="bi bi-aspect-ratio me-2" />
                        <span>{room.roomSizeSqm} sqm</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 2 — Amenities */}
              {amenityList.length > 0 && (
                <div className="room-detail-section">
                  <div className="room-detail-section-title">
                    <i className="bi bi-grid me-2 text-gold" />Amenities & Facilities
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {amenityList.map(a => (
                      <span key={a} className="tag-chip">
                        <i className={`bi ${AMENITY_ICONS[a] || 'bi-check-circle'}`} />
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 3 — Policies */}
              <div className="room-detail-section">
                <div className="room-detail-section-title">
                  <i className="bi bi-shield-check me-2 text-gold" />Policies
                </div>
                <div className="row g-2">
                  {room.cancellationPolicy && (
                    <div className="col-12">
                      <div className="room-detail-item">
                        <i className="bi bi-calendar-x me-2 text-muted" />
                        <span>Cancellation: <strong>{room.cancellationPolicy}</strong></span>
                      </div>
                    </div>
                  )}
                  <div className="col-6">
                    <div className={`room-detail-item ${room.breakfastIncluded ? 'text-success' : 'text-muted'}`}>
                      <i className={`bi ${room.breakfastIncluded ? 'bi-check-circle-fill' : 'bi-x-circle'} me-2`} />
                      Breakfast {room.breakfastIncluded ? 'Included' : 'Not Included'}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className={`room-detail-item ${room.petsAllowed ? 'text-success' : 'text-muted'}`}>
                      <i className={`bi ${room.petsAllowed ? 'bi-check-circle-fill' : 'bi-x-circle'} me-2`} />
                      Pets {room.petsAllowed ? 'Allowed' : 'Not Allowed'}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className={`room-detail-item ${room.smokingAllowed ? 'text-success' : 'text-muted'}`}>
                      <i className={`bi ${room.smokingAllowed ? 'bi-check-circle-fill' : 'bi-x-circle'} me-2`} />
                      Smoking {room.smokingAllowed ? 'Allowed' : 'Not Allowed'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Book button */}
              {user?.role === 'ADMIN' ? (
                <div className="alert-lux-info mt-3 text-center">
                  <i className="bi bi-shield-check me-2" />
                  Admins cannot book rooms. Use a guest account.
                </div>
              ) : (
                <button
                  className="btn btn-gold w-100 py-2 mt-2"
                  onClick={() => { setShowDetails(false); handleBook() }}
                  disabled={soldOut}
                >
                  {soldOut
                    ? 'Unavailable'
                    : <><i className="bi bi-check-circle me-2" />Book This Room</>
                  }
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
