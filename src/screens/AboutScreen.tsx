import { useNavigate } from 'react-router-dom'

export default function AboutScreen() {
  const navigate = useNavigate()

  return (
    <div>
      <section style={{
        background: 'var(--bg-hero)',
        padding: '100px 40px 80px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <span className="chip chip-lav" style={{ marginBottom: 24, display: 'inline-flex' }}>
            Our story
          </span>
          <h1 className="serif" style={{
            fontSize: 72,
            lineHeight: 1.05,
            color: 'var(--ink)',
            letterSpacing: '-0.02em',
            marginBottom: 24,
          }}>
            A girl, a cat, a million beads.
          </h1>
          <p style={{
            fontSize: 18,
            color: 'var(--ink-soft)',
            lineHeight: 1.7,
            maxWidth: 560,
            margin: '0 auto',
          }}>
            Born in the coffee hills of Armenia, Quindío, Ambar Design is a one-woman studio where every piece is stitched by hand — named for a golden-brown cat who supervised it all.
          </p>
        </div>
      </section>

      <section style={{ padding: '80px 40px 100px', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p style={{
            fontSize: 17,
            color: 'var(--ink-2)',
            lineHeight: 1.85,
            marginBottom: 36,
          }}>
            Laura started threading beads on a borrowed needle in 2019, sitting at a kitchen table in Armenia with a cup of tinto going cold beside her. She had no plan to sell anything. She just wanted to make something small and quiet with her hands — the kind of object you carry without thinking about it, until one day someone asks where you got it.
          </p>

          <p style={{
            fontSize: 17,
            color: 'var(--ink-2)',
            lineHeight: 1.85,
            marginBottom: 36,
          }}>
            The studio takes its name from her cat Ámbar — an orange tabby with a coat the color of{' '}
            <span style={{ color: 'var(--amber)', fontWeight: 600 }}>raw honey and warm amber</span>
            {' '}— who spent most of those early sessions sprawled across the bead mat, batting seed beads off the table one at a time. The first color Laura ever wove was{' '}
            <span style={{ color: 'var(--lavender-deep)', fontWeight: 600 }}>lavender</span>
            {' '}— she still doesn't know exactly why, only that it felt right for the light in the room that afternoon.
          </p>

          <p style={{
            fontSize: 17,
            color: 'var(--ink-2)',
            lineHeight: 1.85,
            marginBottom: 48,
          }}>
            Every piece in the collection is still made in small batches — often just four or six at a time — using Japanese Miyuki seed beads sourced from specialty suppliers and finished with sterling or gold-fill findings. Colombia's coffee region is not a place that hurries, and neither is Ambar Design. Orders ship within two business days. Custom pieces take a little longer. Nothing is made by machine. Nothing is made twice the same.
          </p>

          <div style={{
            borderTop: '1px solid var(--line)',
            paddingTop: 40,
            display: 'flex',
            gap: 16,
          }}>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/shop')}
            >
              Shop the collection
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => navigate('/builder')}
            >
              Design something custom
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
