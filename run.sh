#!/usr/bin/env bash

GRAFANA_API_KEY='eyJrIjoiNzkzY2MzY2QwY2I2YmU0MGE2MjJlYzg2MmFhMzM0NjA0ZmQ3MzZlMyIsIm4iOiJwc3ljaHJvbWV0cmljLWNoYXJ0IiwiaWQiOjUzODIzNH0='

YARN_ARG='dev'

HELP=false
BUILD=false
START=false
STOP=false

for ARG in "${@}" ; do
  if [[ "${ARG}" == -h ]] ; then
    HELP=true
  elif [[ "${ARG}" == -b ]] ; then
    BUILD=true
  elif [[ "${ARG}" == -B ]] ; then
    YARN_ARG='build'
    BUILD=true
  elif [[ "${ARG}" == -r ]] ; then
    START=true
  elif [[ "${ARG}" == -x ]] ; then
    STOP=true
  fi
done

if [[ "${HELP}" == true ]] ; then
  echo "Usage: ${0} [-h] [-bB] [-r] [-x]"
  echo '  -h: Show this help message.'
  echo '  -b: Build and sign the plugin. (Development mode)'
  echo '  -B: Build and sign the plugin. (Release mode)'
  echo '  -r: Run or restart the Grafana instance.'
  echo '  -x: Close the Grafana instance.'
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
