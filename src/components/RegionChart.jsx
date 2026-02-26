import React, { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'

const COLORS = ['#63b3ed','#68d391','#b794f4','#f6ad55','#4fd1c5','#f687b3','#fc8181']

function fmt(n) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(0)}M`
  return `$${n.toFixed(0)}`
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{
      background:'var(--bg-card2)', border:'1px solid var(--border)',
      borderRadius:10, padding:'12px 16px', fontSize:12,
      boxShadow:'0 8px 24px rgba(0,0,0,0.4)',
    }}>
      <div style={{ color:'var(--text-primary)', fontWeight:700, marginBottom:8 }}>{d.region}</div>
      <div style={{ display:'flex', justifyContent:'space-between', gap:16, marginBottom:4 }}>
        <span style={{ color:'var(--text-muted)' }}>Revenue</span>
        <span style={{ color:'#63b3ed', fontWeight:700 }}>{fmt(d.revenue)}</span>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', gap:16, marginBottom:4 }}>
        <span style={{ color:'var(--text-muted)' }}>Profit</span>
        <span style={{ color:'#68d391', fontWeight:700 }}>{fmt(d.profit)}</span>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', gap:16 }}>
        <span style={{ color:'var(--text-muted)' }}>Orders</span>
        <span style={{ color:'var(--text-primary)', fontWeight:700 }}>{d.orders.toLocaleString()}</span>
      </div>
    </div>
  )
}

export default function RegionChart({ data }) {
  const [metric, setMetric] = useState('revenue')
  const sorted = [...data].sort((a, b) => b[metric] - a[metric])

  return (
    <div className="card fade-in fade-in-4" style={{ marginBottom: 0 }}>
      <div className="card-header">
        <div className="card-title">Sales by Region</div>
        <div className="tabs">
          {['revenue','profit','orders'].map(m => (
            <button key={m} className={`tab-btn${metric === m ? ' active' : ''}`} onClick={() => setMetric(m)}>
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={sorted} margin={{ top: 4, right: 4, bottom: 40, left: 0 }} barCategoryGap="30%">
          <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="region"
            tick={{ fontSize: 9, fill: 'var(--text-dim)' }}
            axisLine={false}
            tickLine={false}
            angle={-30}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            tickFormatter={n => metric === 'orders' ? (n >= 1e6 ? `${(n/1e6).toFixed(0)}M` : `${(n/1e3).toFixed(0)}K`) : fmt(n)}
            tick={{ fontSize: 10, fill: 'var(--text-dim)' }}
            axisLine={false}
            tickLine={false}
            width={52}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey={metric} radius={[5, 5, 0, 0]}>
            {sorted.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
