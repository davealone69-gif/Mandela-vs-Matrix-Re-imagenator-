package com.mandela.matrixos.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.Stop
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import com.mandela.matrixos.data.AiSettings
import com.mandela.matrixos.data.ChatMessage
import com.mandela.matrixos.data.LlmClient
import com.mandela.matrixos.data.SwarmDefaults
import com.mandela.matrixos.data.SwarmMessage
import com.mandela.matrixos.data.SwarmTopology
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch

/**
 * Swarm Builder: run the default agent roster (Planner → Coder → Critic) against
 * a task. v1 executes the chosen topology as an honest SEQUENTIAL chain — each
 * agent sees the upstream output. Parallel/debate topologies arrive in a later
 * phase; the selector is already wired into the run log.
 */
@Composable
fun SwarmBuilderScreen(modifier: Modifier = Modifier) {
    val context = LocalContext.current
    var topology by remember { mutableStateOf(SwarmTopology.SEQUENTIAL) }
    var task by remember { mutableStateOf("") }
    var feed by remember { mutableStateOf(listOf<SwarmMessage>()) }
    var running by remember { mutableStateOf(false) }
    var runJob by remember { mutableStateOf<Job?>(null) }
    val listState = rememberLazyListState()
    val scope = rememberCoroutineScope()

    LaunchedEffect(feed.size) {
        if (feed.isNotEmpty()) listState.animateScrollToItem(feed.size - 1)
    }

    fun say(agentName: String, role: String, content: String) {
        feed = feed + SwarmMessage(agentName = agentName, role = role, content = content)
    }

    fun run() {
        val t = task.trim()
        if (t.isEmpty() || running) return
        val ai = AiSettings.load(context)
        if (ai.provider.needsKey && ai.apiKey.isBlank()) {
            say("System", "system", "No ${ai.provider.displayName} key configured — set one up on the FreeAI tab first.")
            return
        }
        val cfg = LlmClient.Config(apiKey = ai.apiKey, provider = ai.provider, baseUrl = ai.baseUrl, model = ai.model)
        running = true
        feed = emptyList()
        say("System", "system", "Swarm online — topology $topology, executing sequentially (v1). Task: $t")

        runJob = scope.launch {
            var plan = ""
            var code = ""
            for ((index, agent) in SwarmDefaults.defaultAgents.withIndex()) {
                say(agent.name, "system", "⏳ ${agent.role} thinking…")
                val upstream = when (agent.role) {
                    "Planner" -> "Task:\n$t"
                    "Coder" -> "Task:\n$t\n\nPlan from Planner:\n$plan"
                    else -> "Task:\n$t\n\nPlan:\n$plan\n\nDraft code from Coder:\n$code"
                }
                val result = LlmClient.chat(
                    config = cfg,
                    systemPrompt = agent.systemPrompt,
                    userMessage = upstream,
                    history = emptyList()
                )
                result
                    .onSuccess { reply ->
                        when (agent.role) {
                            "Planner" -> plan = reply
                            "Coder" -> code = reply
                        }
                        say(agent.name, "assistant", reply.take(6000))
                    }
                    .onFailure { e ->
                        say(agent.name, "system", "⚠ ${agent.role} failed: ${e.message}")
                        say("System", "system", "Run aborted at ${agent.role}.")
                        running = false
                        return@launch
                    }
                if (index < SwarmDefaults.defaultAgents.size - 1) {
                    say("System", "system", "── handoff → ${SwarmDefaults.defaultAgents[index + 1].name} ──")
                }
            }
            say("System", "system", "✅ Swarm run complete — Planner, Coder and Critic all responded.")
            running = false
        }
    }

    Column(modifier = modifier.fillMaxSize().background(MaterialTheme.colorScheme.background)) {
        Surface(tonalElevation = 2.dp, modifier = Modifier.fillMaxWidth()) {
            Column(Modifier.padding(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Build, null, tint = MaterialTheme.colorScheme.primary)
                    Spacer(Modifier.width(8.dp))
                    Text("Swarm Builder", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                }
                Spacer(Modifier.height(4.dp))
                Text(
                    "${SwarmDefaults.defaultAgents.joinToString(" → ") { it.name }} via your FreeAI provider",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    SwarmTopology.entries.take(3).forEach { topo ->
                        FilterChip(
                            selected = topology == topo,
                            onClick = { if (!running) topology = topo },
                            label = { Text(topo.name.lowercase().replaceFirstChar { it.uppercase() }, style = MaterialTheme.typography.labelSmall) }
                        )
                    }
                }
            }
        }

        LazyColumn(
            state = listState,
            modifier = Modifier.weight(1f).fillMaxWidth().padding(horizontal = 12.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
            contentPadding = PaddingValues(vertical = 12.dp)
        ) {
            if (feed.isEmpty()) {
                item {
                    Box(Modifier.fillMaxWidth().padding(top = 40.dp), contentAlignment = Alignment.Center) {
                        Text(
                            "Give the swarm a build task.\nExample: \"Compose screen with a settings list and dark toggle\"",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
            items(feed, key = { it.id }) { msg ->
                val isSystem = msg.role == "system"
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = if (isSystem) MaterialTheme.colorScheme.surfaceVariant else MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(Modifier.padding(10.dp)) {
                        Text(
                            msg.agentName,
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = if (isSystem) MaterialTheme.colorScheme.onSurfaceVariant else MaterialTheme.colorScheme.primary
                        )
                        if (!isSystem) Spacer(Modifier.height(2.dp))
                        Text(msg.content, style = if (isSystem) MaterialTheme.typography.bodySmall else MaterialTheme.typography.bodyMedium)
                    }
                }
            }
        }

        Surface(tonalElevation = 3.dp) {
            Row(modifier = Modifier.fillMaxWidth().padding(8.dp), verticalAlignment = Alignment.Bottom) {
                OutlinedTextField(
                    value = task,
                    onValueChange = { task = it },
                    modifier = Modifier.weight(1f),
                    placeholder = { Text("Swarm task…") },
                    maxLines = 3,
                    enabled = !running,
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Send)
                )
                Spacer(Modifier.width(8.dp))
                if (running) {
                    FilledIconButton(onClick = {
                        runJob?.cancel()
                        running = false
                        say("System", "system", "Run cancelled by user.")
                    }) {
                        Icon(Icons.Default.Stop, contentDescription = "Stop run")
                    }
                } else {
                    FilledIconButton(onClick = { run() }, enabled = task.isNotBlank()) {
                        Icon(Icons.AutoMirrored.Filled.Send, contentDescription = "Run swarm")
                    }
                }
            }
        }
    }
}
