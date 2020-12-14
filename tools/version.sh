#!/bin/bash
if [ "$1" == "major" ] || [ "$1" == "minor" ] || [ "$1" == "patch" ]; then
  echo " "
  echo "* * * *"
  echo "* "
  echo "*  Generating package.json for @cyberforce/cyberforce-essentials package"
  version=$(jq -r .version package.json)
  versions=(${version//./ })
  if [ "$1" == "major" ]; then
    (( versions[0]++ ))
  fi
  if [ "$1" == "minor" ]; then
    (( versions[1]++ ))
  fi
  if [ "$1" == "patch" ]; then
    (( versions[2]++ ))
  fi
  new=$(printf '%s.' "${versions[@]}")
  new=${new::-1}
  echo "*  Version incrementation to $new ($1)"
  echo "* "
  vc=$(npm version $new)
  cp package.json build/package.json
  echo "*  Success. File 'package.json' has been regenerated."
  echo "* "
  echo "* * * *"
else
    echo "Version incrementation type must be defined (major, minor, patch)"
fi
