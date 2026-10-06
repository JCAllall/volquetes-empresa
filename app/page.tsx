import Link from 'next/link'
import { Sora } from 'next/font/google'

const sora = Sora({ subsets: ['latin'], weight: ['600', '700', '800'] })

const RUBROS = [
  {
    nombre: 'Volquetes',
    desc: 'Para escombros y obra',
    icon: (
      <>
        <path d="M3 10h18l-2 9H5l-2-9Z" />
        <path d="M3 10l3-6h12l3 6" />
        <path d="M8 10v9M16 10v9" />
      </>
    ),
  },
  {
    nombre: 'Fletes',
    desc: 'Transporte de carga',
    icon: (
      <>
        <path d="M3 16V7a1 1 0 0 1 1-1h8v10" />
        <path d="M12 10h5l3 3v3h-2" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
        <path d="M9 18h6" />
      </>
    ),
  },
  {
    nombre: 'Maquinaria pesada',
    desc: 'Excavadoras, grúas y más',
    icon: (
      <>
        <path d="M3 20h8" />
        <path d="M6 20v-5l5-3 4 2 4-4" />
        <circle cx="19" cy="9" r="2" />
        <path d="M6 15l-2-1" />
      </>
    ),
  },
  {
    nombre: 'Baños químicos',
    desc: 'Para eventos y obra',
    icon: (
      <>
        <rect x="6" y="4" width="12" height="17" rx="1.5" />
        <path d="M6 9h12" />
        <path d="M12 12v4" />
      </>
    ),
  },
]

const RUBROS_PROFESIONALES = ['Gasista', 'Electricista', 'Plomero', 'Obrero', '+ más']

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* TOPBAR */}
      <header className="bg-white border-b border-brand-200 py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-end gap-5">
          <Link
            href="/login"
            className="bg-[#f7f2e7] border border-[#ece3d1] text-brand-700 text-[13px] font-bold px-4 py-2.5 rounded-md hover:bg-[#f1e9d8] transition-colors"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/login"
            className="bg-accent-500 text-brand-700 text-[12.5px] font-extrabold px-4.5 py-2.5 rounded-md hover:bg-accent-400 transition-colors"
          >
            Registrarse
          </Link>
        </div>
      </header>

      {/* HERO — sin listar los 4 rubros en el texto, eso lo hace el selector de abajo */}
      <section className="bg-brand-700 text-white px-4 py-11 sm:py-12 flex flex-col items-center text-center">
        <div className={`${sora.className} text-[42px] font-extrabold text-accent-500 mb-5`}>
          BILNY
        </div>

        <h1 className={`${sora.className} text-[28px] sm:text-[32px] font-extrabold leading-tight max-w-lg`}>
          Lo que necesitás, cuando lo necesitás.
        </h1>

        <p className="mt-2.5 text-[15px] font-semibold text-slate-300">
          Elegí el rubro y encontrá la empresa que lo resuelve.
        </p>
      </section>

      {/* SELECTOR DE RUBROS */}
      <section className="px-4 pt-11 pb-2 max-w-4xl mx-auto w-full">
        <h2 className="text-center text-[19px] font-extrabold text-brand-700 mb-6">
          ¿Qué estás buscando?
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {RUBROS.map((rubro) => (
            <Link
              key={rubro.nombre}
              href="/login"
              className="bg-white border border-brand-100 rounded-xl px-4 py-5 text-center shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10 mx-auto mb-3.5 text-brand-700"
              >
                {rubro.icon}
              </svg>
              <h3 className="text-[13.5px] font-extrabold text-brand-700 mb-1">
                {rubro.nombre}
              </h3>
              <p className="text-[11.5px] text-brand-400 leading-snug">{rubro.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* PROFESIONALES — próximamente, en su propio espacio (son personas, no empresas de equipos) */}
      <section className="bg-brand-700 text-white px-4 py-14 mt-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-9 items-center">
          <div className="flex-1">
            <span className="inline-block bg-accent-500 text-brand-700 text-[11px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded mb-4">
              Próximamente · otra sección
            </span>
            <h2 className={`${sora.className} text-[23px] font-extrabold mb-3 leading-tight`}>
              Profesionales de la construcción
            </h2>
            <p className={`${sora.className} text-[14.5px] font-semibold text-slate-300 leading-relaxed max-w-md`}>
              Gasistas, electricistas, plomeros, obreros y más — con perfil,
              contacto y reseñas. Esto no es una empresa de equipos: son
              personas, así que vive en su propio espacio dentro de la app.
            </p>
          </div>
          <div className="flex-1 flex flex-wrap gap-2.5 content-start">
            {RUBROS_PROFESIONALES.map((rubro) => (
              <span
                key={rubro}
                className="bg-brand-600 border border-brand-500 text-slate-100 text-xs font-extrabold uppercase tracking-wide px-4 py-2 rounded-full"
              >
                {rubro}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-brand-700 text-slate-500 mt-auto px-4 py-6 text-center text-xs">
        © {new Date().getFullYear()} Bilny
      </footer>
    </div>
  )
}
