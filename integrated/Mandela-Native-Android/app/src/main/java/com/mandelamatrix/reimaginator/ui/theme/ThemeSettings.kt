package com.mandelamatrix.reimaginator.ui.theme

import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.text.font.FontFamily

enum class AppThemeMode { SYSTEM, LIGHT, DARK }

enum class AppFontFamily(val displayName: String, val family: FontFamily) {
    DEFAULT("Default", FontFamily.Default),
    SERIF("Serif", FontFamily.Serif),
    MONOSPACE("Mono", FontFamily.Monospace)
}

class AppSettings {
    val themeMode = mutableStateOf(AppThemeMode.SYSTEM)
    val fontFamily = mutableStateOf(AppFontFamily.DEFAULT)
}

val LocalAppSettings = staticCompositionLocalOf { AppSettings() }
