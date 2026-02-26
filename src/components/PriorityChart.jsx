import React from 'react'
import { RadialBarChart, RadialBar, Tooltip, ResponsiveContainer } from 'recharts'

const PRIORITY_COLORS = { H: '#fc8181', M: '#f6ad55', L: '#68d391', C: '#63b3ed' }
const PRIORITY_LABELS = { H: 'High', M: 'Medium', L: 'Low', C: 'Critical' }

function fmt(n) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(0)}M`
  return `$${n.toFixed(0)}`
}

export default function PriorityChart({ data }) {
  const total = data.reduce((s, d) => s + d.orders, 0)
  const enriched = data
    .map(d => ({
      name: PRIORITY_LABELS[d.priority] || d.priority,
      value: d.orders,
      revenue: d.revenue,
      fill: PRIORITY_COLORS[d.priority] || '#8b94b2',
      pct: (d.orders / total * 100).toFixed(1),
    }))
    .sort((a, b) => b.value - a.value)

  return (
    <div className="card fade-in fade-in-5" style={{ marginBottom: 0 }}>
      <div className="card-header">
        <div className="card-title">Order Priority Breakdown</div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="20%"
          outerRadius="90%"
          data={enriched}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            dataKey="value"
            cornerRadius={6}
            background={{ fill: 'rgba(255,255,255,0.03)' }}
          />
          <Tooltip
            formatter={(v, name, props) => [
              `${props.payload.pct}% (${v.toLocaleString()} orders)`,
              props.payload.name,
            ]}
            contentStyle={{
              background: 'var(--bg-card2)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              fontSize: 12,
              color: 'var(--text-primary)',
            }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="legend-list" style={{ marginTop: 4 }}>
        {enriched.map(d => (
          <div key={d.name} className="legend-item">
            <span className="legend-dot" style={{ background: d.fill }} />
            <span className="legend-name">{d.name}</span>
            <span className="legend-val">{fmt(d.revenue)}</span>
            <span style={{ color: d.fill, marginLeft: 8, fontSize: 11, fontWeight: 700 }}>{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
