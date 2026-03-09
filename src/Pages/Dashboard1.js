/**
 * AQMSDashboard.jsx
 * ─────────────────────────────────────────────────────────────────────────
 *  Fully dynamic Air Quality Monitoring Dashboard
 *  - Light pastel card backgrounds per parameter (auto from index)
 *  - Dual limit markers: H (High) + HH (High-High)
 *  - Live sparklines with animated updates
 *  - Status pills: Normal / Warning / Alarm
 *  - Plug in your real API by replacing the fetch URL in useLiveData()
 *
 *  USAGE:
 *    import AQMSDashboard from './AQMSDashboard';
 *    <AQMSDashboard />
 *
 *  WITH YOUR OWN DATA:
 *    <AQMSDashboard
 *      fetchUrl="/api/parameters"
 *      refreshInterval={5000}
 *      stationName="My Station"
 *    />
 *
 *  PARAMETER SHAPE (your API must return an array of these):
 *  {
 *    id:       string          unique key
 *    name:     string          "Sulfur Dioxide"
 *    sym:      string          "SO₂"
 *    val:      number          current reading
 *    unit:     string          "mg/Nm³"
 *    min:      number          session min
 *    avg:      number          session avg
 *    max:      number          session max
 *    scale:    number          progress bar max
 *    limitH:   number|null     High limit    (orange marker)
 *    limitHH:  number|null     High-High limit (red marker)
 *    status:   "normal"|"warning"|"alarm"
 *  }
 * ─────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useRef, useCallback } from "react";
import CommonFunctions from "../utils/CommonFunctions";

// ══════════════════════════════════════════════════════════════
//  THEME
// ══════════════════════════════════════════════════════════════
const T = {
  blue:      "#1e40ae",
  blueSoft:  "#eff3fd",
  bg:        "#f5f7ff",          // very light blue-white page bg
  cardBg:    "#ffffff",
  border:    "#e4eaf7",
  trackBg:   "#edf1fa",
  divider:   "#f0f4fb",
  text:      "#1a2540",
  textMid:   "#4a5a7a",
  textSoft:  "#8a9abf",
  textDim:   "#b8c4d8",
  normal:    "#0fba74",
  warning:   "#f5a623",
  alarm:     "#e8324a",
  limitH:    "#f5a623",
  limitHH:   "#e8324a",
};

// ══════════════════════════════════════════════════════════════
//  LIGHT PASTEL PALETTE
//  Each index gets a distinct pastel card background + accent color.
//  Cards feel light, clean, and colorful at the same time.
// ══════════════════════════════════════════════════════════════
const SWATCHES = [
  { accent: "#1e40ae", pastel: "#eff3fd" },   // blue
  { accent: "#d97706", pastel: "#fef9ec" },   // amber
  { accent: "#0891b2", pastel: "#ecfbff" },   // cyan
  { accent: "#059669", pastel: "#edfbf5" },   // emerald
  { accent: "#7c3aed", pastel: "#f5f0ff" },   // violet
  { accent: "#ea580c", pastel: "#fff4ee" },   // orange
  { accent: "#0284c7", pastel: "#edf7ff" },   // sky
  { accent: "#dc2626", pastel: "#fff0f0" },   // red
  { accent: "#9333ea", pastel: "#faf0ff" },   // purple
  { accent: "#0369a1", pastel: "#eef7ff" },   // dark sky
  { accent: "#65a30d", pastel: "#f4fce8" },   // lime
  { accent: "#db2777", pastel: "#fff0f8" },   // pink
  { accent: "#16a34a", pastel: "#edfbf1" },   // green
  { accent: "#e11d48", pastel: "#fff0f3" },   // rose
  { accent: "#2563eb", pastel: "#eff4ff" },   // indigo
  { accent: "#b45309", pastel: "#fdf6ec" },   // brown amber
  { accent: "#0f766e", pastel: "#edfafa" },   // teal
  { accent: "#be123c", pastel: "#fff1f4" },   // crimson
  { accent: "#6d28d9", pastel: "#f4efff" },   // dark violet
  { accent: "#0e7490", pastel: "#edfafd" },   // dark cyan
];

const getSwatch = (i) => SWATCHES[i % SWATCHES.length];

const rgba = (hex, a) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
};

const fmtVal = (v) =>
  typeof v === "number"
    ? v % 1 === 0 ? v.toLocaleString() : v
    : v ?? "—";

const STATUS_CFG = {
  normal:  { color: T.normal,  bg: rgba(T.normal,  0.10), border: rgba(T.normal,  0.28) },
  warning: { color: T.warning, bg: rgba(T.warning, 0.12), border: rgba(T.warning, 0.32) },
  alarm:   { color: T.alarm,   bg: rgba(T.alarm,   0.10), border: rgba(T.alarm,   0.32) },
};

// ══════════════════════════════════════════════════════════════
//  CUSTOM HOOK — Live Data Fetching
//  Replace fetchUrl prop with your real endpoint.
//  Falls back to SAMPLE_PARAMETERS if no URL / fetch fails.
// ══════════════════════════════════════════════════════════════
function useLiveData(fetchUrl, refreshInterval) {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [lastSync,setLastSync]= useState(null);

  const fetchData = useCallback(async () => {
    if (!fetchUrl) return;
    setLoading(true);
    try {
      const res = await fetch(fetchUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setError(null);
      setLastSync(new Date());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [fetchUrl]);
  


  useEffect(() => {
    //fetchData();
    if (!fetchUrl) return;
    const id = setInterval(fetchData, refreshInterval);
    return () => clearInterval(id);
  }, [fetchData, fetchUrl, refreshInterval]);

  return { data, loading, error, lastSync, refetch: fetchData };
}


function Sparkline({ data, color }) {
  const ref = useRef(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg || !data || data.length < 2) return;

    const W = 220, H = 40; // Dimensions of the sparkline chart

    // Ensure data has a minimum and maximum for proper scaling
    const mn = Math.min(...data);
    const mx = Math.max(...data);
    const padding = (mx - mn) * 0.3; // Increased padding to allow better scaling and spikes (more space)
    const rng = mx - mn || 1;  // Range, ensuring no zero division

    const yMin = mn - padding;  // Minimum value with extra padding for better visualization of small changes
    const yMax = mx + padding;  // Maximum value with extra padding for better visibility of spikes

    const pts = data
      .map((d, i) => {
        const x = (i / (data.length - 1)) * W; // X-position based on data index
        const y = H - ((d - yMin) / (yMax - yMin)) * H - 3; // Y-position for the value in scaled range
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");

    const gid = "sg_" + color.replace("#", "");
    svg.innerHTML = `
      <defs>
        <linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="${color}" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="M 0,${H} L ${pts} L ${W},${H} Z" fill="url(#${gid})"/>
      <polyline points="${pts}" fill="none" stroke="${color}"
        stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    `;
  }, [data, color]);

  return (
    <svg
      ref={ref}
      viewBox="0 0 220 40"
      preserveAspectRatio="none"
      style={{ width: "100%", height: 40, display: "block" }}
    />
  );
}


// ══════════════════════════════════════════════════════════════
//  DUAL LIMIT TRACK
// ══════════════════════════════════════════════════════════════
function DualLimitTrack({ val, limitH , limitHH ,floor, ceiling, fillColor }) {
  const scale = 1000;
  const rawVal  = Math.abs(Number(val)) || 0;
  const fillPct = Math.min(100, (rawVal / scale) * 100);

  const hPct    =  limitH != null ? Math.min(100, (limitH  / scale) * 100) : null;
  const hhPct   = limitHH != null ? Math.min(100, (limitHH / scale) * 100) : null;

const roundedHPct  = hPct  != null ? Math.round(hPct)  : null;
const roundedHHPct = hhPct != null ? Math.round(hhPct) : null;



  return (
    <div style={{ marginTop: 10 }}>
      {/* Bar */}
      <div style={{
        height: 6, background: T.trackBg, borderRadius: 4,
        position: "relative", overflow: "visible",
      }}>
        <div style={{
          position: "absolute", left: 0, top: 0,
          height: "100%", width: `${fillPct}%`,
          background: fillColor, borderRadius: 4, opacity: 0.85,
          transition: "width 0.6s ease",
        }} />
        {hPct != null && (
          <div title={`High: ${limitH}`} style={{
            position: "absolute", left: `${roundedHPct}%`,
            top: -3, width: 2, height: 12,
            background: T.limitH, borderRadius: 1,
          }} />
        )}
        {hhPct != null && (
          <div title={`High-High: ${limitHH}`} style={{
            position: "absolute", left: `${roundedHHPct}%`,
            top: -3, width: 2, height: 12,
            background: T.limitHH, borderRadius: 1,
          }} />
        )}
      </div>

      {/* Scale ends */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        fontSize: 9, color: T.textDim,
        fontFamily: "'Roboto Mono', monospace", marginTop: 3,
      }}>
        <span>0</span>
        <span>{typeof scale === "number" ? scale.toLocaleString() : scale}</span>
      </div>

      {/* Legend */}
      {(hPct != null || hhPct != null) && (
        <div style={{ display: "flex", gap: 10, marginTop: 4, flexWrap: "wrap" }}>
          {hPct != null && (
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              fontSize: 9, fontFamily: "'Roboto Mono', monospace", color: T.textSoft,
            }}>
              <div style={{ width: 10, height: 3, background: T.limitH, borderRadius: 2 }} />
              H: {limitH}
            </div>
          )}
          {hhPct != null && (
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              fontSize: 9, fontFamily: "'Roboto Mono', monospace", color: T.textSoft,
            }}>
              <div style={{ width: 10, height: 3, background: T.limitHH, borderRadius: 2 }} />
              HH: {limitHH}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  PARAMETER CARD
// ══════════════════════════════════════════════════════════════
function ParamCard({ param, colorIndex, sparkData ,onClick }) {
  const [hovered, setHovered] = useState(false);
  const sw  = getSwatch(colorIndex);
  const st  = STATUS_CFG[param.status] || STATUS_CFG.normal;

  const fillColor =
    param.status === "alarm"   ? T.alarm   :
    param.status === "warning" ? T.warning : sw.accent;

  const valColor =
    param.status === "alarm"   ? T.alarm   :
    param.status === "warning" ? T.warning : sw.accent;

  return (
    <div
     onClick={onClick} 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? sw.pastel : T.cardBg,
        border: `1.5px solid ${hovered ? rgba(sw.accent, 0.4) : T.border}`,
        borderRadius: 14,
        padding: "15px 15px 13px",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.22s ease",
        boxShadow: hovered
          ? `0 8px 28px ${rgba(sw.accent, 0.15)}`
          : `0 1px 5px rgba(30,64,174,0.06)`,
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      cursor: "pointer",
      }}
    >
      {/* Top accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 3, background: sw.accent, borderRadius: "14px 14px 0 0",
      }} />

      {/* Faint pastel bg patch top-right */}
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: 70, height: 70,
        background: `radial-gradient(circle at top right, ${rgba(sw.accent, 0.07)}, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 10.5, color: T.textSoft, fontWeight: 500, lineHeight: 1.3 }}>
            {param.name}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: sw.accent, marginTop: 3, letterSpacing: "0.2px" }}>
            {param.sym}
          </div>
        </div>
        <span style={{
          fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 5,
          textTransform: "uppercase", letterSpacing: 0.5,
          border: `1px solid ${st.border}`,
          color: st.color, background: st.bg,
          whiteSpace: "nowrap", flexShrink: 0,
          animation: param.status === "alarm" ? "aqms_blink 1s infinite" : "none",
        }}>
          {param.status.toUpperCase()}
        </span>
      </div>

      {/* Value */}
      <div style={{ marginBottom: 2 }}>
        <span style={{
          fontFamily: "'Roboto Mono', 'Courier New', monospace",
          fontSize: 22, fontWeight: 600,
          color: valColor, lineHeight: 1.1,
        }}>
          {fmtVal(param.val)}
        </span>
        <span style={{ fontSize: 11, color: T.textSoft, marginLeft: 5 }}>
          {param.unit}
        </span>
      </div>

      {/* Dual limit track */}
      <DualLimitTrack
        val={param.val}
        // scale={param.scale}
        limitH={param.limitH}
        limitHH={param.limitHH}
        floor={param.floor}
        ceiling={param.ceiling}
        fillColor={fillColor}
      />

      {/* Divider */}
      <div style={{ height: 1, background: T.divider, margin: "9px 0" }} />

      {/* Min / Avg / Max */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        fontSize: 10, fontFamily: "'Roboto Mono', monospace",
        color: T.textSoft, marginBottom: 9,
      }}>
        {["min", "avg", "max"].map((k) => (
          <span key={k}>
            {k.toUpperCase()}{" "}
            <strong style={{ color: T.textMid, fontWeight: 500 }}>
              {fmtVal(param[k])}
            </strong>
          </span>
        ))}
      </div>

      {/* Sparkline */}
      <div style={{
        fontSize: 9, color: T.textDim,
        textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 3,
      }}>
        1-Hour Trend
      </div>
      <Sparkline data={sparkData} color={sw.accent} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  TrendModal
// ══════════════════════════════════════════════════════════════
function TrendModal({ open, onClose, param, sparkData, colorIndex }) {
  if (!open) return null;


  const sw = getSwatch(colorIndex);

  // Format X and Y axis dynamically based on the spark data
  // const labelX = sparkData.map((d, idx) => {
  //   const date = new Date(d.dateTime); // Convert dateTime to Date object
  //   return `${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`; // Hour:Minute
  // });
  const labelX = sparkData.map((d) => {
    const date = new Date(d.dateTime);
    const datePart = `${date.getDate().toString().padStart(2,'0')}/${(date.getMonth()+1).toString().padStart(2,'0')}`;
    const timePart = `${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`;
    return `${datePart} ${timePart}`; // e.g. "05/03 15:19"
});

  const minValue = Math.min(...sparkData.map(d => d.value));
  const maxValue = Math.max(...sparkData.map(d => d.value));
  const labelY = Array.from({ length: 5 }, (_, idx) => {
    const step = (maxValue - minValue) / 4; // divide range into 4 steps
    return (minValue + step * idx).toFixed(1);
  });
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(720px, 96vw)",
          borderRadius: 16,
          background: T.cardBg,
          border: `1px solid ${T.border}`,
          boxShadow: "0 16px 60px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
      >
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 16px",
          borderBottom: `1px solid ${T.divider}`,
        }}>
          <div>
            <div style={{ fontSize: 12, color: T.textSoft }}>{param?.parameterName}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: sw.accent, marginTop: 2 }}>
              24-Hour Trend
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              border: `1px solid ${T.border}`,
              background: "transparent",
              color: T.textMid,
              borderRadius: 10,
              padding: "6px 10px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T.textMid, marginBottom: 12 }}>
            {param?.name} 
          </div>
          <div style={{
            display: "flex",
            gap: 14,
            alignItems: "baseline",
            marginBottom: 12,
          }}>
            <div style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: 26,
              fontWeight: 700,
              color: sw.accent,
            }}>
              {fmtVal(param?.val)}
            </div>
            <div style={{ color: T.textSoft, fontSize: 12 }}>
              {param?.unit}
            </div>
          </div>

          {/* Big Sparkline */}
          <BigSparkline data={sparkData} color={sw.accent} xLabels={labelX} labelY={labelY} />
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  STATUS SUMMARY BAR
// ══════════════════════════════════════════════════════════════

function BigSparkline({ data, color, xLabels, labelY }) {
  const W = 720;
  const H = 260;
  // chart margins for axes/labels
  const M = { left: 50, right: 18, top: 14, bottom: 40 };
  const plotW = W - M.left - M.right;
  const plotH = H - M.top - M.bottom;

  const clean = (Array.isArray(data) ? data : []).map((d) =>
    d == null ? null : Number(d.value) // Extract 'value' from the data objects
  );

  const valid = clean.filter((d) => d != null && !Number.isNaN(d));

  if (valid.length < 2) {
    return (
      <div style={{ height: 220, display: "grid", placeItems: "center", color: T.textSoft }}>
        Not enough data Available
      </div>
    );
  }

  const mn = Math.min(...valid);
  const mx = Math.max(...valid);
  const pad = (mx - mn) * 0.08 || 1; // small padding so line doesn't touch border
  const yMin = mn - pad;
  const yMax = mx + pad;
  const rng = yMax - yMin || 1;

  const xAt = (i) => M.left + (i / (clean.length - 1)) * plotW;
  const yAt = (v) => M.top + (1 - (v - yMin) / rng) * plotH;

  // Handle single data point case by plotting a single point
  if (valid.length === 1) {
    const x = xAt(0);
    const y = yAt(valid[0]);

    return (
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: "100%", height: 260, display: "block" }}>
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Axes */}
        <line x1={M.left} y1={M.top} x2={M.left} y2={M.top + plotH} stroke={T.border} strokeWidth="1" />
        <line x1={M.left} y1={M.top + plotH} x2={M.left + plotW} y2={M.top + plotH} stroke={T.border} strokeWidth="1" />

        {/* Y axis ticks */}
        {labelY.map((v, idx) => {
          const y = yAt(parseFloat(v));
          return (
            <g key={idx}>
              <line x1={M.left - 6} y1={y} x2={M.left} y2={y} stroke={T.border} strokeWidth="1" />
              <text x={M.left - 10} y={y + 4} fontSize="11" fill={T.textSoft} textAnchor="end" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                {v}
              </text>
              <line x1={M.left} y1={y} x2={M.left + plotW} y2={y} stroke={T.divider} strokeWidth="1" opacity="0.7" />
            </g>
          );
        })}

        {/* X axis tick */}
        <g>
          <line x1={x} y1={M.top + plotH} x2={x} y2={M.top + plotH + 6} stroke={T.border} strokeWidth="1" />
          <text x={x} y={M.top + plotH + 22} fontSize="11" fill={T.textSoft} textAnchor="middle">
            {xLabels[0] || "1"}
          </text>
        </g>

        {/* Single Point */}
        <circle cx={x} cy={y} r={4} fill={color} />
      </svg>
    );
  }

  // If you have more than one point, proceed as usual with the line chart
  let lastGood = valid[0];
  const pts = clean.map((d, i) => {
    if (d == null || Number.isNaN(d)) d = lastGood;
    else lastGood = d;
    return `${xAt(i).toFixed(1)},${yAt(d).toFixed(1)}`;
  }).join(" ");

  const firstX = xAt(0);
  const lastX = xAt(clean.length - 1);
  const baseY = M.top + plotH;
  const areaPath = `M ${firstX},${baseY} L ${pts} L ${lastX},${baseY} Z`;

  const yTicks = 5;
  // const yTickVals = Array.from({ length: yTicks }, (_, k) => {
  //   return yMin + (k * (yMax - yMin)) / (yTicks - 1);
  // }).reverse();
  const yTickVals = Array.from({ length: yTicks }, (_, k) => {
    return yMin + (k * (yMax - yMin)) / (yTicks - 1);
});

  const xTicks = Math.min(6, clean.length);
  const xTickIdx = Array.from({ length: xTicks }, (_, k) => {
    return Math.round((k * (clean.length - 1)) / (xTicks - 1));
  });

  const xl = Array.isArray(xLabels) && xLabels.length >= clean.length
    ? xLabels
    : clean.map((_, i) => `${i}`);

  const gid = "bg_" + color.replace("#", "");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: "100%", height: 260, display: "block" }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Axes */}
      <line x1={M.left} y1={M.top} x2={M.left} y2={M.top + plotH} stroke={T.border} strokeWidth="1" />
      <line x1={M.left} y1={M.top + plotH} x2={M.left + plotW} y2={M.top + plotH} stroke={T.border} strokeWidth="1" />

      {/* Y axis ticks */}
      {yTickVals.map((v, idx) => {
        const y = yAt(v);
        return (
          <g key={idx}>
            <line x1={M.left - 6} y1={y} x2={M.left} y2={y} stroke={T.border} strokeWidth="1" />
            <text x={M.left - 10} y={y + 4} fontSize="11" fill={T.textSoft} textAnchor="end" style={{ fontFamily: "'Roboto Mono', monospace" }}>
              {labelY ? labelY[idx] : v.toFixed(1)}
            </text>
            <line x1={M.left} y1={y} x2={M.left + plotW} y2={y} stroke={T.divider} strokeWidth="1" opacity="0.7" />
          </g>
        );
      })}

      {/* X axis ticks */}
      {/* {xTickIdx.map((i) => {
        const x = xAt(i);
        return (
          <g key={i}>
            <line x1={x} y1={M.top + plotH} x2={x} y2={M.top + plotH + 6} stroke={T.border} strokeWidth="1" />
            <text x={x} y={M.top + plotH + 22} fontSize="11" fill={T.textSoft} textAnchor="middle">
              {xl[i] ?? ""}
            </text>
          </g>
        );
      })} */}
      {/* X axis ticks */}
{xTickIdx.map((i) => {
    const x = xAt(i);
    const label = xl[i] ?? "";
    
    // Split "05/03 15:19" into date and time parts
    const [datePart, timePart] = label.split(" ");

    return (
        <g key={i}>
            <line 
                x1={x} y1={M.top + plotH} 
                x2={x} y2={M.top + plotH + 6} 
                stroke={T.border} strokeWidth="1" 
            />
            {/* Time on first line */}
            <text 
                x={x} y={M.top + plotH + 18} 
                fontSize="11" fill={T.textSoft} textAnchor="middle"
            >
                {timePart || label}
            </text>
            {/* Date on second line */}
            {datePart && timePart && (
                <text 
                    x={x} y={M.top + plotH + 32} 
                    fontSize="10" fill={T.textSoft} textAnchor="middle" 
                    opacity="0.7"
                >
                    {datePart}
                </text>
            )}
        </g>
    );
})}

      <path d={areaPath} fill={`url(#${gid})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
function StatusBar({ counts, loading, error, lastSync, onRefresh }) {
  const pills = [
    { key: "normal",  label: "Normal",  color: T.normal  },
    { key: "warning", label: "Warning", color: T.warning },
    { key: "alarm",   label: "Alarm",   color: T.alarm, blink: true },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      {pills.map((p) => (
        <div key={p.key} style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "5px 13px", borderRadius: 20,
          fontSize: 11, fontWeight: 600,
          color: p.color,
          background: rgba(p.color, 0.10),
          border: `1px solid ${rgba(p.color, 0.28)}`,
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%",
            background: p.color, display: "inline-block",
            animation: p.blink ? "aqms_blink 1.1s infinite" : "none",
          }} />
          {counts[p.key] ?? 0} {p.label}
        </div>
      ))}

      {/* Error indicator */}
      {error && (
        <div style={{
          fontSize: 10, color: T.alarm,
          background: rgba(T.alarm, 0.08),
          border: `1px solid ${rgba(T.alarm, 0.25)}`,
          padding: "4px 10px", borderRadius: 6,
        }}>
          ⚠ {error}
        </div>
      )}

      {/* Refresh button */}
      <button
        onClick={onRefresh}
        disabled={loading}
        style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "5px 12px", borderRadius: 7,
          fontSize: 11, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
          color: T.blue, background: T.blueSoft,
          border: `1px solid ${rgba(T.blue, 0.2)}`,
          transition: "all 0.18s",
          opacity: loading ? 0.6 : 1,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5"
          style={{ animation: loading ? "aqms_spin 1s linear infinite" : "none" }}>
          <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
        </svg>
        {loading ? "Syncing…" : "Refresh"}
      </button>

      {lastSync && (
        <span style={{ fontSize: 10, color: T.textDim, fontFamily: "'Roboto Mono', monospace" }}>
          Synced {lastSync.toLocaleTimeString("en-US", { hour12: false })}
        </span>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  SEARCH / FILTER BAR
// ══════════════════════════════════════════════════════════════
function FilterBar({ query, onQuery, statusFilter, onStatusFilter, total, shown }) {
  const statuses = ["all", "normal", "warning", "alarm"];
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      flexWrap: "wrap", marginBottom: 18,
    }}>
      {/* Search */}
      <div style={{ position: "relative", flex: "1 1 180px", maxWidth: 280 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke={T.textSoft} strokeWidth="2.5"
          style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}>
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search parameter…"
          style={{
            width: "100%", padding: "7px 10px 7px 30px",
            borderRadius: 8, border: `1.5px solid ${T.border}`,
            fontSize: 12, color: T.text, background: T.cardBg,
            outline: "none", fontFamily: "inherit",
          }}
          onFocus={(e) => (e.target.style.borderColor = T.blue)}
          onBlur={(e)  => (e.target.style.borderColor = T.border)}
        />
      </div>

      {/* Status filter buttons */}
      {statuses.map((s) => (
        <button key={s} onClick={() => onStatusFilter(s)}
          style={{
            padding: "6px 13px", borderRadius: 7, fontSize: 11,
            fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
            border: `1.5px solid ${statusFilter === s ? T.blue : T.border}`,
            color: statusFilter === s ? T.white : T.textMid,
            background: statusFilter === s ? T.blue : T.cardBg,
            transition: "all 0.18s",
          }}>
          {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
        </button>
      ))}

      <span style={{ fontSize: 11, color: T.textSoft, marginLeft: "auto" }}>
        Showing {shown} of {total} parameters
      </span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  CLOCK
// ══════════════════════════════════════════════════════════════
function Clock() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString("en-US", { hour12: false })
  );
  useEffect(() => {
    const id = setInterval(() =>
      setTime(new Date().toLocaleTimeString("en-US", { hour12: false })), 1000
    );
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{
      fontSize: 11, color: T.textMid,
      fontFamily: "'Roboto Mono', monospace",
      background: T.blueSoft, padding: "5px 12px",
      borderRadius: 7, border: `1px solid ${rgba(T.blue, 0.15)}`,
    }}>
      {time}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  SUMMARY STATS ROW
// ══════════════════════════════════════════════════════════════
function SummaryStats({ data }) {
  const total   = data.length;
  const normal  = data.filter((p) => p.status.toLowerCase() === "normal").length;
  const warning = data.filter((p) => p.status.toLowerCase() === "warning").length;
  const alarm   = data.filter((p) => p.status.toLowerCase() === "alarm").length;
  const alarmPct = total ? Math.round((alarm / total) * 100) : 0;

  const stats = [
    { label: "Total Parameters", value: total,   color: T.blue,    bg: T.blueSoft },
    { label: "Normal",           value: normal,  color: T.normal,  bg: rgba(T.normal, 0.08) },
    { label: "Warning",          value: warning, color: T.warning, bg: rgba(T.warning, 0.08) },
    { label: "Alarm",            value: alarm,   color: T.alarm,   bg: rgba(T.alarm, 0.08) },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
      gap: 10, marginBottom: 20,
    }}>
      {stats.map((s) => (
        <div key={s.label} style={{
          background: s.bg,
          border: `1px solid ${rgba(s.color, 0.2)}`,
          borderRadius: 10, padding: "12px 14px",
          display: "flex", flexDirection: "column", gap: 4,
        }}>
          <span style={{ fontSize: 10, color: T.textSoft, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.8px" }}>
            {s.label}
          </span>
          <span style={{ fontSize: 24, fontWeight: 700, color: s.color, lineHeight: 1 }}>
            {s.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  SPARKLINE HISTORY MANAGER
//  Keeps rolling sparkline history per parameter.
//  Updates automatically when new data arrives.
// ══════════════════════════════════════════════════════════════
// function useSparkHistories(params, sparkPoints = 50) {
//   const historiesRef = useRef({});
//   const [histories, setHistories] = useState({});

//   // Initialise or extend history when params change
//   useEffect(() => {
//     const updated = { ...historiesRef.current };
//     let changed = false;
//     params.forEach((p) => {
//       if (!updated[p.id]) {
//         const base = Math.abs(Number(p.val)) || 1;
//         const va   = base * 0.08 || 0.5;
//         let v = base;
//         updated[p.id] = Array.from({ length: sparkPoints }, () => {
//           v += (Math.random() - 0.5) * va * 2;
//           return Math.max(0, v);
//         });
//         changed = true;
//       }
//     });
//     if (changed) {
//       historiesRef.current = updated;
//       setHistories({ ...updated });
//     }
//   }, [params, sparkPoints]);

//   // Push new data point from live param val
//   const pushPoint = useCallback((params) => {
//     const updated = { ...historiesRef.current };
//     params.forEach((p) => {
//       if (!updated[p.id]) return;
//       const base = Math.abs(Number(p.val)) || 1;
//       const va   = base * 0.08 || 0.5;
//       const arr  = [...updated[p.id]];
//       let next   = arr.at(-1) + (Math.random() - 0.5) * va * 2;
//       arr.push(Math.max(0, next));
//       arr.shift();
//       updated[p.id] = arr;
//     });
//     historiesRef.current = updated;
//     setHistories({ ...updated });
//   }, []);

//   return { histories, pushPoint };
// }
function useSparkHistories(params, sparkPoints = 24) {
  const historiesRef = useRef({});
  const [histories, setHistories] = useState({});

  // Initialize / refresh history when params change (use hourlyValues)
  useEffect(() => {
    const updated = { ...historiesRef.current };
    let changed = false;

    params.forEach((p) => {
      const hv = Array.isArray(p.hourlyValues) ? p.hourlyValues : [];

      // If no history exists OR hourly length changed, reset from hourlyValues
      if (!updated[p.id] || updated[p.id].length !== hv.length) {
        // Extract values from hourlyValues array
        const seed = hv.length ? hv.map(item => Number(item.value)) : (p.latestValue != null ? [Number(p.latestValue)] : []);
        updated[p.id] = seed;
        changed = true;
      }
    });

    if (changed) {
      historiesRef.current = updated;
      setHistories({ ...updated });
    }
  }, [params]);

  // Optional pushPoint functionality (if required)
  const pushPoint = (id, newValue) => {
    if (historiesRef.current[id]) {
      const updatedHistory = [...historiesRef.current[id], newValue];
      // Ensure that the history doesn't exceed sparkPoints
      if (updatedHistory.length > sparkPoints) {
        updatedHistory.shift(); // Remove the first (oldest) value if it exceeds the limit
      }
      historiesRef.current[id] = updatedHistory;
      setHistories({ ...historiesRef.current });
    }
  };

  return { histories, pushPoint };
}

// ══════════════════════════════════════════════════════════════
//  MAIN DASHBOARD COMPONENT
// ══════════════════════════════════════════════════════════════
export default function AQMSDashboard({
  fetchUrl         = "",                 
  refreshInterval  = 5000,              
  stationName      = "",
  sparkPoints      = 50,
}) {
  // Live data
  const { loading,error, lastSync, refetch } = useLiveData(fetchUrl, refreshInterval);
  
  // Search & filter state
  const [query,        setQuery]        = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedParam, setSelectedParam] = useState(null);
    const [monitoringTypesData,setMonitoringTypesData] = useState([]);
  const [stationsData,setStationsData] = useState([]);
  const[filteredStations,setFilteredStations]=useState([]);
    const[selectedStation,setSelectedStation]=useState([]);
    const[selectedMonitorType,setSelectedMonitorType]=useState([]);
    const [data,setData] =useState([]);

  // Sparkline histories
  const { histories, pushPoint } = useSparkHistories(data, sparkPoints);

useEffect(()=>
{
 const fetchData = async () => {
        try {
            let authHeader = await CommonFunctions.getAuthHeader();
            const response = await fetch(CommonFunctions.getWebApiUrl() + "api/monitoringTyPElookupdata", {
                method: 'GET',
                headers: authHeader,
            });
            const data = await response.json();
            setMonitoringTypesData(data?.listMonitoringTypes);
            setStationsData(data?.stationsList);
          }catch(error)
          {
           console.error(error);
          }
        }
        fetchData();
},[]);
  // Animate sparklines every 2s
  useEffect(() => {
    if (!data.length) return;
    const id = setInterval(() => pushPoint(data), 2000);
    return () => clearInterval(id);
  }, [data, pushPoint]);

  // Filtered parameter list
  const filtered = data?.filter((p) => {
    const matchQuery  = !query || p.name.toLowerCase().includes(query.toLowerCase()) ||
                        p.sym.toLowerCase().includes(query.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchQuery && matchStatus;
  });

  // Status counts
  const counts = data?.reduce(
    (acc, p) => { acc[p.status] = (acc[p.status] || 0) + 1; return acc; },
    { normal: 0, warning: 0, alarm: 0 }
  );

  const handleChange =(value,name)=>
  {
    if(name === "monitorTypes")
    {
      setSelectedMonitorType(value)
    }else if(name === "stations" )
    {
      setSelectedStation(value);
    }
  }



useEffect(() => {
  const filteredStations = stationsData.filter(
    (station) => station.monitoringTypeId == selectedMonitorType
  );
   if (filteredStations.length > 0) {
    setFilteredStations(filteredStations);
    setSelectedStation(filteredStations[0].id); 
  } else {
    setFilteredStations([]); 
    setSelectedStation(null); 
  }
}, [selectedMonitorType, stationsData]);

// useEffect(() => {
//   if (monitoringTypesData.length > 0) {
//     setSelectedMonitorType(monitoringTypesData[0].id); 
//   }
// }, [monitoringTypesData]);

useEffect(() => {
  if (stationsData.length > 0) {
    const stationWithMonitoringType = stationsData.find(station => station.monitoringTypeId);
    
    if (stationWithMonitoringType) {
      setSelectedStation(stationWithMonitoringType.id);

      const matchingMonitoringType = monitoringTypesData.find(
        type => type.id === stationWithMonitoringType.monitoringTypeId
      );
      
      if (matchingMonitoringType) {
        setSelectedMonitorType(matchingMonitoringType.id);
      }
    }
  }
}, [stationsData, monitoringTypesData]);


useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
  document.getElementById("loader").style.display = "block";
        try {
            let authHeader = await CommonFunctions.getAuthHeader();
             const url = `${CommonFunctions.getWebApiUrl()}api/dashboardparemetersdata?stationId=${selectedStation}`; 
                const response = await fetch(url, { method: 'GET', headers: authHeader });
            const data = await response.json();

            // Process the data into the required format
            const formattedData = data?.map((item) => {
                      
        const formattedHourlyValues = item?.hourlyValues?.map((hv) => {
        return {
            value: hv?.value || '-', 
            dateTime: new Date(hv?.dateTime).toLocaleString("en-GB", { hour12: false }) 
        };
    }) || [];

        const formattedIntervalData = item?.intervalData?.map((interval) => {
        return {
            value: interval?.value || '-',
            dateTime: new Date(interval?.dateTime).toLocaleString("en-GB", { hour12: false }) 
        };
    }) || [];
                return {
                    id: item?.id,
                    name:item?.parameterName || '-',
                    sym: item?.parameterName,
                    val: item?.latestValue !=null ? item?.latestValue.toFixed(2):'-',
                     unit:item?.unitName||"-",
                     min: item?.minValue != null ? item?.minValue.toFixed(2) : '-',
                     max: item?.maxValue != null ? item?.maxValue.toFixed(2) : '-',
                     avg: item?.avgValue != null ? item?.avgValue.toFixed(2) : '-',
                     scale:item?.scale ||0,
                    limitH: item?.high || null,
                    limitHH: item?.highHigh || null,
                    floor:item?.floor||0,
                    ceiling:item?.ceiling ||0,
                    status: item?.highHigh != null && item?.latestValue >= item?.highHigh ? 'alarm': item?. High != null && item?.latestValue >=item?.high ?'warning':'normal'  ,
                     hourlyValues: formattedHourlyValues,
                     intervalData: formattedIntervalData 
                };
            });

            setData(formattedData); 
        } catch (error) {
            console.error("Error fetching data:", error);
        }finally
        {
            document.getElementById("loader").style.display = "none";
        }
    };

       if (!selectedStation) {
        setData([]);
        return;
    }
    fetchData();
    
    const intervalId = setInterval(fetchData, 60000); 

  
    return () => clearInterval(intervalId);
}, [selectedStation]);

  return (
    <>
           <div className="col-md-4">
            <div className="row">
              <div id="loader" className="loader"></div>
            </div>
          </div>
      {/* Global keyframes */}
      <style>{`
        @keyframes aqms_blink { 0%,100%{opacity:1} 50%{opacity:.15} }
        @keyframes aqms_spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        * { box-sizing: border-box; }
      `}</style>
  <main id="main" className="main">
      <div style={{
        background: T.bg,
        minHeight: "100%",
        padding: "22px 22px 36px",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}>

        {/* ── PAGE HEADER ─────────────────────────────── */}
        <div style={{
          display: "flex", alignItems: "flex-start",
          justifyContent: "space-between", flexWrap: "wrap",
          gap: 14, marginBottom: 20,
          paddingBottom: 18,
          borderBottom: `1.5px solid #edf1fb`,
        }}>
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
  <div>
    <label style={{ fontSize: "14px", marginRight: "8px" }}>Monitoring Types</label>
    <select
         style={{
        padding: '8px 12px',
        fontSize: '14px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        outline: 'none',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        backgroundColor: '#fff',
        width: '200px',
      }}
      value={selectedMonitorType}
        onChange={(e)=>handleChange(e.target.value,"monitorTypes")}
    >
     <option value="" disabled>
        Please Select
      </option>
      {monitoringTypesData.map((type) => (
        <option key={type.id} value={type.id}>
          {type.name}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label style={{ fontSize: "14px", marginRight: "8px" }}>Stations</label>
    <select
         style={{
        padding: '8px 12px',
        fontSize: '14px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        outline: 'none',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        backgroundColor: '#fff',
        width: '200px',
      }}
      value={selectedStation}
      onChange={(e)=>handleChange(e.target.value,"stations")}
    >
           <option value="" disabled>
        Please Select
      </option>
      {filteredStations.map((station) => (
        <option key={station.id} value={station.id}>
          {station.stationName}
        </option>
      ))}
    </select>
  </div>
</div>
       
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <StatusBar
              counts={counts}
              loading={loading}
              error={error}
              lastSync={lastSync}
              onRefresh={refetch}
            />
            <Clock />
          </div>
        </div>

        {/* ── SUMMARY STATS ───────────────────────────── */}
        <SummaryStats data={data} />

        {/* ── SEARCH & FILTER ─────────────────────────── */}
        <FilterBar
          query={query}
          onQuery={setQuery}
          statusFilter={statusFilter}
          onStatusFilter={setStatusFilter}
          total={data?.length}
          shown={filtered.length}
        />

        {/* ── PARAMETER CARDS GRID ────────────────────── */}
        {filtered.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 14,
          }}>
            {filtered.map((param) => {
              // Use original index for stable color assignment
              const originalIndex = data.findIndex((d) => d.id === param.id);
              const sparkData = histories[param.id] || [];
              return (
                <ParamCard
                  key={param.id}
                  param={param}
                  colorIndex={originalIndex}
                  sparkData={sparkData}
                  onClick={() => setSelectedParam({ param, sparkData, colorIndex: originalIndex })}
                />
              );
            })}
          </div>
        ) : (
          <div style={{
            textAlign: "center", padding: "60px 0",
            color: T.textSoft, fontSize: 14,
          }}>
            {data.length === 0
              ? ""
              : "No parameters match your search."}
          </div>
        )}

        <TrendModal
  open={!!selectedParam}
  onClose={() => setSelectedParam(null)}
  param={selectedParam?.param}
  sparkData={selectedParam?.param?.intervalData || []}
  colorIndex={selectedParam?.colorIndex ?? 0}
/>
      </div>
      </main>
    </>
  );
}

// ══════════════════════════════════════════════════════════════
//  SAMPLE DATA — used when fetchUrl is empty or API fails
//
//  HOW TO CONNECT YOUR REAL API:
//
//    Option 1 — Pass fetchUrl prop:
//      <AQMSDashboard fetchUrl="/api/parameters" refreshInterval={5000} />
//
//    Option 2 — Replace SAMPLE_PARAMETERS with your state:
//      const [params, setParams] = useState([]);
//      useEffect(() => {
//        fetch('/api/parameters').then(r => r.json()).then(setParams);
//      }, []);
//      <AQMSDashboard fetchUrl="/api/parameters" />
//
//    Your API response must be an array matching the param shape
//    documented at the top of this file.
// ══════════════════════════════════════════════════════════════
const SAMPLE_PARAMETERS = [
  { id:"so2",  name:"Sulfur Dioxide",      sym:"SO₂",  val:40,    unit:"mg/Nm³", min:35,    avg:39,    max:44,    scale:500,   limitH:150,  limitHH:200,  status:"normal"  },
  { id:"nox",  name:"Nitrogen Oxides",     sym:"NOₓ",  val:140,   unit:"mg/Nm³", min:123,   avg:136,   max:154,   scale:400,   limitH:150,  limitHH:200,  status:"normal"  },
  { id:"co",   name:"Carbon Monoxide",     sym:"CO",   val:22,    unit:"mg/Nm³", min:20,    avg:22,    max:24,    scale:300,   limitH:100,  limitHH:150,  status:"normal"  },
  { id:"o2",   name:"Oxygen",              sym:"O₂",   val:5.9,   unit:"% vol",  min:5,     avg:6,     max:6,     scale:21,    limitH:null, limitHH:null, status:"normal"  },
  { id:"co2",  name:"Carbon Dioxide",      sym:"CO₂",  val:15,    unit:"% vol",  min:13,    avg:14,    max:16,    scale:25,    limitH:null, limitHH:null, status:"normal"  },
  { id:"pm",   name:"Opacity / Dust",      sym:"PM",   val:50,    unit:"mg/Nm³", min:44,    avg:48,    max:55,    scale:200,   limitH:40,   limitHH:50,   status:"warning" },
  { id:"qv",   name:"Stack Flow Rate",     sym:"Qv",   val:15280, unit:"Nm³/h",  min:13447, avg:14022, max:16008, scale:25000, limitH:null, limitHH:null, status:"normal"  },
  { id:"tmp",  name:"Stack Temperature",   sym:"T",    val:119,   unit:"°C",     min:104,   avg:115,   max:130,   scale:400,   limitH:200,  limitHH:250,  status:"normal"  },
  { id:"hcl",  name:"Hydrogen Chloride",   sym:"HCl",  val:6.3,   unit:"mg/Nm³", min:6,     avg:6,     max:7,     scale:50,    limitH:8,    limitHH:10,   status:"normal"  },
  { id:"hf",   name:"Hydrogen Fluoride",   sym:"HF",   val:1.0,   unit:"mg/Nm³", min:1,     avg:1,     max:1,     scale:5,     limitH:0.8,  limitHH:1.0,  status:"alarm"   },
  { id:"nh3",  name:"Ammonia",             sym:"NH₃",  val:0.8,   unit:"mg/Nm³", min:0.5,   avg:0.7,   max:1.0,   scale:10,    limitH:3,    limitHH:5,    status:"normal"  },
  { id:"h2o",  name:"Moisture / H₂O",     sym:"H₂O",  val:12.5,  unit:"% vol",  min:11,    avg:12,    max:14,    scale:30,    limitH:null, limitHH:null, status:"normal"  },
  { id:"thc",  name:"Total Hydrocarbons",  sym:"THC",  val:8.2,   unit:"mg/Nm³", min:6,     avg:7.5,   max:10,    scale:50,    limitH:15,   limitHH:20,   status:"normal"  },
  { id:"prs",  name:"Stack Pressure",      sym:"P",    val:-2.4,  unit:"mbar",   min:-3.1,  avg:-2.6,  max:-2.0,  scale:5,     limitH:null, limitHH:null, status:"normal"  },
];
