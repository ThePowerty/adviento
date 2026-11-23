import React, { useEffect, useRef, useState } from 'react'
import { ChevronRight, FlaskConical, Lightbulb, Play, Search } from 'lucide-react'
import './extraGames.css'

const ninjaSymbols = [
  { id: 'leaf', label: 'Aldea Oculta de la Hoja', file: 'village-leaf.png' },
  { id: 'sand', label: 'Aldea Oculta de la Arena', file: 'village-sand.png' },
  { id: 'mist', label: 'Aldea Oculta de la Niebla', file: 'village-mist.png' },
  { id: 'cloud', label: 'Aldea Oculta de la Nube', file: 'village-cloud.png' },
]
const randomSymbol = () => ninjaSymbols[Math.floor(Math.random() * ninjaSymbols.length)].id

export const extraInstructions = {
  ninja: { current: 5, number: '06', icon: '🥷', iconImage: 'village-leaf.png', title: 'Entrenamiento ninja', subtitle: 'Brain puzzle de cinco rondas', objective: 'Memoriza patrones de aldeas cada vez más largos. El panel cerebral marca cada paso correcto y, si fallas, compara tu elección con la respuesta esperada.', controls: ['Estudia el patrón iluminado', 'Reconstrúyelo paso a paso', 'Usa el informe del fallo para corregir tu estrategia'], tip: 'Agrupa los símbolos por parejas en lugar de intentar recordar toda la secuencia de golpe.', narration: 'Un buen ninja usa la memoria. Yo uso una chuleta, pero hoy no cuenta.' },
  jutsu: { current: 6, number: '07', icon: '🔥', iconImage: 'chakra-fire.png', title: 'Arena de naturalezas', subtitle: 'Duelo ninja de tres rivales', objective: 'Derrota a tres ninjas leyendo su ataque y lanzando la naturaleza de chakra que tiene ventaja. Encadena aciertos para cargar tu técnica definitiva.', controls: ['Consulta la rueda de ventajas', 'Elige el chakra que vence al ataque rival', 'Carga la barra y activa el Modo Chakra'], tip: 'La cadena es: fuego → viento → rayo → tierra → agua → fuego.', narration: 'Yo domino el chakra de chocolate. Es muy poderoso a la hora de la merienda.' },
  maomao: { current: 7, number: '08', icon: '🌿', title: 'Los crípticos de Maomao', subtitle: 'Cinco palabras ocultas', objective: 'Resuelve pistas crípticas sobre plantas, remedios y venenos. Cada frase contiene una definición y un juego que construye la respuesta letra a letra.', controls: ['Separa la definición del juego de letras', 'Escribe la palabra en las casillas', 'Pide ayudas si necesitas definición, mecanismo o letras'], tip: 'Palabras como «revuelto», «oculta» o los puntos cardinales indican cómo manipular las letras.', narration: 'Maomao ha cifrado sus notas. Yo probé a descifrarlas oliendo el papel.' },
  keroro: { current: 8, number: '09', icon: '🐸', iconImage: 'keroro-face.png', title: 'Atrapa a Keroro', subtitle: 'Diez apariciones', objective: 'Keroro aparecerá en distintos escondites. Atrápalo diez veces antes de que vuelva a ocultarse.', controls: ['Pulsa comenzar', 'Busca rápidamente entre los nueve agujeros', 'Toca a Keroro antes de que desaparezca'], tip: 'Cada aparición dura menos de un segundo. Mantén la vista en el centro del tablero.', narration: 'Atrapar una rana alienígena parece fácil hasta que empieza a saltar.' },
  ultra: { current: 9, number: '10', icon: '⭐', iconImage: 'ultrahero-face.png', title: 'La carrera de Ultrahéroe', subtitle: 'Salta, vuela y agáchate', objective: 'Corre por la ciudad como en el dinosaurio de Chrome. Salta los obstáculos bajos y agáchate bajo los drones hasta superar doce peligros.', controls: ['Espacio o ↑: saltar y volar', '↓: agacharse', 'Móvil: usa los dos botones inferiores'], tip: 'Los obstáculos terrestres se saltan; los que vuelan se esquivan agachándote.', narration: '¡Ultrahéroe al rescate! Esta vez no hay pimientos. Creo.' },
  escape: { current: 10, number: '11', icon: '🔎', title: 'Archivo Murdle', subtitle: 'Tres Murdles y dos Murdokus', objective: 'Resuelve tres misterios de deducción y dos cuadrículas Murdoku. Puedes revelar pistas, descartar opciones y escribir tus propias notas durante todo el expediente.', controls: ['Cruza personas, lugares y objetos', 'Completa los Murdokus sin repetir símbolos', 'Usa el bloc lateral para tus deducciones'], tip: 'En los Murdokus, cada símbolo aparece una sola vez por fila, columna y bloque de 2×2.', narration: 'Cinco expedientes. Yo ya he escrito mi primera nota: buscar galletas.' },
}

export const extraSuccess = {
  ninja: { current: 6, icon: '🥷', eyebrow: 'Entrenamiento superado', title: '¡Memoria de ninja!', text: 'Cinco secuencias completadas sin perder el ritmo. Ya puedes fundar tu propia aldea.' },
  jutsu: { current: 7, icon: '⚡', eyebrow: 'Arena conquistada', title: '¡Maestra elemental!', text: 'Tres rivales derrotados, una técnica definitiva dominada y las cinco naturalezas bajo control.' },
  maomao: { current: 8, icon: '🌿', eyebrow: 'Archivo descifrado', title: '¡Criptógrafa imperial!', text: 'Cinco palabras ocultas resueltas. Maomao ya puede volver a leer sus fórmulas secretas.' },
  keroro: { current: 9, icon: '🐸', iconImage: 'keroro-face.png', eyebrow: 'Invasión detenida', title: '¡Keroro capturado!', text: 'Diez apariciones atrapadas. El pelotón tendrá que intentarlo otro día.' },
  ultra: { current: 10, icon: '⭐', iconImage: 'ultrahero-face.png', eyebrow: 'Ciudad protegida', title: '¡Ultrahéroe imparable!', text: 'Doce obstáculos superados entre saltos, vuelos rasantes y maniobras heroicas.' },
  escape: { current: 11, icon: '🔎', eyebrow: 'Archivo cerrado', title: '¡Detective magistral!', text: 'Tres Murdles y dos Murdokus resueltos. Ninguna pista ha podido engañarte.' },
}

export function NinjaGame({ Layout, onComplete, sound }) {
  const [sequence, setSequence] = useState(() => [randomSymbol(), randomSymbol(), randomSymbol()])
  const [round, setRound] = useState(1)
  const [phase, setPhase] = useState('ready')
  const [lit, setLit] = useState(null)
  const [input, setInput] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [mistakes, setMistakes] = useState(0)
  const [message, setMessage] = useState('Cuando estés lista, observa la primera secuencia.')
  const timers = useRef([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const watch = () => {
    if (phase !== 'ready') return
    setPhase('watch'); setInput([]); setFeedback(null); setMessage('Analiza el patrón. Puedes agruparlo por parejas.')
    sequence.forEach((symbol, index) => {
      timers.current.push(setTimeout(() => { setLit(symbol); sound(480 + index * 55) }, 550 + index * 700))
      timers.current.push(setTimeout(() => setLit(null), 980 + index * 700))
    })
    timers.current.push(setTimeout(() => { setPhase('input'); setMessage('¡Tu turno! Repite la secuencia.') }, 650 + sequence.length * 700))
  }
  const press = (symbol) => {
    if (phase !== 'input') return
    const next = [...input, symbol]
    const expected = sequence[next.length - 1]
    setInput(next)
    if (symbol !== sequence[next.length - 1]) {
      setPhase('review'); setMistakes(value => value + 1); setFeedback({ type:'wrong', step:next.length, expected, received:symbol }); setMessage(`Fallo localizado en el paso ${next.length}. Compara los dos emblemas y vuelve a intentarlo.`); sound(160, .12); return
    }
    sound(660); setFeedback({ type:'correct', step:next.length })
    if (next.length === sequence.length) {
      setPhase('locked'); sound(850); setFeedback({ type:'complete' }); setMessage('¡Patrón reconstruido! Tu memoria ninja sube de nivel.')
      timers.current.push(setTimeout(() => {
        if (round === 5) onComplete()
        else { setRound((value) => value + 1); setSequence((value) => [...value, randomSymbol()]); setInput([]); setFeedback(null); setPhase('ready'); setMessage('Nuevo nivel cerebral: el patrón tendrá un emblema más.') }
      }, 1250))
    } else {
      timers.current.push(setTimeout(() => setFeedback(null), 420))
    }
  }
  const symbolById=(id)=>ninjaSymbols.find(symbol=>symbol.id===id)
  const retry=()=>{setInput([]);setFeedback(null);setPhase('ready');setMessage('Has aprendido del fallo. Vuelve a estudiar el mismo patrón.')}
  return <Layout current={5} kicker="Mundo 06 · Brain puzzle" title="Entrenamiento ninja" narrator={message} mood={phase === 'review' ? 'oops' : phase === 'locked' ? 'wow' : 'happy'}>
    <div className="extra-meta"><span>Nivel mental <b>{round}/5</b></span><span>Longitud <b>{sequence.length}</b></span><span>Fallos <b>{mistakes}</b></span></div>
    <div className={`brain-console ${phase}`}>
      <div className="brain-status"><div><small>TRAZA DE MEMORIA</small><strong>{phase==='watch'?'Codificando…':phase==='input'?'Reconstruye el patrón':phase==='review'?'Analiza el error':phase==='locked'?'¡Patrón completo!':'Preparada para observar'}</strong></div><div className="sequence-trace">{sequence.map((_,index)=><span className={index<input.length&&phase!=='review'?'done':index===input.length&&phase==='input'?'current':''} key={index}>{index<input.length&&phase!=='review'?'✓':index+1}</span>)}</div></div>
      {feedback?.type==='wrong'&&<div className="ninja-feedback wrong" role="alert"><div><b>Paso {feedback.step}</b><span>Elegiste</span><img src={`${import.meta.env.BASE_URL}${symbolById(feedback.received).file}`} alt={symbolById(feedback.received).label}/></div><i>≠</i><div><b>Corrección</b><span>Debía ser</span><img src={`${import.meta.env.BASE_URL}${symbolById(feedback.expected).file}`} alt={symbolById(feedback.expected).label}/></div></div>}
      {feedback?.type==='complete'&&<div className="ninja-feedback success" role="status"><b>✓ Secuencia perfecta</b><span>Has reconstruido {sequence.length} emblemas sin perder el orden.</span></div>}
      <div className="simon-board">{ninjaSymbols.map((symbol) => <button className={`${lit === symbol.id ? 'lit' : ''} ${feedback?.type==='correct'&&symbol.id===sequence[feedback.step-1]?'right':''} ${feedback?.type==='wrong'&&symbol.id===feedback.received?'wrong':''}`} onClick={() => press(symbol.id)} disabled={phase !== 'input'} aria-label={symbol.label} key={symbol.id}><img className="ninja-emblem" src={`${import.meta.env.BASE_URL}${symbol.file}`} alt="" /></button>)}</div>
    </div>
    <div className="center-action">{phase==='review'?<button className="primary" onClick={retry}>Revisar el patrón</button>:<button className="primary" onClick={watch} disabled={phase !== 'ready'}><Play size={17} /> {phase === 'ready' ? 'Mostrar patrón' : phase === 'input' ? `Tu turno · ${input.length}/${sequence.length}` : phase==='locked'?'Nivel superado':'Observa…'}</button>}</div>
  </Layout>
}

const elements = [
  { name:'Fuego', file:'chakra-fire.png', color:'#ef5b49' },
  { name:'Viento', file:'chakra-wind.png', color:'#62b994' },
  { name:'Rayo', file:'chakra-lightning.png', color:'#e3b928' },
  { name:'Tierra', file:'chakra-earth.png', color:'#a97950' },
  { name:'Agua', file:'chakra-water.png', color:'#4c91dc' },
]
const chakraAdvantage = { Fuego:'Viento', Viento:'Rayo', Rayo:'Tierra', Tierra:'Agua', Agua:'Fuego' }
const chakraCounter = Object.fromEntries(Object.entries(chakraAdvantage).map(([winner, loser]) => [loser, winner]))
const jutsuNames = {
  Fuego:'Gran bola de fuego', Viento:'Cuchilla de vendaval', Rayo:'Descarga relámpago',
  Tierra:'Muralla de roca', Agua:'Dragón de agua',
}
const jutsuOpponents = [
  { name:'Ren, ninja novato', rank:'GENIN', village:'Aldea de la Hoja', hp:2, attacks:['Fuego','Rayo'] },
  { name:'Mika, guardiana del río', rank:'CHŪNIN', village:'Aldea de la Niebla', hp:2, attacks:['Agua','Tierra'] },
  { name:'Kuro, maestro elemental', rank:'JŌNIN', village:'Arena final', hp:3, attacks:['Viento','Fuego','Tierra'] },
]
export function JutsuGame({ Layout, onComplete, sound }) {
  const [opponentIndex,setOpponentIndex]=useState(0)
  const [enemyHp,setEnemyHp]=useState(jutsuOpponents[0].hp)
  const [attackIndex,setAttackIndex]=useState(0)
  const [lives,setLives]=useState(5)
  const [streak,setStreak]=useState(0)
  const [chakra,setChakra]=useState(0)
  const [empowered,setEmpowered]=useState(false)
  const [feedback,setFeedback]=useState(null)
  const [phase,setPhase]=useState('battle')
  const [message,setMessage]=useState('Lee el primer ataque y busca en la rueda qué naturaleza lo vence.')
  const timers=useRef([])
  useEffect(()=>()=>timers.current.forEach(clearTimeout),[])
  const opponent=jutsuOpponents[opponentIndex]
  const enemyElement=opponent.attacks[attackIndex%opponent.attacks.length]
  const enemySymbol=elements.find(element=>element.name===enemyElement)
  const queue=(callback,delay)=>timers.current.push(setTimeout(callback,delay))
  const choose=(name)=>{
    if(phase!=='battle'||feedback)return
    if(name===chakraCounter[enemyElement]){
      const damage=empowered?2:1
      const remaining=Math.max(0,enemyHp-damage)
      const nextChakra=empowered?0:Math.min(100,chakra+25)
      setEnemyHp(remaining);setStreak(value=>value+1);setChakra(nextChakra);setEmpowered(false)
      setFeedback({type:'correct',name});sound(empowered?980:820)
      setMessage(empowered?'¡Técnica definitiva! El impacto atraviesa la defensa.':'¡Ventaja elemental! Impacto directo.')
      queue(()=>{
        setFeedback(null)
        if(remaining===0){
          if(opponentIndex===jutsuOpponents.length-1){setPhase('victory');onComplete()}
          else{
            const next=opponentIndex+1
            setOpponentIndex(next);setEnemyHp(jutsuOpponents[next].hp);setAttackIndex(0)
            setMessage(`${jutsuOpponents[next].name} entra en la arena. ¡Prepárate!`)
          }
        }else{
          setAttackIndex(value=>value+1);setMessage('El rival cambia de naturaleza. Mantén la racha.')
        }
      },850)
    }else{
      setFeedback({type:'wrong',name});setStreak(0);sound(150,.12)
      if(empowered){
        setEmpowered(false);setChakra(0);setMessage('El manto de chakra absorbió el golpe. No has perdido vida.')
      }else{
        const remaining=lives-1;setLives(remaining)
        setMessage(`Choque desfavorable: ${chakraCounter[enemyElement]} vence a ${enemyElement}.`)
        if(remaining===0)setPhase('defeat')
      }
      queue(()=>setFeedback(null),750)
    }
  }
  const activateChakra=()=>{if(chakra<100||empowered||phase!=='battle')return;setEmpowered(true);setMessage('Modo Chakra activo: acierta para causar doble daño; si fallas, el manto te protegerá.') ;sound(930)}
  const retry=()=>{setLives(5);setStreak(0);setChakra(0);setEmpowered(false);setFeedback(null);setEnemyHp(opponent.hp);setAttackIndex(0);setPhase('battle');setMessage(`Segundo intento contra ${opponent.name}. Observa bien la rueda.`)}
  return <Layout current={6} kicker="Mundo 07 · Arena ninja" title="Arena de naturalezas" narrator={message} mood={phase==='defeat'||feedback?.type==='wrong'?'oops':empowered?'wow':'happy'}>
    <div className="jutsu-hud"><span>Rival <b>{opponentIndex+1}/3</b></span><span className="jutsu-lives" aria-label={`${lives} puntos de vida`}>{Array.from({length:5},(_,i)=><i className={i>=lives?'lost':''} key={i}>♥</i>)}</span><span>Racha <b>×{streak}</b></span></div>
    <div className={`jutsu-battle ${feedback?.type||''} ${empowered?'empowered':''}`}>
      <div className="jutsu-rival">
        <div className="rival-heading"><span>{opponent.rank}</span><div><strong>{opponent.name}</strong><small>{opponent.village}</small></div></div>
        <div className="enemy-health" aria-label={`Vida rival: ${enemyHp} de ${opponent.hp}`}><span style={{width:`${enemyHp/opponent.hp*100}%`}}/></div>
        <div className="enemy-cast"><span className="cast-rings"/><img src={`${import.meta.env.BASE_URL}${enemySymbol.file}`} alt={`Símbolo de chakra ${enemyElement}`}/><small>JUTSU ENEMIGO</small><strong>{jutsuNames[enemyElement]}</strong><em>Naturaleza: {enemyElement}</em></div>
      </div>
      <div className="chakra-wheel" aria-label="Rueda de ventajas elementales">
        <small>VENTAJA ELEMENTAL</small>
        <div>{elements.map((element,index)=><React.Fragment key={element.name}><span style={{'--element-color':element.color}}><img src={`${import.meta.env.BASE_URL}${element.file}`} alt=""/><b>{element.name}</b></span>{index<elements.length-1&&<i>→</i>}</React.Fragment>)}<i>↺</i></div>
        <p>Cada naturaleza vence a la siguiente</p>
      </div>
      {phase==='defeat'?<div className="jutsu-defeat"><strong>Te has quedado sin chakra</strong><p>El rival recupera su vida, pero ya conoces sus ataques.</p><button className="primary" onClick={retry}>Volver al combate</button></div>:<div className="jutsu-controls">
        <div className="element-grid">{elements.map((element)=><button className={`${feedback?.name===element.name?feedback.type:''} ${chakraCounter[enemyElement]===element.name&&feedback?.type==='wrong'?'answer':''}`} onClick={()=>choose(element.name)} disabled={Boolean(feedback)} key={element.name}><img src={`${import.meta.env.BASE_URL}${element.file}`} alt=""/><span>{element.name}</span><small>vence a {chakraAdvantage[element.name]}</small></button>)}</div>
        <div className="chakra-power"><div><span style={{width:`${chakra}%`}}/></div><button onClick={activateChakra} disabled={chakra<100||empowered}>{empowered?'✦ Modo Chakra activo':chakra===100?'✦ Activar técnica definitiva':`Chakra ${chakra}%`}</button></div>
      </div>}
    </div>
  </Layout>
}

const crypticCases=[
  {clue:'A ti y una nota forman una infusión calmante (4)',answer:'TILA',definition:'infusión calmante',mechanism:'Charada: TI + LA (una nota musical)',letters:'L · A · I · T'},
  {clue:'Tema con norte revuelto, planta digestiva (5)',answer:'MENTA',definition:'planta digestiva',mechanism:'Anagrama: TEMA + N, indicado por «revuelto»',letters:'A · T · N · E · M'},
  {clue:'Oculta en mAL Olor Extraño, planta para la piel (4)',answer:'ALOE',definition:'planta para la piel',mechanism:'Palabra oculta entre mAL Olor Extraño',letters:'O · E · A · L'},
  {clue:'Ven, este, norte y oeste forman una sustancia tóxica (6)',answer:'VENENO',definition:'sustancia tóxica',mechanism:'Charada: VEN + E + N + O',letters:'N · O · E · V · N · E'},
  {clue:'En contra, una nota y todo sin final forman el remedio del veneno (8)',answer:'ANTIDOTO',definition:'remedio del veneno',mechanism:'Charada: ANTI + DO + TO (TODO sin final)',letters:'O · T · I · D · A · O · T · N'},
]
export function MaomaoGame({ Layout,onComplete,sound }){
  const [index,setIndex]=useState(0),[answer,setAnswer]=useState(''),[hints,setHints]=useState([]),[wrong,setWrong]=useState(false),[message,setMessage]=useState('Cada frase esconde una definición y una forma de construir la palabra.')
  const puzzle=crypticCases[index]
  const normalize=(value)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z]/g,'').toUpperCase()
  const submit=(event)=>{event.preventDefault();if(normalize(answer)===puzzle.answer){sound(830);setWrong(false);setMessage(`Correcto: ${puzzle.mechanism}.`);setTimeout(()=>{if(index===crypticCases.length-1)onComplete();else{setIndex(index+1);setAnswer('');setHints([]);setMessage('Nueva nota cifrada de Maomao.')}} ,900)}else{sound(150,.12);setWrong(true);setMessage('Esa palabra no encaja con las dos partes de la pista.')}}
  const reveal=(hint)=>setHints(value=>value.includes(hint)?value:[...value,hint])
  return <Layout current={7} kicker="Mundo 08 · Crípticos" title="Los enigmas de Maomao" narrator={message} mood={wrong?'oops':'happy'}>
    <div className="extra-meta"><span>Enigma <b>{index+1}/{crypticCases.length}</b></span><span>Ayudas <b>{hints.length}/3</b></span></div>
    <div className="cryptic-card"><FlaskConical/><small>Nota cifrada #{index+1}</small><h3>“{puzzle.clue}”</h3><div className="letter-slots">{Array.from({length:puzzle.answer.length},(_,i)=><span key={i}>{normalize(answer)[i]||''}</span>)}</div></div>
    <form className={`cryptic-answer ${wrong?'wrong':''}`} onSubmit={submit} noValidate><input value={answer} onChange={event=>{setAnswer(event.target.value.slice(0,puzzle.answer.length));setWrong(false)}} placeholder="Escribe la palabra" autoComplete="off" aria-label="Respuesta al enigma"/><button className="primary" type="submit" disabled={normalize(answer).length!==puzzle.answer.length}>Comprobar</button></form>
    <div className="cryptic-hints"><button onClick={()=>reveal('definition')}><Lightbulb size={15}/> Definición</button><button onClick={()=>reveal('mechanism')}><Lightbulb size={15}/> Mecanismo</button><button onClick={()=>reveal('letters')}><Lightbulb size={15}/> Letras</button></div>
    <div className="hint-reveals">{hints.includes('definition')&&<p><b>Definición:</b> {puzzle.definition}</p>}{hints.includes('mechanism')&&<p><b>Mecanismo:</b> {puzzle.mechanism}</p>}{hints.includes('letters')&&<p><b>Letras:</b> {puzzle.letters}</p>}</div>
  </Layout>
}

export function KeroroGame({Layout,onComplete,sound}){
  const [target,setTarget]=useState(-1),[hits,setHits]=useState(0),[misses,setMisses]=useState(0),[running,setRunning]=useState(false),[message,setMessage]=useState('Pulsa comenzar cuando tengas la vista preparada.')
  const timer=useRef(null);useEffect(()=>()=>clearTimeout(timer.current),[])
  const spawn=()=>{const spot=Math.floor(Math.random()*9);setTarget(spot);timer.current=setTimeout(()=>{setTarget(-1);setMisses(v=>v+1);setMessage('¡Se escapó! Volverá a aparecer.');timer.current=setTimeout(spawn,220)},850)}
  const start=()=>{clearTimeout(timer.current);setHits(0);setMisses(0);setRunning(true);setMessage('¡Ahí viene Keroro!');spawn()}
  const catchKeroro=(spot)=>{if(!running||spot!==target)return;clearTimeout(timer.current);const next=hits+1;setHits(next);setTarget(-1);sound(800);setMessage(next===10?'¡Último Keroro atrapado!':'¡Lo atrapaste! Prepárate para el siguiente.');if(next===10){setRunning(false);setTimeout(onComplete,650)}else timer.current=setTimeout(spawn,250)}
  return <Layout current={8} kicker="Mundo 09 · Reacción" title="Atrapa a Keroro" narrator={message} mood={hits===10?'wow':'happy'}><div className="extra-meta"><span>Atrapados <b>{hits}/10</b></span><span>Escapadas <b>{misses}</b></span></div><div className="keroro-board">{Array.from({length:9},(_,i)=><button onClick={()=>catchKeroro(i)} aria-label={target===i?'Keroro visible':'Escondite vacío'} key={i}><span className="hole"/>{target===i&&<span className="keroro"><img src={`${import.meta.env.BASE_URL}keroro-character.png`} alt="" /></span>}</button>)}</div><div className="center-action"><button className="primary" onClick={start} disabled={running}><Play size={17}/> {hits||misses?'Reiniciar partida':'Comenzar'}</button></div></Layout>
}

const rooms=[
  {name:'Salón',theme:'living',objects:[{id:'cushion',icon:'🛋️',label:'Cojín',x:18,y:60,clue:'Bajo el cojín: una estrella.'},{id:'tv',icon:'📺',label:'Televisión',x:68,y:35,clue:'Tras la tele: el número 2.'}]},
  {name:'Cocina',theme:'kitchen',objects:[{id:'fridge',icon:'🧊',label:'Nevera',x:19,y:35,clue:'En la nevera: una luna.'},{id:'pot',icon:'🍲',label:'Olla',x:67,y:62,clue:'Bajo la olla: la letra A.'}]},
  {name:'Dormitorio',theme:'bedroom',objects:[{id:'pillow',icon:'🛏️',label:'Almohada',x:25,y:57,clue:'En la almohada: una llave.'}]},
  {name:'Jardín',theme:'garden',objects:[{id:'plant',icon:'🌻',label:'Maceta',x:64,y:53,clue:'En la maceta: el número 5.'}]},
]
export function TreasureGame({Layout,onComplete,sound}){
  const [room,setRoom]=useState(0),[found,setFound]=useState([]),[message,setMessage]=useState('Explora el salón. Hay objetos que parecen demasiado inocentes.')
  const inspect=(object)=>{if(found.includes(object.id)){setMessage('Ahí ya encontraste una pista.');return}const next=[...found,object.id];setFound(next);sound(800);setMessage(object.clue);if(next.length===6)setTimeout(onComplete,750)}
  return <Layout current={11} kicker="Mundo 12 · Exploración" title="Búsqueda del tesoro" narrator={message} mood={found.length===6?'wow':'happy'}><div className="room-tabs">{rooms.map((r,i)=><button className={room===i?'active':''} onClick={()=>setRoom(i)} key={r.name}>{r.name}</button>)}</div><div className={`room-scene ${rooms[room].theme}`}><span className="room-title">Casa Nohara · {rooms[room].name}</span>{rooms[room].objects.map(object=><button className={`room-object ${found.includes(object.id)?'found':''}`} style={{left:`${object.x}%`,top:`${object.y}%`}} onClick={()=>inspect(object)} aria-label={`Examinar ${object.label}`} key={object.id}>{found.includes(object.id)?'✓':object.icon}</button>)}</div><div className="treasure-progress"><Search size={17}/><strong>{found.length}/6 pistas</strong>{found.map(id=><span key={id}>★</span>)}</div></Layout>
}

const murdleClues=[
  'Naruto estuvo en el salón cuando se activó el portal.',
  'El grimorio apareció en la cocina Nohara.',
  'Asta no pisó el jardín en toda la tarde.',
  'Quien estuvo en el jardín llevaba el mapa estelar.',
  'Luffy no tenía la llave antigua.',
  'La llave antigua fue encontrada en el salón.',
]
const murdleGroups=[
  {id:'suspect',label:'Sospechoso',icon:'👤',options:['Luffy','Naruto','Asta']},
  {id:'place',label:'Lugar',icon:'🏠',options:['Jardín','Salón','Cocina Nohara']},
  {id:'object',label:'Objeto',icon:'🎒',options:['Mapa estelar','Llave antigua','Grimorio']},
]
const murdleAnswer={suspect:'Luffy',place:'Jardín',object:'Mapa estelar'}
function LegacyEscapeGame({Layout,onComplete,sound}){
  const [revealed,setRevealed]=useState([]),[deduction,setDeduction]=useState({}),[wrong,setWrong]=useState(false),[solved,setSolved]=useState(false),[message,setMessage]=useState('Un portal se ha abierto en la casa Nohara. Necesitamos tres respuestas.')
  const reveal=(index)=>{if(revealed.includes(index))return;setRevealed(value=>[...value,index]);sound(520);setMessage('Nueva pista registrada en el expediente.')}
  const solve=()=>{const correct=Object.entries(murdleAnswer).every(([key,value])=>deduction[key]===value);if(correct){setSolved(true);setWrong(false);sound(880);setMessage('¡Caso resuelto! Todas las pistas encajan.');setTimeout(onComplete,1400)}else{setWrong(true);sound(150,.12);setMessage('Hay una contradicción en tu teoría. Cruza de nuevo las seis pistas.')}}
  return <Layout current={12} kicker="Mundo 13 · Deducción" title="El Murdle del portal anime" narrator={message} mood={wrong?'oops':solved?'wow':'happy'}>
    <div className="murdle-header"><div><small>CASO #013</small><h3>¿Quién activó el portal?</h3><p>Cada sospechoso estuvo en un lugar distinto y llevaba un objeto diferente.</p></div><span>{revealed.length}/6<br/><small>PISTAS</small></span></div>
    <div className="murdle-clues">{murdleClues.map((clue,index)=><button className={revealed.includes(index)?'revealed':''} onClick={()=>reveal(index)} key={clue}><b>{revealed.includes(index)?`Pista ${index+1}`:'¿?'}</b><span>{revealed.includes(index)?clue:'Pulsa para revelar'}</span></button>)}</div>
    <div className="deduction-grid">{murdleGroups.map(group=><fieldset key={group.id}><legend>{group.icon} {group.label}</legend>{group.options.map(option=><button className={deduction[group.id]===option?'selected':''} onClick={()=>{setDeduction(value=>({...value,[group.id]:option}));setWrong(false)}} key={option}>{option}</button>)}</fieldset>)}</div>
    {solved&&<div className="quiz-correct-banner">✓ Luffy · Jardín · Mapa estelar</div>}
    <div className="center-action"><button className="primary" onClick={solve} disabled={revealed.length<6||Object.keys(deduction).length<3||solved}>🔎 Resolver el caso</button></div>
  </Layout>
}

const newObstacle=(count=0)=>({type:count%3===1?'air':'ground',x:104,id:Math.random()})
export function UltraHeroGame({Layout,onComplete,sound}){
  const [obstacle,setObstacle]=useState(()=>newObstacle()),[action,setAction]=useState('run'),[score,setScore]=useState(0),[lives,setLives]=useState(3),[running,setRunning]=useState(false),[message,setMessage]=useState('Pulsa comenzar. Ultrahéroe espera su señal de salida.')
  const actionRef=useRef(action),scoreRef=useRef(score),livesRef=useRef(lives),runningRef=useRef(running),handled=useRef(false),actionTimer=useRef(null)
  actionRef.current=action;scoreRef.current=score;livesRef.current=lives;runningRef.current=running
  const jump=()=>{if(!runningRef.current||actionRef.current==='jump')return;clearTimeout(actionTimer.current);setAction('jump');sound(650);actionTimer.current=setTimeout(()=>setAction('run'),760)}
  const duck=(active)=>{if(!runningRef.current||actionRef.current==='jump')return;setAction(active?'duck':'run')}
  const start=()=>{setScore(0);setLives(3);setAction('run');setObstacle(newObstacle());handled.current=false;setRunning(true);setMessage('¡Corre! Salta las barreras y agáchate bajo los drones.')}
  useEffect(()=>{const down=(event)=>{if(['Space','ArrowUp'].includes(event.code)){event.preventDefault();if(!event.repeat)jump()}if(event.code==='ArrowDown'){event.preventDefault();duck(true)}};const up=(event)=>{if(event.code==='ArrowDown')duck(false)};window.addEventListener('keydown',down);window.addEventListener('keyup',up);return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up)}},[])
  useEffect(()=>{if(!running)return;const timer=setInterval(()=>setObstacle(current=>{const speed=1.45+scoreRef.current*.045,nextX=current.x-speed;if(nextX<29&&nextX>14&&!handled.current){handled.current=true;const safe=current.type==='ground'?actionRef.current==='jump':actionRef.current==='duck';if(!safe){const remaining=livesRef.current-1;setLives(remaining);sound(130,.15);setMessage(remaining?'¡Impacto! Aún puedes continuar.':'Ultrahéroe necesita otro intento.');if(!remaining)setRunning(false);return{...current,x:-20}}}if(nextX< -12){const nextScore=scoreRef.current+1;setScore(nextScore);sound(780);setMessage(nextScore===12?'¡La ciudad está a salvo!':`¡Obstáculo ${nextScore} superado!`);if(nextScore===12){setRunning(false);setTimeout(onComplete,750)}handled.current=false;return newObstacle(nextScore)}return{...current,x:nextX}}),40);return()=>clearInterval(timer)},[running])
  useEffect(()=>()=>clearTimeout(actionTimer.current),[])
  const heroImage=action==='jump'?'ultrahero-jump.png':action==='duck'?'ultrahero-duck.png':'ultrahero-run.png'
  return <Layout current={9} kicker="Mundo 10 · Carrera heroica" title="La carrera de Ultrahéroe" narrator={message} mood={!lives?'oops':score===12?'wow':'happy'}>
    <div className="extra-meta"><span>Peligros <b>{score}/12</b></span><span>Energía <b>{'❤'.repeat(lives)}{'♡'.repeat(3-lives)}</b></span><span>Velocidad <b>{(1+score*.06).toFixed(1)}x</b></span></div>
    <div className={`ultra-world ${running?'running':'paused'}`}><div className="city-skyline"/><div className="ultra-ground"/><div className={`ultra-hero ${action}`}><img src={`${import.meta.env.BASE_URL}${heroImage}`} alt={`Ultrahéroe ${action==='jump'?'volando':action==='duck'?'agachado':'corriendo'}`}/></div><div className={`ultra-obstacle ${obstacle.type}`} style={{left:`${obstacle.x}%`}}><img src={`${import.meta.env.BASE_URL}${obstacle.type==='ground'?'ultrahero-obstacle-ground.png':'ultrahero-obstacle-air.png'}`} alt={obstacle.type==='ground'?'Robot obstáculo':'Dron volador'}/></div>{!running&&score<12&&<button className="runner-start" onClick={start}><Play size={18}/>{score||!lives?'Reintentar':'Comenzar'}</button>}</div>
    <div className="runner-controls"><button onClick={jump} aria-label="Saltar"><b>↑</b><span>Saltar / volar</span></button><button onClick={()=>{duck(true);clearTimeout(actionTimer.current);actionTimer.current=setTimeout(()=>duck(false),700)}} aria-label="Agacharse"><b>↓</b><span>Agacharse</span></button></div>
  </Layout>
}

const murdleCases=[
  {kind:'murdle',code:'M-01',title:'El portal anime',question:'¿Quién activó el portal?',description:'Cada sospechoso estuvo en un lugar y llevaba un objeto distinto.',clues:['Naruto estuvo en el salón.','El grimorio apareció en la cocina Nohara.','Asta no pisó el jardín.','Quien estuvo en el jardín llevaba el mapa estelar.','Luffy no tenía la llave antigua.','La llave antigua fue encontrada en el salón.'],groups:[{id:'suspect',label:'Sospechoso',options:['Luffy','Naruto','Asta']},{id:'place',label:'Lugar',options:['Jardín','Salón','Cocina Nohara']},{id:'object',label:'Objeto',options:['Mapa estelar','Llave antigua','Grimorio']}],answer:{suspect:'Luffy',place:'Jardín',object:'Mapa estelar'}},
  {kind:'murdle',code:'M-02',title:'El caso de la galleta lunar',question:'¿Quién se llevó la galleta?',description:'Tres visitantes, tres habitaciones y tres objetos. Solo uno salió con la galleta.',clues:['Sin Chan estuvo en el jardín.','La cuchara apareció en el jardín.','Anya no entró en la cocina.','La bolsa de cacahuetes quedó en el salón.','Quien estuvo en la cocina llevaba la galleta lunar.','Keroro no tenía la bolsa de cacahuetes.'],groups:[{id:'suspect',label:'Sospechoso',options:['Anya','Keroro','Sin Chan']},{id:'place',label:'Lugar',options:['Cocina','Salón','Jardín']},{id:'object',label:'Objeto',options:['Galleta lunar','Bolsa de cacahuetes','Cuchara']}],answer:{suspect:'Keroro',place:'Cocina',object:'Galleta lunar'}},
  {kind:'murdle',code:'M-03',title:'El grimorio envenenado',question:'¿Quién preparó la prueba?',description:'El culpable estaba en el invernadero y llevaba la sustancia correcta.',clues:['Naruto estuvo en el patio.','El mapa ninja apareció en el patio.','Asta no entró en el invernadero.','El grimorio quedó en la biblioteca.','Quien estuvo en el invernadero llevaba el veneno de prueba.','Maomao no tenía el mapa ninja.'],groups:[{id:'suspect',label:'Sospechoso',options:['Maomao','Naruto','Asta']},{id:'place',label:'Lugar',options:['Invernadero','Biblioteca','Patio']},{id:'object',label:'Objeto',options:['Veneno de prueba','Mapa ninja','Grimorio']}],answer:{suspect:'Maomao',place:'Invernadero',object:'Veneno de prueba'}},
  {kind:'murdoku',code:'S-01',title:'Murdoku de las cuatro pruebas',description:'Completa la cuadrícula: cada símbolo aparece una vez por fila, columna y bloque de 2×2.',symbols:['◆','●','▲','★'],solution:['◆','●','▲','★','▲','★','◆','●','●','◆','★','▲','★','▲','●','◆'],givens:[0,3,5,6,9,10,12,15],answer:{}},
  {kind:'murdoku',code:'S-02',title:'Murdoku del archivo final',description:'La última cuadrícula usa las mismas cuatro pruebas, pero oculta un patrón diferente.',symbols:['◆','●','▲','★'],solution:['●','★','◆','▲','◆','▲','●','★','★','●','▲','◆','▲','◆','★','●'],givens:[1,2,4,7,8,11,13,14],answer:{}},
]
export function EscapeGame({Layout,onComplete,sound}){
  const [caseIndex,setCaseIndex]=useState(0),[revealed,setRevealed]=useState([]),[deduction,setDeduction]=useState({}),[grid,setGrid]=useState([]),[notes,setNotes]=useState(''),[wrong,setWrong]=useState(false),[solved,setSolved]=useState(false),[message,setMessage]=useState('Abre el primer expediente y empieza a cruzar pistas.')
  const current=murdleCases[caseIndex]
  useEffect(()=>{setRevealed([]);setDeduction({});setWrong(false);setSolved(false);setGrid(current.kind==='murdoku'?current.solution.map((value,index)=>current.givens.includes(index)?value:''):[])},[caseIndex])
  const reveal=(index)=>{if(revealed.includes(index))return;setRevealed(value=>[...value,index]);sound(520);setMessage('Nueva pista añadida al expediente.')}
  const cycleCell=(index)=>{if(current.givens.includes(index)||solved)return;setGrid(value=>{const next=[...value],position=current.symbols.indexOf(next[index]);next[index]=current.symbols[(position+1)%current.symbols.length];return next});setWrong(false)}
  const solve=()=>{const correct=current.kind==='murdle'?Object.entries(current.answer).every(([key,value])=>deduction[key]===value):current.solution.every((value,index)=>grid[index]===value);if(correct){setSolved(true);setWrong(false);sound(880);setMessage('¡Expediente resuelto! La deducción es consistente.')}else{setWrong(true);sound(150,.12);setMessage(current.kind==='murdle'?'Tu teoría contradice una pista. Revisa las notas.':'Hay un símbolo repetido o fuera de posición.')}}
  const next=()=>{if(caseIndex===murdleCases.length-1)onComplete();else{setCaseIndex(value=>value+1);setMessage('Nuevo expediente abierto. Tus notas anteriores siguen disponibles.')}}
  const ready=current.kind==='murdle'?revealed.length===current.clues.length&&Object.keys(deduction).length===3:grid.filter(Boolean).length===16
  return <Layout current={10} kicker="Mundo 11 · Archivo criminal" title="Murdles & Murdokus" narrator={message} mood={wrong?'oops':solved?'wow':'happy'}>
    <div className="case-tabs">{murdleCases.map((item,index)=><span className={index<caseIndex?'done':index===caseIndex?'active':''} key={item.code}>{index<caseIndex?'✓':index+1}<small>{item.kind==='murdle'?'Murdle':'Murdoku'}</small></span>)}</div>
    <div className="detective-layout"><section className="case-file"><div className="murdle-header"><div><small>EXPEDIENTE {current.code}</small><h3>{current.title}</h3><p>{current.description}</p></div><span>{caseIndex+1}/5<br/><small>CASOS</small></span></div>
      {current.kind==='murdle'?<><h4 className="case-question">{current.question}</h4><div className="murdle-clues">{current.clues.map((clue,index)=><button className={revealed.includes(index)?'revealed':''} onClick={()=>reveal(index)} key={clue}><b>{revealed.includes(index)?`Pista ${index+1}`:'¿?'}</b><span>{revealed.includes(index)?clue:'Pulsa para revelar'}</span></button>)}</div><div className="deduction-grid">{current.groups.map(group=><fieldset key={group.id}><legend>{group.label}</legend>{group.options.map(option=><button className={deduction[group.id]===option?'selected':''} onClick={()=>{setDeduction(value=>({...value,[group.id]:option}));setWrong(false)}} key={option}>{option}</button>)}</fieldset>)}</div></>:<><div className={`murdoku-board ${wrong?'wrong':''}`}>{grid.map((value,index)=><button className={current.givens.includes(index)?'given':''} onClick={()=>cycleCell(index)} aria-label={`Casilla ${index+1}: ${value||'vacía'}`} key={index}>{value||'·'}</button>)}</div><p className="murdoku-help">Pulsa las casillas vacías para alternar entre ◆ ● ▲ ★.</p></>}
      {solved&&<div className="quiz-correct-banner">✓ {current.title} resuelto</div>}<div className="case-actions">{!solved?<button className="primary" onClick={solve} disabled={!ready}>🔎 Comprobar solución</button>:<button className="primary" onClick={next}>{caseIndex===murdleCases.length-1?'Cerrar archivo':'Siguiente expediente'} <ChevronRight size={17}/></button>}</div>
    </section><aside className="detective-notes"><strong>📝 Bloc de deducciones</strong><small>Se conserva entre los cinco expedientes.</small><textarea className="resize-none" value={notes} onChange={event=>setNotes(event.target.value)} placeholder="Ej.: Naruto = salón = llave…"/><button onClick={()=>setNotes('')} disabled={!notes}>Limpiar notas</button></aside></div>
  </Layout>
}
