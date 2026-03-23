'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

const FRED_BASE = 'https://api.stlouisfed.org/fred/series/observations'
const START_DATE = '2020-01-01'

const RANGE_OPTIONS = [
  { label: '3M', months: 3 },
  { label: '6M', months: 6 },
  { label: '1Y', months: 12 },
  { label: '2Y', months: 24 },
  { label: '전체', months: null },
]

function parseObs(observations) {
  return observations
    .filter(o => o.value !== '.')
    .map(o => ({ date: o.date, value: parseFloat(o.value) }))
}

function buildMap(series) {
  const m = {}
  series.forEach(({ date, value }) => { m[date] = value })
  return m
}

function mergeSeries(fedObs, tgaObs, rrpObs) {
  const fedMap = buildMap(parseObs(fedObs))
  const tgaMap = buildMap(parseObs(tgaObs))
  const rrpMap = buildMap(parseObs(rrpObs))

  const allDates = [...new Set([
    ...Object.keys(fedMap),
    ...Object.keys(tgaMap),
    ...Object.keys(rrpMap),
  ])].sort()

  let lastFed = null, lastTga = null, lastRrp = null
  const merged = []
  for (const date of allDates) {
    if (fedMap[date] != null) lastFed = fedMap[date] / 1_000_000
    if (tgaMap[date] != null) lastTga = tgaMap[date] / 1_000_000
    if (rrpMap[date] != null) lastRrp = rrpMap[date] / 1_000
    if (lastFed != null && lastTga != null && lastRrp != null) {
      merged.push({
        date,
        fed: lastFed,
        tga: lastTga,
        rrp: lastRrp,
        net: lastFed - lastTga - lastRrp,
      })
    }
  }
  return merged
}

function filterByRange(data, months) {
  if (!months) return data
  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - months)
  const cutoffStr = cutoff.toISOString().slice(0, 10)
  return data.filter(d => d.date >= cutoffStr)
}

function getSignal(net) {
  if (net >= 6) return { emoji: '🟢', label: '강한 순풍 (역사적 상위권)', color: '#22c55e' }
  if (net >= 5) return { emoji: '🟢', label: '우호적', color: '#4ade80' }
  if (net >= 4) return { emoji: '🟡', label: '중립', color: '#eab308' }
  if (net >= 3) return { emoji: '🟠', label: '주의', color: '#f97316' }
  return { emoji: '🔴', label: '강한 역풍', color: '#ef4444' }
}

function fmt(v) {
  return v != null ? `$${v.toFixed(2)}T` : '-'
}

function fmtChange(v) {
  if (v == null) return '-'
  const arrow = v >= 0 ? '↑' : '↓'
  const sign = v >= 0 ? '+' : ''
  return `${arrow} ${sign}${(v * 1000).toFixed(0)}B`
}

function Skeleton() {
  const card = {
    border: '1px solid rgba(128,128,128,0.2)',
    borderRadius: 10,
    padding: '14px 18px',
    flex: 1,
    minWidth: 130,
  }
  const bar = (w, h = 14) => ({
    background: 'rgba(128,128,128,0.15)',
    borderRadius: 4,
    height: h,
    width: w,
    marginBottom: 8,
  })
  return (
    <div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={card}>
            <div style={bar('55%')} />
            <div style={bar('75%', 22)} />
            <div style={bar('40%', 11)} />
          </div>
        ))}
      </div>
      <div style={{ background: 'rgba(128,128,128,0.1)', borderRadius: 8, height: 300 }} />
    </div>
  )
}

function ErrorUI({ message, onRetry }) {
  return (
    <div style={{
      border: '1px solid #ef4444',
      borderRadius: 10,
      padding: '24px',
      textAlign: 'center',
    }}>
      <p style={{ color: '#ef4444', marginBottom: 12 }}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '6px 16px',
            border: '1px solid currentColor',
            borderRadius: 6,
            cursor: 'pointer',
            background: 'transparent',
            color: 'inherit',
            marginBottom: 12,
          }}
        >
          재시도
        </button>
      )}
      <p style={{ fontSize: '0.85em', opacity: 0.6 }}>
        FRED API 키 발급:{' '}
        <a href="https://fred.stlouisfed.org/docs/api/api_key.html" target="_blank" rel="noreferrer">
          fred.stlouisfed.org
        </a>
      </p>
    </div>
  )
}

function StatCard({ title, sub, value, date, accent, changeLabel, changeColor }) {
  return (
    <div style={{
      border: `1px solid ${accent}30`,
      borderLeft: `3px solid ${accent}`,
      borderRadius: 8,
      padding: '12px 16px',
      flex: 1,
      minWidth: 130,
    }}>
      <div style={{ fontSize: '0.78em', opacity: 0.55, marginBottom: 4 }}>{title}</div>
      <div style={{ fontWeight: 700, fontSize: '1.35em', color: accent }}>{value}</div>
      <div style={{ fontSize: '0.78em', opacity: 0.55, marginTop: 2 }}>{sub}</div>
      {changeLabel && (
        <div style={{ fontSize: '0.8em', color: changeColor, marginTop: 4, fontWeight: 600 }}>
          {changeLabel}
        </div>
      )}
      {date && <div style={{ fontSize: '0.72em', opacity: 0.4, marginTop: 2 }}>{date}</div>}
    </div>
  )
}

export function NetLiquidityDashboard() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [range, setRange] = useState('1Y')
  const [mounted, setMounted] = useState(false)

  const apiKey = process.env.NEXT_PUBLIC_FRED_API_KEY

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const qs = `observation_start=${START_DATE}&sort_order=asc&file_type=json&api_key=${apiKey}`
      const [fedRes, tgaRes, rrpRes] = await Promise.all([
        fetch(`${FRED_BASE}?series_id=WALCL&${qs}`).then(r => r.json()),
        fetch(`${FRED_BASE}?series_id=WTREGEN&${qs}`).then(r => r.json()),
        fetch(`${FRED_BASE}?series_id=RRPONTSYD&${qs}`).then(r => r.json()),
      ])
      if (fedRes.error_message || tgaRes.error_message || rrpRes.error_message) {
        throw new Error(fedRes.error_message || tgaRes.error_message || rrpRes.error_message)
      }
      setData(mergeSeries(
        fedRes.observations || [],
        tgaRes.observations || [],
        rrpRes.observations || [],
      ))
    } catch (e) {
      setError(`데이터 로딩 실패: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }, [apiKey])

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    if (!apiKey) {
      setError('NEXT_PUBLIC_FRED_API_KEY 환경변수가 설정되지 않았습니다. .env.local 파일에 추가해주세요.')
      setLoading(false)
      return
    }
    fetchData()
  }, [mounted, fetchData])

  if (!mounted) return null

  const selectedRange = RANGE_OPTIONS.find(r => r.label === range)
  const filtered = filterByRange(data, selectedRange?.months)
  const latest = filtered[filtered.length - 1] || {}
  const ago28 = filtered[Math.max(0, filtered.length - 28)] || {}
  const netChange = (latest.net != null && ago28.net != null) ? latest.net - ago28.net : null
  const signal = latest.net != null ? getSignal(latest.net) : null

  return (
    <div style={{ fontFamily: 'inherit', marginTop: 8 }}>
      {loading ? (
        <Skeleton />
      ) : error ? (
        <ErrorUI message={error} onRetry={apiKey ? fetchData : null} />
      ) : (
        <>
          {/* 지표 카드 */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
            <StatCard title="Fed 총자산" sub="WALCL" value={fmt(latest.fed)} date={latest.date} accent="#22c55e" />
            <StatCard title="TGA (재무부)" sub="WTREGEN" value={fmt(latest.tga)} date={latest.date} accent="#ef4444" />
            <StatCard title="RRP (역레포)" sub="RRPONTSYD" value={fmt(latest.rrp)} date={latest.date} accent="#eab308" />
            <StatCard
              title="순유동성"
              sub="Net Liq"
              value={fmt(latest.net)}
              date={latest.date}
              accent="#3b82f6"
              changeLabel={netChange != null ? `4주 ${fmtChange(netChange)}` : null}
              changeColor={netChange != null ? (netChange >= 0 ? '#22c55e' : '#ef4444') : undefined}
            />
          </div>

          {/* 범위 버튼 */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            {RANGE_OPTIONS.map(r => (
              <button
                key={r.label}
                onClick={() => setRange(r.label)}
                style={{
                  padding: '3px 11px',
                  borderRadius: 5,
                  border: '1px solid rgba(128,128,128,0.4)',
                  background: range === r.label ? '#3b82f6' : 'transparent',
                  color: range === r.label ? '#fff' : 'inherit',
                  cursor: 'pointer',
                  fontSize: '0.82em',
                  fontWeight: range === r.label ? 600 : 400,
                }}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* 라인 차트 */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filtered} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                tickFormatter={d => d.slice(2, 7)}
                minTickGap={40}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickFormatter={v => `$${v.toFixed(1)}T`}
                width={56}
              />
              <Tooltip
                formatter={(v, name) => [v != null ? `$${v.toFixed(3)}T` : '-', name]}
                labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                contentStyle={{ fontSize: '0.85em' }}
              />
              <Legend wrapperStyle={{ fontSize: '0.82em' }} />
              <Line type="monotone" dataKey="fed" name="Fed 총자산" stroke="#22c55e" dot={false} strokeDasharray="5 3" strokeWidth={1.5} connectNulls />
              <Line type="monotone" dataKey="tga" name="TGA" stroke="#ef4444" dot={false} strokeDasharray="5 3" strokeWidth={1.5} connectNulls />
              <Line type="monotone" dataKey="rrp" name="RRP" stroke="#eab308" dot={false} strokeDasharray="5 3" strokeWidth={1.5} connectNulls />
              <Line type="monotone" dataKey="net" name="순유동성" stroke="#3b82f6" dot={false} strokeWidth={2.5} connectNulls />
            </LineChart>
          </ResponsiveContainer>

          {/* 해석 카드 */}
          {signal && (
            <div style={{
              marginTop: 18,
              padding: '14px 18px',
              border: `1px solid ${signal.color}35`,
              borderLeft: `4px solid ${signal.color}`,
              borderRadius: 8,
            }}>
              <div style={{ fontWeight: 600, marginBottom: 5, fontSize: '0.95em' }}>
                {signal.emoji} 현재 유동성 환경: {signal.label}
              </div>
              <div style={{ fontSize: '0.88em', opacity: 0.8 }}>
                순유동성 <strong>{fmt(latest.net)}</strong>
                {netChange != null && (
                  <>
                    {' '}· 4주 변화{' '}
                    <strong style={{ color: netChange >= 0 ? '#22c55e' : '#ef4444' }}>
                      {fmtChange(netChange)}
                    </strong>
                  </>
                )}
              </div>
            </div>
          )}

          {/* 푸터 */}
          <div style={{ marginTop: 16, fontSize: '0.77em', opacity: 0.45 }}>
            데이터 출처:{' '}
            <a href="https://fred.stlouisfed.org" target="_blank" rel="noreferrer">
              FRED (St. Louis Fed)
            </a>{' '}
            · 마지막 업데이트: {latest.date} · WALCL · WTREGEN · RRPONTSYD
          </div>
        </>
      )}
    </div>
  )
}
