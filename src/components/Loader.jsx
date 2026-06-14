export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="lux-loader">
      <div className="spinner-gold" />
      <p className="text-muted small mb-0">{text}</p>
    </div>
  )
}