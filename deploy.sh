#!/usr/bin/env bash
# Publica tu página en GitHub Pages.
# Uso:   bash deploy.sh nombre-del-repositorio
# Ejemplo: bash deploy.sh mi-sitio-drones
set -e
cd "$(dirname "$0")"

REPO="${1:-mi-sitio-drones}"

echo "==> 1/5 Actualizando la galería con tus videos y fotos"
bash actualizar-galeria.sh

echo "==> 2/5 Revisando el tamaño de los archivos"
# GitHub no acepta archivos de más de 100 MB
GRANDES="$(find assets -type f -size +95M 2>/dev/null || true)"
if [ -n "$GRANDES" ]; then
  echo ""
  echo "Estos archivos pesan demasiado para GitHub (máximo 100 MB):"
  echo "$GRANDES"
  echo ""
  echo "Comprímelos con ffmpeg y vuelve a correr el script:"
  echo '  ffmpeg -i entrada.mp4 -vcodec libx264 -crf 26 -preset slow -vf "scale=-2:1080" -an salida.mp4'
  exit 1
fi

echo "==> 3/5 Preparando Git"
command -v git >/dev/null 2>&1 || { echo "Instala Git primero: https://git-scm.com/downloads"; exit 1; }

if [ ! -d .git ]; then
  git init -q
fi
git checkout -q -B main
touch .nojekyll

git add -A
if git diff --cached --quiet; then
  echo "No hay cambios nuevos para guardar."
else
  git commit -q -m "Actualiza sitio web"
fi

echo "==> 4/5 Subiendo a GitHub"
if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  OWNER="$(gh api user --jq .login)"

  if git remote get-url origin >/dev/null 2>&1; then
    git push -u origin main
  else
    gh repo create "$REPO" --public --source=. --remote=origin --push
  fi

  echo "==> 5/5 Activando GitHub Pages"
  gh api -X POST "repos/$OWNER/$REPO/pages" \
    -f "source[branch]=main" -f "source[path]=/" >/dev/null 2>&1 || true

  echo ""
  echo "Listo. Tu página estará en línea en 1 o 2 minutos en:"
  echo "  https://$OWNER.github.io/$REPO/"
else
  echo ""
  echo "No encontré GitHub CLI (gh) con sesión iniciada. Hazlo manualmente:"
  echo "  1. Crea un repositorio vacío y público en https://github.com/new llamado: $REPO"
  echo "  2. Corre estos comandos (cambia TU_USUARIO):"
  echo "       git remote add origin https://github.com/TU_USUARIO/$REPO.git"
  echo "       git push -u origin main"
  echo "  3. En GitHub: Settings > Pages > Source: 'Deploy from a branch' > main > / (root) > Save"
  echo "  4. Tu página quedará en: https://TU_USUARIO.github.io/$REPO/"
  exit 0
fi
