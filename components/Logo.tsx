type LogoProps = {
  /** 'light' = texto claro (para fondos oscuros), 'dark' = texto oscuro (para fondos claros) */
  variant?: 'light' | 'dark'
  size?: number
  showWordmark?: boolean
  className?: string
}

export default function Logo({
  variant = 'dark',
  size = 28,
  showWordmark = true,
  className = '',
}: LogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-brand-700'

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 30 30"
        fill="none"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="26" height="26" rx="7" className="fill-accent-500" />
        <path
          d="M2 18 L18 2 L28 2 L28 9 L9 28 L2 28 Z"
          fill="white"
          fillOpacity="0.22"
        />
      </svg>
      {showWordmark && (
        <span className={`font-extrabold tracking-tight ${textColor}`} style={{ fontSize: size * 0.68 }}>
          Bilny
        </span>
      )}
    </div>
  )
}
