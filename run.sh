#!/usr/bin/env bash

VERSION=''

HELP=false
INSTALL=false
CLEAN=false
EXEC=false
PSY=false

for ARG in "${@}" ; do
  if [[ "${ARG}" == -h ]] ; then
    HELP=true
  elif [[ "${ARG}" == -i ]] ; then
    INSTALL=true
  elif [[ "${ARG}" == -c ]] ; then
    CLEAN=true
  elif [[ "${ARG}" == -o ]] ; then
    open './docs/index.html'
  elif [[ "${ARG}" == -x ]] ; then
    clear
    PSY=true
    EXEC=true
  elif [[ "${ARG}" =~ -P=([0-9]+\.[0-9]+\.[0-9]+) ]] ; then
    VERSION="${BASH_REMATCH[1]}"
    echo "Publishing with version ${VERSION}."
  else
    echo "Unknown switch ${ARG}. Use ${0} -h for help."
  fi
done

if [[ "${HELP}" == true ]] ; then
  echo "Usage: ${0} [-h] [-i] [-c] [-o] [-x] [-P=#.#.#]"
  echo '  -h: Show this help message.'
  echo '  -i: (Re)install node packages.'
  echo '  -c: Clean build files.'
  echo '  -o: Open the svg generator in a web browser.'
  echo '  -x: Clears the terminal, rebuilds the plugin, and restarts Grafana.'
  echo '  -P: Publish the plugin to Grafana. Requires a version number.'
fi

if [[ "${PSY}" == true ]] ; then
  IN1='./docs/w3color.js'
  IN2='./docs/psychrolib.js'
  IN3='./docs/psychart.js'
  OUT='./src/psychart.js'
  EXT='.bk'
  MIN='.min'
  cp -v "${IN1}" "${OUT}"
  cat "${IN2}" >> "${OUT}"
  cat "${IN3}" >> "${OUT}"
  sed -i"${EXT}" 's/function Psychart/export function Psychart/g' "${OUT}"
  sed -i"${EXT}" -E "s/(Validate\(.*\);)/\/\/\1/g" "${OUT}"
  sed -i"${EXT}" -E "s/(['\"]use strict['\"];)/\/\/\1/g" "${OUT}"
  sed -i"${EXT}" -E "s/(Object.freeze\(.*\);)/\/\/\1/g" "${OUT}"
  rm -v "${OUT}${EXT}"
  curl -X POST -s --data-urlencode "input@${OUT}" "https://www.toptal.com/developers/javascript-minifier/api/raw" > "${OUT}${MIN}"
  cp -v "${OUT}${MIN}" "${OUT}"
  rm -v "${OUT}${MIN}"
  cp -v "./docs/logo.svg" "./src/img/logo.svg"
fi

if [[ "${INSTALL}" == true ]] ; then
  yarn install
fi

if [[ "${CLEAN}" == true ]] ; then
  rm -r node_modules dist yarn.lock && echo 'Removed dependencies and build files.'
fi

if [[ "${EXEC}" == true ]] ; then
  yarn build
  brew services restart grafana
fi

if [[ "${VERSION}" ]] ; then
  if git status | grep -q clean ; then
    EXT='.bk'
    PACKAGE_JSON='package.json'
    REMOTE_ORIGIN='origin'
    sed -i"${EXT}" -E "s/\"version\": \"[0-9]+\.[0-9]+\.[0-9]+\"/\"version\": \"${VERSION}\"/" "${PACKAGE_JSON}"
    rm -v "${PACKAGE_JSON}${EXT}"
    git add "${PACKAGE_JSON}" && git commit -m "v${VERSION}" && git push
    git tag -a "v${VERSION}" -m "${VERSION}" && git push "${REMOTE_ORIGIN}" "v${VERSION}"
  else
    echo 'Some changes not committed. Commit or discard them first before publishing.'
  fi
fi