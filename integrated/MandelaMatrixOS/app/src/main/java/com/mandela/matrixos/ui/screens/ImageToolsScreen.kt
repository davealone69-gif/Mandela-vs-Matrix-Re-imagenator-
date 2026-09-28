package com.mandela.matrixos.ui.screens

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Image
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.delay
import kotlin.math.sin
import kotlin.random.Random

@Composable
fun ImageToolsScreen(modifier: Modifier = Modifier) {
    var neonGlitch by remember { mutableStateOf(true) }
    var matrixRain by remember { mutableStateOf(true) }
    var brutalNoise by remember { mutableStateOf(false) }
    var intensity by remember { mutableFloatStateOf(0.65f) }
    var tick by remember { mutableIntStateOf(0) }

    LaunchedEffect(neonGlitch, matrixRain, brutalNoise) {
        while (neonGlitch || matrixRain || brutalNoise) {
            delay(50)
            tick++
        }
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .verticalScroll(rememberScrollState())
    ) {
        Surface(tonalElevation = 2.dp, modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Image, null, tint = MaterialTheme.colorScheme.primary)
                    Spacer(Modifier.width(8.dp))
                    Text("Image Tools", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                }
                Spacer(Modifier.height(4.dp))
                Text("Cyber-brutalist graphic synthesizer", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }

        Card(
            modifier = Modifier.fillMaxWidth().padding(12.dp).height(280.dp),
            shape = RoundedCornerShape(12.dp)
        ) {
            Canvas(modifier = Modifier.fillMaxSize().background(Color(0xFF0A0A0F))) {
                val w = size.width
                val h = size.height
                val rnd = Random(tick)
                if (matrixRain) {
                    val cols = 24
                    val colW = w / cols
                    for (c in 0 until cols) {
                        val x = c * colW + colW / 2
                        val speed = 0.3f + (c % 5) * 0.15f
                        val yBase = ((tick * speed * 8) % (h + 40)) - 20
                        for (drop in 0 until 8) {
                            val y = yBase - drop * 14
                            if (y in 0f..h) {
                                val alpha = (1f - drop / 8f) * intensity
                                drawCircle(color = Color(0xFF00FF9F).copy(alpha = alpha), radius = 2.5f, center = Offset(x, y))
                            }
                        }
                    }
                }
                if (neonGlitch) {
                    for (i in 0 until 6) {
                        val y = (h / 6) * i + (sin(tick * 0.2 + i) * 8 * intensity).toFloat()
                        val shift = (sin(tick * 0.15 + i * 1.3) * 20 * intensity).toFloat()
                        drawLine(
                            color = listOf(Color(0xFFFF00E5), Color(0xFF00B8FF), Color(0xFF00FF9F))[i % 3].copy(alpha = 0.7f * intensity),
                            start = Offset(shift, y),
                            end = Offset(w + shift, y),
                            strokeWidth = 2f + intensity * 3f
                        )
                    }
                    var sy = 0f
                    while (sy < h) {
                        drawLine(color = Color.White.copy(alpha = 0.04f * intensity), start = Offset(0f, sy), end = Offset(w, sy), strokeWidth = 1f)
                        sy += 3f
                    }
                }
                if (brutalNoise) {
                    repeat((400 * intensity).toInt().coerceIn(50, 800)) {
                        val x = rnd.nextFloat() * w
                        val y = rnd.nextFloat() * h
                        drawRect(
                            color = Color.White.copy(alpha = rnd.nextFloat() * 0.5f * intensity),
                            topLeft = Offset(x, y),
                            size = androidx.compose.ui.geometry.Size(rnd.nextFloat() * 3f + 1f, rnd.nextFloat() * 3f + 1f)
                        )
                    }
                }
                drawRect(color = Color(0xFF00FF9F).copy(alpha = 0.3f), style = Stroke(width = 2f))
            }
        }

        Column(modifier = Modifier.padding(horizontal = 16.dp)) {
            Text("Filters", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
            Spacer(Modifier.height(8.dp))
            FilterToggle("NEON_GLITCH", "RGB slice shift + scanlines", neonGlitch) { neonGlitch = it }
            FilterToggle("MATRIX_RAIN", "Falling emerald code drops", matrixRain) { matrixRain = it }
            FilterToggle("BRUTAL_NOISE", "High-density static grain", brutalNoise) { brutalNoise = it }
            Spacer(Modifier.height(12.dp))
            Text("Intensity ${(intensity * 100).toInt()}%", style = MaterialTheme.typography.labelLarge)
            Slider(value = intensity, onValueChange = { intensity = it }, valueRange = 0.1f..1f)
            Spacer(Modifier.height(24.dp))
        }
    }
}

@Composable
private fun FilterToggle(name: String, desc: String, checked: Boolean, onChecked: (Boolean) -> Unit) {
    Card(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp), shape = RoundedCornerShape(10.dp)) {
        Row(modifier = Modifier.fillMaxWidth().padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
            Column(modifier = Modifier.weight(1f)) {
                Text(name, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
                Text(desc, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            Switch(checked = checked, onCheckedChange = onChecked)
        }
    }
}
