#!/usr/bin/env bash

KEY_FILE='grafana-api-key.txt'
GRAFANA_API_KEY="$(cat $KEY_FILE)"

YARN_ARG='dev'
GRAFANA_ARG='restart'

HELP=false
BUILD=false
INSTALL=false
GRAFANA=false
PSY=false
ZIP=false

for ARG in "${@}" ; do
  if [[ "${ARG}" == -h ]] ; then
    HELP=true
  elif [[ "${ARG}" == -i ]] ; then
    INSTALL=true
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
    BUILD=true
    GRAFANA=true
    PSY=true
  elif [[ "${ARG}" == -z ]] ; then
    ZIP=true
  elif [[ "${ARG}" == -Z ]] ; then
    clear
    echo 'Building and zipping the plugin.'
    BUILD=true
    YARN_ARG='build'
    PSY=true
    ZIP=true
  else
    echo "Unknown switch ${ARG}. Use ${0} -h for help."
  fi
done

if [[ "${HELP}" == true ]] ; then
  echo "Usage: ${0} [-h] [-i] [-b=<mode>] [-g=<mode>] [-p] [-o] [-z] [-A] [-Z]"
  echo '  -h: Show this help message.'
  echo '  -i: (Re)install node packages.'
  echo '  -b: Build and sign the plugin.'
  echo '      - "dev" = Development mode'
  echo '      - "build" = Release mode'
  echo '  -g: Run, restart, or stop the local Grafana instance.'
  echo '      - "start" = Start up'
  echo '      - "restart" = Start or restart'
  echo '      - "stop" = Shut down'
  echo '  -p: Publish the current psychart file.'
  echo '  -o: Open the svg generator in a web browser.'
  echo '  -z: Zip the current build files into psychart.zip.'
  echo "  -A: Clears the terminal and executes the command ${0} -p -b=dev -g=restart"
  echo "  -Z: Clears the terminal and executes the command ${0} -p -b=build -z"
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
  curl -X POST -s --data-urlencode "input@${OUT}" https://www.toptal.com/developers/javascript-minifier/raw > "${OUT}${MIN}"
  cp -v "${OUT}${MIN}" "${OUT}"
  rm -v "${OUT}${MIN}"
  cp -v "./docs/logo.svg" "./src/img/logo.svg"
fi

if [[ "${INSTALL}" == true ]] ; then
  npm install
  yarn install --pure-lockfile
fi

if [[ "${BUILD}" == true ]] ; then
  yarn "${YARN_ARG}"
  export GRAFANA_API_KEY
  npx @grafana/toolkit plugin:sign --rootUrls http://localhost:3000
fi

if [[ "${GRAFANA}" == true ]] ; then
  brew services "${GRAFANA_ARG}" grafana
fi

if [[ "${ZIP}" == true ]] ; then
  cp -rv 'dist' 'ventura-psychrometric-panel'
  zip -vXr 'psychart.zip' 'ventura-psychrometric-panel'
  rm -rv 'ventura-psychrometric-panel'
fi