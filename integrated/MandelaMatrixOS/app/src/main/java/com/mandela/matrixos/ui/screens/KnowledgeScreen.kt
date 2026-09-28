package com.mandela.matrixos.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.mandela.matrixos.data.KnowledgeDefaults
import com.mandela.matrixos.data.KnowledgeEntry

/**
 * Knowledge System: searchable anomaly/pattern memory with local add.
 * Seeded from [KnowledgeDefaults]; persistence (Room/DataStore) is a later phase.
 */
@Composable
fun KnowledgeScreen(modifier: Modifier = Modifier) {
    var entries by remember { mutableStateOf(KnowledgeDefaults.seed) }
    var query by remember { mutableStateOf("") }
    var showAdd by remember { mutableStateOf(false) }

    val filtered = remember(query, entries) {
        if (query.isBlank()) entries
        else entries.filter {
            it.title.contains(query, true) || it.body.contains(query, true) ||
                it.tags.any { tag -> tag.contains(query, true) }
        }
    }

    Column(modifier = modifier.fillMaxSize().background(MaterialTheme.colorScheme.background)) {
        Surface(tonalElevation = 2.dp, modifier = Modifier.fillMaxWidth()) {
            Column(Modifier.padding(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.MenuBook, null, tint = MaterialTheme.colorScheme.primary)
                    Spacer(Modifier.width(8.dp))
                    Text("Knowledge System", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                    Spacer(Modifier.weight(1f))
                    FilledTonalIconButton(onClick = { showAdd = true }) {
                        Icon(Icons.Default.Add, contentDescription = "Add entry")
                    }
                }
                Spacer(Modifier.height(4.dp))
                Text(
                    "${filtered.size} of ${entries.size} entries",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(Modifier.height(8.dp))
                OutlinedTextField(
                    value = query,
                    onValueChange = { query = it },
                    modifier = Modifier.fillMaxWidth(),
                    placeholder = { Text("Search anomalies, tags, patterns…") },
                    leadingIcon = { Icon(Icons.Default.Search, null) },
                    singleLine = true
                )
            }
        }

        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(horizontal = 12.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
            contentPadding = PaddingValues(vertical = 12.dp)
        ) {
            items(filtered, key = { it.id }) { entry ->
                Surface(shape = RoundedCornerShape(12.dp), tonalElevation = 1.dp) {
                    Column(Modifier.padding(12.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                entry.title,
                                style = MaterialTheme.typography.titleSmall,
                                fontWeight = FontWeight.SemiBold,
                                modifier = Modifier.weight(1f)
                            )
                            Spacer(Modifier.width(8.dp))
                            // Anomaly meter: color shifts with severity
                            val tone = when {
                                entry.anomalyScore >= 80 -> MaterialTheme.colorScheme.error
                                entry.anomalyScore >= 50 -> MaterialTheme.colorScheme.tertiary
                                else -> MaterialTheme.colorScheme.primary
                            }
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = tone.copy(alpha = 0.15f)
                            ) {
                                Text(
                                    "⚡ ${entry.anomalyScore}",
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                    style = MaterialTheme.typography.labelSmall,
                                    color = tone
                                )
                            }
                        }
                        Spacer(Modifier.height(4.dp))
                        Text(entry.body, style = MaterialTheme.typography.bodySmall)
                        if (entry.tags.isNotEmpty()) {
                            Spacer(Modifier.height(6.dp))
                            Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                entry.tags.take(4).forEach { tag ->
                                    SuggestionChip(onClick = { query = tag }, label = { Text("#$tag") })
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if (showAdd) {
        var title by remember { mutableStateOf("") }
        var body by remember { mutableStateOf("") }
        var tags by remember { mutableStateOf("") }
        var score by remember { mutableStateOf(50f) }
        AlertDialog(
            onDismissRequest = { showAdd = false },
            title = { Text("New knowledge entry") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(value = title, onValueChange = { title = it }, label = { Text("Title") }, singleLine = true)
                    OutlinedTextField(value = body, onValueChange = { body = it }, label = { Text("What happened / the fix") }, maxLines = 3)
                    OutlinedTextField(value = tags, onValueChange = { tags = it }, label = { Text("Tags (comma-sep)") }, singleLine = true)
                    Text("Anomaly score: ${score.toInt()}", style = MaterialTheme.typography.labelMedium)
                    Slider(value = score, onValueChange = { score = it }, valueRange = 0f..100f, steps = 9)
                }
            },
            confirmButton = {
                TextButton(
                    enabled = title.isNotBlank() && body.isNotBlank(),
                    onClick = {
                        entries = entries + KnowledgeEntry(
                            title = title.trim(),
                            body = body.trim(),
                            tags = tags.split(",").map { it.trim() }.filter { it.isNotBlank() },
                            anomalyScore = score.toInt()
                        )
                        showAdd = false
                    }
                ) { Text("Add") }
            },
            dismissButton = { TextButton(onClick = { showAdd = false }) { Text("Cancel") } }
        )
    }
}
