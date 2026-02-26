import React, { useState } from 'react'

function fmt(n) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(0)}M`
  return `$${n.toFixed(0)}`
}

const RANK_COLORS = ['#ffd700','#c0c0c0','#cd7f32']

export default function TopCountries({ data }) {
  const [metric, setMetric] = useState('revenue')
  const sorted = [...data].sort((a, b) => b[metric] - a[metric]).slice(0, 15)
  const max = sorted[0]?.[metric] ?? 1

  return (
    <div className="card fade-in fade-in-6" style={{ marginBottom: 0 }}>
      <div className="card-header">
        <div className="card-title">Top Countries</div>
        <div className="tabs">
          {['revenue','profit','orders'].map(m => (
            <button key={m} className={`tab-btn${metric === m ? ' active' : ''}`} onClick={() => setMetric(m)}>
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div style={{ overflowY: 'auto', maxHeight: 380 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Country</th>
              <th>Revenue</th>
              <th>Profit</th>
              <th>Orders</th>
              <th style={{ width: 80 }}>Share</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((d, i) => {
              const pct = (d[metric] / max * 100).toFixed(0)
              const rankColor = i < 3 ? RANK_COLORS[i] : 'var(--text-dim)'
              return (
                <tr key={d.country}>
                  <td>
                    <span
                      className="rank-badge"
                      style={{
                        background: i < 3 ? `${rankColor}22` : 'var(--bg-hover)',
                        color: rankColor,
                      }}
                    >
                      {i + 1}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{d.country}</td>
                  <td style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>{fmt(d.revenue)}</td>
                  <td style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{fmt(d.profit)}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{d.orders.toLocaleString()}</td>
                  <td>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, var(--accent-blue), var(--accent-purple))`,
                        }}
                      />
                    </div>
                    <div style={{ fontSize: 9, color: 'var(--text-dim)', marginTop: 2 }}>{pct}%</div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
