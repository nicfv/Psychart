#!/usr/bin/env bash

YARN_ARG='dev'
GRAFANA_ARG='restart'
VERSION='1.0.0'

HELP=false
CLEAN=false
BUILD=false
INSTALL=false
GRAFANA=false
PSY=false
PUBLISH=false

for ARG in "${@}" ; do
  if [[ "${ARG}" == -h ]] ; then
    HELP=true
  elif [[ "${ARG}" == -i ]] ; then
    INSTALL=true
  elif [[ "${ARG}" == -c ]] ; then
    CLEAN=true
  elif [[ "${ARG}" =~ -b=(.*) ]] ; then
    YARN_ARG="${BASH_REMATCH[1]}"
    BUILD=true
  elif [[ "${ARG}" =~ -g=(.*) ]] ; then
    GRAFANA_ARG="${BASH_REMATCH[1]}"
    GRAFANA=true
  elif [[ "${ARG}" == -p ]] ; then
    PSY=true
  elif [[ "${ARG}" == -o ]] ; then
    open './docs/index.html'
  elif [[ "${ARG}" == -A ]] ; then
    clear
    echo 'Building plugin in development mode.'
    YARN_ARG='build'
    BUILD=true
    GRAFANA=true
    PSY=true
  elif [[ "${ARG}" =~ -P=([0-9]+\.[0-9]+\.[0-9]+) ]] ; then
    VERSION="${BASH_REMATCH[1]}"
    echo "Publishing with version ${VERSION}."
    PUBLISH=true
  else
    echo "Unknown switch ${ARG}. Use ${0} -h for help."
  fi
done

if [[ "${HELP}" == true ]] ; then
  echo "Usage: ${0} [-h] [-i] [-c] [-b=<mode>] [-g=<mode>] [-p] [-o] [-A] [-P=#.#.#]"
  echo '  -h: Show this help message.'
  echo '  -i: (Re)install node packages.'
  echo '  -c: Clean build files.'
  echo '  -b: Build the plugin without signing it.'
  echo '      - "dev" = Development mode'
  echo '      - "build" = Release mode'
  echo '  -g: Run, restart, or stop the local Grafana instance.'
  echo '      - "start" = Start up'
  echo '      - "restart" = Start or restart'
  echo '      - "stop" = Shut down'
  echo '  -p: Publish the current psychart file.'
  echo '  -o: Open the svg generator in a web browser.'
  echo "  -A: Clears the terminal and executes the command ${0} -p -b=dev -g=restart"
  echo '  -P: Publish the plugin to Grafana. Needs a version number.'
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

if [[ "${BUILD}" == true ]] ; then
  yarn "${YARN_ARG}"
fi

if [[ "${GRAFANA}" == true ]] ; then
  brew services "${GRAFANA_ARG}" grafana
fi

if [[ "${PUBLISH}" == true ]] ; then
  if git status | grep -q clean ; then
    EXT='.bk'
    PACKAGE_JSON='package.json'
    REMOTE_ORIGIN='github'
    sed -i"${EXT}" -E "s/\"version\": \"[0-9]+\.[0-9]+\.[0-9]+\"/\"version\": \"${VERSION}\"/" "${PACKAGE_JSON}"
    rm -v "${PACKAGE_JSON}${EXT}"
    git add "${PACKAGE_JSON}" && git commit -m "v${VERSION}"
    git tag -a "v${VERSION}" -m "${VERSION}" && git push "${REMOTE_ORIGIN}" "v${VERSION}"
  else
    echo 'Some changes not committed. Commit or discard them first before publishing.'
  fi
fi