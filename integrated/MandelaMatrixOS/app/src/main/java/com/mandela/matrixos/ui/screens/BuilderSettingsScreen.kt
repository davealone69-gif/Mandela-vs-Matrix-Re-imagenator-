package com.mandela.matrixos.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Terminal
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.Switch
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.mandela.matrixos.data.BuilderBackend
import com.mandela.matrixos.data.TermuxLauncher
import kotlinx.coroutines.launch

@Composable
fun BuilderSettingsScreen(modifier: Modifier = Modifier) {
    val context = LocalContext.current
    val prefs = remember { context.getSharedPreferences("builder_settings", 0) }
    var url by remember { mutableStateOf(prefs.getString("url", "http://127.0.0.1:3000") ?: "http://127.0.0.1:3000") }
    var command by remember { mutableStateOf(prefs.getString("command", TermuxLauncher.DEFAULT_COMMAND) ?: TermuxLauncher.DEFAULT_COMMAND) }
    var autoStart by remember { mutableStateOf(prefs.getBoolean("auto_start", true)) }
    var status by remember { mutableStateOf("Not checked") }
    val scope = rememberCoroutineScope()

    Column(modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("LOCAL BUILDER", style = MaterialTheme.typography.titleLarge)
        Text("Termux + local HTTP builder", color = MaterialTheme.colorScheme.onSurfaceVariant)
        OutlinedTextField(url, { url = it; prefs.edit().putString("url", it).apply() }, Modifier.fillMaxWidth(), label = { Text("Builder API URL") }, singleLine = true)
        OutlinedTextField(command, { command = it; prefs.edit().putString("command", it).apply() }, Modifier.fillMaxWidth(), label = { Text("Termux launch command") }, minLines = 2)
        Card(Modifier.fillMaxWidth()) {
            Row(Modifier.fillMaxWidth().padding(12.dp), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.SpaceBetween) {
                Column(Modifier.weight(1f)) {
                    Text("Auto-start backend")
                    Text("Launch Termux when the local builder is unreachable.", style = MaterialTheme.typography.bodySmall)
                }
                Switch(autoStart, { autoStart = it; prefs.edit().putBoolean("auto_start", it).apply() })
            }
        }
        Text("Status: $status", style = MaterialTheme.typography.bodyMedium)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = { scope.launch { status = "Checking…"; val r = BuilderBackend.health(url); status = if (r.ok) "ONLINE: ${r.message}" else "OFFLINE: ${r.message}" } }) {
                Icon(Icons.Default.Refresh, null); Text("  Check Backend")
            }
            Button(onClick = { status = TermuxLauncher.launch(context, command).message }) {
                Icon(Icons.Default.Terminal, null); Text("  Launch Termux")
            }
        }
        Text("Termux installed: ${if (TermuxLauncher.isInstalled(context)) "YES" else "NO"}", style = MaterialTheme.typography.bodySmall)
        Text("The app only marks the builder online after a real /health response.", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}
