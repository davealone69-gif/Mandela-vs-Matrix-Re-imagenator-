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
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Psychology
import androidx.compose.material.icons.filled.Save
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import com.mandela.matrixos.data.AiSettings
import com.mandela.matrixos.data.ChatMessage
import com.mandela.matrixos.data.FreeModels
import com.mandela.matrixos.data.LlmClient
import com.mandela.matrixos.data.LlmProvider
import kotlinx.coroutines.launch

/**
 * Free AI hub: pick a provider, paste a free-tier key (stored encrypted),
 * and chat. This is the same pipeline the other tabs use.
 */
@Composable
fun FreeAiScreen(modifier: Modifier = Modifier) {
    val context = LocalContext.current
    var config by remember { mutableStateOf(AiSettings.load(context)) }
    var keyVisible by remember { mutableStateOf(false) }
    var savedFlash by remember { mutableStateOf(false) }

    var input by remember { mutableStateOf("") }
    var messages by remember { mutableStateOf(listOf<ChatMessage>()) }
    var loading by remember { mutableStateOf(false) }
    val listState = rememberLazyListState()
    val scope = rememberCoroutineScope()

    LaunchedEffect(messages.size) {
        if (messages.isNotEmpty()) listState.animateScrollToItem(messages.size - 1)
    }

    fun send() {
        val t = input.trim()
        if (t.isEmpty() || loading) return
        if (!config.usable) {
            messages = messages + ChatMessage(
                role = "assistant",
                content = "Add your ${config.provider.displayName} key above and tap Save, then ask again."
            )
            return
        }
        messages = messages + ChatMessage(role = "user", content = t)
        input = ""
        loading = true
        scope.launch {
            val result = LlmClient.chat(
                config = LlmClient.Config(
                    apiKey = config.apiKey,
                    provider = config.provider,
                    baseUrl = config.baseUrl,
                    model = config.model
                ),
                systemPrompt = "You are the Free AI assistant inside Mandela Matrix OS. Be concise and practical.",
                userMessage = t,
                history = messages
            )
            result
                .onSuccess { messages = messages + ChatMessage(role = "assistant", content = it) }
                .onFailure { messages = messages + ChatMessage(role = "assistant", content = "⚠ ${it.message}") }
            loading = false
        }
    }

    LazyColumn(
        state = listState,
        modifier = modifier.fillMaxSize().background(MaterialTheme.colorScheme.background).padding(horizontal = 12.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
        contentPadding = PaddingValues(vertical = 12.dp)
    ) {
        item {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Psychology, null, tint = MaterialTheme.colorScheme.primary)
                Spacer(Modifier.width(8.dp))
                Text("Free AI", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            }
            Text(
                "Bring your own free key — stored encrypted on-device, never uploaded.",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        // ── provider chips ──
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                LlmProvider.entries.forEach { p ->
                    val short = when (p) {
                        LlmProvider.GEMINI -> "Gemini"
                        LlmProvider.GROQ -> "Groq"
                        LlmProvider.OPENROUTER -> "OpenRtr"
                        LlmProvider.OPENAI_COMPAT_LOCAL -> "Local"
                    }
                    FilterChip(
                        selected = config.provider == p,
                        onClick = { config = config.copy(provider = p, baseUrl = p.baseUrl, model = p.defaultModel) },
                        label = { Text(short, style = MaterialTheme.typography.labelSmall) },
                        leadingIcon = if (config.provider == p) {
                            { Icon(Icons.Default.CheckCircle, null, modifier = Modifier.size(16.dp)) }
                        } else null
                    )
                }
            }
            Text(
                config.provider.displayName + " • default model " + config.provider.defaultModel,
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        // ── key field ──
        if (config.provider.needsKey) {
            item {
                OutlinedTextField(
                    value = config.apiKey,
                    onValueChange = { config = config.copy(apiKey = it) },
                    modifier = Modifier.fillMaxWidth(),
                    label = { Text("API key (${config.provider.displayName})") },
                    singleLine = true,
                    visualTransformation = if (keyVisible) VisualTransformation.None else PasswordVisualTransformation(),
                    trailingIcon = {
                        IconButton(onClick = { keyVisible = !keyVisible }) {
                            Icon(if (keyVisible) Icons.Default.VisibilityOff else Icons.Default.Visibility, "toggle key visibility")
                        }
                    }
                )
            }
        } else {
            item {
                OutlinedTextField(
                    value = config.baseUrl,
                    onValueChange = { config = config.copy(baseUrl = it) },
                    modifier = Modifier.fillMaxWidth(),
                    label = { Text("Base URL (OpenAI-compatible, loopback only)") },
                    singleLine = true
                )
            }
        }

        // ── model + save ──
        item {
            Row(verticalAlignment = Alignment.CenterVertically) {
                OutlinedTextField(
                    value = config.model,
                    onValueChange = { config = config.copy(model = it) },
                    modifier = Modifier.weight(1f),
                    label = { Text("Model") },
                    singleLine = true
                )
                Spacer(Modifier.width(8.dp))
                FilledIconButton(onClick = {
                    AiSettings.save(context, config)
                    savedFlash = true
                }) {
                    Icon(Icons.Default.Save, contentDescription = "Save settings")
                }
            }
            if (savedFlash) {
                LaunchedEffect(Unit) { kotlinx.coroutines.delay(1800); savedFlash = false }
                Text("Saved (encrypted) ✓", color = MaterialTheme.colorScheme.primary, style = MaterialTheme.typography.labelSmall)
            }
        }

        // ── model catalog hint ──
        item {
            Text(
                "Free catalog: " + FreeModels.list.joinToString(" • ") { it.id },
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            HorizontalDivider(Modifier.padding(vertical = 4.dp))
        }

        // ── chat ──
        if (messages.isEmpty()) {
            item {
                Box(Modifier.fillMaxWidth().padding(top = 24.dp), contentAlignment = Alignment.Center) {
                    Text(
                        if (config.usable) "Ask anything — live ${config.provider.displayName}."
                        else "Configure a key above to go live.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
        items(messages, key = { it.id + it.timestamp }) { msg ->
            val isUser = msg.role == "user"
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = if (isUser) Arrangement.End else Arrangement.Start) {
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = if (isUser) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surfaceVariant,
                    modifier = Modifier.widthIn(max = 320.dp)
                ) {
                    Text(msg.content, modifier = Modifier.padding(12.dp), style = MaterialTheme.typography.bodyMedium)
                }
            }
        }
        if (loading) {
            item {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    CircularProgressIndicator(Modifier.size(16.dp), strokeWidth = 2.dp)
                    Spacer(Modifier.width(8.dp))
                    Text("Thinking…", style = MaterialTheme.typography.bodySmall)
                }
            }
        }

        // ── input row ──
        item {
            Surface(tonalElevation = 3.dp, shape = RoundedCornerShape(20.dp)) {
                Row(modifier = Modifier.fillMaxWidth().padding(6.dp), verticalAlignment = Alignment.Bottom) {
                    OutlinedTextField(
                        value = input,
                        onValueChange = { input = it },
                        modifier = Modifier.weight(1f),
                        placeholder = { Text("Message…") },
                        maxLines = 4,
                        keyboardOptions = KeyboardOptions(imeAction = ImeAction.Send),
                        keyboardActions = KeyboardActions(onSend = { send() })
                    )
                    Spacer(Modifier.width(6.dp))
                    FilledIconButton(onClick = { send() }, enabled = input.isNotBlank() && !loading) {
                        Icon(Icons.AutoMirrored.Filled.Send, contentDescription = "Send")
                    }
                }
            }
        }
    }
}
