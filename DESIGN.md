---
version: alpha
name: "Rumbo a la luna"
description: "Aventura de Adviento lúdica con estética de cuaderno ilustrado, luna amarilla y contornos entintados."
colors:
  navy: "#18213a"
  red: "#f45252"
  yellow: "#ffd84d"
  cream: "#fffaf0"
  teal: "#42b8b2"
  blue: "#3453a4"
  canvas: "#f7f2e6"
typography:
  display:
    fontFamily: "Fredoka, sans-serif"
  body:
    fontFamily: "DM Sans, sans-serif"
rounded:
  DEFAULT: "10px"
  card: "24px"
  round: "999px"
spacing:
  page-gutter: "20px"
  card-padding: "48px"
  content-max: "1120px"
components:
  button: {}
  card: {}
  input: {}
---

# Rumbo a la luna Design System

## Overview

### Creative North Star

Una libreta de misión infantil convertida en juego: superficies crema, tinta azul marino, pegatinas de colores y una luna amarilla como señal de progreso. La interfaz debe sentirse hecha para esta aventura concreta, no como un panel de aplicación genérico.

### Product context and register

- **Audience and primary job:** una destinataria concreta accede a una aventura privada y completa once mundos de minijuegos.
- **Target market(s) and evidence:** experiencia personal en español; el contenido y todas las acciones existentes están escritos en español.
- **Locale(s) and language policy:** español como único idioma de interfaz.
- **Usage scene:** móvil u ordenador, sesión recreativa de baja urgencia y contenido espacioso.
- **Register:** producto lúdico con fuerte expresión de marca.
- **Memorable signature:** la luna amarilla con contorno azul y sombra desplazada.
- **Restraint:** los formularios mantienen etiquetas claras, estados de error legibles y controles familiares.
- **Anti-references:** paneles SaaS, tarjetas translúcidas y degradados tecnológicos; romperían el carácter de cuento-juego.
- **Token ownership/runtime mapping:** este archivo refleja los tokens canónicos definidos en `src/styles.css`; cualquier cambio durable debe actualizar ambos archivos.

## Colors

`navy` define texto, contornos y sombras duras. `red` identifica acciones principales y momentos de energía; `yellow` señala foco y elementos lunares; `teal` comunica progreso correcto. `cream` pertenece a tarjetas y `canvas` al fondo general. Los errores usan un rojo oscuro derivado para alcanzar contraste sobre crema.

## Typography

Fredoka se reserva para títulos y elementos narrativos. DM Sans se usa en texto, etiquetas y controles. Los titulares pueden ser compactos y expresivos; los formularios conservan tamaño y espaciado convencionales.

## Layout

El contenido se centra hasta 1120px con un margen exterior de 20px. Las tarjetas principales son amplias y reducen su relleno en móvil. La pantalla de acceso usa una única columna para que el foco sea inequívoco.

## Elevation & Depth

La profundidad se construye con bordes de 2–3px y sombras sólidas desplazadas, nunca con vidrio o desenfoques de superficie. El foco de formulario añade un halo suave sin reemplazar el contorno.

## Shapes

Las tarjetas usan radios grandes de 24px; campos y botones, 10–11px; avatares, lunas e indicadores importantes son circulares. Los contornos permanecen azul marino.

## Components

### Foundational visual states

Los controles ofrecen hover, `focus-visible`, estado pulsado y deshabilitado. Los errores conservan el espacio de ayuda para evitar saltos de diseño. El movimiento se reduce mediante `prefers-reduced-motion`.

### Buttons and actions

La acción principal es roja, sólida y con sombra dura. Los botones auxiliares son transparentes o crema y siempre incluyen nombre accesible cuando solo muestran un icono.

### Navigation and data display

El progreso usa círculos numerados y color semántico. Las tarjetas mantienen el mismo vocabulario de borde, radio y sombra.

### Forms and overlays

Los campos tienen etiqueta visible, borde oscuro y error textual asociado. Las contraseñas aparecen enmascaradas por defecto y cuentan con un botón explícito para mostrar u ocultar.

### Iconography

Lucide React es la familia canónica. Se usan trazos de 18–20px en controles; los iconos sin texto requieren `aria-label` en el botón.

### Motion

Las entradas duran aproximadamente 450ms y los controles responden en 150ms. La animación comunica cambio de estado y debe quedar prácticamente anulada cuando el sistema solicita movimiento reducido.

### Content and data visualization

La voz es directa, afectuosa y relacionada con la misión. Los errores explican cómo continuar sin culpabilizar a la persona.

## Do's and Don'ts

- **Do:** conservar la combinación de crema, tinta azul, luna amarilla y sombra desplazada.
- **Do:** mantener todos los estados y textos de interacción en español.
- **Don't:** introducir tarjetas genéricas de dashboard, cristal translúcido o decoración sin relación con la aventura.
- **Don't:** usar el color como único indicador de error, éxito o foco.
