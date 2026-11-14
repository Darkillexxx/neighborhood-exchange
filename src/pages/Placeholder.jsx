import './Placeholder.css'

// Temporary screen for tabs we haven't built yet.
export default function Placeholder({ icon: Icon, title, text }) {
  return (
    <main className="screen placeholder">
      <h1>{title}</h1>
      <div className="placeholder__box">
        <span className="placeholder__icon">
          <Icon size={28} strokeWidth={1.75} />
        </span>
        <p>{text}</p>
      </div>
    </main>
  )
}
