const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target = `    files.push({
      name: 'gradle-wrapper.properties',
      path: 'gradle/wrapper/gradle-wrapper.properties',
      content: \`distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\\\://services.gradle.org/distributions/gradle-8.5-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists\`,
      language: 'yaml'
    });`;

const replacement = `    files.push({
      name: 'gradlew',
      path: 'gradlew',
      content: \`#!/usr/bin/env bash

# Self-bootstrapping Gradle Wrapper script
# Downloads gradle-wrapper.jar if missing, then executes it.

set -e

GRADLE_WRAPPER_JAR="gradle/wrapper/gradle-wrapper.jar"
GRADLE_WRAPPER_URL="https://raw.githubusercontent.com/gradle/gradle/v8.5.0/gradle/wrapper/gradle-wrapper.jar"

if [ ! -f "\$GRADLE_WRAPPER_JAR" ]; then
    mkdir -p "$(dirname "\$GRADLE_WRAPPER_JAR")"
    echo "Downloading gradle-wrapper.jar..."
    if command -v curl >/dev/null 2>&1; then
        curl -sSL "\$GRADLE_WRAPPER_URL" -o "\$GRADLE_WRAPPER_JAR"
    elif command -v wget >/dev/null 2>&1; then
        wget -qO "\$GRADLE_WRAPPER_JAR" "\$GRADLE_WRAPPER_URL"
    else
        echo "Error: Neither curl nor wget found."
        exit 1
    fi
fi

exec java \\
    -XX:+HeapDumpOnOutOfMemoryError \\
    -Xmx1024m \\
    -Dorg.gradle.appname=gradlew \\
    -classpath "\$GRADLE_WRAPPER_JAR" \\
    org.gradle.wrapper.GradleWrapperMain \\
    "\$@"\`,
      language: 'markdown' // treat as text/shell
    });

    files.push({
      name: 'gradle-wrapper.properties',
      path: 'gradle/wrapper/gradle-wrapper.properties',
      content: \`distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\\\://services.gradle.org/distributions/gradle-8.5-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists\`,
      language: 'yaml'
    });`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('server.ts', code);
  console.log('patched gradlew');
} else {
  console.log('target not found for gradlew');
}
