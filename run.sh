#!/usr/bin/env bash

GRAFANA_API_KEY='eyJrIjoiNzkzY2MzY2QwY2I2YmU0MGE2MjJlYzg2MmFhMzM0NjA0ZmQ3MzZlMyIsIm4iOiJwc3ljaHJvbWV0cmljLWNoYXJ0IiwiaWQiOjUzODIzNH0='

YARN_ARG='dev'

HELP=false
BUILD=false
INSTALL=false
START=false
STOP=false
PSY=false

for ARG in "${@}" ; do
  if [[ "${ARG}" == -h ]] ; then
    HELP=true
  elif [[ "${ARG}" == -i ]] ; then
    INSTALL=true
  elif [[ "${ARG}" == -b ]] ; then
    BUILD=true
  elif [[ "${ARG}" == -B ]] ; then
    YARN_ARG='build'
    BUILD=true
  elif [[ "${ARG}" == -r ]] ; then
    START=true
  elif [[ "${ARG}" == -x ]] ; then
    STOP=true
  elif [[ "${ARG}" == -p ]] ; then
    PSY=true
  elif [[ "${ARG}" == -o ]] ; then
    open './svg/index.html'
  elif [[ "${ARG}" == -A ]] ; then
    clear
    echo 'Building plugin in development mode.'
    BUILD=true
    START=true
    PSY=true
  fi
done

if [[ "${HELP}" == true ]] ; then
  echo "Usage: ${0} [-h] [-i] [-bB] [-r] [-x] [-p] [-o] [-A]"
  echo '  -h: Show this help message.'
  echo '  -i: (Re)install node packages.'
  echo '  -b: Build and sign the plugin. (Development mode)'
  echo '  -B: Build and sign the plugin. (Release mode)'
  echo '  -r: Run or restart the Grafana instance.'
  echo '  -x: Close the Grafana instance.'
  echo '  -p: Publish the current psychart file.'
  echo '  -o: Open the svg generator in a web browser.'
  echo '  -A: Clears the terminal and executes flags -b -r -p.'
fi

if [[ "${PSY}" == true ]] ; then
  IN='./svg/psychart.ts'
  OUT='./src/psychart.js'
  EXT='.bk'
  cp -v "${IN}" "${OUT}"
  sed -i"${EXT}" 's/function Psychart/export function Psychart/g' "${OUT}"
  sed -i"${EXT}" "s/new Psychrometrics()/require('psychrolib.js')/g" "${OUT}"
  rm -v "${OUT}${EXT}"
fi

if [[ "${INSTALL}" == true ]] ; then
  npm install
fi

if [[ "${BUILD}" == true ]] ; then
  yarn "${YARN_ARG}"
  export GRAFANA_API_KEY
  npx @grafana/toolkit plugin:sign --rootUrls http://localhost:3000
fi

if [[ "${START}" == true ]] ; then
  brew services restart grafana
fi

if [[ "${STOP}" == true ]] ; then
  brew sercices stop grafana
fi
