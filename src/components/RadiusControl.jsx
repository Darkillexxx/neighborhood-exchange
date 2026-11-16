import { useState } from 'react'
import { ChevronUp } from 'lucide-react'
import { RADIUS_MAX, RADIUS_MIN, RADIUS_STEP, formatRadius } from '../data/map.js'
import './RadiusControl.css'

// The "Radius 800 m" pill on the Nearby map. Tapping it shows or hides the slider.
export default function RadiusControl({ value, onChange }) {
  const [open, setOpen] = useState(true)
  const fill = ((value - RADIUS_MIN) / (RADIUS_MAX - RADIUS_MIN)) * 100

  return (
    <div className="radius">
      <button
        type="button"
        className="radius__pill"
        aria-expanded={open}
        aria-controls="radius-panel"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="radius__label">Radius</span>
        <span className="radius__value">{formatRadius(value)}</span>
        <ChevronUp size={20} strokeWidth={2.2} className={`radius__chevron${open ? '' : ' is-closed'}`} />
      </button>

      <div id="radius-panel" className="radius__panel" hidden={!open}>
        <input
          id="radius"
          type="range"
          className="radius__slider"
          min={RADIUS_MIN}
          max={RADIUS_MAX}
          step={RADIUS_STEP}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ '--fill': `${fill}%` }}
          aria-label="Search radius"
          aria-valuetext={formatRadius(value)}
        />
        <div className="radius__scale" aria-hidden="true">
          <span>{formatRadius(RADIUS_MIN)}</span>
          <span>{formatRadius(RADIUS_MAX)}</span>
        </div>
      </div>
    </div>
  )
}
