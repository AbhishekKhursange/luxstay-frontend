import { useNavigate } from 'react-router-dom'

const HOTEL_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=300&fit=crop',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=300&fit=crop',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=300&fit=crop',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=300&fit=crop',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=300&fit=crop',
  'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&h=300&fit=crop',
]
const ICONS = ['🏨','🏩','🏰','🏯','⛩️','🏪']

export default function HotelCard({ hotel, index = 0 }) {
  const navigate = useNavigate()

  const imgUrl = hotel.imageUrl || HOTEL_IMAGES[index % HOTEL_IMAGES.length]

  return (
    <div className="card hotel-card h-100 shadow-sm">

      <div className="hotel-card-img-wrapper">
        <img
          src={imgUrl}
          alt={hotel.name}
          className="hotel-card-img"
          onError={e => {
            e.target.onerror = null
            e.target.src = HOTEL_IMAGES[index % HOTEL_IMAGES.length]
          }}
        />
      </div>

      <div className="card-body pb-2">
        <p className="hotel-card-location mb-1">
          <i className="bi bi-geo-alt-fill me-1" />{hotel.location}
        </p>
        <h5 className="hotel-card-name mb-3">{hotel.name}</h5>
        <div className="d-flex gap-2 flex-wrap">
          <span className="tag-chip">
            <i className="bi bi-star-fill" style={{ color: '#f1c40f' }} />4.8
          </span>
          <span className="tag-chip"><i className="bi bi-wifi" />Free WiFi</span>
          <span className="tag-chip"><i className="bi bi-cup-hot" />Breakfast</span>
        </div>
      </div>

      <div className="card-footer hotel-card-footer d-flex align-items-center justify-content-between">
        <div>
          <div className="hotel-price-label">Starting from</div>
          <div className="hotel-price">
            ₹2,499 <small className="text-muted fw-normal fs-6">/night</small>
          </div>
        </div>
        <button
          className="btn btn-gold btn-sm px-3"
          onClick={() => navigate(`/hotels/${hotel.id}`)}
        >
          View Rooms
        </button>
      </div>

    </div>
  )
}