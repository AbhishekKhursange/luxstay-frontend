import { useState, useEffect } from 'react'
import axios from 'axios'
import { hotelApi } from '../api/hotelApi'
import { bookingApi } from '../api/bookingApi'
import { userApi } from '../api/userApi'
import { getAccessToken } from '../utils/tokenUtils'
import Loader from '../components/Loader'
import { getErrorMsg } from '../utils/errorUtils'

// ─── Image Uploader ──────────────────────────────────────────────
function ImageUploader({ onUpload, currentUrl, label = 'Image' }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentUrl || '')

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await axios.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${getAccessToken()}`
        }
      })
      onUpload(res.data.imageUrl)
    } catch {
      alert('Image upload failed. Please try again.')
      setPreview('')
      onUpload('')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="form-label-lux">{label}</label>
      {preview && (
        <div className="mb-2 mt-1">
          <img src={preview} alt="Preview"
            style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border-col)' }} />
        </div>
      )}
      <label className="btn btn-outline-secondary w-100 mt-1" style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}>
        {uploading
          ? <><span className="spinner-border spinner-border-sm me-2" />Uploading...</>
          : <><i className="bi bi-upload me-2" />{preview ? 'Change Image' : 'Upload from your computer'}</>
        }
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile}
          style={{ display: 'none' }} disabled={uploading} />
      </label>
      <small className="text-muted d-block mt-1">JPG, PNG, WEBP — max 10MB. Optional.</small>
    </div>
  )
}

// ─── Multi Image Uploader ────────────────────────────────────────
function MultiImageUploader({ onUrlsChange, label = 'Gallery Images' }) {
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await axios.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${getAccessToken()}`
        }
      })
      const newImages = [...images, res.data.imageUrl]
      setImages(newImages)
      onUrlsChange(newImages.join(','))
    } catch {
      alert('Upload failed. Try again.')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onUrlsChange(newImages.join(','))
  }

  return (
    <div>
      <label className="form-label-lux">{label}</label>
      <small className="text-muted d-block mb-2">
        Upload multiple photos
      </small>
      {images.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mb-2">
          {images.map((url, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <img src={url} alt={`img-${i}`}
                style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border-col)' }}
              />
              <button type="button" onClick={() => removeImage(i)}
                style={{
                  position: 'absolute', top: -6, right: -6,
                  background: '#c0392b', border: 'none', borderRadius: '50%',
                  width: 20, height: 20, color: '#fff', fontSize: '0.7rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                <i className="bi bi-x" />
              </button>
            </div>
          ))}
        </div>
      )}
      <label className="btn btn-outline-secondary w-100" style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}>
        {uploading
          ? <><span className="spinner-border spinner-border-sm me-2" />Uploading...</>
          : <><i className="bi bi-images me-2" />Add Photo ({images.length} added)</>
        }
        <input type="file" accept="image/jpeg,image/png,image/webp"
          onChange={handleFile} style={{ display: 'none' }} disabled={uploading} />
      </label>
    </div>
  )
}

// ─── Tab: Add Hotel ──────────────────────────────────────────────
function AddHotelTab({ onSuccess }) {
  const [form, setForm] = useState({ name: '', location: '', imageUrl: '', galleryImages: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setError(''); setSuccess('')
    setLoading(true)
    try {
      await hotelApi.createHotel(form)
      setSuccess(`Hotel "${form.name}" created successfully!`)
      setForm({ name: '', location: '', imageUrl: '', galleryImages: '' })
      onSuccess?.()
    } catch (err) {
      setError(getErrorMsg(err, 'Failed to create hotel.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-6">
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <h5 className="font-display mb-1">Add New Hotel</h5>
            <div className="gold-divider" />
            {error && <div className="alert-lux-danger mb-3"><i className="bi bi-exclamation-triangle me-2" />{error}</div>}
            {success && <div className="alert-lux-success mb-3"><i className="bi bi-check-circle me-2" />{success}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label-lux">Hotel Name</label>
                <input className="form-control-lux mt-1" type="text" name="name"
                  placeholder="e.g. The Grand Palace" value={form.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label-lux">Location</label>
                <input className="form-control-lux mt-1" type="text" name="location"
                  placeholder="e.g. Mumbai, India" value={form.location} onChange={handleChange} required />
              </div>
              <div className="mb-4">
                <ImageUploader label="Hotel Image"
                  onUpload={url => setForm(f => ({ ...f, imageUrl: url }))}
                  currentUrl={form.imageUrl} />
              </div>
              <div className="mb-4">
                <MultiImageUploader
                  label="Hotel Gallery Photos"
                  onUrlsChange={urls => setForm(f => ({ ...f, galleryImages: urls }))}
                />
              </div>
              <button className="btn btn-gold w-100 py-2" disabled={loading}>
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2" />Creating...</>
                  : <><i className="bi bi-plus-circle me-2" />Create Hotel</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Tab: Add Room ───────────────────────────────────────────────
const AMENITY_OPTIONS = ['WiFi', 'AC', 'TV', 'Mini Bar', 'Safe', 'Jacuzzi', 'Bathtub', 'Balcony', 'Kitchen', 'Sofa', 'Desk', 'Iron', 'Hairdryer']
const BED_TYPES = ['King', 'Queen', 'Twin', 'Single', 'Double', 'Bunk']
const CANCEL_POLICIES = ['Free Cancellation', 'Non-refundable', '24hr Notice', '48hr Notice']

function AddRoomTab() {
  const [hotels, setHotels] = useState([])
  const [form, setForm] = useState({
    hotelId: '', roomType: '', description: '',
    pricePerNight: '', totalRooms: '', imageUrl: '',
    bedType: '', maxOccupancy: '', numberOfBeds: '', roomSizeSqm: '',
    amenities: [],
    cancellationPolicy: '', breakfastIncluded: false,
    petsAllowed: false, smokingAllowed: false,
    extraImageUrls: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => { hotelApi.getAll().then(setHotels).catch(() => { }) }, [])

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const toggleAmenity = (a) => {
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter(x => x !== a)
        : [...f.amenities, a]
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError(''); setSuccess('')
    setLoading(true)
    try {
      await hotelApi.addRoom({
        hotelId: parseInt(form.hotelId),
        roomType: form.roomType,
        description: form.description,
        pricePerNight: parseFloat(form.pricePerNight),
        totalRooms: parseInt(form.totalRooms),
        imageUrl: form.imageUrl || null,
        bedType: form.bedType,
        maxOccupancy: parseInt(form.maxOccupancy) || 0,
        numberOfBeds: parseInt(form.numberOfBeds) || 0,
        roomSizeSqm: parseFloat(form.roomSizeSqm) || 0,
        amenities: form.amenities.join(','),
        cancellationPolicy: form.cancellationPolicy,
        breakfastIncluded: form.breakfastIncluded,
        petsAllowed: form.petsAllowed,
        smokingAllowed: form.smokingAllowed,
        extraImageUrls: form.extraImageUrls || null,
      })
      setSuccess('Room added successfully!')
      setForm({
        hotelId: '', roomType: '', description: '',
        pricePerNight: '', totalRooms: '', imageUrl: '',
        bedType: '', maxOccupancy: '', numberOfBeds: '', roomSizeSqm: '',
        amenities: [], cancellationPolicy: '',
        breakfastIncluded: false, petsAllowed: false, smokingAllowed: false,
        extraImageUrls: '',
      })
    } catch (err) {
      setError(getErrorMsg(err, 'Failed to add room.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-7">
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <h5 className="font-display mb-1">Add Room to Hotel</h5>
            <div className="gold-divider" />
            {error && <div className="alert-lux-danger mb-3"><i className="bi bi-exclamation-triangle me-2" />{error}</div>}
            {success && <div className="alert-lux-success mb-3"><i className="bi bi-check-circle me-2" />{success}</div>}

            <form onSubmit={handleSubmit}>

              {/* ── Section 1: Basic Info ── */}
              <div className="room-form-section-title">
                <i className="bi bi-info-circle me-2 text-gold" />Basic Room Information
              </div>
              <div className="mb-3">
                <label className="form-label-lux">Select Hotel</label>
                <select className="form-select-lux mt-1" name="hotelId" value={form.hotelId} onChange={handleChange} required>
                  <option value="">— Choose a hotel —</option>
                  {hotels.map(h => <option key={h.id} value={h.id}>{h.name} — {h.location}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label-lux">Room Type</label>
                <select className="form-select-lux mt-1" name="roomType" value={form.roomType} onChange={handleChange} required>
                  <option value="">— Choose type —</option>
                  {['Standard', 'Deluxe', 'Suite', 'Presidential Suite', 'Studio', 'Family Room'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label-lux">Description</label>
                <textarea className="form-control-lux mt-1" name="description" rows={2}
                  placeholder="Brief description of the room..." value={form.description} onChange={handleChange} />
              </div>
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label-lux">Price Per Night (₹)</label>
                  <input className="form-control-lux mt-1" type="number" name="pricePerNight"
                    placeholder="e.g. 3500" value={form.pricePerNight} onChange={handleChange} min="1" required />
                </div>
                <div className="col-6">
                  <label className="form-label-lux">Total Rooms</label>
                  <input className="form-control-lux mt-1" type="number" name="totalRooms"
                    placeholder="e.g. 10" value={form.totalRooms} onChange={handleChange} min="1" required />
                </div>
              </div>

              {/* ── Section 2: Bed & Occupancy ── */}
              <div className="room-form-section-title mt-4">
                <i className="bi bi-moon-stars me-2 text-gold" />Bed & Occupancy Details
              </div>
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label-lux">Bed Type</label>
                  <select className="form-select-lux mt-1" name="bedType" value={form.bedType} onChange={handleChange}>
                    <option value="">— Select —</option>
                    {BED_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label-lux">Number of Beds</label>
                  <input className="form-control-lux mt-1" type="number" name="numberOfBeds"
                    placeholder="e.g. 1" value={form.numberOfBeds} onChange={handleChange} min="0" />
                </div>
                <div className="col-6">
                  <label className="form-label-lux">Max Occupancy</label>
                  <input className="form-control-lux mt-1" type="number" name="maxOccupancy"
                    placeholder="e.g. 2" value={form.maxOccupancy} onChange={handleChange} min="0" />
                </div>
                <div className="col-6">
                  <label className="form-label-lux">Room Size (sqm)</label>
                  <input className="form-control-lux mt-1" type="number" name="roomSizeSqm"
                    placeholder="e.g. 32" value={form.roomSizeSqm} onChange={handleChange} min="0" />
                </div>
              </div>

              {/* ── Section 3: Amenities ── */}
              <div className="room-form-section-title mt-4">
                <i className="bi bi-grid me-2 text-gold" />Amenities & Facilities
              </div>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {AMENITY_OPTIONS.map(a => (
                  <button key={a} type="button"
                    className={`btn btn-sm ${form.amenities.includes(a) ? 'btn-gold' : 'btn-outline-secondary'}`}
                    onClick={() => toggleAmenity(a)}
                  >
                    {form.amenities.includes(a) && <i className="bi bi-check me-1" />}
                    {a}
                  </button>
                ))}
              </div>

              {/* ── Section 4: Policies & Media ── */}
              <div className="room-form-section-title mt-4">
                <i className="bi bi-shield-check me-2 text-gold" />Policies, Pricing & Media
              </div>
              <div className="mb-3">
                <label className="form-label-lux">Cancellation Policy</label>
                <select className="form-select-lux mt-1" name="cancellationPolicy" value={form.cancellationPolicy} onChange={handleChange}>
                  <option value="">— Select —</option>
                  {CANCEL_POLICIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="d-flex gap-4 mb-3 flex-wrap">
                {[
                  { name: 'breakfastIncluded', label: 'Breakfast Included' },
                  { name: 'petsAllowed', label: 'Pets Allowed' },
                  { name: 'smokingAllowed', label: 'Smoking Allowed' },
                ].map(({ name, label }) => (
                  <div key={name} className="form-check">
                    <input className="form-check-input" type="checkbox" id={name}
                      name={name} checked={form[name]} onChange={handleChange} />
                    <label className="form-check-label small" htmlFor={name}>{label}</label>
                  </div>
                ))}
              </div>
              <div className="mb-3">
                <ImageUploader label="Main Room Image"
                  onUpload={url => setForm(f => ({ ...f, imageUrl: url }))}
                  currentUrl={form.imageUrl} />
              </div>
              <div className="mb-4">
                <MultiImageUploader
                  label="Extra Room Photos"
                  onUrlsChange={urls => setForm(f => ({ ...f, extraImageUrls: urls }))}
                />
                <small className="text-muted d-block mt-1">
                  Upload bathroom, side view, balcony photos etc.
                </small>
              </div>

              <button className="btn btn-gold w-100 py-2" disabled={loading}>
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2" />Adding...</>
                  : <><i className="bi bi-door-open me-2" />Add Room</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Tab: Manage Hotels ──────────────────────────────────────────
function ManageHotelsTab({ refreshKey }) {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const load = () => {
    setLoading(true)
    hotelApi.getAll()
      .then(setHotels)
      .catch(() => setError('Failed to load hotels.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [refreshKey])

  const handleDelete = async (hotel) => {
    if (!window.confirm(`Delete "${hotel.name}"? This cannot be undone.`)) return
    setDeletingId(hotel.id); setError(''); setSuccess('')
    try {
      await hotelApi.deleteHotel(hotel.id)
      setSuccess(`"${hotel.name}" deleted.`)
      load()
    } catch (err) {
      setError(getErrorMsg(err, 'Failed to delete hotel.'))
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return <Loader text="Loading hotels..." />

  return (
    <>
      {error && <div className="alert-lux-danger mb-4"><i className="bi bi-exclamation-circle me-2" />{error}</div>}
      {success && <div className="alert-lux-success mb-4"><i className="bi bi-check-circle me-2" />{success}</div>}
      {hotels.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><i className="bi bi-building" /></div>
          <p className="text-muted">No hotels found.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr><th>#ID</th><th>Hotel Name</th><th>Location</th><th>Image</th><th className="text-end">Actions</th></tr>
            </thead>
            <tbody>
              {hotels.map(h => (
                <tr key={h.id}>
                  <td><span className="badge bg-secondary">#{h.id}</span></td>
                  <td className="fw-semibold">{h.name}</td>
                  <td className="text-muted"><i className="bi bi-geo-alt me-1 text-gold" />{h.location}</td>
                  <td>
                    {h.imageUrl
                      ? <img src={h.imageUrl} alt={h.name} style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                      : <span className="text-muted small">No image</span>}
                  </td>
                  <td className="text-end">
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(h)} disabled={deletingId === h.id}>
                      {deletingId === h.id
                        ? <span className="spinner-border spinner-border-sm" />
                        : <><i className="bi bi-trash me-1" />Delete</>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

// ─── Tab: Manage Rooms ───────────────────────────────────────────
function ManageRoomsTab() {
  const [hotels, setHotels] = useState([])
  const [selectedHotel, setSelectedHotel] = useState('')
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => { hotelApi.getAll().then(setHotels).catch(() => { }) }, [])

  const handleHotelChange = async (e) => {
    const hotelId = e.target.value
    setSelectedHotel(hotelId); setRooms([]); setError('')
    if (!hotelId) return
    setLoading(true)
    try {
      const data = await hotelApi.getRooms(hotelId)
      setRooms(data)
    } catch { setError('Failed to load rooms.') }
    finally { setLoading(false) }
  }

  const handleDelete = async (room) => {
    if (!window.confirm(`Delete "${room.roomType}" room? This cannot be undone.`)) return
    setDeletingId(room.id); setError(''); setSuccess('')
    try {
      await hotelApi.deleteRoom(room.id)
      setSuccess(`"${room.roomType}" deleted.`)
      const data = await hotelApi.getRooms(selectedHotel)
      setRooms(data)
    } catch (err) {
      setError(getErrorMsg(err, 'Failed to delete hotel.'))
    } finally { setDeletingId(null) }
  }

  return (
    <>
      {error && <div className="alert-lux-danger mb-4"><i className="bi bi-exclamation-circle me-2" />{error}</div>}
      {success && <div className="alert-lux-success mb-4"><i className="bi bi-check-circle me-2" />{success}</div>}
      <div className="row mb-4 justify-content-center">
        <div className="col-lg-5">
          <label className="form-label-lux mb-1 d-block text-center">Select Hotel to Manage Rooms</label>
          <select className="form-select-lux" value={selectedHotel} onChange={handleHotelChange}>
            <option value="">— Choose a hotel —</option>
            {hotels.map(h => <option key={h.id} value={h.id}>{h.name} — {h.location}</option>)}
          </select>
        </div>
      </div>
      {loading && <Loader text="Loading rooms..." />}
      {!loading && selectedHotel && rooms.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon"><i className="bi bi-door-closed" /></div>
          <p className="text-muted">No rooms found for this hotel.</p>
        </div>
      )}
      {!loading && rooms.length > 0 && (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr><th>#ID</th><th>Type</th><th>Bed</th><th>Price/Night</th><th>Available</th><th>Image</th><th className="text-end">Actions</th></tr>
            </thead>
            <tbody>
              {rooms.map(room => (
                <tr key={room.id}>
                  <td><span className="badge bg-secondary">#{room.id}</span></td>
                  <td><span className="room-type-badge">{room.roomType}</span></td>
                  <td className="text-muted small">{room.bedType || '—'}</td>
                  <td className="fw-semibold">₹{room.pricePerNight?.toLocaleString('en-IN')}</td>
                  <td>
                    <span className={`badge ${room.availableRooms <= 0 ? 'bg-danger' : room.availableRooms <= 3 ? 'bg-warning text-dark' : 'bg-success'}`}>
                      {room.availableRooms}
                    </span>
                  </td>
                  <td>
                    {room.imageUrl
                      ? <img src={room.imageUrl} alt={room.roomType} style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                      : <span className="text-muted small">No image</span>}
                  </td>
                  <td className="text-end">
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(room)} disabled={deletingId === room.id}>
                      {deletingId === room.id
                        ? <span className="spinner-border spinner-border-sm" />
                        : <><i className="bi bi-trash me-1" />Delete</>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!selectedHotel && (
        <div className="empty-state">
          <div className="empty-state-icon"><i className="bi bi-building" /></div>
          <p className="text-muted">Select a hotel above to manage its rooms.</p>
        </div>
      )}
    </>
  )
}

// ─── Tab: Manage Users ───────────────────────────────────────────
function ManageUsersTab() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    userApi.getAll()
      .then(setUsers)
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader text="Loading users..." />

  return (
    <>
      {error && <div className="alert-lux-danger mb-4">{error}</div>}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>#ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td><span className="badge bg-secondary">#{u.id}</span></td>
                <td className="fw-semibold">
                  <i className="bi bi-person-circle me-2 text-gold" />{u.username}
                </td>
                <td>{u.email || '—'}</td>
                <td>{u.phone || '—'}</td>
                <td>
                  <span className={`badge ${u.role === 'ADMIN' ? 'bg-warning text-dark' : 'bg-primary'}`}>
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

// ─── Tab: All Bookings ───────────────────────────────────────────
function AllBookingsTab() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    bookingApi.getMyBookings()
      .then(setBookings)
      .catch(() => setError('Failed to load bookings.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter)

  const statusBadge = (status) => {
    const map = { CREATED: 'bg-primary', PAID: 'bg-success', FAILED: 'bg-danger' }
    return <span className={`badge ${map[status] || 'bg-secondary'}`}>{status}</span>
  }

  if (loading) return <Loader text="Loading bookings..." />

  return (
    <>
      {error && <div className="alert-lux-danger mb-4">{error}</div>}
      <div className="d-flex gap-2 mb-4 flex-wrap justify-content-center">
        {['ALL', 'CREATED', 'PAID', 'FAILED'].map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-gold' : 'btn-outline-secondary'}`} onClick={() => setFilter(f)}>
            {f}
            <span className="ms-2 badge bg-white text-dark">
              {f === 'ALL' ? bookings.length : bookings.filter(b => b.status === f).length}
            </span>
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><i className="bi bi-calendar-x" /></div>
          <p className="text-muted">No bookings found.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr><th>Booking ID</th><th>Username</th><th>Room ID</th><th>Days</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id}>
                  <td><span className="badge bg-secondary">#{b.bookingId}</span></td>
                  <td className="fw-semibold"><i className="bi bi-person me-1 text-gold" />{b.username}</td>
                  <td className="text-muted">#{b.roomId}</td>
                  <td>{b.days} {b.days === 1 ? 'night' : 'nights'}</td>
                  <td className="fw-bold">₹{b.totalPrice?.toLocaleString('en-IN')}</td>
                  <td>{statusBadge(b.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

// ─── Main Admin Page ─────────────────────────────────────────────
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('add-hotel')
  const [hotelRefreshKey, setHotelRefreshKey] = useState(0)

  const tabs = [
    { key: 'add-hotel', label: 'Add Hotel', icon: 'bi-plus-circle' },
    { key: 'manage-hotels', label: 'Manage Hotels', icon: 'bi-building-gear' },
    { key: 'add-room', label: 'Add Room', icon: 'bi-door-open' },
    { key: 'manage-rooms', label: 'Manage Rooms', icon: 'bi-door-closed' },
    { key: 'manage-users', label: 'Manage Users', icon: 'bi-people' },
    { key: 'all-bookings', label: 'All Bookings', icon: 'bi-calendar-check' },
  ]

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="lux-breadcrumb mb-2">
            <a href="/">Home</a>
            <span className="sep"><i className="bi bi-chevron-right" /></span>
            <span className="current">Admin Dashboard</span>
          </div>
          <h1 className="page-header-title mb-1">
            <i className="bi bi-shield-check me-2 text-gold" />Admin Dashboard
          </h1>
          <p className="page-header-sub mb-0">Manage hotels, rooms and bookings</p>
        </div>
      </div>

      <div className="container pb-5">
        <div className="d-flex gap-2 mb-4 flex-wrap justify-content-center">
          {tabs.map(t => (
            <button key={t.key}
              className={`btn ${activeTab === t.key ? 'btn-gold' : 'btn-outline-secondary'}`}
              onClick={() => setActiveTab(t.key)}
            >
              <i className={`bi ${t.icon} me-2`} />{t.label}
            </button>
          ))}
        </div>
        <div className="mt-3">
          {activeTab === 'add-hotel' && <AddHotelTab onSuccess={() => setHotelRefreshKey(k => k + 1)} />}
          {activeTab === 'manage-hotels' && <ManageHotelsTab refreshKey={hotelRefreshKey} />}
          {activeTab === 'add-room' && <AddRoomTab />}
          {activeTab === 'manage-rooms' && <ManageRoomsTab />}
          {activeTab === 'manage-users' && <ManageUsersTab />}
          {activeTab === 'all-bookings' && <AllBookingsTab />}
        </div>
      </div>
    </>
  )
}
