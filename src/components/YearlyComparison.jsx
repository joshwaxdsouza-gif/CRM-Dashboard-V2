import React from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'

function fmt(n) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(0)}M`
  return `$${n.toFixed(0)}`
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background:'var(--bg-card2)', border:'1px solid var(--border)',
      borderRadius:10, padding:'12px 16px', fontSize:12,
      boxShadow:'0 8px 24px rgba(0,0,0,0.4)',
    }}>
      <div style={{ color:'var(--text-muted)', fontWeight:600, marginBottom:8 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ display:'flex', justifyContent:'space-between', gap:16, marginBottom:4 }}>
          <span style={{ color: p.color }}>● {p.name}</span>
          <span style={{ color:'var(--text-primary)', fontWeight:700 }}>
            {p.name === 'Orders' ? p.value.toLocaleString() : fmt(p.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function YearlyComparison({ data }) {
  return (
    <div className="card fade-in fade-in-5" style={{ marginBottom: 0 }}>
      <div className="card-header">
        <div className="card-title">Year-over-Year Comparison</div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={data} margin={{ top: 4, right: 24, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize:11, fill:'var(--text-dim)' }} axisLine={false} tickLine={false} />
          <YAxis
            yAxisId="left"
            tickFormatter={fmt}
            tick={{ fontSize:10, fill:'var(--text-dim)' }}
            axisLine={false}
            tickLine={false}
            width={56}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={n => `${(n/1e6).toFixed(0)}M`}
            tick={{ fontSize:10, fill:'var(--text-dim)' }}
            axisLine={false}
            tickLine={false}
            width={46}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize:11, color:'var(--text-muted)', paddingTop:8 }}
            iconType="circle" iconSize={8}
          />
          <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#63b3ed" fillOpacity={0.7} radius={[4,4,0,0]} />
          <Bar yAxisId="left" dataKey="profit"  name="Profit"  fill="#68d391" fillOpacity={0.7} radius={[4,4,0,0]} />
          <Line yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#f6ad55" strokeWidth={2} dot={{ r:3, fill:'#f6ad55' }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
