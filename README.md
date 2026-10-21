# Mandela vs Matrix Re-imaginator

**Android build and audit status:** in progress. Builds and features are not considered verified until CI passes and the APK is installed and exercised on a device.

## Download / build the Android APK

- **[Open APK builds and download the latest successful build artifact](https://github.com/davealone69-gif/Mandela-vs-Matrix-Re-imagenator-/actions/workflows/build-apk.yml)**. Open the latest successful run, then download its **app-debug-apk** artifact. GitHub may require you to be signed in.
- **[Open GitHub Releases](https://github.com/davealone69-gif/Mandela-vs-Matrix-Re-imagenator-/releases)** for versioned downloads. A direct APK release link will be added only after a real APK is attached to a release.
- **[View the current repair pull request](https://github.com/davealone69-gif/Mandela-vs-Matrix-Re-imagenator-/pull/8)**.
- **[Review the consolidation and fake-feature audit](https://github.com/davealone69-gif/Mandela-vs-Matrix-Re-imagenator-/tree/audit/mandela-family-2026-10-21/docs/CONSOLIDATION_AUDIT.md)**.

## Important status

- A previous Debug APK build passed and uploaded an Actions artifact.
- The latest launcher-resource cleanup and expanded audit still require a successful CI result.
- A CI-built APK is not evidence of successful installation, real AI output, or complete phone runtime verification.
- Features identified as simulated, seeded, or mock must be labelled as such or replaced with tested implementations before being presented as real.

## Local build

For a Capacitor Android build, install the project dependencies, build the web app, sync Capacitor, then build the Android project using the checked-in Gradle wrapper. Follow the workflow linked above for the authoritative CI steps.
