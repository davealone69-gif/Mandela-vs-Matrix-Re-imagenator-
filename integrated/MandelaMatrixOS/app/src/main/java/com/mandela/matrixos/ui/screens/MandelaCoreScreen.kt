package com.mandela.matrixos.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.BlurOn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

data class RealityNode(
    val id: String,
    val name: String,
    val coherence: Float,
    val glitching: Boolean = false
)

@Composable
fun MandelaCoreScreen(modifier: Modifier = Modifier) {
    var quantumGlitch by remember { mutableStateOf(false) }
    var nodes by remember {
        mutableStateOf(
            listOf(
                RealityNode("n1", "Primary Timeline", 0.94f),
                RealityNode("n2", "Memory Anchor", 0.81f),
                RealityNode("n3", "Identity Lattice", 0.76f),
                RealityNode("n4", "Echo Chamber", 0.62f),
                RealityNode("n5", "Drift Buffer", 0.88f)
            )
        )
    }
    val avgCoherence = nodes.map { it.coherence }.average().toFloat()

    Column(modifier = modifier.fillMaxSize().background(MaterialTheme.colorScheme.background)) {
        Surface(tonalElevation = 2.dp, modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.BlurOn, null, tint = MaterialTheme.colorScheme.primary)
                    Spacer(Modifier.width(8.dp))
                    Text("MandelaCore", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                }
                Spacer(Modifier.height(4.dp))
                Text(
                    "Reality matrix controller - coherence ${(avgCoherence * 100).toInt()}%",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
        Card(modifier = Modifier.fillMaxWidth().padding(12.dp), shape = RoundedCornerShape(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth().padding(16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text("Quantum Glitch", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
                    Text(
                        if (quantumGlitch) "ACTIVE" else "Stable continuum",
                        style = MaterialTheme.typography.bodySmall,
                        color = if (quantumGlitch) Color(0xFFFF5252) else MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                Switch(
                    checked = quantumGlitch,
                    onCheckedChange = { on ->
                        quantumGlitch = on
                        nodes = nodes.map { n ->
                            n.copy(
                                glitching = on,
                                coherence = if (on) (n.coherence * 0.85f).coerceAtLeast(0.2f)
                                else (n.coherence / 0.85f).coerceAtMost(1f)
                            )
                        }
                    }
                )
            }
        }
        Text("Reality Nodes", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold, modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp))
        LazyColumn(contentPadding = PaddingValues(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(nodes, key = { it.id }) { node ->
                Card(modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(10.dp)) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text(node.name, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
                            Text(
                                "${(node.coherence * 100).toInt()}%",
                                color = when {
                                    node.coherence >= 0.85f -> Color(0xFF69F0AE)
                                    node.coherence >= 0.6f -> Color(0xFFFFAB00)
                                    else -> Color(0xFFFF5252)
                                },
                                fontWeight = FontWeight.Bold
                            )
                        }
                        Spacer(Modifier.height(6.dp))
                        LinearProgressIndicator(progress = { node.coherence }, modifier = Modifier.fillMaxWidth().height(6.dp))
                        if (node.glitching) {
                            Spacer(Modifier.height(4.dp))
                            Text("GLITCHING", style = MaterialTheme.typography.labelSmall, color = Color(0xFFFF00E5))
                        }
                    }
                }
            }
        }
    }
}
