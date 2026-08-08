#!/bin/bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "Project root directory: $ROOT_DIR"

echo "Updating package lists..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -y

echo "Installing openjdk-21-jdk-headless, unzip, curl..."
apt-get install -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" openjdk-21-jdk-headless unzip curl

# Locate JAVA_HOME
JAVA_PATH=$(dirname $(dirname $(readlink -f $(which java))))
export JAVA_HOME=$JAVA_PATH
export PATH=$JAVA_HOME/bin:$PATH

echo "JAVA_HOME set to: $JAVA_HOME"
java -version

echo "Setting up Android SDK..."
export ANDROID_HOME=/opt/android
mkdir -p $ANDROID_HOME/cmdline-tools
cd /opt/android
if [ ! -f cmdline-tools.zip ]; then
  curl -sL https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -o cmdline-tools.zip
fi
if [ ! -d cmdline-tools/latest ]; then
  unzip -q cmdline-tools.zip -d cmdline-tools
  mv cmdline-tools/cmdline-tools cmdline-tools/latest
fi
rm -f cmdline-tools.zip

export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

echo "Accepting licenses..."
yes | sdkmanager --licenses > /dev/null

echo "Installing platforms and build-tools..."
sdkmanager "platforms;android-36" "build-tools;36.0.0" > /dev/null

echo "Building web assets..."
cd "$ROOT_DIR"
npm run build

echo "Syncing web assets to Android platform..."
npx cap sync

echo "Fixing local.properties and gradle-wrapper..."
echo "sdk.dir=/opt/android" > "$ROOT_DIR/android/local.properties"

# Download valid gradle-wrapper.jar if missing or invalid
if [ ! -f "$ROOT_DIR/android/gradle/wrapper/gradle-wrapper.jar" ] || [ $(stat -c%s "$ROOT_DIR/android/gradle/wrapper/gradle-wrapper.jar" 2>/dev/null || echo 0) -lt 10000 ]; then
  echo "Downloading clean gradle-wrapper.jar..."
  mkdir -p "$ROOT_DIR/android/gradle/wrapper"
  curl -sL https://raw.githubusercontent.com/gradle/gradle/v8.11.1/gradle/wrapper/gradle-wrapper.jar -o "$ROOT_DIR/android/gradle/wrapper/gradle-wrapper.jar"
  python3 -c "
import zipfile
input_jar = '$ROOT_DIR/android/gradle/wrapper/gradle-wrapper.jar'
with zipfile.ZipFile(input_jar, 'r') as z_in:
    files = {name: z_in.read(name) for name in z_in.namelist()}
manifest_str = files.get('META-INF/MANIFEST.MF', b'').decode('utf-8')
if 'Main-Class:' not in manifest_str:
    manifest_str = manifest_str.strip() + '\nMain-Class: org.gradle.wrapper.GradleWrapperMain\n'
files['META-INF/MANIFEST.MF'] = manifest_str.encode('utf-8')
with zipfile.ZipFile(input_jar, 'w', zipfile.ZIP_DEFLATED) as z_out:
    for name, data in files.items():
        z_out.writestr(name, data)
"
fi

echo "Building APK..."
cd "$ROOT_DIR/android"
chmod +x gradlew
./gradlew assembleDebug --no-daemon

echo "Copying generated APK to server download locations..."
mkdir -p "$ROOT_DIR/android/app/build/outputs/apk/release"
mkdir -p "$ROOT_DIR/android/app/build/outputs/apk/debug"
mkdir -p "$ROOT_DIR/dist"

if [ -f "$ROOT_DIR/android/app/build/outputs/apk/debug/app-debug.apk" ]; then
  cp "$ROOT_DIR/android/app/build/outputs/apk/debug/app-debug.apk" "$ROOT_DIR/android/app/build/outputs/apk/release/app-release.apk"
  cp "$ROOT_DIR/android/app/build/outputs/apk/debug/app-debug.apk" "$ROOT_DIR/dist/app-debug.apk"
  cp "$ROOT_DIR/android/app/build/outputs/apk/debug/app-debug.apk" "$ROOT_DIR/dist/app-release.apk"
  echo "SUCCESS: APK compiled and placed in output directories!"
else
  echo "ERROR: app-debug.apk was not found after gradlew build."
  exit 1
fi
