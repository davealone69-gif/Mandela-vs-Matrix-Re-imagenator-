package com.mandela.matrixos.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.School
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.mandela.matrixos.data.BuildScore
import com.mandela.matrixos.data.BuildTrajectory
import com.mandela.matrixos.data.SkillEntry
import com.mandela.matrixos.data.TrainingData

/**
 * Training Centre: build trajectories (what the swarm tried, how it scored)
 * and the distilled skill library whose prompt snippets can condition future runs.
 */
@Composable
fun TrainingCentreScreen(modifier: Modifier = Modifier) {
    var tab by remember { mutableStateOf(0) }
    val clipboard = LocalClipboardManager.current
    var copiedFlash by remember { mutableStateOf<String?>(null) }

    Column(modifier = modifier.fillMaxSize().background(MaterialTheme.colorScheme.background)) {
        Surface(tonalElevation = 2.dp, modifier = Modifier.fillMaxWidth()) {
            Column(Modifier.padding(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.School, null, tint = MaterialTheme.colorScheme.primary)
                    Spacer(Modifier.width(8.dp))
                    Text("Training Centre", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                }
                Spacer(Modifier.height(8.dp))
                TabRow(selectedTabIndex = tab) {
                    Tab(selected = tab == 0, onClick = { tab = 0 }, text = { Text("Trajectories") })
                    Tab(selected = tab == 1, onClick = { tab = 1 }, text = { Text("Skills (${TrainingData.sampleSkills.size})") })
                }
            }
        }

        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(horizontal = 12.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
            contentPadding = PaddingValues(vertical = 12.dp)
        ) {
            if (tab == 0) {
                items(TrainingData.sampleTrajectories, key = { it.id }) { t: BuildTrajectory ->
                    TrajectoryCard(t)
                }
            } else {
                items(TrainingData.sampleSkills, key = { it.id }) { s: SkillEntry ->
                    Surface(shape = RoundedCornerShape(12.dp), tonalElevation = 1.dp) {
                        Column(Modifier.padding(12.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(s.title, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold, modifier = Modifier.weight(1f))
                                Spacer(Modifier.width(4.dp))
                                Text("×${s.timesApplied} used", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                IconButton(onClick = {
                                    clipboard.setText(AnnotatedString(s.promptSnippet))
                                    copiedFlash = s.id
                                }) {
                                    Icon(Icons.Default.ContentCopy, contentDescription = "Copy prompt snippet", modifier = Modifier.size(18.dp))
                                }
                            }
                            Text(s.description, style = MaterialTheme.typography.bodySmall)
                            Spacer(Modifier.height(6.dp))
                            Surface(shape = RoundedCornerShape(8.dp), color = MaterialTheme.colorScheme.surfaceVariant) {
                                Text(
                                    s.promptSnippet,
                                    modifier = Modifier.padding(8.dp),
                                    style = MaterialTheme.typography.labelSmall,
                                    fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                                )
                            }
                            if (copiedFlash == s.id) {
                                LaunchedEffect(s.id) { kotlinx.coroutines.delay(1500); copiedFlash = null }
                                Text("Copied ✓", color = MaterialTheme.colorScheme.primary, style = MaterialTheme.typography.labelSmall)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun TrajectoryCard(t: BuildTrajectory) {
    var expanded by remember { mutableStateOf(false) }
    val badge = when (t.score) {
        BuildScore.SUCCESS -> "SUCCESS" to MaterialTheme.colorScheme.primary
        BuildScore.PARTIAL -> "PARTIAL" to MaterialTheme.colorScheme.tertiary
        BuildScore.FAIL -> "FAIL" to MaterialTheme.colorScheme.error
    }
    Surface(
        shape = RoundedCornerShape(12.dp),
        tonalElevation = 1.dp,
        modifier = Modifier
            .fillMaxWidth()
            .clickable { expanded = !expanded }
    ) {
        Column(Modifier.padding(12.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(t.task, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold, modifier = Modifier.weight(1f))
                Spacer(Modifier.width(8.dp))
                Surface(shape = RoundedCornerShape(8.dp), color = badge.second.copy(alpha = 0.15f)) {
                    Text(badge.first, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp), style = MaterialTheme.typography.labelSmall, color = badge.second)
                }
            }
            Text(
                "${t.agentRoles.joinToString(" → ")} • quality ${t.quality}/100",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            if (expanded) {
                Spacer(Modifier.height(6.dp))
                t.steps.forEachIndexed { i, step ->
                    Text("${i + 1}. $step", style = MaterialTheme.typography.bodySmall)
                }
                if (t.notes.isNotBlank()) {
                    Spacer(Modifier.height(4.dp))
                    Text("Note: ${t.notes}", style = MaterialTheme.typography.bodySmall, fontStyle = androidx.compose.ui.text.font.FontStyle.Italic)
                }
            }
        }
    }
}
