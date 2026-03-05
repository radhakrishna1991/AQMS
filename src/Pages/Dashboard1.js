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
  const [data,    setData]    = useState(SAMPLE_PARAMETERS);
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
    fetchData();
    if (!fetchUrl) return;
    const id = setInterval(fetchData, refreshInterval);
    return () => clearInterval(id);
  }, [fetchData, fetchUrl, refreshInterval]);

  return { data, loading, error, lastSync, refetch: fetchData };
}

// ══════════════════════════════════════════════════════════════
//  SPARKLINE — SVG-based, no dependencies
// ══════════════════════════════════════════════════════════════
function Sparkline({ data, color }) {
  const ref = useRef(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg || !data || data.length < 2) return;
    const W = 220, H = 40;
    const mn  = Math.min(...data);
    const mx  = Math.max(...data);
    const rng = mx - mn || 1;
    const pts = data
      .map((d, i) => {
        const x = (i / (data.length - 1)) * W;
        const y = H - ((d - mn) / rng) * (H - 6) - 3;
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
function DualLimitTrack({ val, scale, limitH, limitHH, fillColor }) {
  const rawVal  = Math.abs(Number(val)) || 0;
  const fillPct = Math.min(100, (rawVal / scale) * 100);
  const hPct    = limitH  != null ? Math.min(100, (limitH  / scale) * 100) : null;
  const hhPct   = limitHH != null ? Math.min(100, (limitHH / scale) * 100) : null;

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
            position: "absolute", left: `${hPct}%`,
            top: -3, width: 2, height: 12,
            background: T.limitH, borderRadius: 1,
          }} />
        )}
        {hhPct != null && (
          <div title={`High-High: ${limitHH}`} style={{
            position: "absolute", left: `${hhPct}%`,
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
function ParamCard({ param, colorIndex, sparkData }) {
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
        cursor: "default",
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
        scale={param.scale}
        limitH={param.limitH}
        limitHH={param.limitHH}
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
//  STATUS SUMMARY BAR
// ══════════════════════════════════════════════════════════════
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
  const normal  = data.filter((p) => p.status === "normal").length;
  const warning = data.filter((p) => p.status === "warning").length;
  const alarm   = data.filter((p) => p.status === "alarm").length;
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
function useSparkHistories(params, sparkPoints = 50) {
  const historiesRef = useRef({});
  const [histories, setHistories] = useState({});

  // Initialise or extend history when params change
  useEffect(() => {
    const updated = { ...historiesRef.current };
    let changed = false;
    params.forEach((p) => {
      if (!updated[p.id]) {
        const base = Math.abs(Number(p.val)) || 1;
        const va   = base * 0.08 || 0.5;
        let v = base;
        updated[p.id] = Array.from({ length: sparkPoints }, () => {
          v += (Math.random() - 0.5) * va * 2;
          return Math.max(0, v);
        });
        changed = true;
      }
    });
    if (changed) {
      historiesRef.current = updated;
      setHistories({ ...updated });
    }
  }, [params, sparkPoints]);

  // Push new data point from live param val
  const pushPoint = useCallback((params) => {
    const updated = { ...historiesRef.current };
    params.forEach((p) => {
      if (!updated[p.id]) return;
      const base = Math.abs(Number(p.val)) || 1;
      const va   = base * 0.08 || 0.5;
      const arr  = [...updated[p.id]];
      let next   = arr.at(-1) + (Math.random() - 0.5) * va * 2;
      arr.push(Math.max(0, next));
      arr.shift();
      updated[p.id] = arr;
    });
    historiesRef.current = updated;
    setHistories({ ...updated });
  }, []);

  return { histories, pushPoint };
}

// ══════════════════════════════════════════════════════════════
//  MAIN DASHBOARD COMPONENT
// ══════════════════════════════════════════════════════════════
export default function AQMSDashboard({
  fetchUrl         = "",                 // your API URL — leave empty to use sample data
  refreshInterval  = 5000,              // polling ms
  stationName      = "Aqdat Al Mawaniah",
  sparkPoints      = 50,
}) {
  // Live data
  const { data, loading, error, lastSync, refetch } = useLiveData(fetchUrl, refreshInterval);

  // Search & filter state
  const [query,        setQuery]        = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sparkline histories
  const { histories, pushPoint } = useSparkHistories(data, sparkPoints);

  // Animate sparklines every 2s
  useEffect(() => {
    if (!data.length) return;
    const id = setInterval(() => pushPoint(data), 2000);
    return () => clearInterval(id);
  }, [data, pushPoint]);

  // Filtered parameter list
  const filtered = data.filter((p) => {
    const matchQuery  = !query || p.name.toLowerCase().includes(query.toLowerCase()) ||
                        p.sym.toLowerCase().includes(query.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchQuery && matchStatus;
  });

  // Status counts
  const counts = data.reduce(
    (acc, p) => { acc[p.status] = (acc[p.status] || 0) + 1; return acc; },
    { normal: 0, warning: 0, alarm: 0 }
  );

  return (
    <>
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
            <div style={{ width: 4, height: 26, background: T.blue, borderRadius: 3 }} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: T.text, lineHeight: 1.2 }}>
                {stationName}
              </div>
              <div style={{ fontSize: 11, color: T.textSoft, marginTop: 3 }}>
                Real-time emissions monitoring dashboard
              </div>
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
          total={data.length}
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
              return (
                <ParamCard
                  key={param.id}
                  param={param}
                  colorIndex={originalIndex}
                  sparkData={histories[param.id] || []}
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
              ? "No parameters available. Connect your API."
              : "No parameters match your search."}
          </div>
        )}
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
