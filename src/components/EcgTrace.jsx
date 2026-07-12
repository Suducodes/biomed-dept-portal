import { useMemo } from "react";

// A real PQRST beat built from gaussians (P wave, QRS complex, T wave) — the
// same waveform language as the portfolio's vital-signs monitor.
const g = (x, c, s, a) => a * Math.exp(-((x - c) * (x - c)) / (2 * s * s));
function beat(ph) {
  const p = ((ph % 1) + 1) % 1;
  return (
    g(p, 0.2, 0.022, 0.1) + // P
    g(p, 0.31, 0.008, -0.12) + // Q
    g(p, 0.34, 0.011, 1.0) + // R
    g(p, 0.37, 0.011, -0.22) + // S
    g(p, 0.56, 0.04, 0.22) // T
  );
}

// Builds an SVG path of `beats` PQRST complexes across `w` × `h`.
function buildPath(beats, w, h) {
  const baseline = h * 0.62;
  const amp = h * 0.5;
  let d = "";
  for (let x = 0; x <= w; x += 2) {
    const ph = (x / w) * beats;
    const y = baseline - beat(ph) * amp;
    d += (x === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1);
  }
  return d;
}

// Realistic ECG monitor trace as a declarative SVG. It renders two copies of
// the waveform side by side and slides them left to give a smooth rolling
// "live monitor" effect — cheap (a single CSS transform), theme-aware via
// var(--color-signal), and no canvas/rAF.
export default function EcgTrace({ height = 130, beats = 6, className = "" }) {
  const W = 1200;
  const d = useMemo(() => buildPath(beats, W, height), [beats, height]);

  return (
    <div className={"ecg-wrap " + className} style={{ height }} aria-hidden="true">
      <svg
        className="ecg-svg"
        viewBox={`0 0 ${W} ${height}`}
        width="100%"
        height={height}
        preserveAspectRatio="none"
      >
        <g className="ecg-roll">
          <path d={d} fill="none" stroke="var(--color-signal)" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          <path d={d} transform={`translate(${W} 0)`} fill="none" stroke="var(--color-signal)" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </g>
      </svg>
    </div>
  );
}
