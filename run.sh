#!/usr/bin/env bash

for ARG in "${@}" ; do
  if [[ "${ARG}" == -h ]] ; then
    echo "Usage: ${0} [-h] [-o] [-r] [-P=#.#.#]"
    echo '  -h: Show this help message.'
    echo '  -o: Open the svg generator in a web browser.'
    echo '  -r: Starts or restarts Grafana.'
    echo '  -P: Publish the plugin to Grafana. Requires a version number.'
  elif [[ "${ARG}" == -o ]] ; then
    open './docs/index.html'
  elif [[ "${ARG}" == -r ]] ; then
    brew services restart grafana
  elif [[ "${ARG}" =~ -P=([0-9]+\.[0-9]+\.[0-9]+) ]] ; then
    VERSION="${BASH_REMATCH[1]}"
    echo "Publishing with version ${VERSION}."
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
  else
    echo "Unknown switch ${ARG}. Use ${0} -h for help."
  fi
done
