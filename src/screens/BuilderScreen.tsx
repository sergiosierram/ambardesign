import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BeadArt from '../components/BeadArt'
import Icon from '../components/Icons'
import { PATTERNS } from '../data/products'
import type { Pattern } from '../types'

const SHAPES = [
  { id: 'flower',    label: 'Flower',    cat: 'Earrings · Charms',   basePrice: 18, pattern: PATTERNS.flower    },
  { id: 'heart',     label: 'Heart',     cat: 'Earrings · Rings',     basePrice: 18, pattern: PATTERNS.heart     },
  { id: 'star',      label: 'Star',      cat: 'Earrings · Charms',   basePrice: 20, pattern: PATTERNS.star      },
  { id: 'butterfly', label: 'Butterfly', cat: 'Keychains · Charms',  basePrice: 22, pattern: PATTERNS.butterfly },
  { id: 'daisy',     label: 'Daisy',     cat: 'Earrings · Charms',   basePrice: 20, pattern: PATTERNS.daisy     },
  { id: 'smiley',    label: 'Smiley',    cat: 'Phone charms',         basePrice: 16, pattern: PATTERNS.smiley    },
  { id: 'strand',    label: 'Strand',    cat: 'Bracelets · Necklaces',basePrice: 24, pattern: PATTERNS.strand2   },
  {
    id: 'blank',
    label: 'Blank',
    cat: 'Freestyle',
    basePrice: 18,
    pattern: [
      [-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1],
    ] as Pattern,
  },
]

const SWATCHES = [
  { name: 'Lavender',  c: '#9F8FC9' },
  { name: 'Mauve',     c: '#6E5DA0' },
  { name: 'Lilac',     c: '#EDE7F5' },
  { name: 'Cream',     c: '#FAF6F0' },
  { name: 'Amber',     c: '#C8843E' },
  { name: 'Honey',     c: '#F2DDC2' },
  { name: 'Clay',      c: '#B05E3C' },
  { name: 'Cocoa',     c: '#7A5638' },
  { name: 'Ink',       c: '#2A1F17' },
  { name: 'Rose',      c: '#D8A5A0' },
  { name: 'Berry',     c: '#8B4338' },
  { name: 'Sage',      c: '#8FA08A' },
  { name: 'Mint',      c: '#B8D6C7' },
  { name: 'Sky',       c: '#A8C0D9' },
  { name: 'Sunshine',  c: '#E8C547' },
  { name: 'Tomato',    c: '#C44536' },
]

const SIZES = [
  { id: 'XS', label: 'XS · 12mm', mult: 0.7,  beadsApprox: 25  },
  { id: 'S',  label: 'S · 18mm',  mult: 0.85, beadsApprox: 50  },
  { id: 'M',  label: 'M · 24mm',  mult: 1.0,  beadsApprox: 90  },
  { id: 'L',  label: 'L · 32mm',  mult: 1.3,  beadsApprox: 160 },
  { id: 'XL', label: 'XL · 42mm', mult: 1.7,  beadsApprox: 240 },
]

const TYPES = ['Earrings', 'Charm', 'Keychain', 'Ring', 'Bracelet', 'Phone charm']

function deepClonePattern(p: Pattern): Pattern {
  return p.map(row => [...row])
}

interface PanelProps {
  title: string
  step?: string
  children: React.ReactNode
}

function Panel({ title, step, children }: PanelProps) {
  return (
    <div style={{
      background: 'var(--paper)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--r-lg)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-2)' }}>
          {title}
        </span>
        {step && (
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-mute)' }}>
            {step}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

interface BeadGridEditorProps {
  pattern: Pattern
  palette: string[]
  activeColor: number
  onPaint: (y: number, x: number) => void
}

function BeadGridEditor({ pattern, palette, activeColor, onPaint }: BeadGridEditorProps) {
  const [hovered, setHovered] = useState<[number, number] | null>(null)

  if (!pattern?.length) return null

  const rows = pattern.length
  const cols = pattern[0].length
  const cellSize = Math.min(Math.floor(420 / cols), 50)
  const w = cellSize * cols
  const h = cellSize * rows
  const r = cellSize * 0.42

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      style={{ display: 'block', cursor: 'crosshair', borderRadius: 'var(--r-md)' }}
    >
      {pattern.map((row, y) =>
        row.map((cell, x) => {
          const cx = x * cellSize + cellSize / 2
          const cy = y * cellSize + cellSize / 2
          const isHovered = hovered?.[0] === y && hovered?.[1] === x
          const isEmpty = cell === -1 || cell === null
          const color = isEmpty ? 'transparent' : (palette[cell as number] ?? '#ddd')

          return (
            <g
              key={`${y}-${x}`}
              onClick={() => onPaint(y, x)}
              onMouseEnter={() => setHovered([y, x])}
              onMouseLeave={() => setHovered(null)}
            >
              <rect
                x={x * cellSize}
                y={y * cellSize}
                width={cellSize}
                height={cellSize}
                fill={isHovered ? 'rgba(159,143,201,0.12)' : 'transparent'}
              />
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill={isEmpty ? 'var(--line)' : color}
                stroke={isHovered ? (palette[activeColor] ?? '#9F8FC9') : 'rgba(0,0,0,0.1)'}
                strokeWidth={isHovered ? 2 : 0.5}
              />
              {!isEmpty && (
                <circle
                  cx={cx - r * 0.28}
                  cy={cy - r * 0.28}
                  r={r * 0.22}
                  fill="rgba(255,255,255,0.5)"
                />
              )}
            </g>
          )
        })
      )}
    </svg>
  )
}

interface BuilderConfirmationProps {
  shape: typeof SHAPES[number]
  pattern: Pattern
  palette: string[]
  size: typeof SIZES[number]
  type: string
  notes: string
  estLow: number
  estHigh: number
  onReset: () => void
}

function BuilderConfirmation({ shape, pattern, palette, size, type, notes, estLow, estHigh, onReset }: BuilderConfirmationProps) {
  const navigate = useNavigate()
  const reqNum = `CR-${Math.floor(Math.random() * 9000) + 1000}`

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 24px',
      background: 'var(--cream)',
    }}>
      <div style={{
        maxWidth: 540,
        width: '100%',
        textAlign: 'center',
      }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'var(--lavender-soft)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <Icon name="check" size={32} color="var(--lavender-deep)" />
        </div>

        <h1 className="serif" style={{ fontSize: 42, color: 'var(--ink)', marginBottom: 8 }}>
          Request sent!
        </h1>
        <p style={{ fontSize: 15, color: 'var(--ink-soft)', marginBottom: 6 }}>
          We received your custom design. We'll quote it within 24 hours.
        </p>
        <div style={{
          display: 'inline-block',
          fontFamily: 'var(--mono)',
          fontSize: 12,
          background: 'var(--cream-2)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r-pill)',
          padding: '4px 14px',
          color: 'var(--ink-2)',
          marginBottom: 36,
        }}>
          {reqNum}
        </div>

        <div style={{
          background: 'var(--paper)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r-xl)',
          padding: '28px 32px',
          marginBottom: 28,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          textAlign: 'left',
        }}>
          <div style={{
            flexShrink: 0,
            background: 'var(--lavender-soft)',
            borderRadius: 'var(--r-lg)',
            padding: 12,
          }}>
            <BeadArt pattern={pattern} palette={palette} size={80} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>
              {shape.label} · {size.label}
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 2 }}>
              Type: {type}
            </div>
            {notes && (
              <div style={{ fontSize: 13, color: 'var(--ink-mute)', fontStyle: 'italic', marginBottom: 2 }}>
                "{notes}"
              </div>
            )}
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginTop: 8 }}>
              Est. ${estLow}–${estHigh}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => navigate('/shop')}>
            Back to shop
          </button>
          <button className="btn btn-ghost" onClick={onReset}>
            Design another
          </button>
        </div>
      </div>
    </div>
  )
}

export default function BuilderScreen() {
  const navigate = useNavigate()

  const defaultShape = SHAPES[0]
  const [shapeId, setShapeId] = useState<string>(defaultShape.id)
  const [pattern, setPattern] = useState<Pattern>(deepClonePattern(defaultShape.pattern))
  const [palette, setPalette] = useState<string[]>(['#9F8FC9', '#EDE7F5', '#6E5DA0', '#FAF6F0', '#C8843E'])
  const [activeColor, setActiveColor] = useState<number>(0)
  const [size, setSize] = useState<string>('M')
  const [type, setType] = useState<string>('Earrings')
  const [notes, setNotes] = useState<string>('')
  const [submitted, setSubmitted] = useState<boolean>(false)

  const currentShape = SHAPES.find(s => s.id === shapeId) ?? SHAPES[0]
  const currentSize = SIZES.find(s => s.id === size) ?? SIZES[2]

  const beadCount = pattern.flat().filter(v => v !== -1 && v !== null).length
  const colorValues = pattern.flat().filter((v): v is number => v !== -1 && v !== null)
  const colorCount = new Set(colorValues).size
  const transitions = pattern.reduce((acc, row) => {
    for (let x = 0; x < row.length - 1; x++) {
      const a = row[x], b = row[x + 1]
      if (a !== -1 && a !== null && b !== -1 && b !== null && a !== b) acc++
    }
    return acc
  }, 0)

  const complexityScore = beadCount > 0 ? transitions / beadCount : 0
  const complexityLabel = complexityScore < 0.3 ? 'Simple' : complexityScore < 0.55 ? 'Medium' : 'Intricate'
  const complexityMult = complexityScore < 0.3 ? 1.0 : complexityScore < 0.55 ? 1.18 : 1.42
  const colorAdd = Math.max(0, colorCount - 3) * 1.5
  const estLow = Math.round(currentShape.basePrice * currentSize.mult * complexityMult + colorAdd)
  const estHigh = Math.round(estLow * 1.25)

  function paintCell(y: number, x: number) {
    setPattern(prev => {
      const next = prev.map(row => [...row])
      if (next[y][x] === activeColor) {
        next[y][x] = -1
      } else {
        next[y][x] = activeColor
      }
      return next
    })
  }

  function handleShapeSelect(s: typeof SHAPES[number]) {
    setShapeId(s.id)
    setPattern(deepClonePattern(s.pattern))
  }

  function handleReset() {
    setPattern(deepClonePattern(currentShape.pattern))
  }

  function handleClear() {
    setPattern(currentShape.pattern.map(row => row.map(() => -1)))
  }

  function handleFill() {
    setPattern(currentShape.pattern.map(row => row.map(v => (v === -1 || v === null) ? -1 : activeColor)))
  }

  function handlePaletteSlotChange(idx: number, hex: string) {
    setPalette(prev => {
      const next = [...prev]
      next[idx] = hex
      return next
    })
  }

  function handleSubmit() {
    setSubmitted(true)
  }

  function handleDesignAnother() {
    setShapeId(defaultShape.id)
    setPattern(deepClonePattern(defaultShape.pattern))
    setPalette(['#9F8FC9', '#EDE7F5', '#6E5DA0', '#FAF6F0', '#C8843E'])
    setActiveColor(0)
    setSize('M')
    setType('Earrings')
    setNotes('')
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <BuilderConfirmation
        shape={currentShape}
        pattern={pattern}
        palette={palette}
        size={currentSize}
        type={type}
        notes={notes}
        estLow={estLow}
        estHigh={estHigh}
        onReset={handleDesignAnother}
      />
    )
  }

  return (
    <div style={{
      maxWidth: 1320,
      margin: '0 auto',
      padding: '40px 32px',
      minHeight: '80vh',
    }}>
      <div style={{ marginBottom: 32 }}>
        <span className="chip chip-lav" style={{ marginBottom: 14, display: 'inline-flex' }}>
          Bead Builder
        </span>
        <h1 className="serif" style={{ fontSize: 48, color: 'var(--ink)', lineHeight: 1.05, marginBottom: 8 }}>
          Design your piece
        </h1>
        <p style={{ fontSize: 15, color: 'var(--ink-soft)' }}>
          Pick a shape, paint with beads, get an instant quote.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr 320px',
        gap: 20,
        alignItems: 'start',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Panel title="Shape" step="01">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {SHAPES.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleShapeSelect(s)}
                  style={{
                    background: shapeId === s.id ? 'var(--lavender-soft)' : 'var(--cream)',
                    border: `1px solid ${shapeId === s.id ? 'var(--lavender)' : 'var(--line)'}`,
                    borderRadius: 'var(--r-md)',
                    padding: '10px 8px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all .12s',
                    fontFamily: 'var(--sans)',
                  }}
                >
                  <BeadArt pattern={s.pattern} palette={palette} size={50} />
                  <span style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: shapeId === s.id ? 'var(--lavender-deep)' : 'var(--ink-2)',
                    letterSpacing: '0.02em',
                  }}>
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Type" step="02">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  style={{
                    background: type === t ? 'var(--ink)' : 'var(--cream)',
                    border: `1px solid ${type === t ? 'var(--ink)' : 'var(--line)'}`,
                    borderRadius: 'var(--r-pill)',
                    padding: '7px 10px',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                    color: type === t ? 'var(--cream)' : 'var(--ink-2)',
                    fontFamily: 'var(--sans)',
                    transition: 'all .12s',
                    textAlign: 'center',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Size" step="03">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {SIZES.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSize(s.id)}
                  style={{
                    background: size === s.id ? 'var(--ink)' : 'var(--cream)',
                    border: `1px solid ${size === s.id ? 'var(--ink)' : 'var(--line)'}`,
                    borderRadius: 'var(--r-md)',
                    padding: '10px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontFamily: 'var(--sans)',
                    transition: 'all .12s',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: size === s.id ? 'var(--cream)' : 'var(--ink)' }}>
                    {s.label}
                  </span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: size === s.id ? 'rgba(250,246,240,0.7)' : 'var(--ink-mute)' }}>
                    ~{s.beadsApprox} beads
                  </span>
                </button>
              ))}
            </div>
          </Panel>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            background: 'var(--paper)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--r-lg)',
            padding: 24,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
              flexWrap: 'wrap',
              gap: 10,
            }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-2)' }}>
                  Live preview
                </span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-mute)', marginLeft: 10 }}>
                  {currentShape.label} · {size}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost btn-sm" onClick={handleReset}>
                  Reset
                </button>
                <button className="btn btn-ghost btn-sm" onClick={handleClear}>
                  Clear
                </button>
                <button className="btn btn-ghost btn-sm" onClick={handleFill}>
                  Fill
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <BeadGridEditor
                pattern={pattern}
                palette={palette}
                activeColor={activeColor}
                onPaint={paintCell}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 10 }}>
                Active palette
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {palette.map((hex, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveColor(i)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: hex,
                      border: activeColor === i ? '3px solid var(--ink)' : '2px solid var(--line)',
                      cursor: 'pointer',
                      boxShadow: activeColor === i ? '0 0 0 2px var(--paper), 0 0 0 4px var(--ink)' : 'none',
                      transition: 'all .12s',
                      flexShrink: 0,
                    }}
                    title={`Slot ${i + 1}`}
                  />
                ))}
              </div>

              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 10 }}>
                Color library
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 6 }}>
                {SWATCHES.map(sw => (
                  <button
                    key={sw.name}
                    title={sw.name}
                    onClick={() => handlePaletteSlotChange(activeColor, sw.c)}
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: 6,
                      background: sw.c,
                      border: palette[activeColor] === sw.c ? '2px solid var(--ink)' : '1px solid rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      transition: 'transform .1s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.12)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = '' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            background: 'var(--ink)',
            borderRadius: 'var(--r-lg)',
            padding: 24,
            color: 'var(--cream)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(250,246,240,0.5)', marginBottom: 16 }}>
              Price estimate
            </div>
            <div className="serif" style={{ fontSize: 56, lineHeight: 1, marginBottom: 20, color: 'var(--cream)' }}>
              ${estLow}–${estHigh}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Shape', value: currentShape.label },
                { label: 'Size', value: currentSize.label },
                { label: 'Complexity', value: complexityLabel },
                { label: 'Colors used', value: colorCount > 0 ? `${colorCount} color${colorCount !== 1 ? 's' : ''}` : '—' },
                { label: 'Beads painted', value: beadCount > 0 ? beadCount : '—' },
              ].map(row => (
                <div key={row.label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 13,
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  paddingBottom: 8,
                }}>
                  <span style={{ color: 'rgba(250,246,240,0.55)' }}>{row.label}</span>
                  <span style={{ fontWeight: 600, color: 'var(--cream)' }}>{row.value}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: 'rgba(250,246,240,0.35)', marginTop: 16, lineHeight: 1.5 }}>
              Final price confirmed after review. No charge until you approve.
            </p>
          </div>

          <Panel title="Notes for Laura" step="04">
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Anything to add? Occasion, color feelings, alternate shapes…"
              rows={4}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 'var(--r-md)',
                background: 'var(--cream)',
                border: '1px solid var(--line)',
                fontFamily: 'var(--sans)',
                fontSize: 13,
                color: 'var(--ink)',
                resize: 'vertical',
                lineHeight: 1.6,
                transition: 'border-color .15s',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--ink-2)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--line)' }}
            />
          </Panel>

          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={handleSubmit}
          >
            <Icon name="sparkles" size={16} />
            Send design request
          </button>

          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              color: 'var(--ink-soft)',
              fontFamily: 'var(--sans)',
              textAlign: 'center',
              padding: '4px 0',
            }}
            onClick={() => navigate('/shop')}
          >
            Browse ready-made pieces instead
          </button>
        </div>
      </div>
    </div>
  )
}
