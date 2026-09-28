package com.mandela.matrixos.data

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager

object TermuxLauncher {
    const val DEFAULT_COMMAND = "cd ~/mandela-builder && ./start.sh"
    private const val TERMUX_PACKAGE = "com.termux"

    data class LaunchResult(val launched: Boolean, val message: String)

    fun isInstalled(context: Context): Boolean = try {
        context.packageManager.getPackageInfo(TERMUX_PACKAGE, 0)
        true
    } catch (_: PackageManager.NameNotFoundException) { false }

    fun launch(context: Context, command: String = DEFAULT_COMMAND): LaunchResult {
        if (!isInstalled(context)) return LaunchResult(false, "Termux is not installed.")
        val service = Intent().apply {
            setClassName(TERMUX_PACKAGE, "com.termux.app.RunCommandService")
            putExtra("com.termux.RUN_COMMAND_PATH", "/data/data/com.termux/files/usr/bin/bash")
            putExtra("com.termux.RUN_COMMAND_ARGUMENTS", arrayOf("-lc", command))
            putExtra("com.termux.RUN_COMMAND_BACKGROUND", true)
            putExtra("com.termux.RUN_COMMAND_WORKDIR", "/data/data/com.termux/files/home")
        }
        return runCatching {
            context.startService(service)
            LaunchResult(true, "Termux builder command launched.")
        }.recoverCatching {
            val launch = context.packageManager.getLaunchIntentForPackage(TERMUX_PACKAGE)
                ?: return@recoverCatching LaunchResult(false, "Termux launch activity unavailable.")
            context.startActivity(launch)
            LaunchResult(true, "Termux opened. Run the configured builder command there.")
        }.getOrElse { LaunchResult(false, "Termux launch failed: ${it.message ?: "permission denied"}.") }
    }
}
