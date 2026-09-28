package com.mandela.matrixos.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Terminal
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.mandela.matrixos.data.BuilderBackend
import com.mandela.matrixos.data.TermuxLauncher
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun RealApkBuilderScreen(modifier: Modifier = Modifier) {
    val context = LocalContext.current
    val prefs = remember { context.getSharedPreferences("builder_settings", 0) }
    var url by remember { mutableStateOf(prefs.getString("url", "http://127.0.0.1:3000") ?: "http://127.0.0.1:3000") }
    var command by remember { mutableStateOf(prefs.getString("command", TermuxLauncher.DEFAULT_COMMAND) ?: TermuxLauncher.DEFAULT_COMMAND) }
    var task by remember { mutableStateOf("") }
    var project by remember { mutableStateOf("") }
    var status by remember { mutableStateOf("READY") }
    var log by remember { mutableStateOf("Zero-trust builder: no success is reported without a verified artifact URL.") }
    var busy by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    fun append(text: String) { log = "$log\n$text" }
    fun start() {
        if (busy || task.isBlank() || project.isBlank()) return
        busy = true
        scope.launch {
            var health = BuilderBackend.health(url)
            if (!health.ok) {
                status = "STARTING TERMUX"
                append("Backend unreachable: ${health.message}")
                val launch = TermuxLauncher.launch(context, command)
                append(launch.message)
                if (!launch.launched) { status = "OFFLINE"; busy = false; return@launch }
                repeat(30) {
                    delay(1000)
                    health = BuilderBackend.health(url)
                    if (health.ok) return@repeat
                }
            }
            if (!health.ok) { status = "OFFLINE"; append("Backend did not become reachable. No build claimed."); busy = false; return@launch }
            status = "BUILDING"
            append("Backend health verified. Submitting /build/apk…")
            val request = BuilderBackend.buildApk(url, task.trim(), project)
            if (!request.ok) { status = "FAILED"; append("Build request failed: ${request.message}"); busy = false; return@launch }
            val result = request.buildId?.let { BuilderBackend.pollBuild(url, it) } ?: request
            if (result.ok && result.artifactUrl != null) { status = "REAL + VERIFIED"; append("APK VERIFIED: ${result.artifactUrl}") }
            else { status = "UNVERIFIED"; append("Backend did not provide a verified artifact. ${result.message}") }
            busy = false
        }
    }

    Column(modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
        Text("REAL APK BUILDER", style = MaterialTheme.typography.titleLarge)
        Text("Status: $status", style = MaterialTheme.typography.titleMedium)
        OutlinedTextField(url, { url = it; prefs.edit().putString("url", it).apply() }, Modifier.fillMaxWidth(), label = { Text("Builder API URL") }, singleLine = true)
        OutlinedTextField(command, { command = it; prefs.edit().putString("command", it).apply() }, Modifier.fillMaxWidth(), label = { Text("Termux command") })
        OutlinedTextField(task, { task = it }, Modifier.fillMaxWidth(), label = { Text("App task") }, minLines = 2)
        OutlinedTextField(project, { project = it }, Modifier.fillMaxWidth().weight(1f), label = { Text("Generated Android project / Coder output") }, minLines = 6)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            OutlinedButton(enabled = !busy, onClick = { scope.launch { status = "CHECKING"; val r = BuilderBackend.health(url); status = if (r.ok) "ONLINE" else "OFFLINE"; append(r.message) } }) { Icon(Icons.Default.Refresh, null); Text(" Check") }
            OutlinedButton(enabled = !busy, onClick = { append(TermuxLauncher.launch(context, command).message) }) { Icon(Icons.Default.Terminal, null); Text(" Termux") }
            Button(enabled = !busy && task.isNotBlank() && project.isNotBlank(), onClick = ::start) { Icon(Icons.Default.Build, null); Text(" BUILD REAL APK") }
        }
        Card(Modifier.fillMaxWidth()) { Text(log.takeLast(6000), Modifier.padding(12.dp), style = MaterialTheme.typography.bodySmall) }
    }
}
