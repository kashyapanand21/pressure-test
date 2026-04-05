// DemoToggle.jsx
// Shows a banner + toggle switch when demo mode is active.
// Place it inside the topbar or just below it in App.jsx.

export default function DemoToggle({ enabled, onToggle }) {
  return (
    <div className={`demo-banner ${enabled ? 'demo-banner--active' : ''}`}>
      <div className="demo-banner-left">
        <span className="demo-banner-dot" />
        <span className="demo-banner-label">
          {enabled ? 'DEMO MODE · No API calls — showing pre-run session' : 'DEMO MODE · OFF'}
        </span>
      </div>
      <button
        className={`demo-toggle-btn ${enabled ? 'demo-toggle-btn--on' : ''}`}
        onClick={onToggle}
      >
        <span className="demo-toggle-track">
          <span className="demo-toggle-thumb" />
        </span>
        <span>{enabled ? 'ON' : 'OFF'}</span>
      </button>
    </div>
  )
}