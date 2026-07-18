#!/bin/bash
set -e

echo "Installing dependencies..."
apt-get install -y openjdk-17-jdk unzip curl

echo "Setting up Android SDK..."
export ANDROID_HOME=/opt/android
mkdir -p $ANDROID_HOME/cmdline-tools
cd /opt/android
curl -sL https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -o cmdline-tools.zip
unzip -q cmdline-tools.zip -d cmdline-tools
mv cmdline-tools/cmdline-tools cmdline-tools/latest
rm cmdline-tools.zip

export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

echo "Accepting licenses..."
yes | sdkmanager --licenses > /dev/null

echo "Installing platforms and build-tools..."
sdkmanager "platforms;android-34" "build-tools;34.0.0" > /dev/null

echo "Building APK..."
cd /app/applet/android
chmod +x gradlew
./gradlew assembleDebug

echo "APK generated!"
