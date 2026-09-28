package com.mandela.matrixreimagenator.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext

private val DarkColorScheme = darkColorScheme(primary = IndigoPrimary, secondary = IndigoSecondary, tertiary = PurpleAccent, background = DarkBackground, surface = DarkSurface, onPrimary = TextLight, onSecondary = TextLight, onBackground = TextLight, onSurface = TextLight)
private val LightColorScheme = lightColorScheme(primary = IndigoPrimary, secondary = IndigoSecondary, tertiary = PurpleAccent, background = Color(0xFFF8FAFC), surface = Color(0xFFFFFFFF), onPrimary = Color.White, onSecondary = Color.White, onBackground = Color(0xFF0F172A), onSurface = Color(0xFF0F172A))

@Composable
fun AppTheme(darkTheme: Boolean = isSystemInDarkTheme(), dynamicColor: Boolean = true, content: @Composable () -> Unit) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val ctx = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(ctx) else dynamicLightColorScheme(ctx)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }
    MaterialTheme(colorScheme = colorScheme, typography = Typography, content = content)
}
