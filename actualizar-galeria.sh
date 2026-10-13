#!/usr/bin/env bash
# Lee tus videos y fotos de la carpeta assets/ y arma la galería de la página.
# Uso: bash actualizar-galeria.sh
set -e
cd "$(dirname "$0")"

OUT="galeria.js"
mkdir -p assets/videos assets/images

esc() { printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'; }

{
  echo "// Archivo generado automáticamente por actualizar-galeria.sh. No lo edites a mano."
  echo "window.GALERIA = ["
} > "$OUT"

shopt -s nullglob nocaseglob
total=0

# Videos (hero.* se usa solo como fondo de la portada)
for f in assets/videos/*.mp4 assets/videos/*.webm assets/videos/*.mov; do
  base="$(basename "$f")"
  case "${base,,}" in hero.*) continue ;; esac
  echo "  { tipo: \"video\", src: \"$(esc "$f")\" }," >> "$OUT"
  total=$((total + 1))
done

# Fotos
for f in assets/images/*.jpg assets/images/*.jpeg assets/images/*.png assets/images/*.webp assets/images/*.avif; do
  base="$(basename "$f")"
  case "${base,,}" in hero.*) continue ;; esac
  echo "  { tipo: \"imagen\", src: \"$(esc "$f")\" }," >> "$OUT"
  total=$((total + 1))
done

echo "];" >> "$OUT"
echo "Galería actualizada: $total archivo(s) en $OUT"
