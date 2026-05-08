import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BeadArt from '../components/BeadArt'
import ProductCard from '../components/ProductCard'
import { CATEGORIES } from '../data/products'
import { fetchProducts } from '../lib/db'
import type { Product } from '../types'

type SortOption = 'Featured' | 'Price · low' | 'Price · high' | 'New'

export default function CatalogScreen() {
  useNavigate()
  const [cat, setCat] = useState<string>('All')
  const [sort, setSort] = useState<SortOption>('Featured')
  const [products, setProducts] = useState<Product[]>([])
  const [dbLoading, setDbLoading] = useState(true)

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data)
      setDbLoading(false)
    })
  }, [])

  if (dbLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <p style={{ fontSize: 16, color: 'var(--ink-soft)' }}>Loading designs…</p>
      </div>
    )
  }

  const filtered: Product[] = products.filter(p =>
    cat === 'All' ? true : p.cat === cat
  )

  const sorted: Product[] = [...filtered].sort((a, b) => {
    if (sort === 'Price · low') return a.price - b.price
    if (sort === 'Price · high') return b.price - a.price
    if (sort === 'New') {
      const aNew = a.tags.includes('New') ? -1 : 1
      const bNew = b.tags.includes('New') ? -1 : 1
      return aNew - bNew
    }
    return 0
  })

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: 24,
        marginBottom: 36,
        flexWrap: 'wrap',
      }}>
        <div>
          <span className="chip chip-lav" style={{ marginBottom: 16, display: 'inline-flex' }}>
            The shop
          </span>
          <h1 className="serif" style={{
            fontSize: 56,
            lineHeight: 1.05,
            color: 'var(--ink)',
            marginBottom: 10,
          }}>
            All designs
          </h1>
          <p style={{ fontSize: 15, color: 'var(--ink-soft)' }}>
            {products.length} ready-made pieces · woven by hand
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label htmlFor="sort-select" style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--ink-soft)',
            whiteSpace: 'nowrap',
          }}>
            Sort by
          </label>
          <select
            id="sort-select"
            value={sort}
            onChange={e => setSort(e.target.value as SortOption)}
            style={{
              appearance: 'none',
              WebkitAppearance: 'none',
              background: 'var(--paper)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--r-pill)',
              padding: '9px 36px 9px 16px',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--ink)',
              fontFamily: 'var(--sans)',
              cursor: 'pointer',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237A6A5B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 14px center',
            }}
          >
            {(['Featured', 'Price · low', 'Price · high', 'New'] as SortOption[]).map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{
        overflowX: 'auto',
        marginBottom: 40,
        WebkitOverflowScrolling: 'touch',
      }}>
        <div style={{
          display: 'flex',
          gap: 4,
          borderBottom: '1px solid var(--line)',
          minWidth: 'max-content',
        }}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '10px 18px',
                fontSize: 13,
                fontWeight: cat === c ? 700 : 500,
                color: cat === c ? 'var(--ink)' : 'var(--ink-soft)',
                fontFamily: 'var(--sans)',
                borderBottom: cat === c ? '2px solid var(--ink)' : '2px solid transparent',
                marginBottom: -1,
                whiteSpace: 'nowrap',
                transition: 'color .12s',
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {sorted.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 0',
          color: 'var(--ink-soft)',
        }}>
          <div style={{ marginBottom: 16 }}>
            <BeadArt
              pattern={[[0, 1, 0], [1, 0, 1], [0, 1, 0]]}
              palette={['var(--line-2)', 'var(--cream-2)']}
              size={64}
            />
          </div>
          <p style={{ fontSize: 15 }}>No pieces in this category yet.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 24,
        }}>
          {sorted.map(p => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  )
}
