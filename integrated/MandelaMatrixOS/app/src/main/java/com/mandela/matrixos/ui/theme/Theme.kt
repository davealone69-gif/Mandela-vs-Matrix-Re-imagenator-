package com.mandela.matrixos.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFF00FF9F),
    secondary = Color(0xFF00B8FF),
    tertiary = Color(0xFFFF00E5),
    background = Color(0xFF0A0A0F),
    surface = Color(0xFF12121A)
)

private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF00C853),
    secondary = Color(0xFF0091EA),
    tertiary = Color(0xFFD500F9)
)

@Composable
fun MandelaTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
