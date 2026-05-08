import type { Pattern, Product } from '../types'

export const PALETTES: Record<string, string[]> = {
  lavenderField: ['#9F8FC9', '#EDE7F5', '#6E5DA0', '#FAF6F0', '#C8843E'],
  amberSun:      ['#C8843E', '#F2DDC2', '#FAF6F0', '#A66828', '#2A1F17'],
  rosyClay:      ['#D8A5A0', '#FAF6F0', '#B05E3C', '#F2DEDB', '#2A1F17'],
  sageMeadow:    ['#8FA08A', '#FAF6F0', '#C8843E', '#E0E8DC', '#2A1F17'],
  duskBerry:     ['#6E5DA0', '#9F8FC9', '#FAF6F0', '#D8A5A0', '#2A1F17'],
  honeyCream:    ['#F2DDC2', '#C8843E', '#FAF6F0', '#A66828', '#2A1F17'],
  mochaMilk:     ['#C9A37A', '#FAF6F0', '#7A5638', '#2A1F17', '#E8DFD2'],
  mintFrost:     ['#B8D6C7', '#FAF6F0', '#5C8A6C', '#9F8FC9', '#2A1F17'],
}

function P(strRows: string[]): Pattern {
  return strRows.map(row =>
    row.split('').map(c => (c === '.' ? -1 : parseInt(c, 36)))
  )
}

export const PATTERNS: Record<string, Pattern> = {
  daisy: P([
    '..1.1..',
    '.10001.',
    '1002001',
    '1002001',
    '1002001',
    '.10001.',
    '..1.1..',
  ]),
  flower: P([
    '...1...',
    '.11.11.',
    '1.020.1',
    '..2.2..',
    '...0...',
    '..2.2..',
    '.......',
  ]),
  heart: P([
    '.11.11.',
    '1001001',
    '1000001',
    '1000001',
    '.10001.',
    '..101..',
    '...1...',
  ]),
  star: P([
    '...1...',
    '.110111',
    '1110111',
    '0111110',
    '1011101',
    '.10.01.',
    '.1...1.',
  ]),
  checker: P([
    '0101010',
    '1010101',
    '0101010',
    '1010101',
    '0101010',
  ]),
  wave: P([
    '...11..',
    '..1001.',
    '.10..10',
    '10....1',
    '0......',
  ]),
  butterfly: P([
    '11...11',
    '101.101',
    '1001001',
    '...0...',
    '1001001',
    '101.101',
    '11...11',
  ]),
  smiley: P([
    '.11111.',
    '1101011',
    '1101011',
    '1000001',
    '1100011',
    '1011101',
    '.11111.',
  ]),
  strand1: P(['1212121212121212']),
  strand2: P(['0103010301030103']),
  strand3: P(['1010210102101021']),
}

export const PRODUCTS: Product[] = [
  {
    id: 'p1', name: 'Margarita Hoops', cat: 'Earrings', price: 28,
    palette: PALETTES.amberSun, pattern: PATTERNS.daisy,
    stock: 12, tags: ['Bestseller'],
    desc: 'Hand-stitched Miyuki Delica daisies on stainless steel hoops. Lightweight, hypoallergenic, made one pair at a time.',
    materials: 'Miyuki Delica 11/0 · 24mm hoops · stainless steel posts',
    palette_name: 'Honey & cream',
  },
  {
    id: 'p2', name: 'Amapola Studs', cat: 'Earrings', price: 22,
    palette: PALETTES.rosyClay, pattern: PATTERNS.flower,
    stock: 8, tags: ['New'],
    desc: 'Soft poppy studs in dusty rose and clay. Tiny, daily-wear, surprisingly bold.',
    materials: 'Miyuki Delica 11/0 · sterling posts · 12mm',
    palette_name: 'Rosy clay',
  },
  {
    id: 'p3', name: 'Lavanda Choker', cat: 'Necklaces', price: 64,
    palette: PALETTES.lavenderField, pattern: PATTERNS.strand1,
    stock: 6, tags: ['Signature'],
    desc: 'A single strand of lavender-and-cream Miyuki seed beads. Adjustable from 14–16".',
    materials: 'Miyuki seed 11/0 · gold-fill clasp · 14–16"',
    palette_name: 'Lavender field',
  },
  {
    id: 'p4', name: 'Cielo Necklace', cat: 'Necklaces', price: 78,
    palette: PALETTES.duskBerry, pattern: PATTERNS.strand2,
    stock: 4, tags: [],
    desc: 'Twilight strand alternating dusk lavender and cream. 18" length.',
    materials: 'Miyuki seed 11/0 · gold-fill clasp · 18"',
    palette_name: 'Dusk berry',
  },
  {
    id: 'p5', name: 'Corazón Ring', cat: 'Rings', price: 18,
    palette: PALETTES.rosyClay, pattern: PATTERNS.heart,
    stock: 14, tags: ['Bestseller'],
    desc: 'A tiny woven heart on a stretch band. Sized 6–8.',
    materials: 'Miyuki Delica 11/0 · elastic · adjustable 6–8',
    palette_name: 'Rosy clay',
  },
  {
    id: 'p6', name: 'Estrella Ring', cat: 'Rings', price: 20,
    palette: PALETTES.honeyCream, pattern: PATTERNS.star,
    stock: 9, tags: [],
    desc: 'A six-pointed star woven on a stretch band. Sized 6–8.',
    materials: 'Miyuki Delica 11/0 · elastic · adjustable 6–8',
    palette_name: 'Honey cream',
  },
  {
    id: 'p7', name: 'Olita Bracelet', cat: 'Bracelets', price: 26,
    palette: PALETTES.mintFrost, pattern: PATTERNS.strand3,
    stock: 11, tags: ['New'],
    desc: 'Mint-and-cream wave strand on stretch cord. Stacks beautifully.',
    materials: 'Miyuki seed 11/0 · stretch cord · 6.5–7"',
    palette_name: 'Mint frost',
  },
  {
    id: 'p8', name: 'Sol Bracelet', cat: 'Bracelets', price: 26,
    palette: PALETTES.amberSun, pattern: PATTERNS.strand1,
    stock: 7, tags: [],
    desc: 'Amber-and-cream pattern on stretch cord.',
    materials: 'Miyuki seed 11/0 · stretch cord · 6.5–7"',
    palette_name: 'Honey & cream',
  },
  {
    id: 'p9', name: 'Mariposa Charm', cat: 'Keychains', price: 16,
    palette: PALETTES.sageMeadow, pattern: PATTERNS.butterfly,
    stock: 5, tags: [],
    desc: 'A woven butterfly charm on a brass keyring or bag clip.',
    materials: 'Miyuki Delica 11/0 · brass keyring · 4cm',
    palette_name: 'Sage meadow',
  },
  {
    id: 'p10', name: 'Sonrisa Phone Charm', cat: 'Phone charms', price: 14,
    palette: PALETTES.honeyCream, pattern: PATTERNS.smiley,
    stock: 18, tags: ['Bestseller'],
    desc: 'A grin to dangle off your case. Comes with strap.',
    materials: 'Miyuki Delica 11/0 · woven strap · 7cm drop',
    palette_name: 'Honey cream',
  },
  {
    id: 'p11', name: 'Florcita Phone Charm', cat: 'Phone charms', price: 14,
    palette: PALETTES.lavenderField, pattern: PATTERNS.flower,
    stock: 0, tags: ['Sold out'],
    desc: 'Lavender bloom for your phone. Restock May 28.',
    materials: 'Miyuki Delica 11/0 · woven strap · 7cm drop',
    palette_name: 'Lavender field',
  },
  {
    id: 'p12', name: 'Cocoa Necklace', cat: 'Necklaces', price: 58,
    palette: PALETTES.mochaMilk, pattern: PATTERNS.strand2,
    stock: 9, tags: [],
    desc: 'Mocha-and-milk strand. Warm and unfussy.',
    materials: 'Miyuki seed 11/0 · gold-fill clasp · 16"',
    palette_name: 'Mocha milk',
  },
]

export const CATEGORIES = ['All', 'Earrings', 'Necklaces', 'Rings', 'Bracelets', 'Keychains', 'Phone charms']

export const CUSTOM_REQUESTS_SEED = [
  { id: 'cr-201', user: 'lucia.b@…', shape: 'flower', size: 'M', colors: 4, complexity: 'medium', est: 38, status: 'review', date: '2 hr ago' },
  { id: 'cr-202', user: 'mia@…', shape: 'heart', size: 'S', colors: 3, complexity: 'simple', est: 22, status: 'quoted', date: 'yesterday' },
  { id: 'cr-203', user: 'noor.k@…', shape: 'star', size: 'L', colors: 6, complexity: 'intricate', est: 78, status: 'in-progress', date: '3 d ago' },
  { id: 'cr-204', user: 'paula@…', shape: 'butterfly', size: 'M', colors: 5, complexity: 'medium', est: 48, status: 'shipped', date: '1 wk ago' },
]

export const ORDERS_SEED = [
  { id: '#A-1284', user: 'lucia.b@…', items: 2, total: 50, status: 'pending', date: 'today' },
  { id: '#A-1283', user: 'mia@…', items: 1, total: 22, status: 'paid', date: 'today' },
  { id: '#A-1282', user: 'noor.k@…', items: 3, total: 102, status: 'packed', date: 'yesterday' },
  { id: '#A-1281', user: 'paula@…', items: 1, total: 78, status: 'shipped', date: '2 d ago' },
  { id: '#A-1280', user: 'sara.t@…', items: 4, total: 124, status: 'shipped', date: '3 d ago' },
  { id: '#A-1279', user: 'eli@…', items: 2, total: 44, status: 'delivered', date: '5 d ago' },
]
