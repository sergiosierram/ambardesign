interface Props {
  size?: number
  color?: string
}

export default function Wordmark({ size = 22, color = 'var(--ink)' }: Props) {
  return (
    <span style={{
      fontFamily: 'var(--serif)',
      fontSize: size,
      color,
      letterSpacing: '-0.02em',
      lineHeight: 1,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
    }}>
      <span style={{
        width: size * 0.7,
        height: size * 0.7,
        borderRadius: '50%',
        background: 'var(--lavender)',
        display: 'inline-block',
        flexShrink: 0,
      }} />
      ambar design
    </span>
  )
}
