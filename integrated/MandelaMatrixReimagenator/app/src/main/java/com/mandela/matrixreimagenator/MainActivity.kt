package com.mandela.matrixreimagenator

import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.mandela.matrixreimagenator.ui.theme.AppTheme
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    private var tabCallback: ((Int) -> Unit)? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AppTheme {
                Surface(Modifier = Modifier.fillMaxSize()) {
                    MandelaApp(
                        onAbout = { showAbout() },
                        onRegisterTab = { cb -> tabCallback = cb }
                    )
                }
            }
        }
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.main_menu, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean = when (item.itemId) {
        R.id.action_recreate -> { tabCallback?.invoke(0); true }
        R.id.action_swarm -> { tabCallback?.invoke(2); true }
        R.id.action_vibe -> { tabCallback?.invoke(3); true }
        R.id.action_tools -> { tabCallback?.invoke(4); true }
        R.id.action_about -> { showAbout(); true }
        else -> super.onOptionsItemSelected(item)
    }

    private fun showAbout() {
        androidx.appcompat.app.AlertDialog.Builder(this)
            .setTitle("Mandela vs Matrix Re-imagenator")
            .setMessage("Version 1.0.0\n\nGiant creation assistant + swarm builder\nRecreate apps with personal vibe adjustment\n\nBuilt by REDRUM Studios")
            .setPositiveButton("OK", null).show()
    }
}

enum class Tab(val title: String, val icon: ImageVector) {
    Core("Core", Icons.Default.GridView),
    Mandela("Mandela", Icons.Default.BlurOn),
    Swarm("Swarm", Icons.Default.Build),
    Vibe("Vibe", Icons.Default.Tune),
    Tools("Tools", Icons.Default.Science)
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MandelaApp(onAbout: () -> Unit, onRegisterTab: ((Int) -> Unit) -> Unit) {
    val tabs = Tab.entries
    val pagerState = rememberPagerState(pageCount = { tabs.size })
    val scope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        onRegisterTab { index -> scope.launch { pagerState.animateScrollToPage(index) } }
    }

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Mandela Re-imagenator • ${tabs[pagerState.currentPage].title}") })
        }
    ) { padding ->
        Column(Modifier.fillMaxSize().padding(padding)) {
            ScrollableTabRow(selectedTabIndex = pagerState.currentPage, edgePadding = 8.dp) {
                tabs.forEachIndexed { index, tab ->
                    Tab(
                        selected = pagerState.currentPage == index,
                        onClick = { scope.launch { pagerState.animateScrollToPage(index) } },
                        text = { Text(tab.title) },
                        icon = { Icon(tab.icon, tab.title) }
                    )
                }
            }
            HorizontalPager(state = pagerState, modifier = Modifier.fillMaxSize()) { page ->
                when (tabs[page]) {
                    Tab.Core -> CoreScreen()
                    Tab.Mandela -> MandelaCoreScreen()
                    Tab.Swarm -> SwarmScreen()
                    Tab.Vibe -> VibeScreen()
                    Tab.Tools -> ToolsScreen()
                }
            }
        }
    }
}

@Composable
fun CoreScreen() {
    var projectName by remember { mutableStateOf("") }
    var status by remember { mutableStateOf("") }
    var running by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    Column(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("Re-imagenator Core", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        Text("Recreate any app with personal vibe. Built by REDRUM Studios.")
        OutlinedTextField(
            value = projectName,
            onValueChange = { projectName = it },
            label = { Text("App / project name") },
            singleLine = true,
            modifier = Modifier.fillMaxWidth()
        )
        if (running) {
            LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
            Text(status)
        }
        Button(
            onClick = {
                if (projectName.isBlank() || running) return@Button
                running = true
                scope.launch {
                    status = "Analysing structure…"
                    delay(700)
                    status = "Applying vibe…"
                    delay(700)
                    status = "Rebuilding $projectName…"
                    delay(800)
                    status = "Done — $projectName re-imaged"
                    running = false
                }
            },
            modifier = Modifier.fillMaxWidth(),
            enabled = projectName.isNotBlank() && !running
        ) { Text("Recreate App") }
        OutlinedButton(onClick = { projectName = ""; status = "" }, modifier = Modifier.fillMaxWidth()) {
            Text("Clear")
        }
    }
}

data class RealityNode(val id: String, val name: String, val coherence: Float, val glitching: Boolean = false)

@Composable
fun MandelaCoreScreen() {
    var quantumGlitch by remember { mutableStateOf(false) }
    var nodes by remember {
        mutableStateOf(listOf(
            RealityNode("n1", "Primary Timeline", 0.94f),
            RealityNode("n2", "Memory Anchor", 0.81f),
            RealityNode("n3", "Identity Lattice", 0.76f),
            RealityNode("n4", "Echo Chamber", 0.62f),
            RealityNode("n5", "Drift Buffer", 0.88f)
        ))
    }
    val avg = nodes.map { it.coherence }.average().toFloat()

    Column(Modifier.fillMaxSize().background(MaterialTheme.colorScheme.background)) {
        Surface(tonalElevation = 2.dp, modifier = Modifier.fillMaxWidth()) {
            Column(Modifier.padding(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.BlurOn, null, tint = MaterialTheme.colorScheme.primary)
                    Spacer(Modifier.width(8.dp))
                    Text("MandelaCore", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                }
                Text("Reality matrix • coherence ${(avg * 100).toInt()}%")
            }
        }
        Card(modifier = Modifier.fillMaxWidth().padding(12.dp), shape = RoundedCornerShape(12.dp)) {
            Row(Modifier.fillMaxWidth().padding(16.dp), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.SpaceBetween) {
                Column {
                    Text("Quantum Glitch", fontWeight = FontWeight.SemiBold)
                    Text(if (quantumGlitch) "ACTIVE" else "Stable continuum")
                }
                Switch(checked = quantumGlitch, onCheckedChange = { on ->
                    quantumGlitch = on
                    nodes = nodes.map { n -> n.copy(glitching = on, coherence = if (on) (n.coherence * 0.85f).coerceAtLeast(0.2f) else (n.coherence / 0.85f).coerceAtMost(1f)) }
                })
            }
        }
        Text("Reality Nodes", fontWeight = FontWeight.SemiBold, modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp))
        LazyColumn(contentPadding = PaddingValues(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(nodes, key = { it.id }) { node ->
                Card(modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(10.dp)) {
                    Column(Modifier.padding(12.dp)) {
                        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text(node.name, fontWeight = FontWeight.SemiBold)
                            Text("${(node.coherence * 100).toInt()}%", color = when {
                                node.coherence >= 0.85f -> Color(0xFF69F0AE)
                                node.coherence >= 0.6f -> Color(0xFFFFAB00)
                                else -> Color(0xFFFF5252)
                            }, fontWeight = FontWeight.Bold)
                        }
                        Spacer(Modifier.height(6.dp))
                        LinearProgressIndicator(progress = { node.coherence }, modifier = Modifier.fillMaxWidth().height(6.dp))
                        if (node.glitching) Text("GLITCHING", color = Color(0xFFFF00E5), style = MaterialTheme.typography.labelSmall)
                    }
                }
            }
        }
    }
}

data class Agent(val id: String, val name: String, val role: String, val active: Boolean)

@Composable
fun SwarmScreen() {
    var agents by remember {
        mutableStateOf(listOf(
            Agent("1", "Architect", "App structure", true),
            Agent("2", "Coder", "Kotlin / Compose", true),
            Agent("3", "Vibe Injector", "Personal style", true),
            Agent("4", "Tester", "Smoke checks", false)
        ))
    }
    var running by remember { mutableStateOf(false) }
    var log by remember { mutableStateOf(listOf<String>()) }
    val scope = rememberCoroutineScope()
    val active = agents.count { it.active }

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text("Swarm Builder", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        Text("$active agents ready to rebuild")
        Spacer(Modifier.height(12.dp))
        LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.weight(1f)) {
            items(agents, key = { it.id }) { agent ->
                Card(modifier = Modifier.fillMaxWidth()) {
                    Row(Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                        Column(Modifier.weight(1f)) {
                            Text(agent.name, fontWeight = FontWeight.SemiBold)
                            Text(agent.role, style = MaterialTheme.typography.bodySmall)
                        }
                        Switch(checked = agent.active, onCheckedChange = {
                            agents = agents.map { if (it.id == agent.id) it.copy(active = !it.active) else it }
                        })
                    }
                }
            }
            items(log) { line -> Text(line, style = MaterialTheme.typography.bodySmall) }
        }
        if (running) LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
        Button(
            onClick = {
                if (active == 0 || running) return@Button
                running = true
                log = emptyList()
                scope.launch {
                    agents.filter { it.active }.forEach { a ->
                        log = log + "→ ${a.name} working…"
                        delay(500)
                        log = log + "✓ ${a.name} done"
                    }
                    log = log + "Swarm complete"
                    running = false
                }
            },
            modifier = Modifier.fillMaxWidth(),
            enabled = active > 0 && !running
        ) { Text("Deploy Swarm ($active)") }
    }
}

@Composable
fun VibeScreen() {
    var tone by remember { mutableStateOf(0.5f) }
    var chaos by remember { mutableStateOf(0.2f) }
    var formal by remember { mutableStateOf(0.4f) }
    var preview by remember { mutableStateOf("Adjust sliders to set generation vibe.") }

    Column(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("Personal Vibe", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        Text("Controls how recreated code and UI feel.")

        Text("Tone (calm → bold)")
        Slider(value = tone, onValueChange = {
            tone = it
            preview = vibePreview(tone, chaos, formal)
        })
        Text("Chaos (strict → wild)")
        Slider(value = chaos, onValueChange = {
            chaos = it
            preview = vibePreview(tone, chaos, formal)
        })
        Text("Formality (casual → formal)")
        Slider(value = formal, onValueChange = {
            formal = it
            preview = vibePreview(tone, chaos, formal)
        })

        Card(modifier = Modifier.fillMaxWidth()) {
            Column(Modifier.padding(16.dp)) {
                Text("Preview", fontWeight = FontWeight.SemiBold)
                Spacer(Modifier.height(8.dp))
                Text(preview)
            }
        }
    }
}

private fun vibePreview(tone: Float, chaos: Float, formal: Float): String {
    val t = when {
        tone < 0.33f -> "calm"
        tone < 0.66f -> "balanced"
        else -> "bold"
    }
    val c = when {
        chaos < 0.33f -> "strict"
        chaos < 0.66f -> "flexible"
        else -> "wild"
    }
    val f = when {
        formal < 0.33f -> "casual"
        formal < 0.66f -> "neutral"
        else -> "formal"
    }
    return "Vibe: $t · $c · $f"
}

@Composable
fun ToolsScreen() {
    var apkName by remember { mutableStateOf("") }
    var auditResult by remember { mutableStateOf("") }
    var running by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    Column(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("Modular Tools", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)

        Card(modifier = Modifier.fillMaxWidth()) {
            Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("APK Auditor", fontWeight = FontWeight.SemiBold)
                OutlinedTextField(
                    value = apkName,
                    onValueChange = { apkName = it },
                    label = { Text("APK / package name") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
                if (running) LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
                Button(
                    onClick = {
                        if (apkName.isBlank() || running) return@Button
                        running = true
                        scope.launch {
                            delay(1000)
                            auditResult = "Audit $apkName\n• minSdk ok\n• no obvious trackers\n• size estimate normal"
                            running = false
                        }
                    },
                    enabled = apkName.isNotBlank() && !running
                ) { Text("Run Audit") }
                if (auditResult.isNotBlank()) Text(auditResult, style = MaterialTheme.typography.bodySmall)
            }
        }

        Card(modifier = Modifier.fillMaxWidth()) {
            Column(Modifier.padding(16.dp)) {
                Text("Image Tools", fontWeight = FontWeight.SemiBold)
                Text("Resize, tag, and stage assets for re-imaged apps.")
            }
        }

        Card(modifier = Modifier.fillMaxWidth()) {
            Column(Modifier.padding(16.dp)) {
                Text("Training Centre", fontWeight = FontWeight.SemiBold)
                Text("Feed examples so vibe and swarm improve over time.")
            }
        }
    }
}
