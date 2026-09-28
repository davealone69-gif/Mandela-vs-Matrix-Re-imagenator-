# Mandela Native Android — Version 1.0

**Package:** `com.mandelamatrix.reimaginator`  
**Version:** 1.0 (versionCode 1)

Clean native Android build combining Workshop working parts into Mandela Re-imaginator.

## Build the APK (required to get the file)

This environment cannot compile Android APKs. Build on your machine or CI:

### Option A — Android Studio (easiest)
1. Clone: `git clone https://github.com/davealone69-gif/Mandela-Native-Android.git`
2. Open the folder in **Android Studio**
3. Copy `.env.example` → `.env` and set `GEMINI_API_KEY=...`
4. **Build → Build Bundle(s) / APK(s) → Build APK(s)**
5. APK path: `app/build/outputs/apk/debug/app-debug.apk`

### Option B — Command line
```bash
cd Mandela-Native-Android
cp .env.example .env   # then edit GEMINI_API_KEY
./gradlew assembleDebug
# APK: app/build/outputs/apk/debug/app-debug.apk
```

Install on phone:
```bash
adb install app/build/outputs/apk/debug/app-debug.apk
```

## Features
- Dashboard, Library, VIN decoder, Scanner, Gemini chat, Settings
- Package renamed from com.example → com.mandelamatrix.reimaginator
