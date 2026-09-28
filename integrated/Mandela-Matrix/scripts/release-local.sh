#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${KEYSTORE_PATH:-}" ]]; then
  echo "Set KEYSTORE_PATH, KEYSTORE_PASSWORD, KEY_ALIAS, KEY_PASSWORD"
  exit 1
fi

./gradlew :app:bundleRelease
echo "AAB ready at app/build/outputs/bundle/release/"
