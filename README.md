# Página web de video con dron

Sitio estático (HTML, CSS y JavaScript) para publicar en GitHub Pages. No necesita instalar nada para verse.

## 1. Pon tus datos

Abre `script.js` y edita el bloque `CONFIG` al inicio:

- `nombre`: el nombre de tu negocio
- `whatsapp`: tu número con código de país y sin `+` (México: `521` + 10 dígitos, por ejemplo `5219981234567`)
- `email`: opcional
- `ciudad`: texto del pie de página

También cambia el título en `index.html` si quieres otro texto.

## 2. Agrega tus videos y fotos

- Video de portada (fondo del inicio): `assets/videos/hero.mp4`
- Foto de portada (se ve mientras carga el video): `assets/images/hero.jpg`
- Videos de trabajos: cualquier `.mp4` o `.webm` en `assets/videos/`
- Fotos de trabajos: `.jpg`, `.png` o `.webp` en `assets/images/`

El nombre del archivo se usa como título en la galería (`casa-playa-del-carmen.mp4` se muestra como "casa playa del carmen").

### Recomendaciones para que cargue rápido

- Video de portada: 10 a 15 segundos, 1080p, menos de 15 MB
- Videos de trabajos: 1080p y menos de 50 MB cada uno
- GitHub no permite archivos de más de 100 MB

Para comprimir un video con [ffmpeg](https://ffmpeg.org/download.html):

```bash
ffmpeg -i entrada.mp4 -vcodec libx264 -crf 26 -preset slow -vf "scale=-2:1080" -an salida.mp4
```

Para comprimir una foto, puedes usar [squoosh.app](https://squoosh.app).

## 3. Verla en tu computadora

Abre `index.html` con doble clic. Cada vez que agregues archivos nuevos, corre:

```bash
bash actualizar-galeria.sh
```

## 4. Publicarla en GitHub

La forma más fácil es con [GitHub CLI](https://cli.github.com/). Instálalo, corre `gh auth login` una vez y luego:

```bash
bash deploy.sh mi-sitio-drones
```

El script actualiza la galería, sube todo a GitHub y activa GitHub Pages. Al final te muestra la dirección de tu página.

Si no usas GitHub CLI, el script te imprime los pasos manuales.

Para actualizar la página después, agrega tus archivos y vuelve a correr `bash deploy.sh mi-sitio-drones`.

## Dominio propio (opcional)

En GitHub: Settings > Pages > Custom domain. Ahí puedes conectar un dominio como `tumarca.com`.
