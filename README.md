# Rumbo a la luna

Una aventura de Adviento hecha con React y Vite. Sin Chan acompaña al jugador por catorce mundos: plataformas hasta la luna, Marvel, anime, openings, memoria, entrenamiento ninja, combate de jutsus, laboratorio de Maomao, misión de Anya, Keroro, pimientos, búsqueda del tesoro, escape room y desafíos matemáticos. Cada mundo incluye instrucciones y una pantalla de celebración al completarlo.

El juego de openings necesita conexión a internet para cargar los vídeos incrustados de YouTube.

## Personalizar

Edita `src/content.js`. Ahí puedes cambiar el nombre, la dedicatoria, el mensaje final, el regalo y la frase secreta.

## Ejecutar

```bash
npm install
npm run dev
```

## Publicar en GitHub Pages

1. Sube el proyecto a un repositorio de GitHub.
2. En **Settings → Pages**, selecciona **GitHub Actions** como fuente.
3. El workflow incluido construirá y publicará la web automáticamente con cada `push` a `main`.

Vite usa rutas relativas (`base: './'`), así que funciona tanto en un dominio propio como en `usuario.github.io/repositorio`.
