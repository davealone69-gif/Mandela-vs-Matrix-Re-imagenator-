package com.example

import android.graphics.Bitmap
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.MenuBook
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.example.ui.theme.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

object GlobalState {
    val savedManuals = mutableStateListOf(
        SavedManual("Prius High Voltage System", listOf("Wiring", "Engines"), true),
        SavedManual("Adrulee Module Guide", listOf("Adrulee", "Accessories"), false)
    )
}

data class SavedManual(val title: String, val tags: List<String>, val isEnhanced: Boolean = false)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                WorkshopApp()
            }
        }
    }
}

sealed class Screen(val route: String, val title: String, val icon: ImageVector) {
    data object Dashboard : Screen("dashboard", "Dashboard", Icons.Filled.Home)
    data object Library : Screen("library", "Library", Icons.AutoMirrored.Filled.MenuBook)
    data object ManualViewer : Screen("viewer", "Viewer", Icons.Filled.Visibility)
    data object Collaboration : Screen("collab", "Teams", Icons.Filled.Group)
    data object AI : Screen("ai", "AI Assist", Icons.Filled.SmartToy)
    data object VINDecoder : Screen("vin", "VIN Decoder", Icons.Filled.DirectionsCar)
    data object Scanner : Screen("scanner", "Scan Manual", Icons.Filled.DocumentScanner)
    data object Settings : Screen("settings", "Settings", Icons.Filled.Settings)
}

@Composable
fun WorkshopApp() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    val screens = listOf(
        Screen.Dashboard, Screen.Library, Screen.VINDecoder,
        Screen.Collaboration, Screen.Settings, Screen.AI
    )

    Surface(Modifier = Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
        BoxWithConstraints {
            val isExpanded = maxWidth > 600.dp
            if (isExpanded) {
                PermanentNavigationDrawer(
                    drawerContent = {
                        PermanentDrawerSheet(Modifier.width(240.dp)) {
                            Spacer(Modifier.height(12.dp))
                            Text("Mandela Native", modifier = Modifier.padding(16.dp),
                                style = MaterialTheme.typography.headlineMedium,
                                color = MaterialTheme.colorScheme.primary)
                            screens.forEach { screen ->
                                NavigationDrawerItem(
                                    icon = { Icon(screen.icon, null) },
                                    label = { Text(screen.title) },
                                    selected = currentRoute == screen.route,
                                    onClick = {
                                        navController.navigate(screen.route) {
                                            popUpTo(Screen.Dashboard.route); launchSingleTop = true
                                        }
                                    },
                                    modifier = Modifier.padding(NavigationDrawerItemDefaults.ItemPadding)
                                )
                            }
                        }
                    }
                ) { AppNavHost(navController) }
            } else {
                Scaffold(
                    bottomBar = {
                        NavigationBar {
                            screens.forEach { screen ->
                                NavigationBarItem(
                                    icon = { Icon(screen.icon, null) },
                                    label = { Text(screen.title, maxLines = 1, overflow = TextOverflow.Ellipsis) },
                                    selected = currentRoute == screen.route,
                                    onClick = {
                                        navController.navigate(screen.route) {
                                            popUpTo(Screen.Dashboard.route); launchSingleTop = true
                                        }
                                    }
                                )
                            }
                        }
                    }
                ) { innerPadding ->
                    AppNavHost(navController, Modifier.padding(innerPadding))
                }
            }
        }
    }
}

@Composable
fun AppNavHost(navController: NavHostController, modifier: Modifier = Modifier) {
    NavHost(navController, startDestination = Screen.Dashboard.route, modifier = modifier) {
        composable(Screen.Dashboard.route) {
            DashboardScreen(
                onNavigateToViewer = { navController.navigate(Screen.ManualViewer.route) },
                onNavigateToVIN = { navController.navigate(Screen.VINDecoder.route) }
            )
        }
        composable(Screen.Library.route) { LibraryScreen(navController) }
        composable(Screen.ManualViewer.route) { ManualViewerScreen(onBack = { navController.popBackStack() }) }
        composable(Screen.Collaboration.route) { CollaborationScreen() }
        composable(Screen.AI.route) { AIScreen() }
        composable(Screen.VINDecoder.route) { VINDecoderScreen() }
        composable(Screen.Scanner.route) { ScannerScreen(onBack = { navController.popBackStack() }) }
        composable(Screen.Settings.route) { SettingsScreen() }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(onNavigateToViewer: () -> Unit, onNavigateToVIN: () -> Unit) {
    val context = LocalContext.current
    var searchQuery by remember { mutableStateOf("") }
    val recentManuals = listOf(
        "Honda Civic 2018 Engine Manual" to "PDF • 12 MB • V2.1",
        "Yamaha R1 2020 Service Guide" to "Offline • Tagged: Engine"
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Workshop Dashboard") },
                actions = {
                    IconButton(onClick = {
                        Toast.makeText(context, "Printing...", Toast.LENGTH_SHORT).show()
                    }) { Icon(Icons.Filled.Print, "Print") }
                }
            )
        },
        floatingActionButton = {
            ExtendedFloatingActionButton(
                onClick = onNavigateToVIN,
                icon = { Icon(Icons.Filled.CenterFocusWeak, null) },
                text = { Text("Scan VIN") }
            )
        }
    ) { innerPadding ->
        LazyColumn(
            Modifier.padding(innerPadding).fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    modifier = Modifier.fillMaxWidth(),
                    placeholder = { Text("Search titles, tags, or concepts (AI)...") },
                    leadingIcon = { Icon(Icons.Filled.Search, null) },
                    singleLine = true,
                    shape = MaterialTheme.shapes.extraLarge
                )
            }
            item {
                Text("Recent Manuals", style = MaterialTheme.typography.headlineMedium,
                    color = MaterialTheme.colorScheme.primary)
            }
            items(recentManuals) { (title, desc) ->
                Card(Modifier = Modifier.fillMaxWidth().clickable { onNavigateToViewer() }) {
                    Row(Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.AutoMirrored.Filled.MenuBook, null, Modifier.size(40.dp),
                            tint = MaterialTheme.colorScheme.secondary)
                        Spacer(Modifier.width(16.dp))
                        Column {
                            Text(title, style = MaterialTheme.typography.titleMedium)
                            Text(desc, style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun VINDecoderScreen() {
    var isDecoding by remember { mutableStateOf(false) }
    var decodedInfo by remember { mutableStateOf<String?>(null) }
    var showUpgrades by remember { mutableStateOf(false) }
    var capturedImage by remember { mutableStateOf<Bitmap?>(null) }
    val context = LocalContext.current

    val cameraLauncher = rememberLauncherForActivityResult(ActivityResultContracts.TakePicturePreview()) { bitmap ->
        if (bitmap != null) {
            capturedImage = bitmap
            isDecoding = true
        }
    }

    Column(
        Modifier.fillMaxSize().padding(16.dp).verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("AI VIN Plate Decoder", style = MaterialTheme.typography.headlineMedium,
            color = MaterialTheme.colorScheme.primary)
        Spacer(Modifier.height(16.dp))

        Box(
            Modifier.fillMaxWidth().height(200.dp).clip(RoundedCornerShape(12.dp))
                .background(MaterialTheme.colorScheme.surfaceVariant)
                .clickable {
                    try { cameraLauncher.launch() } catch (_: Exception) {
                        Toast.makeText(context, "No camera", Toast.LENGTH_SHORT).show()
                    }
                },
            contentAlignment = Alignment.Center
        ) {
            when {
                capturedImage != null -> Image(capturedImage!!.asImageBitmap(), null,
                    Modifier.fillMaxSize(), contentScale = ContentScale.Crop)
                isDecoding -> CircularProgressIndicator()
                else -> Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(Icons.Filled.PhotoCamera, null, Modifier.size(64.dp),
                        tint = MaterialTheme.colorScheme.primary)
                    Text("Tap to capture VIN Plate")
                }
            }
        }

        Spacer(Modifier.height(24.dp))
        Button(
            onClick = {
                try { cameraLauncher.launch() } catch (_: Exception) {
                    Toast.makeText(context, "No camera", Toast.LENGTH_SHORT).show()
                }
            },
            Modifier.fillMaxWidth().height(56.dp)
        ) {
            Icon(Icons.Filled.CameraAlt, null); Spacer(Modifier.width(8.dp))
            Text("Capture Image with AI")
        }

        LaunchedEffect(isDecoding) {
            if (isDecoding) {
                delay(2000)
                decodedInfo = "Vehicle: 1999 Nissan Skyline GT-R (R34)\nEngine: RB26DETT\nChassis: BNR34-123456\nColor: Midnight Purple II"
                showUpgrades = true
                isDecoding = false
            }
        }

        decodedInfo?.let {
            Spacer(Modifier.height(24.dp))
            Card(Modifier.fillMaxWidth()) {
                Column(Modifier.padding(16.dp)) {
                    Text("Vehicle Specifications", style = MaterialTheme.typography.titleLarge)
                    Spacer(Modifier.height(12.dp))
                    Text(it, style = MaterialTheme.typography.bodyLarge, lineHeight = 24.sp)
                }
            }
        }

        if (showUpgrades) {
            Spacer(Modifier.height(32.dp))
            Text("Recommended Major Upgrades", style = MaterialTheme.typography.headlineMedium,
                color = MaterialTheme.colorScheme.primary)
            listOf(
                "N1 Twin Turbos" to "Higher top-end power",
                "HKS Intercooler Piping" to "Better airflow & cooling",
                "Ohlins Road & Track" to "Superior handling",
                "Brembo 6-Piston Kit" to "Essential stopping power"
            ).forEach { (title, desc) ->
                Card(Modifier.fillMaxWidth().padding(vertical = 6.dp)) {
                    Column(Modifier.padding(16.dp)) {
                        Text(title, style = MaterialTheme.typography.titleMedium)
                        Text(desc, style = MaterialTheme.typography.bodyMedium)
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ManualViewerScreen(onBack: () -> Unit) {
    var showAIChat by remember { mutableStateOf(false) }
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("Honda Civic 2018 Engine", maxLines = 1, overflow = TextOverflow.Ellipsis)
                        Text("Page 42 - Timing Belt", style = MaterialTheme.typography.bodySmall)
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "Back") }
                },
                actions = {
                    IconButton(onClick = { showAIChat = !showAIChat }) {
                        Icon(Icons.Filled.SmartToy, "AI", tint = if (showAIChat) MaterialTheme.colorScheme.primary else LocalContentColor.current)
                    }
                }
            )
        }
    ) { innerPadding ->
        Column(Modifier.padding(innerPadding).fillMaxSize()) {
            Box(
                Modifier.weight(if (showAIChat) 1f else 2f).fillMaxWidth().background(Color.LightGray),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(Icons.Filled.Image, null, Modifier.size(120.dp), tint = Color.Gray)
                    Text("Interactive Engine Diagram")
                }
            }
            if (showAIChat) {
                Card(Modifier.weight(1f).fillMaxWidth().padding(top = 8.dp),
                    shape = RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp)) {
                    AIChatContent()
                }
            }
        }
    }
}

@Composable
fun AIChatContent(viewModel: AIChatViewModel = viewModel()) {
    val messages by viewModel.messages.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    var inputText by remember { mutableStateOf("") }
    var useThinking by remember { mutableStateOf(false) }
    val listState = androidx.compose.foundation.lazy.rememberLazyListState()

    LaunchedEffect(messages.size) {
        if (messages.isNotEmpty()) listState.animateScrollToItem(messages.size - 1)
    }

    Column(Modifier.padding(16.dp).fillMaxSize()) {
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically) {
            Text("Gemini Assistant", fontWeight = FontWeight.Bold)
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("Thinking", style = MaterialTheme.typography.bodySmall)
                Switch(checked = useThinking, onCheckedChange = { useThinking = it },
                    modifier = Modifier.scale(0.8f))
            }
        }
        Spacer(Modifier.height(8.dp))
        LazyColumn(state = listState, modifier = Modifier.weight(1f).fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(messages) { msg ->
                Row(Modifier.fillMaxWidth(),
                    horizontalArrangement = if (msg.isUser) Arrangement.End else Arrangement.Start) {
                    Box(
                        Modifier.clip(RoundedCornerShape(12.dp))
                            .background(if (msg.isUser) MaterialTheme.colorScheme.primaryContainer
                            else MaterialTheme.colorScheme.surfaceVariant)
                            .padding(12.dp)
                    ) {
                        if (msg.isThinking) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                CircularProgressIndicator(Modifier.size(16.dp), strokeWidth = 2.dp)
                                Spacer(Modifier.width(8.dp)); Text("Thinking...")
                            }
                        } else Text(msg.text)
                    }
                }
            }
        }
        Spacer(Modifier.height(8.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            OutlinedTextField(
                value = inputText, onValueChange = { inputText = it },
                placeholder = { Text("Ask something...") },
                modifier = Modifier.weight(1f), shape = RoundedCornerShape(24.dp), maxLines = 3
            )
            Spacer(Modifier.width(8.dp))
            IconButton(
                onClick = { viewModel.sendMessage(inputText, useThinking); inputText = "" },
                enabled = inputText.isNotBlank() && !isLoading,
                modifier = Modifier.background(MaterialTheme.colorScheme.primary, RoundedCornerShape(50))
            ) {
                Icon(Icons.AutoMirrored.Filled.Send, "Send", tint = MaterialTheme.colorScheme.onPrimary)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LibraryScreen(navController: NavHostController? = null) {
    val context = LocalContext.current
    var isScanning by remember { mutableStateOf(false) }
    var scanResult by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()
    val savedManuals = GlobalState.savedManuals

    val fileLauncher = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocument()) { uri ->
        if (uri != null) {
            isScanning = true; scanResult = null
            scope.launch {
                delay(2500); isScanning = false
                scanResult = "AI Scan Complete: Cleaned text, colorized diagrams, indexed 12 pages."
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Manual Library") },
                actions = {
                    IconButton(onClick = { fileLauncher.launch(arrayOf("*/*")) }) {
                        Icon(Icons.Filled.FileUpload, "Import")
                    }
                }
            )
        },
        floatingActionButton = {
            ExtendedFloatingActionButton(
                onClick = { navController?.navigate(Screen.Scanner.route) },
                icon = { Icon(Icons.Filled.DocumentScanner, null) },
                text = { Text("Digitize Manual") }
            )
        }
    ) { padding ->
        Column(Modifier.fillMaxSize().padding(padding).padding(16.dp).verticalScroll(rememberScrollState())) {
            Text("Library & Tags", style = MaterialTheme.typography.headlineMedium,
                color = MaterialTheme.colorScheme.primary)
            Spacer(Modifier.height(16.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.horizontalScroll(rememberScrollState())) {
                listOf("All", "Engines", "Wiring", "Accessories", "Adrulee").forEachIndexed { i, tag ->
                    FilterChip(selected = i == 0, onClick = {}, label = { Text(tag) })
                }
            }
            Spacer(Modifier.height(24.dp))
            Button(onClick = { fileLauncher.launch(arrayOf("*/*")) },
                Modifier.fillMaxWidth().height(56.dp)) {
                Icon(Icons.Filled.UploadFile, null); Spacer(Modifier.width(8.dp))
                Text("Import Manual (PDF, Docs, Images)")
            }

            if (isScanning) {
                Spacer(Modifier.height(16.dp))
                Card {
                    Row(Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                        CircularProgressIndicator(Modifier.size(24.dp))
                        Spacer(Modifier.width(16.dp))
                        Text("AI is scanning & enhancing...")
                    }
                }
            } else if (scanResult != null) {
                Spacer(Modifier.height(16.dp))
                Card {
                    Column(Modifier.padding(16.dp)) {
                        Text(scanResult!!, fontWeight = FontWeight.Bold)
                        Spacer(Modifier.height(16.dp))
                        Button(onClick = {
                            scanResult = null
                            savedManuals.add(0, SavedManual("Newly Imported Manual",
                                listOf("Adrulee", "AI Enhanced"), true))
                        }, Modifier.fillMaxWidth()) { Text("Save & View Library") }
                    }
                }
            }

            Spacer(Modifier.height(24.dp))
            Text("Saved Manuals", style = MaterialTheme.typography.titleLarge)
            savedManuals.forEach { manual ->
                Card(Modifier.fillMaxWidth().padding(vertical = 4.dp).clickable {
                    Toast.makeText(context, "Opening ${manual.title}", Toast.LENGTH_SHORT).show()
                }) {
                    Column(Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Filled.Book, null, tint = MaterialTheme.colorScheme.primary)
                            Spacer(Modifier.width(8.dp))
                            Text(manual.title, style = MaterialTheme.typography.titleMedium)
                            if (manual.isEnhanced) {
                                Spacer(Modifier.weight(1f))
                                Icon(Icons.Filled.AutoAwesome, null, tint = Color.Magenta, modifier = Modifier.size(20.dp))
                            }
                        }
                        Spacer(Modifier.height(8.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                            manual.tags.forEach { AssistChip(onClick = {}, label = { Text(it) }) }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun CollaborationScreen() {
    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text("Team Workspaces", style = MaterialTheme.typography.headlineMedium,
            color = MaterialTheme.colorScheme.primary)
        Spacer(Modifier.height(16.dp))
        Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.errorContainer)) {
            Column(Modifier.padding(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Filled.Warning, null, tint = MaterialTheme.colorScheme.error)
                    Spacer(Modifier.width(8.dp))
                    Text("Safety Alert Mode Active", fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.error)
                }
                Spacer(Modifier.height(8.dp))
                Text("Technician Mike flagged a critical high-voltage warning on the Prius manual.")
            }
        }
    }
}

@Composable
fun AIScreen() {
    Column(Modifier.fillMaxSize().padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center) {
        Icon(Icons.Filled.AutoAwesome, null, Modifier.size(64.dp),
            tint = MaterialTheme.colorScheme.primary)
        Spacer(Modifier.height(16.dp))
        Text("AI Auto-Tagging & OCR", style = MaterialTheme.typography.headlineMedium,
            color = MaterialTheme.colorScheme.primary)
        Spacer(Modifier.height(8.dp))
        Text("Open a manual and use the AI chat panel for assistance.")
    }
}

@Composable
fun ScannerScreen(onBack: () -> Unit) {
    var isScanning by remember { mutableStateOf(false) }
    var scanComplete by remember { mutableStateOf(false) }
    var scannedPages by remember { mutableStateOf(0) }
    var capturedImage by remember { mutableStateOf<Bitmap?>(null) }
    val scope = rememberCoroutineScope()
    val context = LocalContext.current

    val cameraLauncher = rememberLauncherForActivityResult(ActivityResultContracts.TakePicturePreview()) { bitmap ->
        if (bitmap != null) {
            capturedImage = bitmap; isScanning = true; scanComplete = false
            scope.launch { delay(1500); scannedPages++; isScanning = false }
        }
    }

    Scaffold(
        topBar = {
            @OptIn(ExperimentalMaterial3Api::class)
            TopAppBar(
                title = { Text("Digitize Manual") },
                navigationIcon = {
                    IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "Back") }
                }
            )
        }
    ) { padding ->
        Column(Modifier.padding(padding).fillMaxSize(), horizontalAlignment = Alignment.CenterHorizontally) {
            Box(
                Modifier.weight(1f).fillMaxWidth().padding(16.dp)
                    .clip(RoundedCornerShape(12.dp)).background(Color.Black),
                contentAlignment = Alignment.Center
            ) {
                when {
                    capturedImage != null && !isScanning && !scanComplete ->
                        Image(capturedImage!!.asImageBitmap(), null, Modifier.fillMaxSize(),
                            contentScale = ContentScale.Fit)
                    isScanning -> {
                        CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
                        Text("Scanning page...", color = Color.White, modifier = Modifier.padding(top = 64.dp))
                    }
                    scanComplete -> Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(Icons.Filled.CheckCircle, null, tint = Color.Green, modifier = Modifier.size(64.dp))
                        Text("$scannedPages pages digitized", color = Color.White)
                    }
                    else -> Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(Icons.Filled.DocumentScanner, null, tint = Color.White, modifier = Modifier.size(64.dp))
                        Text("Align manual page in frame", color = Color.White)
                    }
                }
            }
            Row(Modifier.fillMaxWidth().padding(16.dp), horizontalArrangement = Arrangement.SpaceEvenly) {
                Button(onClick = {
                    try { cameraLauncher.launch() } catch (_: Exception) {
                        Toast.makeText(context, "No camera", Toast.LENGTH_SHORT).show()
                    }
                }) {
                    Icon(Icons.Filled.CameraAlt, null); Spacer(Modifier.width(8.dp)); Text("Capture Page")
                }
                if (scannedPages > 0) {
                    Button(onClick = {
                        scanComplete = true
                        GlobalState.savedManuals.add(0, SavedManual("Newly Digitized Manual",
                            listOf("Scans", "AI Processed"), true))
                    }) {
                        Icon(Icons.Filled.Save, null); Spacer(Modifier.width(8.dp)); Text("Save as PDF")
                    }
                }
            }
        }
    }
}

@Composable
fun SettingsScreen() {
    val appSettings = LocalAppSettings.current
    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text("Settings", style = MaterialTheme.typography.headlineMedium,
            color = MaterialTheme.colorScheme.primary)
        Spacer(Modifier.height(24.dp))
        Text("Theme", style = MaterialTheme.typography.titleMedium)
        Spacer(Modifier.height(8.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            AppThemeMode.entries.forEach { mode ->
                FilterChip(
                    selected = appSettings.themeMode.value == mode,
                    onClick = { appSettings.themeMode.value = mode },
                    label = { Text(mode.name.lowercase().replaceFirstChar { it.uppercase() }) }
                )
            }
        }
        Spacer(Modifier.height(24.dp))
        Text("Font", style = MaterialTheme.typography.titleMedium)
        Spacer(Modifier.height(8.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            AppFontFamily.entries.forEach { font ->
                FilterChip(
                    selected = appSettings.fontFamily.value == font,
                    onClick = { appSettings.fontFamily.value = font },
                    label = { Text(font.displayName) }
                )
            }
        }
    }
}
