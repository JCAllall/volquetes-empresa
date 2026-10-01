import Logo from '@/components/Logo'

type AuthHeaderProps = {
  subtitle: string
}

/** Encabezado compartido por las pantallas de autenticación (login, recuperar
 * contraseña, etc.): logo, línea de acento y subtítulo. */
export default function AuthHeader({ subtitle }: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center mb-7">
      <Logo size={30} />
      <div className="w-9 h-[3px] bg-brand-600 rounded-full my-3" />
      <p className="text-[11.5px] font-semibold text-brand-400 mb-0.5">
        Logística y alquiler de equipos
      </p>
      <p className="text-sm font-bold text-brand-600">{subtitle}</p>
    </div>
  )
}
