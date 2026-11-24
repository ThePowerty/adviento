import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import confetti from 'canvas-confetti'
import { ArrowRight, Check, ChevronRight, Eye, EyeOff, Gift, Heart, LockKeyhole, Play, RotateCcw, Rocket, Star, Trophy, Volume2, VolumeX } from 'lucide-react'
import { animeQuestions, marvelMovies, memoryCards, openingQuestions, story } from './content'
import { EscapeGame, JutsuGame, KeroroGame, MaomaoGame, NinjaGame, UltraHeroGame, extraInstructions, extraSuccess } from './extraGames'
import './styles.css'

const steps = ['Luna', 'Marvel', 'Anime', 'Opening', 'Memoria', 'Ninja', 'Jutsus', 'Maomao', 'Keroro', 'Ultrahéroe', 'Murdles']

const ACCESS_SALT = 'adviento-gate-v1:'
const ACCESS_DIGEST = '360fe53b1854e0fe7d36e55777cb15766e9ff277bda043a5a3923fdeca3de23d'

async function digestAccessCode(value) {
  const payload = new TextEncoder().encode(`${ACCESS_SALT}${value}`)
  const digest = await window.crypto.subtle.digest('SHA-256', payload)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function AccessGate({ onUnlock }) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)
  const inputRef = useRef(null)

  const submit = async (event) => {
    event.preventDefault()
    if (checking) return
    if (!password) {
      setError('Escribe la contraseña para continuar.')
      inputRef.current?.focus()
      return
    }

    setChecking(true)
    setError('')
    try {
      const digest = await digestAccessCode(password)
      if (digest === ACCESS_DIGEST) {
        setPassword('')
        onUnlock()
        return
      }
      setError('La contraseña no es correcta. Vuelve a intentarlo.')
      setPassword('')
      requestAnimationFrame(() => inputRef.current?.focus())
    } catch {
      setError('No se ha podido comprobar la contraseña. Recarga la página e inténtalo de nuevo.')
    } finally {
      setChecking(false)
    }
  }

  return (
    <main className="access-page">
      <div className="noise" />
      <section className="access-card" aria-labelledby="access-title">
        <div className="access-orbit" aria-hidden="true"><span>★</span><LockKeyhole size={38} /></div>
        <p className="eyebrow">Acceso a la misión</p>
        <h1 id="access-title">Un último código<br /><em>antes de despegar</em></h1>
        <p className="access-intro">Esta aventura está reservada. Introduce la contraseña para abrir la compuerta.</p>
        <form className="access-form" onSubmit={submit} noValidate>
          <label htmlFor="access-password">Contraseña</label>
          <div className={`access-input ${error ? 'has-error' : ''}`}>
            <LockKeyhole size={19} aria-hidden="true" />
            <input
              ref={inputRef}
              id="access-password"
              type={showPassword ? 'text' : 'password'}
              inputMode="numeric"
              autoComplete="current-password"
              value={password}
              onChange={(event) => { setPassword(event.target.value); if (error) setError('') }}
              aria-invalid={Boolean(error)}
              aria-describedby="access-error"
              autoFocus
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
          <p id="access-error" className="access-error" role={error ? 'alert' : undefined}>{error || '\u00a0'}</p>
          <button className="primary access-submit" type="submit" disabled={checking}>
            {checking ? 'Comprobando…' : 'Abrir la compuerta'}
            {!checking && <ArrowRight size={18} />}
          </button>
        </form>
        <small className="access-note">El acceso se cerrará cuando recargues la página.</small>
      </section>
    </main>
  )
}

function useSound(enabled) {
  const context = useRef(null)
  return useCallback((frequency = 520, duration = 0.08) => {
    if (!enabled) return
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    context.current ||= new AudioContext()
    const oscillator = context.current.createOscillator()
    const gain = context.current.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0.07, context.current.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, context.current.currentTime + duration)
    oscillator.connect(gain).connect(context.current.destination)
    oscillator.start()
    oscillator.stop(context.current.currentTime + duration)
  }, [enabled])
}

function ShinChan({ message, mood = 'happy', compact = false }) {
  return (
    <aside className={`narrator ${compact ? 'compact' : ''}`} aria-label={`Sin Chan dice: ${message}`}>
      <div className={`shin-avatar ${mood}`} aria-hidden="true"><img src={`${import.meta.env.BASE_URL}shin-chan-narrator.png`} alt="" /></div>
      <div className="speech"><strong>Sin Chan</strong><p>{message}</p></div>
    </aside>
  )
}

function Progress({ current }) {
  return (
    <nav className="progress" aria-label="Progreso de la misión">
      {steps.map((label, index) => (
        <div className={`progress-item ${index < current ? 'done' : ''} ${index === current ? 'active' : ''}`} key={label}>
          <span>{index < current ? <Check size={14} /> : index + 1}</span><small>{label}</small>
        </div>
      ))}
    </nav>
  )
}

function Intro({ onStart }) {
  return (
    <section className="intro">
      <div className="intro-copy">
        <p className="eyebrow">{story.eyebrow}</p>
        <h1>Rumbo a<br /><em>la luna</em></h1>
        <p className="for">Una aventura para {story.recipient}</p>
        <p className="intro-text">{story.intro}</p>
        <button className="primary" onClick={onStart}>Aceptar la misión <ArrowRight size={18} /></button>
      </div>
      <div className="intro-visual">
        <div className="big-moon"><span>★</span></div>
        <ShinChan message="¡Yo soy el narrador! No toques nada raro... salvo el botón grande, claro." />
      </div>
      <div className="mission-strip"><span>11 mundos</span><span>Una aventura completa</span><span>1 regalo secreto</span></div>
    </section>
  )
}

function GameLayout({ current, title, kicker, narrator, mood, children }) {
  return (
    <section className="game-page">
      <Progress current={current} />
      <div className="game-layout">
        <div className="game-main">
          <p className="eyebrow">{kicker}</p><h2>{title}</h2>
          {children}
        </div>
        <ShinChan message={narrator} mood={mood} compact />
      </div>
    </section>
  )
}

const instructionData = {
  bunny: {
    current: 0, number: '01', icon: '🐇', title: 'El conejo saltarín', subtitle: 'Plataformas verticales',
    objective: 'Guía al conejo durante veinticinco saltos desde la casa de Sin Chan hasta la luna, atravesando el barrio, el cielo y el espacio. Él salta automáticamente: tú decides dónde cae.',
    controls: ['Ordenador: mantén pulsadas ← y →', 'Móvil: usa los botones inferiores', 'Aterriza dentro de la siguiente plataforma'],
    tip: 'Empieza a moverte mientras el conejo sube y corrige la trayectoria antes de que baje.',
    narration: 'Este conejo salta solo. Como yo cuando mamá menciona los deberes.',
  },
  marvel: {
    current: 1, number: '02', icon: '🎬', title: 'Marvel en imágenes', subtitle: 'Doce películas ocultas',
    objective: 'Descifra cada película de Marvel observando tres imágenes y una pista. Puedes equivocarte y volver a intentarlo.',
    controls: ['Observa los tres símbolos', 'Lee la pista bajo el fotograma', 'Elige una de las tres películas'],
    tip: 'Los símbolos representan al héroe, su poder o un momento muy reconocible de la película.',
    narration: 'Yo pedí salir en una película de Marvel, pero dicen que ya tienen demasiado caos.',
  },
  anime: {
    current: 2, number: '03', icon: '🍥', title: 'El gran quiz del anime', subtitle: 'Once series, veintidós preguntas',
    objective: 'Supera dos preguntas de cada una de tus series favoritas. No hay vidas ni penalizaciones: solo conocimiento otaku.',
    controls: ['Lee el nombre de la serie', 'Escoge una respuesta', 'Si fallas, prueba otra opción'],
    tip: 'Aparecerán las once series de la lista, así que ninguna se queda fuera.',
    narration: 'Yo me sé todos los openings. La letra no, pero hago muy bien los sonidos.',
  },
  opening: {
    current: 3, number: '04', icon: '🎧', title: 'El opening misterioso', subtitle: 'Ocho fragmentos de YouTube',
    objective: 'Escucha una fracción de cada opening original de YouTube y descubre a qué anime pertenece. Puedes reproducirla todas las veces que necesites.',
    controls: ['Pulsa el botón de reproducción', 'Escucha hasta el final', 'Elige el anime correcto'],
    tip: 'Cada fragmento tiene un ritmo y un carácter inspirado en la energía de su serie.',
    narration: 'Yo canto los openings en japonés perfecto. Nadie puede demostrar lo contrario.',
  },
  memory: {
    current: 4, number: '05', icon: '🃏', title: 'Memoria otaku', subtitle: 'Ocho parejas ocultas',
    objective: 'Encuentra las ocho parejas escondidas entre frutas fantásticas y rostros de personajes de anime. Solo puedes descubrir dos cartas cada vez.',
    controls: ['Gira una carta y memoriza su imagen', 'Busca otra carta con la misma ilustración', 'Empareja las dieciséis cartas para continuar'],
    tip: 'Las cartas que no coincidan volverán a ocultarse. Fíjate bien en su posición antes de probar otra pareja.',
    narration: 'Yo tengo memoria fotográfica. El problema es que casi todas mis fotos son de comida.',
  },
  ...extraInstructions,
}

function Instructions({ kind, onStart }) {
  const data = instructionData[kind]
  return (
    <section className="instruction-page">
      <Progress current={data.current} />
      <div className="instruction-card">
        <div className="instruction-copy">
          <p className="eyebrow">Manual de misión · Mundo {data.number}</p>
          <div className="instruction-title"><span>{data.iconImage ? <img src={`${import.meta.env.BASE_URL}${data.iconImage}`} alt="" /> : data.icon}</span><div><small>{data.subtitle}</small><h2>{data.title}</h2></div></div>
          <div className="objective"><strong>Tu objetivo</strong><p>{data.objective}</p></div>
          <div className="how-to"><strong>Cómo se juega</strong>{data.controls.map((control, index) => <p key={control}><b>{index + 1}</b>{control}</p>)}</div>
          <div className="tip"><Star size={18} fill="currentColor" /><span><strong>Consejo:</strong> {data.tip}</span></div>
          <button className="primary" onClick={onStart}>Empezar juego <ArrowRight size={18} /></button>
        </div>
        <ShinChan message={data.narration} mood="wow" />
      </div>
    </section>
  )
}

function BunnyGame({ onComplete, sound }) {
  const platforms = [
    { x: 42, w: 20 }, { x: 17, w: 24 }, { x: 57, w: 23 }, { x: 30, w: 24 },
    { x: 68, w: 21 }, { x: 40, w: 22 }, { x: 12, w: 24 }, { x: 52, w: 23 },
    { x: 72, w: 20 }, { x: 36, w: 22 }, { x: 8, w: 23 }, { x: 45, w: 24 },
    { x: 70, w: 22 }, { x: 32, w: 24 }, { x: 5, w: 22 }, { x: 48, w: 23 },
    { x: 70, w: 21 }, { x: 38, w: 24 }, { x: 12, w: 22 }, { x: 55, w: 24 },
    { x: 27, w: 22 }, { x: 66, w: 22 }, { x: 43, w: 23 }, { x: 10, w: 24 },
    { x: 50, w: 25 }, { x: 70, w: 23 },
  ]
  const [level, setLevel] = useState(0)
  const [x, setX] = useState(47)
  const [jump, setJump] = useState(0)
  const [direction, setDirection] = useState(0)
  const [message, setMessage] = useState('¡Ya salta solo! Tú encárgate de que no se caiga. Yo superviso desde aquí.')
  const levelRef = useRef(0)
  const xRef = useRef(47)
  const jumpRef = useRef(0)
  const finishedRef = useRef(false)

  useEffect(() => { levelRef.current = level }, [level])
  useEffect(() => { xRef.current = x }, [x])

  useEffect(() => {
    const down = (event) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') event.preventDefault()
      if (event.key === 'ArrowLeft') setDirection(-1)
      if (event.key === 'ArrowRight') setDirection(1)
    }
    const up = (event) => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') setDirection(0) }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [])

  useEffect(() => {
    if (finishedRef.current) return undefined
    const timer = setInterval(() => {
      if (direction) setX((value) => Math.max(3, Math.min(87, value + direction * 1.7)))
      const previous = jumpRef.current
      const next = previous + 1.5

      // La plataforma siguiente está exactamente a 120 px. Comprobamos el
      // aterrizaje en el vértice, cuando los pies alcanzan su superficie.
      if (previous < 50 && next >= 50) {
        const currentLevel = levelRef.current
        const target = platforms[currentLevel + 1]
        if (!target) return
        const bunnyCenter = xRef.current + 5
        const landed = bunnyCenter >= target.x && bunnyCenter <= target.x + target.w
        if (landed) {
          const nextLevel = currentLevel + 1
          jumpRef.current = 0
          setJump(0)
          levelRef.current = nextLevel
          sound(700 + nextLevel * 25, 0.08)
          setLevel(nextLevel)
          setMessage(['¡Buen aterrizaje! Sigue subiendo.', '¡Eso es! Más arriba, más arriba.', '¡Ni los astronautas saltan así!'][nextLevel % 3])
          if (nextLevel === platforms.length - 1) {
            finishedRef.current = true
            setMessage('¡Ha tocado la luna! Admito que ha sido bastante impresionante.')
            setTimeout(onComplete, 1200)
          }
          return
        }
      }

      if (next >= 100) {
        const current = platforms[levelRef.current]
        const resetX = current.x + current.w / 2 - 5
        jumpRef.current = 0
        setJump(0)
        setX(resetX)
        xRef.current = resetX
        sound(170, 0.12)
        setMessage('¡Casi! Te devuelvo a la última plataforma. Corrige con las flechas mientras sube.')
        return
      }

      jumpRef.current = next
      setJump(next)
    }, 30)
    return () => clearInterval(timer)
  }, [direction, onComplete, sound])

  const reset = () => {
    finishedRef.current = false; levelRef.current = 0; xRef.current = 47; jumpRef.current = 0
    setLevel(0); setX(47); setJump(0); setDirection(0)
    setMessage('Volvemos abajo. Esta vez finge que la gravedad te cae bien.')
  }
  const nudge = (amount) => setX((value) => {
    const next = Math.max(3, Math.min(87, value + amount))
    xRef.current = next
    return next
  })
  // 43 px = parte superior de la plataforma actual (30 + 13).
  // 120 px = distancia vertical exacta hasta la siguiente plataforma.
  const bunnyBottom = 43 + Math.sin((jump / 100) * Math.PI) * 120
  const zone = level < 6 ? 'neighborhood' : level < 16 ? 'sky' : 'space'

  return (
    <GameLayout current={0} kicker="Mundo 01 · Plataformas" title="Salto a la luna" narrator={message} mood={level === platforms.length - 1 ? 'wow' : 'happy'}>
      <p className="instructions">El conejo salta automáticamente. Muévelo con <kbd>←</kbd> <kbd>→</kbd> o con los botones para aterrizar en la siguiente plataforma.</p>
      <div className={`bunny-world vertical ${zone}`}>
        <div className="space-dots" />
        <div className="journey-layer" aria-hidden="true"><span className="sun">☀️</span><span className="cloud c1">☁️</span><span className="cloud c2">☁️</span></div>
        <div className="shin-house" style={{ bottom: `${30 - level * 120}px` }} aria-label="Casa de Sin Chan"><img src={`${import.meta.env.BASE_URL}nohara-house.jpg`} alt="Casa de la familia Nohara" /><small>CASA DE SIN CHAN</small></div>
        <div className="altitude">ALTURA <strong>{level}/{platforms.length - 1}</strong></div>
        <div className="goal-moon vertical-goal" style={{ bottom: `${(platforms.length - 1 - level) * 120 + 50}px` }}>🌙<small>META</small></div>
        {platforms.map((platform, index) => {
          const bottom = (index - level) * 120 + 30
          return <span className={`jump-platform ${index <= level ? 'passed' : ''}`} style={{ left: `${platform.x}%`, width: `${platform.w}%`, bottom: `${bottom}px` }} key={index} />
        })}
        <div className="bunny vertical-bunny" style={{ left: `${x}%`, bottom: `${bunnyBottom}px` }} aria-label={`Conejo en la plataforma ${level + 1} de ${platforms.length}`}><img src={`${import.meta.env.BASE_URL}bunny-realistic.png`} alt="" /></div>
      </div>
      <div className="game-actions">
        <div className="mobile-controls" aria-label="Controles de movimiento">
          <button onClick={() => nudge(-1.7)} onPointerDown={() => setDirection(-1)} onPointerUp={() => setDirection(0)} onPointerLeave={() => setDirection(0)} aria-label="Mover a la izquierda">←</button>
          <span>Mantén pulsado</span>
          <button onClick={() => nudge(1.7)} onPointerDown={() => setDirection(1)} onPointerUp={() => setDirection(0)} onPointerLeave={() => setDirection(0)} aria-label="Mover a la derecha">→</button>
        </div>
        <button className="icon-button" onClick={reset} aria-label="Reiniciar conejo"><RotateCcw size={18} /></button>
      </div>
    </GameLayout>
  )
}

function ChoiceGame({ type, current, title, kicker, questions, onComplete, sound }) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [wrong, setWrong] = useState(null)
  const [message, setMessage] = useState(type === 'marvel' ? 'Yo habría sido un gran superhéroe. Mi poder: encontrar galletas.' : type === 'anime' ? 'He estudiado muchísimo. Bueno, vi los openings. Cuenta, ¿no?' : '¡Matemáticas! Mi archienemigo después del pimiento verde.')
  const question = questions[index]

  const choose = (option) => {
    if (selected) return
    if (option === question.answer) {
      setSelected(option); setWrong(null); sound(780)
      setMessage(['¡Respuesta correcta! Sabía que eras lista.', '¡Punto para ti! Y medio punto para mi narración.', '¡Bingo! Mi método educativo funciona.'][index % 3])
      setTimeout(() => {
        if (index + 1 === questions.length) onComplete()
        else { setIndex((value) => value + 1); setSelected(null); setWrong(null) }
      }, 1250)
    } else {
      setWrong(option); sound(160, 0.14)
      setMessage(['¡Uy! Esa respuesta se ha caído por un agujero negro.', 'Casi, casi… prueba otra antes de que alguien nos vea.', 'No pasa nada. Yo tampoco lo sabía, pero disimulo muy bien.'][index % 3])
    }
  }

  return (
    <GameLayout current={current} kicker={kicker} title={title} narrator={message} mood={wrong ? 'oops' : selected ? 'wow' : 'happy'}>
      <div className="round-meta"><span>Pregunta {index + 1} de {questions.length}</span><div><i style={{ width: `${((index + (selected ? 1 : 0)) / questions.length) * 100}%` }} /></div></div>
      <article className={`question-card ${type}`}>
        {type === 'marvel' && <><div className="movie-frame">{question.visual.map((emoji, i) => <span key={i}>{emoji}</span>)}</div><p className="clue">“{question.clue}”</p></>}
        {type === 'anime' && <div className="series-label"><b>{question.badge}</b><span>Pregunta de<strong>{question.series}</strong></span></div>}
        {type === 'math' && <div className="math-visual">{question.visual}</div>}
        <h3>{type === 'marvel' ? '¿Qué película de Marvel es?' : question.question}</h3>
        {selected && <div className="quiz-correct-banner" role="status"><Check size={19}/> ¡Acierto! {selected}</div>}
        <div className="answers">
          {question.options.map((option) => (
            <button className={`${wrong === option ? 'wrong' : ''} ${selected === option ? 'correct' : ''}`} onClick={() => choose(option)} key={option}>
              <span>{option}</span>{selected === option ? <Check size={18} /> : <ChevronRight size={18} />}
            </button>
          ))}
        </div>
      </article>
    </GameLayout>
  )
}

function OpeningGame({ onComplete, sound }) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [wrong, setWrong] = useState(null)
  const [message, setMessage] = useState('Sube el volumen. Yo haré los coros aunque nadie me los haya pedido.')
  const question = openingQuestions[index]

  const choose = (option) => {
    if (selected) return
    if (option === question.series) {
      setSelected(option); setWrong(null); sound(820)
      setMessage('¡Oído absoluto otaku! Esa era la serie correcta.')
      setTimeout(() => {
        if (index + 1 === openingQuestions.length) onComplete()
        else { setIndex((value) => value + 1); setSelected(null); setWrong(null) }
      }, 1250)
    } else {
      setWrong(option); sound(160, 0.12)
      setMessage('Ese no era… vuelve a escucharlo y fíjate en el ritmo.')
    }
  }

  return (
    <GameLayout current={3} kicker="Mundo 04 · Música" title="¿De qué anime es?" narrator={message} mood={wrong ? 'oops' : selected ? 'wow' : 'happy'}>
      <div className="round-meta"><span>Opening {index + 1} de {openingQuestions.length}</span><div><i style={{ width: `${((index + (selected ? 1 : 0)) / openingQuestions.length) * 100}%` }} /></div></div>
      <article className="question-card opening-card">
        <div className="audio-console">
          <div className="youtube-tap-target">
            <iframe key={question.youtubeId} className="youtube-opening" src={`https://www.youtube-nocookie.com/embed/${question.youtubeId}?start=${question.start}&end=${question.end}&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0&playsinline=1`} title={`Reproducir fragmento de opening ${index + 1}`} allow="encrypted-media; picture-in-picture" />
            <span className="play-opening" aria-hidden="true"><Play size={29} fill="currentColor" /></span>
          </div>
          <div className="waveform" aria-hidden="true">{Array.from({ length: 14 }, (_, i) => <i key={i} />)}</div>
          <div><strong>Toca para escuchar</strong><small>Fragmento original #{index + 1}</small></div>
        </div>
        <h3>¿A qué anime pertenece este opening?</h3>
        {selected && <div className="quiz-correct-banner" role="status"><Check size={19}/> ¡Opening reconocido! {selected}</div>}
        <div className="answers">
          {question.options.map((option) => <button className={`${wrong === option ? 'wrong' : ''} ${selected === option ? 'correct' : ''}`} onClick={() => choose(option)} key={option}><span>{option}</span>{selected === option ? <Check size={18} /> : <ChevronRight size={18} />}</button>)}
        </div>
        <p className="audio-note">Toca el círculo de reproducción. En móvil, YouTube necesita recibir el toque directamente para activar el sonido.</p>
      </article>
    </GameLayout>
  )
}

function shuffledMemoryDeck() {
  const deck = memoryCards.flatMap((card) => [0, 1].map((copy) => ({ ...card, uid: `${card.id}-${copy}` })))
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[deck[index], deck[swapIndex]] = [deck[swapIndex], deck[index]]
  }
  return deck
}

function MemoryGame({ onComplete, sound }) {
  const [deck, setDeck] = useState(shuffledMemoryDeck)
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [locked, setLocked] = useState(false)
  const [message, setMessage] = useState('Dieciséis cartas y solo ocho parejas. ¡No vale marcar la pantalla con lápiz!')
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const reset = () => {
    clearTimeout(timerRef.current)
    setDeck(shuffledMemoryDeck()); setFlipped([]); setMatched([]); setMoves(0); setLocked(false)
    setMessage('Tablero mezclado. Esta vez seguro que no recuerdo dónde estaba ninguna.')
  }

  const reveal = (card) => {
    if (locked || flipped.includes(card.uid) || matched.includes(card.id)) return
    const nextFlipped = [...flipped, card.uid]
    setFlipped(nextFlipped)
    sound(520)
    if (nextFlipped.length < 2) {
      setMessage('Buena elección. Ahora encuentra su pareja.')
      return
    }

    setMoves((value) => value + 1)
    setLocked(true)
    const first = deck.find((item) => item.uid === nextFlipped[0])
    if (first.id === card.id) {
      const finished = matched.length + 1 === memoryCards.length
      setMatched((value) => [...value, card.id])
      setMessage(finished ? '¡Las ocho parejas! Tu memoria da un poco de miedo.' : '¡Pareja encontrada! Esa ya no se vuelve a esconder.')
      sound(820)
      timerRef.current = setTimeout(() => {
        setFlipped([]); setLocked(false)
        if (finished) onComplete()
      }, 700)
    } else {
      setMessage('No coinciden. Memorízalas antes de que se den la vuelta.')
      sound(170, 0.12)
      timerRef.current = setTimeout(() => { setFlipped([]); setLocked(false) }, 950)
    }
  }

  return (
    <GameLayout current={4} kicker="Mundo 05 · Memoria" title="Parejas otaku" narrator={message} mood={matched.length === memoryCards.length ? 'wow' : locked ? 'oops' : 'happy'}>
      <div className="memory-meta">
        <span><strong>{matched.length}</strong> / {memoryCards.length} parejas</span>
        <span><strong>{moves}</strong> movimientos</span>
        <button className="icon-button" onClick={reset} aria-label="Mezclar y reiniciar el juego de memoria"><RotateCcw size={17} /></button>
      </div>
      <div className="memory-board" aria-label="Tablero de juego de memoria">
        {deck.map((card) => {
          const isVisible = flipped.includes(card.uid) || matched.includes(card.id)
          return (
            <button className={`memory-card ${isVisible ? 'flipped' : ''} ${matched.includes(card.id) ? 'matched' : ''}`} onClick={() => reveal(card)} disabled={matched.includes(card.id)} aria-label={isVisible ? card.name : 'Carta oculta'} aria-pressed={isVisible} key={card.uid}>
              <span className="memory-card-inner">
                <span className="memory-back" aria-hidden="true"><b>?</b><i>★</i></span>
                <span className="memory-face" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}anime-memory-sprites.png)`, backgroundPosition: card.position }} aria-hidden="true" />
              </span>
            </button>
          )
        })}
      </div>
      <p className="memory-hint">Encuentra las dos cartas con la misma imagen.</p>
    </GameLayout>
  )
}

const successData = {
  bunny: { current: 1, icon: '🌙', eyebrow: 'Trayecto completado', title: '¡De casa a la luna!', text: 'Veinticinco saltos, nubes, cielo y espacio. El conejo ya puede presumir de ser astronauta.' },
  marvel: { current: 2, icon: '🦸', eyebrow: 'Universo salvado', title: '¡Experta en Marvel!', text: 'Ni las gemas del infinito han podido ocultarte esas doce películas.' },
  anime: { current: 3, icon: '🏆', eyebrow: 'Torneo superado', title: '¡Nivel otaku legendario!', text: 'Once series y veintidós respuestas. Sin Chan ya quiere que seas su sensei.' },
  opening: { current: 4, icon: '🎧', eyebrow: 'Oído absoluto', title: '¡Reconoces hasta el opening!', text: 'Ocho openings originales identificados. Ese oído merece un bis.' },
  memory: { current: 5, icon: '🃏', eyebrow: 'Tablero completado', title: '¡Memoria otaku perfecta!', text: 'Ocho parejas encontradas entre frutas fantásticas y caras de anime. Sin Chan sospecha que tienes superpoderes.' },
  ...extraSuccess,
}

function SuccessScreen({ kind, onContinue }) {
  const data = successData[kind]
  useEffect(() => {
    confetti({ particleCount: 85, spread: 75, origin: { y: .25 }, colors: ['#f45252', '#ffd84d', '#42b8b2', '#ffffff'] })
  }, [])
  return (
    <section className="success-page">
      <Progress current={data.current} />
      <div className="success-card">
        <div className="success-badge"><span>{data.iconImage ? <img src={`${import.meta.env.BASE_URL}${data.iconImage}`} alt="" /> : data.icon}</span><Trophy size={26} /></div>
        <p className="eyebrow">{data.eyebrow}</p><h2>{data.title}</h2><p>{data.text}</p>
        <ShinChan message="Yo sabía que lo conseguirías. Bueno… tenía un 83% de confianza." mood="wow" />
        <button className="primary" onClick={onContinue}>Continuar la aventura <ArrowRight size={18} /></button>
      </div>
    </section>
  )
}

function Finale({ onRestart }) {
  useEffect(() => {
    const end = Date.now() + 2300
    const colors = ['#ff5d5d', '#ffd84d', '#fff4dd', '#50c7c7']
    const timer = setInterval(() => {
      if (Date.now() > end) return clearInterval(timer)
      confetti({ particleCount: 22, spread: 75, origin: { x: Math.random(), y: 0.15 }, colors, scalar: 0.85 })
    }, 210)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="finale">
      <div className="final-moon"><Rocket size={32} /><span>✓</span></div>
      <p className="eyebrow">Misión completada</p><h2>{story.finalTitle}</h2>
      <p>{story.finalMessage}</p>
      <div className="final-grid">
        <ShinChan message="El regalo es para ti, pero las galletas podemos compartirlas. Soy un narrador muy generoso." mood="wow" />
        <article className="gift-ticket"><span>Premio desbloqueado</span><Gift size={28} /><h3>{story.gift}</h3><p>{story.giftDetail}</p><Heart fill="currentColor" /></article>
      </div>
      <button className="text-button" onClick={onRestart}><RotateCcw size={16} /> Jugar otra vez</button>
    </section>
  )
}

function App() {
  const stageMap = [
    'intro', 'bunny-info', 'bunny', 'bunny-success',
    'marvel-info', 'marvel', 'marvel-success',
    'anime-info', 'anime', 'anime-success',
    'opening-info', 'opening', 'opening-success',
    'memory-info', 'memory', 'memory-success',
    'ninja-info', 'ninja', 'ninja-success',
    'jutsu-info', 'jutsu', 'jutsu-success',
    'maomao-info', 'maomao', 'maomao-success',
    'keroro-info', 'keroro', 'keroro-success',
    'ultra-info', 'ultra', 'ultra-success',
    'escape-info', 'escape', 'escape-success', 'finale',
  ]
  const testStage = Math.min(stageMap.length - 1, Math.max(0, Number(new URLSearchParams(window.location.search).get('stage')) || 0))
  const [screen, setScreen] = useState(stageMap[testStage])
  const [soundOn, setSoundOn] = useState(true)
  const sound = useSound(soundOn)
  return (
    <main>
      <div className="noise" /><button className="sound-toggle" onClick={() => setSoundOn((value) => !value)} aria-label={soundOn ? 'Silenciar sonidos' : 'Activar sonidos'}>{soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}</button>
      <div className="shell" key={screen}>
        {screen === 'intro' && <Intro onStart={() => { sound(650); setScreen('bunny-info') }} />}
        {screen === 'bunny-info' && <Instructions kind="bunny" onStart={() => setScreen('bunny')} />}
        {screen === 'bunny' && <BunnyGame onComplete={() => setScreen('bunny-success')} sound={sound} />}
        {screen === 'bunny-success' && <SuccessScreen kind="bunny" onContinue={() => setScreen('marvel-info')} />}
        {screen === 'marvel-info' && <Instructions kind="marvel" onStart={() => setScreen('marvel')} />}
        {screen === 'marvel' && <ChoiceGame type="marvel" current={1} kicker="Mundo 02 · Cine" title="Marvel en imágenes" questions={marvelMovies} onComplete={() => setScreen('marvel-success')} sound={sound} />}
        {screen === 'marvel-success' && <SuccessScreen kind="marvel" onContinue={() => setScreen('anime-info')} />}
        {screen === 'anime-info' && <Instructions kind="anime" onStart={() => setScreen('anime')} />}
        {screen === 'anime' && <ChoiceGame type="anime" current={2} kicker="Mundo 03 · Gran torneo" title="El quiz del anime" questions={animeQuestions} onComplete={() => setScreen('anime-success')} sound={sound} />}
        {screen === 'anime-success' && <SuccessScreen kind="anime" onContinue={() => setScreen('opening-info')} />}
        {screen === 'opening-info' && <Instructions kind="opening" onStart={() => setScreen('opening')} />}
        {screen === 'opening' && <OpeningGame onComplete={() => setScreen('opening-success')} sound={sound} />}
        {screen === 'opening-success' && <SuccessScreen kind="opening" onContinue={() => setScreen('memory-info')} />}
        {screen === 'memory-info' && <Instructions kind="memory" onStart={() => setScreen('memory')} />}
        {screen === 'memory' && <MemoryGame onComplete={() => setScreen('memory-success')} sound={sound} />}
        {screen === 'memory-success' && <SuccessScreen kind="memory" onContinue={() => setScreen('ninja-info')} />}
        {screen === 'ninja-info' && <Instructions kind="ninja" onStart={() => setScreen('ninja')} />}
        {screen === 'ninja' && <NinjaGame Layout={GameLayout} onComplete={() => setScreen('ninja-success')} sound={sound} />}
        {screen === 'ninja-success' && <SuccessScreen kind="ninja" onContinue={() => setScreen('jutsu-info')} />}
        {screen === 'jutsu-info' && <Instructions kind="jutsu" onStart={() => setScreen('jutsu')} />}
        {screen === 'jutsu' && <JutsuGame Layout={GameLayout} onComplete={() => setScreen('jutsu-success')} sound={sound} />}
        {screen === 'jutsu-success' && <SuccessScreen kind="jutsu" onContinue={() => setScreen('maomao-info')} />}
        {screen === 'maomao-info' && <Instructions kind="maomao" onStart={() => setScreen('maomao')} />}
        {screen === 'maomao' && <MaomaoGame Layout={GameLayout} onComplete={() => setScreen('maomao-success')} sound={sound} />}
        {screen === 'maomao-success' && <SuccessScreen kind="maomao" onContinue={() => setScreen('keroro-info')} />}
        {screen === 'keroro-info' && <Instructions kind="keroro" onStart={() => setScreen('keroro')} />}
        {screen === 'keroro' && <KeroroGame Layout={GameLayout} onComplete={() => setScreen('keroro-success')} sound={sound} />}
        {screen === 'keroro-success' && <SuccessScreen kind="keroro" onContinue={() => setScreen('ultra-info')} />}
        {screen === 'ultra-info' && <Instructions kind="ultra" onStart={() => setScreen('ultra')} />}
        {screen === 'ultra' && <UltraHeroGame Layout={GameLayout} onComplete={() => setScreen('ultra-success')} sound={sound} />}
        {screen === 'ultra-success' && <SuccessScreen kind="ultra" onContinue={() => setScreen('escape-info')} />}
        {screen === 'escape-info' && <Instructions kind="escape" onStart={() => setScreen('escape')} />}
        {screen === 'escape' && <EscapeGame Layout={GameLayout} onComplete={() => setScreen('escape-success')} sound={sound} />}
        {screen === 'escape-success' && <SuccessScreen kind="escape" onContinue={() => setScreen('finale')} />}
        {screen === 'finale' && <Finale onRestart={() => setScreen('intro')} />}
      </div>
    </main>
  )
}

function ProtectedApp() {
  const [unlocked, setUnlocked] = useState(false)
  return unlocked ? <App /> : <AccessGate onUnlock={() => setUnlocked(true)} />
}

createRoot(document.getElementById('root')).render(<React.StrictMode><ProtectedApp /></React.StrictMode>)
