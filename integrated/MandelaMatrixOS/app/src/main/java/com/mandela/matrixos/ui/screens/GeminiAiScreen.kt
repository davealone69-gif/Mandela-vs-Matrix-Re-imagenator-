package com.mandela.matrixos.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import com.mandela.matrixos.data.AiSettings
import com.mandela.matrixos.data.ChatMessage
import com.mandela.matrixos.data.LlmClient
import kotlinx.coroutines.launch

data class GeminiMsg(val id: String = System.currentTimeMillis().toString() + (0..99).random(), val role: String, val text: String)

@Composable
fun GeminiAiScreen(modifier: Modifier = Modifier) {
    val context = androidx.compose.ui.platform.LocalContext.current
    var input by remember { mutableStateOf("") }
    var messages by remember { mutableStateOf(listOf<GeminiMsg>()) }
    var loading by remember { mutableStateOf(false) }
    val listState = rememberLazyListState()
    val scope = rememberCoroutineScope()

    LaunchedEffect(messages.size) {
        if (messages.isNotEmpty()) listState.animateScrollToItem(messages.size - 1)
    }

    fun send() {
        val t = input.trim()
        if (t.isEmpty() || loading) return
        val ai = AiSettings.load(context)
        messages = messages + GeminiMsg(role = "user", text = t)
        input = ""
        if (ai.provider.needsKey && ai.apiKey.isBlank()) {
            messages = messages + GeminiMsg(
                role = "assistant",
                text = "No ${ai.provider.displayName} key configured.\nOpen the FreeAI tab, paste a free key, tap Save — then ask me again."
            )
            return
        }
        loading = true
        scope.launch {
            val result = LlmClient.chat(
                config = LlmClient.Config(
                    apiKey = ai.apiKey,
                    provider = ai.provider,
                    baseUrl = ai.baseUrl,
                    model = ai.model
                ),
                systemPrompt = "You are the Gemini matrix-synthesis agent of Mandela Matrix OS. " +
                    "Answer with structured, concise synthesis: key insight first, then details. " +
                    "Be technical but clear.",
                userMessage = t,
                history = messages.map { ChatMessage(role = it.role, content = it.text) }
            )
            result
                .onSuccess { reply -> messages = messages + GeminiMsg(role = "assistant", text = reply) }
                .onFailure { e -> messages = messages + GeminiMsg(role = "assistant", text = "⚠ ${e.message}") }
            loading = false
        }
    }

    Column(modifier = modifier.fillMaxSize().background(MaterialTheme.colorScheme.background)) {
        Surface(tonalElevation = 2.dp, modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.AutoAwesome, null, tint = MaterialTheme.colorScheme.primary)
                    Spacer(Modifier.width(8.dp))
                    Text("Gemini AI", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                }
                Spacer(Modifier.height(4.dp))
                Text("Matrix synthesis prompt", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
        LazyColumn(
            state = listState,
            modifier = Modifier.weight(1f).fillMaxWidth().padding(horizontal = 12.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
            contentPadding = PaddingValues(vertical = 12.dp)
        ) {
            if (messages.isEmpty()) {
                item {
                    Box(Modifier.fillMaxWidth().padding(top = 48.dp), contentAlignment = Alignment.Center) {
                        Text("Prompt Gemini for matrix synthesis.", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            }
            items(messages, key = { it.id }) { msg ->
                val isUser = msg.role == "user"
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = if (isUser) Arrangement.End else Arrangement.Start) {
                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = if (isUser) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surfaceVariant,
                        modifier = Modifier.widthIn(max = 320.dp)
                    ) {
                        Text(msg.text, modifier = Modifier.padding(12.dp), style = MaterialTheme.typography.bodyMedium)
                    }
                }
            }
            if (loading) {
                item {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        CircularProgressIndicator(Modifier.size(16.dp), strokeWidth = 2.dp)
                        Spacer(Modifier.width(8.dp))
                        Text("Synthesizing...", style = MaterialTheme.typography.bodySmall)
                    }
                }
            }
        }
        Surface(tonalElevation = 3.dp) {
            Row(modifier = Modifier.fillMaxWidth().padding(8.dp), verticalAlignment = Alignment.Bottom) {
                OutlinedTextField(
                    value = input,
                    onValueChange = { input = it },
                    modifier = Modifier.weight(1f),
                    placeholder = { Text("Matrix synthesis prompt...") },
                    maxLines = 4,
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Send),
                    keyboardActions = KeyboardActions(onSend = { send() })
                )
                Spacer(Modifier.width(8.dp))
                FilledIconButton(onClick = { send() }, enabled = input.isNotBlank() && !loading) {
                    Icon(Icons.AutoMirrored.Filled.Send, contentDescription = "Send")
                }
            }
        }
    }
}
