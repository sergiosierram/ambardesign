import type { Pattern } from '../types'

interface Props {
  pattern: Pattern
  palette: string[]
  size?: number
  bg?: string
  radius?: number
  strung?: boolean
}

export default function BeadArt({ pattern, palette, size = 200, bg = 'transparent', radius = 16, strung = false }: Props) {
  if (!pattern?.length) return null
  const rows = pattern.length
  const cols = pattern[0].length
  const cell = Math.min(size / cols, size / rows)
  const w = cell * cols
  const h = cell * rows
  const r = cell * 0.46

  const beads: React.ReactNode[] = []
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const idx = pattern[y][x]
      if (idx === null || idx === -1 || idx === undefined) continue
      const cx = x * cell + cell / 2
      const cy = y * cell + cell / 2
      const color = palette[idx as number] || '#ddd'
      beads.push(
        <g key={`${x}-${y}`}>
          <circle cx={cx} cy={cy} r={r} fill={color} />
          <circle cx={cx - r * 0.3} cy={cy - r * 0.3} r={r * 0.25} fill="rgba(255,255,255,0.55)" />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={r * 0.06} />
        </g>
      )
    }
  }

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={size}
      height={size * (h / w)}
      style={{ display: 'block', borderRadius: radius, background: bg }}
    >
      {strung && (
        <line x1={0} y1={cell / 2} x2={w} y2={cell / 2}
          stroke="rgba(120,100,80,0.3)" strokeWidth="0.6" />
      )}
      {beads}
    </svg>
  )
}
