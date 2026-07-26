# Deep Repair Status — do not mix identities

## Host shell (Capacitor / Android wrapper) — v1A
| Field | Value |
|-------|-------|
| appId | `com.mandelamatrix.reimaginator` |
| appName | `Re-Imaginator 1A` |
| versionName | `1A` |
| MainActivity | `android/.../com/mandelamatrix/reimaginator/MainActivity.java` |

## Factory-generated apps (separate)
| Field | Value |
|-------|-------|
| package | `com.example.aiapp` |
| Compose BOM | `2024.06.00` |
| compileSdk / targetSdk | `36` |
| kotlinCompilerExtensionVersion | `1.5.14` |

Templates live in `src/templates.ts` (repaired).

## Security
- Live GitHub PATs removed from `jobs_db.json` → `[REDACTED]`
- **Rotate** any token that was previously committed (assume compromised).

## Remaining (run locally)
```bash
node scripts/repair_factory_server_bom.cjs
```
This rewrites **factory** strings inside `server.ts` only:
- `com.drivelog` → `com.example.aiapp`
- Compose BOM / SDK modernization
Does **not** touch Capacitor host identity.

### Manual UI leftovers (optional)
- `src/App.tsx` — a few string paths still mention `com.drivelog` (workspace paths / toasts)
- `src/components/CyberCrossTechDashboard.tsx` — label `com.drivelog.ai` → should read `com.mandelamatrix.reimaginator`

## Commits in this repair stream
1. v1A host rename (Capacitor + Android)
2. deep-repair-1 templates + jobs_db + repair script
3. deep-repair-2 IntegritySweepDialog host namespace
4. this status file
