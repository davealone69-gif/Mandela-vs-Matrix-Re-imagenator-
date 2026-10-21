# Mandela family consolidation audit

**Audit started:** 2026-10-21  
**Target repository:** `davealone69-gif/Mandela-vs-Matrix-Re-imagenator-`  
**Audit branch:** `audit/mandela-family-2026-10-21`  
**Status:** Phase 1 live repository/CI audit. No source repositories deleted. No app integration claimed complete.

## Decision rules

- Preserve source repositories until their useful code has been transferred and the consolidated replacement has passed build, tests, and installed-device runtime checks.
- Treat README feature claims as unverified until code and runtime evidence support them.
- Do not use mock metrics, simulated network delays, fake build results, placeholder AI, or dummy endpoints as working features.
- Swarm Builder must remain usable as a standalone app/project and also be integrated into Mandela.
- Build success is not device/runtime verification.

## Repositories inspected

| Repository | Current evidence | Initial disposition |
|---|---|---|
| `Mandela-vs-Matrix-Re-imagenator-` | Contains a large React/Vite/Capacitor app-builder UI, Android Capacitor shell, a 62 KB `ConsolidatedApp.kt`, and a tracked `integrated/` snapshot of related projects. Its README still describes a branding/deliverables package, not the actual app. | Keep as requested integration target, but audit its real app and correct the misleading README. |
| `MandelaMatrixOS` | A native Jetpack Compose app with separate screens for Free AI, Gemini, knowledge, image tools, APK auditing/building, training, settings, and Swarm Builder. `LlmClient` and `BuilderBackend` make real requests; Swarm Builder explicitly says v1 is sequential. Main-branch Build & Release APK and Full Code Audit both succeeded on 2026-10-01; the newer `fix/termux-builder-startup-truth` branch has successful build/audit runs on 2026-10-15. | Strongest current candidate for reusable native Compose/AI/swarm features. Inspect branch-only fixes before transferring. |
| `MandelaMatrixReimagenator` | Native Compose shell with Core, Mandela, Swarm, Vibe and Tools tabs. The inspected Core action only advances through timed status messages and reports completion without rebuilding anything. Main-branch APK/audit workflows failed at Android SDK setup on 2026-10-01. | Salvage genuinely useful UI/components only; do not transfer simulated actions as working functionality. |
| `Mandela-Native-Android` | Native Compose UI and Gemini service exist, but the tree has duplicated `com/example` and `com/mandelamatrix/reimaginator` source trees. Its Gradle wrapper JAR is missing from the repository tree; the 2026-10-14 audit failed with `GradleWrapperMain` not found. | Inspect both variants, resolve which is canonical, and salvage real features after build repair. |
| `Mandela-Matrix` | Gradle Kotlin DSL, version catalog, `:app` and `:libs` structure, but `:libs` contains a `Placeholder.kt`; the app is a starter shell, not the full Mandela feature set. Main CI failed on 2026-10-14 at Android SDK setup. | Reuse build conventions only if they improve the target; do not treat the starter as the app. |

## Target repository findings

1. The target already contains source snapshots under `integrated/`, but copying repositories into subdirectories is **not** the same as integrating their features into one running app.
2. `.github/workflows/consolidate-mandela.yml` clones only the named repositories' `main` branches. It does not select useful commits from feature branches or resolve conflicting app implementations.
3. The root Android `MainActivity.java` extends Capacitor `BridgeActivity`; the native Compose `ConsolidatedApp.kt` is not wired into that entry point.
4. `ConsolidatedApp.kt` seeds invented metrics, sample conversations, fake health/fingerprint values, a pretend API-active log, and repository operations that mostly wait and mutate local state. These must not be presented as real diagnostics, AI, or backend operations.
5. The latest inspected target main-branch APK run (2026-10-06) failed before compilation because Android SDK setup requested the obsolete package `tools`. The latest main-branch full audit also failed. No current green APK build or installed-device verification was established by this audit.

## Transfer direction (provisional, not yet performed)

- Start with the working native Compose/AI/swarm implementation from `MandelaMatrixOS`, including its branch-specific honest-startup and server-requirements work.
- Compare each candidate feature against the actual target React/Capacitor app and the native sources; keep one canonical implementation per capability.
- Keep real API/network calls and honest failure states. Replace or exclude demo-only modules rather than merging them as functional code.
- Retain the target's genuinely useful app-builder/editor capabilities only where code inspection confirms they work; test generated project/APK output end to end.
- Add provenance notes mapping every transferred feature to source repository, branch, commit SHA, and target path.
- Rebuild and test the consolidated APK before any source repository is considered disposable.

## Verification gate before cleanup

- [ ] Feature-by-feature source/branch audit completed.
- [ ] Useful source code transferred, with provenance recorded.
- [ ] Conflicts, duplicate packages, placeholders, fake metrics and nonfunctional controls resolved.
- [ ] Android SDK/Gradle workflow repaired and APK produced.
- [ ] Unit/lint/build checks pass.
- [ ] APK installed and exercised on a physical Android device; key navigation, AI provider, Swarm Builder, builder/backend health, and failure states checked.
- [ ] Standalone Swarm Builder path remains documented and usable.
- [ ] Release APK link and checksum/provenance verified.
- [ ] Only then review the exact source repositories for archival/deletion.

**Current outcome:** audit findings recorded; feature transfer, green build, physical-device verification, and repository deletion are still pending.
