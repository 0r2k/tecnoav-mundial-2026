import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TecnoAV – Predice el Marcador',
  description: 'Trivia de ciberseguridad y predicción de partido',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {/* Stadium background — fixed, behind everything */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            backgroundImage: 'url(/assets/concurso-mundial.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Dark overlay — heavier on inner screens, lightened by the screen's own overlay */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1,
            background: 'linear-gradient(to bottom, rgba(2,11,24,0.35) 0%, rgba(2,11,24,0.25) 40%, rgba(2,11,24,0.45) 80%, rgba(2,11,24,0.60) 100%)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 2 }}>
          {children}
        </div>
      </body>
    </html>
  )
}
