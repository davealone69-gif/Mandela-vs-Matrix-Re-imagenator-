# Clean Native Android Build (Separate from Capacitor)

This is a **separate, clean native Android project** extracted from the working `App` repository.

It does **not** touch the existing Capacitor `android/` folder.

## Why this exists
- The main Mandela project uses Capacitor (web + thin Android shell).
- The `App` repo had a fully working pure Kotlin + Jetpack Compose project that builds APKs cleanly.
- This folder gives you that clean native foundation while keeping the original project intact.

## How to open & build
1. Open **Android Studio**
2. Choose **Open** and select the `android-native` folder (not the repo root)
3. Let Gradle sync
4. Create `.env` from `.env.example` and put your `GEMINI_API_KEY`
5. Build:
   ```bash
   ./gradlew assembleDebug
   # or assembleRelease (needs keystore)
   ```

## Structure (from working App)
- Kotlin + Jetpack Compose (Material 3)
- Room database
- Gemini agent helper
- MVVM architecture
- Modern Gradle Kotlin DSL + Version Catalog
- Signing configs already present

## Next steps you can take
- Change `applicationId` / namespace to `com.mandelamatrix.reimaginator`
- Port specific features from the main Mandela web app into Compose screens
- Or keep using this as the APK-producing project and call the web backend if needed
