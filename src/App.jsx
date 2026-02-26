import React, { useMemo, useState } from 'react'
import rawData from './data/salesData.json'

import Header         from './components/Header.jsx'
import KPICards       from './components/KPICards.jsx'
import RevenueTrend   from './components/RevenueTrend.jsx'
import RegionChart    from './components/RegionChart.jsx'
import ItemTypeChart  from './components/ItemTypeChart.jsx'
import ChannelPie     from './components/ChannelPie.jsx'
import PriorityChart  from './components/PriorityChart.jsx'
import TopCountries   from './components/TopCountries.jsx'
import MarginChart    from './components/MarginChart.jsx'
import YearlyComparison from './components/YearlyComparison.jsx'

// ── Helpers ────────────────────────────────────────────────────
function fmt(n) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(1)}M`
  return `$${n.toFixed(0)}`
}

// ── App ────────────────────────────────────────────────────────
export default function App() {
  const years = useMemo(() => {
    const ys = [...new Set(rawData.revenueByMonth.map(d => d.month.slice(0, 4)))].sort()
    return ['All', ...ys]
  }, [])

  const [yearFilter, setYearFilter] = useState('All')

  // Filtered monthly data
  const filteredMonthly = useMemo(() =>
    yearFilter === 'All'
      ? rawData.revenueByMonth
      : rawData.revenueByMonth.filter(d => d.month.startsWith(yearFilter)),
    [yearFilter]
  )

  // Recomputed KPIs for filtered year
  const filteredKpi = useMemo(() => {
    if (yearFilter === 'All') return rawData.kpi
    const rows = filteredMonthly
    const totalRevenue = rows.reduce((s, d) => s + d.revenue, 0)
    const totalProfit  = rows.reduce((s, d) => s + d.profit, 0)
    const totalOrders  = rows.reduce((s, d) => s + d.orders, 0)
    return {
      ...rawData.kpi,
      totalRevenue,
      totalProfit,
      totalCost: totalRevenue - totalProfit,
      totalOrders,
      avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      profitMargin:  totalRevenue > 0 ? +(totalProfit / totalRevenue * 100).toFixed(2) : 0,
      avgProfit:     totalOrders > 0 ? totalProfit / totalOrders : 0,
    }
  }, [yearFilter, filteredMonthly])

  return (
    <div className="dashboard-shell">
      <Header />

      <main className="main-content">

        {/* ── Page Header ───────────────────────────────────── */}
        <div className="page-header">
          <div>
            <div className="page-title">Sales Analytics Overview</div>
            <div className="page-sub">
              Global CRM data · {rawData.kpi.totalOrders.toLocaleString()} total orders · {years.length - 1} years of data
            </div>
          </div>
          <div className="filter-bar">
            <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>Year:</label>
            <select
              className="filter-select"
              value={yearFilter}
              onChange={e => setYearFilter(e.target.value)}
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {/* ── KPI Row ───────────────────────────────────────── */}
        <KPICards kpi={filteredKpi} />

        {/* ── Revenue Trend (full width) ────────────────────── */}
        <div style={{ marginBottom: 20 }}>
          <RevenueTrend data={filteredMonthly} />
        </div>

        {/* ── Region + Item Type ────────────────────────────── */}
        <div className="grid-2" style={{ marginBottom: 20 }}>
          <RegionChart   data={rawData.revenueByRegion} />
          <ItemTypeChart data={rawData.revenueByItem}   />
        </div>

        {/* ── Channel Pie + Priority + Yearly ──────────────── */}
        <div className="grid-3" style={{ marginBottom: 20 }}>
          <ChannelPie    data={rawData.salesByChannel} />
          <PriorityChart data={rawData.byPriority}    />
          <YearlyComparison data={rawData.revenueByYear} />
        </div>

        {/* ── Margin Scatter + Top Countries ───────────────── */}
        <div className="grid-12" style={{ marginBottom: 20 }}>
          <MarginChart  data={rawData.marginByItem}  />
          <TopCountries data={rawData.topCountries}  />
        </div>

        {/* ── Summary Metrics ───────────────────────────────── */}
        <div className="grid-3">
          <div className="card fade-in fade-in-6">
            <div className="card-title" style={{ marginBottom: 14 }}>Revenue Summary</div>
            {[
              { k: 'Total Revenue',  v: fmt(filteredKpi.totalRevenue),  c: 'var(--accent-blue)' },
              { k: 'Total Profit',   v: fmt(filteredKpi.totalProfit),   c: 'var(--accent-green)' },
              { k: 'Total Cost',     v: fmt(filteredKpi.totalCost),     c: 'var(--accent-red)' },
              { k: 'Profit Margin',  v: `${filteredKpi.profitMargin}%`, c: 'var(--accent-orange)' },
              { k: 'Avg Order Value',v: fmt(filteredKpi.avgOrderValue), c: 'var(--accent-cyan)' },
            ].map(r => (
              <div key={r.k} className="metric-row">
                <span className="metric-key">{r.k}</span>
                <span className="metric-value" style={{ color: r.c }}>{r.v}</span>
              </div>
            ))}
          </div>

          <div className="card fade-in fade-in-6">
            <div className="card-title" style={{ marginBottom: 14 }}>Top Regions by Revenue</div>
            {rawData.revenueByRegion.slice(0, 5).map((r, i) => {
              const maxRev = rawData.revenueByRegion[0].revenue
              const pct = (r.revenue / maxRev * 100).toFixed(0)
              const colors = ['#63b3ed','#b794f4','#f6ad55','#68d391','#f687b3']
              return (
                <div key={r.region} style={{ marginBottom: 12 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:4 }}>
                    <span style={{ color:'var(--text-primary)' }}>{r.region}</span>
                    <span style={{ color:colors[i], fontWeight:700 }}>{fmt(r.revenue)}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width:`${pct}%`, background:colors[i] }} />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="card fade-in fade-in-6">
            <div className="card-title" style={{ marginBottom: 14 }}>Product Performance</div>
            {rawData.revenueByItem.slice(0, 6).map((item, i) => {
              const margin = (item.profit / item.revenue * 100).toFixed(1)
              const colors = ['#b794f4','#63b3ed','#f6ad55','#68d391','#f687b3','#4fd1c5']
              return (
                <div key={item.itemType} className="metric-row">
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:colors[i], display:'inline-block', flexShrink:0 }} />
                    <span className="metric-key">{item.itemType}</span>
                  </div>
                  <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                    <span style={{ fontSize:11, color:'var(--text-dim)' }}>{margin}% margin</span>
                    <span className="metric-value" style={{ color:colors[i] }}>{fmt(item.revenue)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </main>

      <footer className="footer">
        CRM Analytics Dashboard · Built with React &amp; Recharts · {rawData.kpi.totalOrders.toLocaleString()} records processed
      </footer>
    </div>
  )
}
