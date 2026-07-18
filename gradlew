#!/bin/bash
# Delegate to the android gradle wrapper
cd "$(dirname "$0")/android"
exec ./gradlew "$@"
