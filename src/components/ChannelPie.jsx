import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

function fmt(n) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(0)}M`
  return `$${n.toFixed(0)}`
}

const COLORS = ['#63b3ed', '#b794f4']

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div style={{
      background:'var(--bg-card2)', border:'1px solid var(--border)',
      borderRadius:10, padding:'10px 14px', fontSize:12,
      boxShadow:'0 8px 24px rgba(0,0,0,0.4)',
    }}>
      <div style={{ color:d.payload.fill, fontWeight:700, marginBottom:6 }}>{d.name}</div>
      <div style={{ color:'var(--text-primary)' }}>{fmt(d.value)}</div>
      <div style={{ color:'var(--text-muted)', marginTop:3 }}>{d.payload.pct}% of total</div>
    </div>
  )
}

const RADIAN = Math.PI / 180
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, pct }) => {
  const r = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={700}>
      {pct}%
    </text>
  )
}

export default function ChannelPie({ data }) {
  const total = data.reduce((s, d) => s + d.revenue, 0)
  const enriched = data.map((d, i) => ({
    ...d,
    fill: COLORS[i % COLORS.length],
    pct: (d.revenue / total * 100).toFixed(1),
  }))

  return (
    <div className="card fade-in fade-in-5" style={{ marginBottom: 0 }}>
      <div className="card-header">
        <div className="card-title">Sales Channel Split</div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={enriched}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={78}
            dataKey="revenue"
            nameKey="channel"
            paddingAngle={3}
            labelLine={false}
            label={renderCustomLabel}
          >
            {enriched.map((e, i) => (
              <Cell key={i} fill={e.fill} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="legend-list" style={{ marginTop: 8 }}>
        {enriched.map(d => (
          <div key={d.channel} className="legend-item">
            <span className="legend-dot" style={{ background: d.fill }} />
            <span className="legend-name">{d.channel}</span>
            <span className="legend-val">{fmt(d.revenue)}</span>
            <span style={{ color: d.fill, marginLeft: 8, fontSize: 11, fontWeight: 700 }}>{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
