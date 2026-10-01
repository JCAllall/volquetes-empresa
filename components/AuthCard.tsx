type AuthCardProps = {
  label: string
  children: React.ReactNode
}

/** Tarjeta compartida por las pantallas de autenticación: header oscuro tipo
 * panel técnico + contenido (formulario) en blanco. */
export default function AuthCard({ label, children }: AuthCardProps) {
  return (
    <div className="w-full bg-white border border-brand-200 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-brand-700 text-white text-[11px] font-bold uppercase tracking-wider px-5 py-2.5 flex items-center gap-2">
        <span className="w-[7px] h-[7px] bg-accent-500 rounded-[2px]" />
        {label}
      </div>
      <div className="px-5 py-6">{children}</div>
    </div>
  )
}
