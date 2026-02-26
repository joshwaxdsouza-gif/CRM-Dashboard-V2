import React, { useState, useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'

function fmt(n) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(1)}T`
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(0)}M`
  return `$${n.toFixed(0)}`
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-card2)',
      border: '1px solid var(--border)',
      borderRadius: '10px',
      padding: '12px 16px',
      fontSize: '12px',
      minWidth: '170px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ display:'flex', justifyContent:'space-between', gap:16, marginBottom:4 }}>
          <span style={{ color: p.color }}>● {p.name}</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function RevenueTrend({ data }) {
  const [view, setView] = useState('monthly')

  const chartData = useMemo(() => {
    if (view === 'monthly') {
      return data.map(d => ({
        ...d,
        label: d.month.slice(0, 7),
      })).slice(-60) // last 60 months
    }
    // yearly aggregation
    const yearly = {}
    data.forEach(d => {
      const yr = d.month.slice(0, 4)
      if (!yearly[yr]) yearly[yr] = { label: yr, revenue: 0, profit: 0, orders: 0 }
      yearly[yr].revenue += d.revenue
      yearly[yr].profit  += d.profit
      yearly[yr].orders  += d.orders
    })
    return Object.values(yearly).sort((a, b) => a.label.localeCompare(b.label))
  }, [data, view])

  const tickInterval = view === 'yearly' ? 0 : Math.floor(chartData.length / 8)

  return (
    <div className="card fade-in fade-in-3" style={{ marginBottom: 0 }}>
      <div className="card-header">
        <div>
          <div className="card-title">Revenue &amp; Profit Trend</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>
            {view === 'monthly' ? 'Last 60 months' : 'Full year-over-year view'}
          </div>
        </div>
        <div className="tabs">
          {['monthly', 'yearly'].map(v => (
            <button key={v} className={`tab-btn${view === v ? ' active' : ''}`} onClick={() => setView(v)}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#63b3ed" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#63b3ed" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradPro" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#68d391" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#68d391" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: 'var(--text-dim)' }}
            axisLine={false}
            tickLine={false}
            interval={tickInterval}
          />
          <YAxis
            tickFormatter={fmt}
            tick={{ fontSize: 10, fill: 'var(--text-dim)' }}
            axisLine={false}
            tickLine={false}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 11, color: 'var(--text-muted)', paddingTop: 8 }}
            iconType="circle"
            iconSize={8}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#63b3ed"
            strokeWidth={2}
            fill="url(#gradRev)"
            dot={false}
            activeDot={{ r: 4, fill: '#63b3ed' }}
          />
          <Area
            type="monotone"
            dataKey="profit"
            name="Profit"
            stroke="#68d391"
            strokeWidth={2}
            fill="url(#gradPro)"
            dot={false}
            activeDot={{ r: 4, fill: '#68d391' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
