import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { hotelApi } from '../api/hotelApi'
import RoomCard from '../components/RoomCard'
import Loader from '../components/Loader'

const HOTEL_HERO_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1400&h=500&fit=crop',
]

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&h=600&fit=crop',
]

const ALL_AMENITIES = [
  { icon: 'bi-wifi', label: 'Free WiFi' },
  { icon: 'bi-water', label: 'Swimming Pool' },
  { icon: 'bi-flower1', label: 'Spa & Wellness' },
  { icon: 'bi-p-circle', label: 'Free Parking' },
  { icon: 'bi-cup-hot', label: 'Restaurant' },
  { icon: 'bi-glass-cocktail', label: 'Bar & Lounge' },
  { icon: 'bi-bicycle', label: 'Fitness Center' },
  { icon: 'bi-shield-check', label: '24/7 Security' },
  { icon: 'bi-person-workspace', label: 'Business Center' },
  { icon: 'bi-airplane', label: 'Airport Shuttle' },
  { icon: 'bi-tv', label: 'Conference Room' },
  { icon: 'bi-bag', label: 'Laundry Service' },
  { icon: 'bi-wind', label: 'Air Conditioning' },
  { icon: 'bi-heart-pulse', label: 'Medical Assistance' },
  { icon: 'bi-car-front', label: 'Valet Parking' },
  { icon: 'bi-moon-stars', label: 'Room Service' },
]

const STRIP_AMENITIES = ALL_AMENITIES.slice(0, 6)

export default function HotelDetailPage() {
  const { id } = useParams()
  const [hotel, setHotel] = useState(null)
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showGallery, setShowGallery] = useState(false)
  const [showFacilities, setShowFacilities] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)

  const heroImg = hotel?.imageUrl || HOTEL_HERO_IMAGES[parseInt(id) % HOTEL_HERO_IMAGES.length]
  const dbGallery = hotel?.galleryImages
    ? hotel.galleryImages.split(',').map(u => u.trim()).filter(Boolean)
    : []
  const galleryImgs = [heroImg, ...(dbGallery.length > 0 ? dbGallery : GALLERY_IMAGES)]

  useEffect(() => {
    Promise.all([hotelApi.getById(id), hotelApi.getRooms(id)])
      .then(([h, r]) => { setHotel(h); setRooms(r) })
      .catch(() => setError('Failed to load hotel details.'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' && showGallery)
        setGalleryIndex(i => (i + 1) % galleryImgs.length)
      if (e.key === 'ArrowLeft' && showGallery)
        setGalleryIndex(i => (i - 1 + galleryImgs.length) % galleryImgs.length)
      if (e.key === 'Escape') {
        setShowGallery(false)
        setShowFacilities(false)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [showGallery, galleryImgs.length])

  if (loading) return <Loader text="Loading hotel details..." />
  if (error) return (
    <div className="container py-5">
      <div className="alert-lux-danger">{error}</div>
    </div>
  )

  return (
    <>
      {/* Hero Banner */}
      <div className="hotel-detail-hero">
        <img
          src={heroImg}
          alt={hotel?.name}
          className="hotel-detail-hero-bg"
          onError={e => { e.target.onerror = null; e.target.src = HOTEL_HERO_IMAGES[0] }}
        />
        <div className="hotel-detail-hero-overlay" />
        <button
          className="show-photos-btn"
          onClick={() => { setGalleryIndex(0); setShowGallery(true) }}
        >
          <i className="bi bi-images me-2" />Show all photos
        </button>
        <div className="container hotel-detail-hero-content">
          <div className="lux-breadcrumb mb-3">
            <Link to="/">Home</Link>
            <span className="sep"><i className="bi bi-chevron-right" /></span>
            <Link to="/hotels">Hotels</Link>
            <span className="sep"><i className="bi bi-chevron-right" /></span>
            <span className="current">{hotel?.name}</span>
          </div>
          <h1 className="font-display text-white fw-bold mb-2"
            style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>
            {hotel?.name}
          </h1>
          <div className="d-flex gap-3 align-items-center flex-wrap">
            <span className="text-white-75">
              <i className="bi bi-geo-alt-fill me-1 text-gold" />{hotel?.location}
            </span>
            <span className="badge bg-warning text-dark">
              <i className="bi bi-star-fill me-1" />4.8 · Exceptional
            </span>
            <span className="text-white-50 small">
              <i className="bi bi-chat-dots me-1" />2,847 reviews
            </span>
          </div>
        </div>
      </div>

      {/* Photo strip */}
      <div className="container mt-3 mb-2">
        <div className="row g-2">
          {galleryImgs.slice(1, 5).map((img, i) => (
            <div key={i} className="col-3">
              <div
                className="hotel-thumb"
                onClick={() => { setGalleryIndex(i + 1); setShowGallery(true) }}
              >
                <img src={img} alt={`Hotel view ${i + 1}`} className="hotel-thumb-img" />
                {i === 3 && galleryImgs.length > 5 && (
                  <div className="hotel-thumb-more">
                    <i className="bi bi-images me-1" />+{galleryImgs.length - 5} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container py-4 pb-5">

        {/* Amenities strip */}
        <div className="amenities-strip mb-5 shadow-sm">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div className="d-flex flex-wrap gap-4">
              {STRIP_AMENITIES.map(a => (
                <div key={a.label} className="d-flex align-items-center gap-2 amenity-item">
                  <i className={`bi ${a.icon} text-success`} />
                  <span>{a.label}</span>
                </div>
              ))}
            </div>
            <button
              className="btn btn-outline-dark btn-sm px-3"
              onClick={() => setShowFacilities(true)}
            >
              <i className="bi bi-grid-3x3-gap me-2" />View all facilities
            </button>
          </div>
        </div>

        {/* Rooms */}
        <div className="mb-4">
          <p className="section-eyebrow mb-1">Available</p>
          <h2 className="font-display display-6 fw-bold">Choose Your Room</h2>
          <div className="gold-divider" />
        </div>

        {rooms.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><i className="bi bi-door-closed" /></div>
            <h5 className="font-display">No rooms available</h5>
            <p className="text-muted">This hotel has no rooms listed yet.</p>
          </div>
        ) : (
          <div className="row g-4">
            {rooms.map((room, i) => (
              <div key={room.id} className="col-md-6 col-lg-4">
                <RoomCard room={room} hotelId={id} index={i} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gallery Modal */}
      {showGallery && (
        <div className="lux-modal-backdrop" onClick={() => setShowGallery(false)}>
          <div className="lux-gallery-modal" onClick={e => e.stopPropagation()}>
            <button className="lux-modal-close" onClick={() => setShowGallery(false)}>
              <i className="bi bi-x-lg" />
            </button>
            <div className="gallery-main-img-wrap">
              <img src={galleryImgs[galleryIndex]} alt="Hotel" className="gallery-main-img" />
              <button
                className="gallery-nav gallery-prev"
                onClick={() => setGalleryIndex(i => (i - 1 + galleryImgs.length) % galleryImgs.length)}
              ><i className="bi bi-chevron-left" /></button>
              <button
                className="gallery-nav gallery-next"
                onClick={() => setGalleryIndex(i => (i + 1) % galleryImgs.length)}
              ><i className="bi bi-chevron-right" /></button>
              <div className="gallery-counter">{galleryIndex + 1} / {galleryImgs.length}</div>
            </div>
            <div className="gallery-thumbs">
              {galleryImgs.map((img, i) => (
                <img key={i} src={img} alt="" className={`gallery-thumb ${i === galleryIndex ? 'active' : ''}`} onClick={() => setGalleryIndex(i)} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Facilities Modal */}
      {showFacilities && (
        <div className="lux-modal-backdrop" onClick={() => setShowFacilities(false)}>
          <div className="lux-popup" onClick={e => e.stopPropagation()}>
            <div className="lux-popup-header">
              <h5 className="font-display mb-0">All Hotel Facilities</h5>
              <button className="lux-modal-close-sm" onClick={() => setShowFacilities(false)}>
                <i className="bi bi-x-lg" />
              </button>
            </div>
            <div className="lux-popup-body">
              <div className="row g-3">
                {ALL_AMENITIES.map(a => (
                  <div key={a.label} className="col-6 col-md-4">
                    <div className="facility-item">
                      <i className={`bi ${a.icon} text-success me-2`} />
                      {a.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
