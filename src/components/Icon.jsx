import './Icon.css'

// Draws an SVG file from src/assets/icons in the current text color (CSS `color`),
// so one file works for every state: active tab, saved item, and so on.
export default function Icon({ src, size = 22 }) {
  return (
    <span
      className="icon"
      style={{ '--icon-src': `url("${src}")`, width: size, height: size }}
      aria-hidden="true"
    />
  )
}
