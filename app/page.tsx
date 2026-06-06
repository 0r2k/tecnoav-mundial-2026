'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './trivia.module.css'

/* ─── Data ─────────────────────────────────────────────────────────── */
const QUESTIONS = [
  {
    question: '¿Qué ataque busca engañar a un usuario para que entregue sus credenciales?',
    options: ['Malware', 'Phishing', 'Ransomware', 'Comando y control'],
    correct: 1,
  },
  {
    question: '¿Cuál es la práctica más recomendada para proteger una cuenta corporativa?',
    options: [
      'Tener 3 contraseñas y rotarlas',
      'No repetir nunca contraseñas',
      'Activar MFA o doble factor de autenticación',
      'Guardarla en papel y en el cajón con llave',
    ],
    correct: 2,
  },
  {
    question: '¿Qué activos protege principalmente la ciberseguridad?',
    options: [
      'Solo computadoras',
      'Solo servidores',
      'Datos, sistemas y usuarios',
      'Solo correos electrónicos',
    ],
    correct: 2,
  },
]

/* ─── Types ─────────────────────────────────────────────────────────── */
type FormData = {
  empresa: string
  nombre: string
  cargo: string
  email: string
  celular: string
}

/* ─── Score Picker ───────────────────────────────────────────────────── */
function ScorePicker({
  label, flag, value, onChange,
}: {
  label: string; flag: string; value: number; onChange: (v: number) => void
}) {
  return (
    <div className={styles.scorePicker}>
      <Image src={flag} alt={label} width={64} height={43} className={styles.scoreFlag} unoptimized />
      <span className={styles.scoreLabel}>{label}</span>
      <div className={styles.scoreControls}>
        <button
          type="button"
          className={styles.scoreBtn}
          onClick={() => onChange(Math.max(0, value - 1))}
        >−</button>
        <span className={styles.scoreValue}>{value}</span>
        <button
          type="button"
          className={styles.scoreBtn}
          onClick={() => onChange(Math.min(20, value + 1))}
        >+</button>
      </div>
      <input type="number" min={0} max={20} value={value} readOnly className={styles.scoreHidden} />
    </div>
  )
}

/* ─── Main component ────────────────────────────────────────────────── */
export default function TriviaApp() {
  const [screen, setScreen] = useState(0)           // 0=intro 1=register 2-4=questions 5=score
  const [ready, setReady] = useState(false)
  const [form, setForm] = useState<FormData>({ empresa: '', nombre: '', cargo: '', email: '', celular: '' })
  const [answers, setAnswers] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [scoreEC, setScoreEC] = useState(0)
  const [scoreCM, setScoreCM] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')

  useEffect(() => { const t = setTimeout(() => setReady(true), 100); return () => clearTimeout(t) }, [])

  useEffect(() => {
    if (submitted) {
      const t = setTimeout(() => {
        // Redirección con parámetros UTM para analíticas
        window.location.href = 'https://tecnoav.com/?utm_source=trivia_mundial&utm_medium=landing_page&utm_campaign=registro_trivia'
      }, 2000)
      return () => clearTimeout(t)
    }
  }, [submitted])

  const qIndex = screen - 2   // question index (0,1,2)

  function handleAnswer(idx: number) {
    if (revealed) return
    setSelected(idx)
    setRevealed(true)
    setTimeout(() => {
      setAnswers(prev => [...prev, idx])
      setSelected(null)
      setRevealed(false)
      setScreen(s => s + 1)
    }, 1800)
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!form.empresa || !form.nombre || !form.email) {
      setFormError('Por favor completa los campos requeridos.')
      return
    }
    setFormError('')
    setScreen(2)
  }

  async function handleSubmit() {
    setSending(true)
    setSendError('')
    try {
      const webhookUrl = process.env.NEXT_PUBLIC_SHEETS_WEBHOOK_URL
      if (!webhookUrl) throw new Error('Webhook no configurado')

      // Llamada directa al Apps Script desde el browser.
      // mode: 'no-cors' porque Google hace un redirect 302 que el servidor no puede seguir.
      // La respuesta es opaca (no podemos leerla) pero los datos llegan correctamente.
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' }, // requerido con no-cors
        body: JSON.stringify({ ...form, answers, scoreEC, scoreCM }),
      })
      // Con no-cors no podemos leer la respuesta — asumimos éxito si no hubo excepción
      setSubmitted(true)
    } catch {
      setSendError('Hubo un problema al enviar. Intenta de nuevo.')
    } finally {
      setSending(false)
    }
  }

  /* ── Screen 0: Intro ─────────────────────────────────────────────── */
  if (screen === 0) return (
    <div className={styles.introWrap}>
      <div className="scan-line" />
      <div className="grid-bg" />

      {/* Left neon icon */}
      <div className={`${styles.neonIcon} ${styles.neonLeft} ${ready ? styles.neonVisible : ''}`}>
        <Image src="/assets/seguridad-informatica.webp" alt="Seguridad" width={180} height={180} unoptimized />
      </div>

      {/* Right neon icon */}
      <div className={`${styles.neonIcon} ${styles.neonRight} ${ready ? styles.neonVisible : ''}`}>
        <Image src="/assets/seguridad-tecnologica.webp" alt="Tecnología" width={180} height={180} unoptimized />
      </div>

      {/* Center content */}
      <div className={styles.introCenter}>
        {/* Logo */}
        <div className={`${styles.logoWrap} ${ready ? styles.logoIn : ''}`}>
          <Image src="/assets/logo-tecnoav-35anios.webp" alt="TecnoAV 35 años" width={440} height={90} priority unoptimized />
        </div>

        {/* Title */}
        <div className={`${styles.titleWrap} ${ready ? styles.titleIn : ''}`}>
          <h1 className={styles.titleMain}>Predice el Marcador</h1>
          <h2 className={styles.titleSub}>y Protege tu Información</h2>
        </div>

        {/* Match box */}
        <div className={`${styles.matchBox} ${ready ? styles.matchIn : ''}`}>
          <div className={styles.matchLabel}>PARTIDO</div>
          <div className={styles.matchRow}>
            <div className={styles.teamBlock}>
              <Image src="/assets/bandera-ecuador.webp" alt="Ecuador" width={70} height={47} unoptimized />
              <span className={styles.teamName}>ECUADOR</span>
            </div>
            <div className={styles.vsBlock}>VS.</div>
            <div className={styles.teamBlock}>
              <span className={styles.teamName}>COSTA <br />DE MARFIL</span>
              <Image src="/assets/bandera-costademarfil.webp" alt="Costa de Marfil" width={70} height={47} unoptimized />
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          className={`${styles.ctaBtn} ${ready ? styles.ctaIn : ''}`}
          onClick={() => setScreen(1)}
        >
          <span>CONTINUAR</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  )

  /* ── Screen 1: Register ──────────────────────────────────────────── */
  if (screen === 1) return (
    <div className={styles.formScreen}>
      <div className="scan-line" />
      <div className="grid-bg" />
      <div className={styles.innerContent}>
        <div className={styles.innerLogoWrap}>
          <Image src="/assets/logo-tecnoav-35anios.webp" alt="TecnoAV 35 años" width={450} height={92} priority unoptimized className={styles.innerLogo} />
        </div>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Registro de Participante</h2>
            <p className={styles.formSub}>Completa tus datos para participar</p>
          </div>
          <form onSubmit={handleRegister} className={styles.form} noValidate>
            {[
              { id: 'empresa', label: 'Empresa *', placeholder: 'Nombre de tu empresa', type: 'text' },
              { id: 'nombre',  label: 'Nombre completo *', placeholder: 'Tu nombre y apellido', type: 'text' },
              { id: 'cargo',   label: 'Cargo', placeholder: 'Tu posición o cargo', type: 'text' },
              { id: 'email',   label: 'Email corporativo *', placeholder: 'correo@empresa.com', type: 'email' },
              { id: 'celular', label: 'Celular', placeholder: '+593 9XX XXX XXXX', type: 'tel' },
            ].map(f => (
              <div key={f.id} className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>{f.label}</label>
                <input
                  className={styles.fieldInput}
                  type={f.type}
                  placeholder={f.placeholder}
                  value={(form as Record<string,string>)[f.id]}
                  onChange={e => setForm(prev => ({ ...prev, [f.id]: e.target.value }))}
                />
              </div>
            ))}
            {formError && <p className={styles.formError}>{formError}</p>}
            <button type="submit" className={styles.formBtn}>
              <span>COMENZAR TRIVIA</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  )

  /* ── Screens 2-4: Questions ──────────────────────────────────────── */
  if (screen >= 2 && screen <= 4) {
    const q = QUESTIONS[qIndex]
    return (
      <div className={styles.questionScreen}>
        <div className="scan-line" />
        <div className="grid-bg" />
        <div className={styles.innerContent}>
          {/* Logo centrado */}
          <div className={styles.innerLogoWrap}>
            <Image src="/assets/logo-tecnoav-35anios.webp" alt="TecnoAV 35 años" width={450} height={92} priority unoptimized className={styles.innerLogo} />
          </div>

          {/* Progress bar */}
          <div className={styles.progressWrap}>
            <div className={styles.progressBar}>
              {QUESTIONS.map((_, i) => (
                <div key={i} className={`${styles.progressDot} ${i < qIndex ? styles.dotDone : i === qIndex ? styles.dotActive : ''}`} />
              ))}
            </div>
            <span className={styles.qCounter}>{qIndex + 1} / {QUESTIONS.length}</span>
          </div>

          {/* Question card */}
          <div key={screen} className={styles.questionCard}>
            <div className={styles.qBadge}>PREGUNTA {qIndex + 1}</div>
            <h2 className={styles.questionText}>{q.question}</h2>
            <div className={styles.optionsList}>
              {q.options.map((opt, i) => {
                let cls = styles.option
                if (revealed) {
                  if (i === q.correct) cls = `${styles.option} ${styles.optionCorrect}`
                  else if (i === selected) cls = `${styles.option} ${styles.optionWrong}`
                }
                if (selected === i && !revealed) cls = `${styles.option} ${styles.optionSelected}`
                return (
                  <button key={i} className={cls} onClick={() => handleAnswer(i)} disabled={revealed}>
                    <span className={styles.optLetter}>{String.fromCharCode(65 + i)}</span>
                    <span className={styles.optText}>{opt}</span>
                    {revealed && i === q.correct && (
                      <span className={styles.optIcon}>✓</span>
                    )}
                    {revealed && i === selected && i !== q.correct && (
                      <span className={styles.optIconWrong}>✗</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ── Screen 5: Score prediction ─────────────────────────────────── */
  if (screen === 5 && !submitted) {
    const correct = answers.filter((a, i) => a === QUESTIONS[i].correct).length
    return (
      <div className={styles.scoreScreen}>
        <div className="scan-line" />
        <div className="grid-bg" />
        <div className={styles.innerContent}>
          <div className={styles.innerLogoWrap}>
            <Image src="/assets/logo-tecnoav-35anios.webp" alt="TecnoAV 35 años" width={450} height={92} priority unoptimized className={styles.innerLogo} />
          </div>
          <div className={styles.scoreCard}>
            <div className={styles.resultBadge}>
              <span className={styles.resultNum}>{correct}</span>
              <span className={styles.resultOf}>/{QUESTIONS.length} correctas</span>
            </div>

            <div className={styles.scoreDivider} />

            <h2 className={styles.scoreTitle}>¿Cuál será el marcador final?</h2>
            <p className={styles.scoreSub}>Ecuador <span className={styles.vs}>VS</span> Costa de Marfil</p>

            <div className={styles.scorePickers}>
              <ScorePicker label="Ecuador"         flag="/assets/bandera-ecuador.webp"         value={scoreEC} onChange={setScoreEC} />
              <div className={styles.scoreSep}>:</div>
              <ScorePicker label="Costa de Marfil" flag="/assets/bandera-costademarfil.webp" value={scoreCM} onChange={setScoreCM} />
            </div>

            {sendError && <p className={styles.formError}>{sendError}</p>}
            <button className={styles.submitBtn} onClick={handleSubmit} disabled={sending}>
              <span>{sending ? 'ENVIANDO…' : 'ENVIAR PARTICIPACIÓN'}</span>
              {!sending && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ── Screen 6: Thank you ─────────────────────────────────────────── */
  return (
    <div className={styles.thankScreen}>
      <div className="scan-line" />
      <div className="grid-bg" />
      <div className={styles.innerContent}>
        <div className={styles.innerLogoWrap}>
          <Image src="/assets/logo-tecnoav-35anios.webp" alt="TecnoAV 35 años" width={450} height={92} priority unoptimized className={styles.innerLogo} />
        </div>
      <div className={styles.thankCard}>
        <div className={styles.thankIcon}>
          <svg viewBox="0 0 60 60" fill="none">
            <circle cx="30" cy="30" r="28" stroke="var(--correct-green)" strokeWidth="2.5"/>
            <path d="M18 30l9 9 15-17" stroke="var(--correct-green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 className={styles.thankTitle}>¡Gracias por participar!</h2>
        <p className={styles.thankText}>
          Tu predicción <strong>{scoreEC} – {scoreCM}</strong> ha sido registrada.<br/>
          Mucha suerte, <strong>{form.nombre}</strong>.
        </p>
        <div className={styles.loadingSpinner}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
          </svg>
        </div>
        <p className={styles.thankMini}>Estás siendo redirigido a tecnoav.com...</p>
      </div>
      </div>
    </div>
  )
}
