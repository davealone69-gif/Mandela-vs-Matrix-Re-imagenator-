package com.mandela.matrixos.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import kotlin.math.roundToInt

data class AxisScore(val name: String, val description: String, var value: Float)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EvaluateorScreen(modifier: Modifier = Modifier) {
    var axes by remember {
        mutableStateOf(
            listOf(
                AxisScore("Stability", "Crash rate, state consistency, recovery", 0.72f),
                AxisScore("Performance", "Frame time, memory, startup speed", 0.65f),
                AxisScore("UX Impact", "Clarity, flow, accessibility", 0.80f),
                AxisScore("Identity Alignment", "Theme, Mandela/Matrix aesthetic fit", 0.70f),
                AxisScore("Security Risk", "Permissions, data exposure (higher = safer)", 0.75f)
            )
        )
    }
    val consensus = axes.map { it.value }.average().toFloat()
    val consensusPercent = (consensus * 100).roundToInt()
    val consensusColor = when {
        consensusPercent >= 90 -> Color(0xFF00C853)
        consensusPercent >= 70 -> Color(0xFFFFAB00)
        else -> Color(0xFFFF5252)
    }

    Column(modifier = modifier.fillMaxSize().background(MaterialTheme.colorScheme.background)) {
        Surface(tonalElevation = 2.dp, modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Tune, null, tint = MaterialTheme.colorScheme.primary)
                    Spacer(Modifier.width(8.dp))
                    Text("Evaluateor", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                }
                Text("5-axis scoring matrix - live consensus", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
        Column(
            modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Card(modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(16.dp)) {
                Column(modifier = Modifier.fillMaxWidth().padding(20.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("CONSENSUS", style = MaterialTheme.typography.labelMedium)
                    Text("$consensusPercent", style = MaterialTheme.typography.displayMedium, fontWeight = FontWeight.Bold, color = consensusColor)
                    Text(if (consensusPercent >= 90) "PASS (90+)" else "BELOW THRESHOLD", color = consensusColor)
                    Spacer(Modifier.height(8.dp))
                    LinearProgressIndicator(progress = { consensus }, modifier = Modifier.fillMaxWidth().height(8.dp), color = consensusColor)
                    Spacer(Modifier.height(12.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        TextButton(onClick = {
                            axes = axes.map { it.copy(value = 0.5f) }
                        }) { Text("Reset") }
                        FilledTonalButton(onClick = {
                            axes = axes.map { it.copy(value = (it.value + 0.1f).coerceAtMost(1f)) }
                        }) { Text("Boost") }
                    }
                }
            }
            axes.forEachIndexed { index, axis ->
                Card(modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(12.dp)) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(axis.name, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
                                Text(axis.description, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                            Text("${(axis.value * 100).roundToInt()}", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                        }
                        Slider(
                            value = axis.value,
                            onValueChange = { v ->
                                axes = axes.toMutableList().also { it[index] = axis.copy(value = v) }
                            },
                            valueRange = 0f..1f
                        )
                    }
                }
            }
        }
    }
}
