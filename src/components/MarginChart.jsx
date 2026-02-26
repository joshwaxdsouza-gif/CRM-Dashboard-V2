import React from 'react'
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'

const COLORS = ['#b794f4','#63b3ed','#f6ad55','#68d391','#f687b3','#4fd1c5','#fc8181','#faf089','#c6f6d5','#fed7d7','#bee3f8','#fbb6ce']

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
      borderRadius:10, padding:'10px 14px', fontSize:12,
      boxShadow:'0 8px 24px rgba(0,0,0,0.4)',
    }}>
      <div style={{ color:'var(--text-primary)', fontWeight:700, marginBottom:6 }}>{d.itemType}</div>
      <div style={{ color:'var(--text-muted)' }}>Revenue: <b style={{ color:'#63b3ed' }}>{fmt(d.revenue)}</b></div>
      <div style={{ color:'var(--text-muted)' }}>Margin: <b style={{ color:'#68d391' }}>{d.margin.toFixed(1)}%</b></div>
    </div>
  )
}

export default function MarginChart({ data }) {
  return (
    <div className="card fade-in fade-in-5" style={{ marginBottom: 0 }}>
      <div className="card-header">
        <div className="card-title">Revenue vs Profit Margin</div>
        <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>Bubble = product category</div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="revenue"
            name="Revenue"
            tickFormatter={fmt}
            tick={{ fontSize: 10, fill: 'var(--text-dim)' }}
            axisLine={false}
            tickLine={false}
            label={{ value: 'Revenue →', position: 'insideBottomRight', offset: -10, fontSize: 10, fill: 'var(--text-dim)' }}
          />
          <YAxis
            dataKey="margin"
            name="Margin"
            unit="%"
            tick={{ fontSize: 10, fill: 'var(--text-dim)' }}
            axisLine={false}
            tickLine={false}
            width={40}
            label={{ value: 'Margin %', angle: -90, position: 'insideLeft', fontSize: 10, fill: 'var(--text-dim)' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={data} shape="circle">
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.8} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
