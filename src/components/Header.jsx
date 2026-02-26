import React from 'react'

export default function Header({ lastUpdated }) {
  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo">C</div>
        <div>
          <div className="header-title">CRM Analytics</div>
          <div className="header-sub">Sales Intelligence Dashboard</div>
        </div>
      </div>
      <div className="header-right">
        <span className="header-badge">5,000,000 Records</span>
        <span className="header-badge" style={{ color: 'var(--accent-cyan)', borderColor: 'rgba(79,209,197,0.25)', background: 'rgba(79,209,197,0.08)' }}>
          Global Sales
        </span>
        <div className="live-dot" title="Data loaded" />
      </div>
    </header>
  )
}
