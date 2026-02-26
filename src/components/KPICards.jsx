import React from 'react'
import { TrendingUp, ShoppingCart, DollarSign, BarChart2, Package, Percent } from 'lucide-react'

function fmt(n) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3)  return `$${(n / 1e3).toFixed(1)}K`
  return `$${n.toFixed(2)}`
}

function fmtNum(n) {
  if (n >= 1e9)  return `${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6)  return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3)  return `${(n / 1e3).toFixed(0)}K`
  return n.toLocaleString()
}

const cards = (kpi) => [
  {
    label: 'Total Revenue',
    value: fmt(kpi.totalRevenue),
    meta: `Avg Order: ${fmt(kpi.avgOrderValue)}`,
    icon: <DollarSign size={16} />,
    color: 'var(--accent-blue)',
    bg: 'rgba(99,179,237,0.1)',
  },
  {
    label: 'Total Profit',
    value: fmt(kpi.totalProfit),
    meta: `Avg Profit/Order: ${fmt(kpi.avgProfit)}`,
    icon: <TrendingUp size={16} />,
    color: 'var(--accent-green)',
    bg: 'rgba(104,211,145,0.1)',
  },
  {
    label: 'Total Orders',
    value: fmtNum(kpi.totalOrders),
    meta: 'All time orders processed',
    icon: <ShoppingCart size={16} />,
    color: 'var(--accent-purple)',
    bg: 'rgba(183,148,244,0.1)',
  },
  {
    label: 'Profit Margin',
    value: `${kpi.profitMargin}%`,
    meta: `Total Cost: ${fmt(kpi.totalCost)}`,
    icon: <Percent size={16} />,
    color: 'var(--accent-orange)',
    bg: 'rgba(246,173,85,0.1)',
  },
  {
    label: 'Units Sold',
    value: fmtNum(kpi.totalUnits),
    meta: 'Across all product lines',
    icon: <Package size={16} />,
    color: 'var(--accent-cyan)',
    bg: 'rgba(79,209,197,0.1)',
  },
  {
    label: 'Avg Deal Value',
    value: fmt(kpi.avgOrderValue),
    meta: 'Revenue per transaction',
    icon: <BarChart2 size={16} />,
    color: 'var(--accent-pink)',
    bg: 'rgba(246,135,179,0.1)',
  },
]

export default function KPICards({ kpi }) {
  const items = cards(kpi)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '14px', marginBottom: '20px' }}
         className="kpi-grid">
      {items.map((c, i) => (
        <div
          key={c.label}
          className={`kpi-card fade-in fade-in-${i + 1}`}
          style={{ '--kpi-color': c.color, '--kpi-bg': c.bg }}
        >
          <div className="kpi-top">
            <span className="kpi-label">{c.label}</span>
            <div className="kpi-icon-wrap" style={{ background: c.bg }}>
              <span style={{ color: c.color }}>{c.icon}</span>
            </div>
          </div>
          <div className="kpi-value">{c.value}</div>
          <div className="kpi-meta">{c.meta}</div>
        </div>
      ))}
      <style>{`
        @media (max-width:1400px) { .kpi-grid { grid-template-columns: repeat(3,1fr) !important; } }
        @media (max-width:800px)  { .kpi-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width:500px)  { .kpi-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
