import React, { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList
} from 'recharts'

const COLORS = ['#b794f4','#63b3ed','#f6ad55','#68d391','#f687b3','#4fd1c5','#fc8181','#faf089','#63b3ed','#c6f6d5','#fed7d7','#bee3f8']

function fmt(n) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(0)}M`
  return `$${n.toFixed(0)}`
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  const margin = d.revenue > 0 ? (d.profit / d.revenue * 100).toFixed(1) : 0
  return (
    <div style={{
      background:'var(--bg-card2)', border:'1px solid var(--border)',
      borderRadius:10, padding:'12px 16px', fontSize:12,
      boxShadow:'0 8px 24px rgba(0,0,0,0.4)',
    }}>
      <div style={{ color:'var(--text-primary)', fontWeight:700, marginBottom:8 }}>{d.itemType}</div>
      {[
        { label:'Revenue', val:fmt(d.revenue), color:'#b794f4' },
        { label:'Profit',  val:fmt(d.profit),  color:'#68d391' },
        { label:'Units',   val:(d.units/1e6).toFixed(1)+'M', color:'#63b3ed' },
        { label:'Margin',  val:`${margin}%`,   color:'#f6ad55' },
      ].map(r => (
        <div key={r.label} style={{ display:'flex', justifyContent:'space-between', gap:16, marginBottom:4 }}>
          <span style={{ color:'var(--text-muted)' }}>{r.label}</span>
          <span style={{ color:r.color, fontWeight:700 }}>{r.val}</span>
        </div>
      ))}
    </div>
  )
}

export default function ItemTypeChart({ data }) {
  const [metric, setMetric] = useState('revenue')
  const sorted = [...data].sort((a, b) => b[metric] - a[metric])

  return (
    <div className="card fade-in fade-in-4" style={{ marginBottom: 0 }}>
      <div className="card-header">
        <div className="card-title">Top Product Categories</div>
        <div className="tabs">
          {['revenue','profit','units'].map(m => (
            <button key={m} className={`tab-btn${metric === m ? ' active' : ''}`} onClick={() => setMetric(m)}>
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 0, right: 60, bottom: 0, left: 10 }}
          barCategoryGap="25%"
        >
          <CartesianGrid stroke="rgba(255,255,255,0.04)" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={n => metric === 'units'
              ? (n >= 1e9 ? `${(n/1e9).toFixed(0)}B` : `${(n/1e6).toFixed(0)}M`)
              : fmt(n)
            }
            tick={{ fontSize: 10, fill: 'var(--text-dim)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="itemType"
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            axisLine={false}
            tickLine={false}
            width={90}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey={metric} radius={[0, 5, 5, 0]}>
            <LabelList
              dataKey={metric}
              position="right"
              formatter={n => metric === 'units'
                ? `${(n/1e9).toFixed(1)}B`
                : fmt(n)
              }
              style={{ fontSize: 10, fill: 'var(--text-muted)' }}
            />
            {sorted.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
