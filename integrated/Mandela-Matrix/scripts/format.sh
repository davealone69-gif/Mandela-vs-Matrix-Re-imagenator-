#!/usr/bin/env bash
set -euo pipefail
./gradlew detekt --auto-correct
echo "Formatting complete."
