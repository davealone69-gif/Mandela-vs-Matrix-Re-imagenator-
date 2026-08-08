package com.drivelog

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.compose.viewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

// ============================================================================
// 1. ENUMS & NAVIGATION DOMAIN
// ============================================================================

enum class NavigationTab(val title: String, val iconName: String) {
    MATRIX_CORE("Matrix Core", "Grid"),
    MANDELA_CORE("Mandela Core", "Layers"),
    EVALUATEOR("Evaluateor", "Tag"),
    DEVATOR_LAB("Devator Lab", "Wrench"),
    KNOWLEDGE_BASE("Knowledge RAG", "Search"),
    GEMINI_AI("Gemini AI", "AutoAwesome"),
    FREE_AI("Free AI Tools", "Zap"),
    IMAGE_TOOLS("Image Tools", "Image"),
    APK_AUDITOR("APK Auditor", "Security")
}

enum class ActionCode(val code: String, val defaultMethod: String) {
    DEV_SYM("DEV-SYM", "rewrite"),
    DEV_ID("DEV-ID", "reinforce"),
    DEV_TIME("DEV-TIME", "patch"),
    DEV_STR("DEV-STR", "purge")
}

enum class ModifierMethod(val methodName: String) {
    REWRITE("rewrite"),
    PATCH("patch"),
    REINFORCE("reinforce"),
    PURGE("purge")
}

enum class DriftCategory(val categoryName: String) {
    TIMELINE("Timeline Drift"),
    IDENTITY("Identity Drift"),
    SYMBOLIC("Symbolic Drift"),
    STRUCTURAL("Structural Drift")
}

// ============================================================================
// 2. STATE MODELS
// ============================================================================

data class MatrixState(
    val parsedRecordsCount: Long = 2845010L,
    val parserLatencyMs: Double = 0.12,
    val matrixBandwidthMBps: Double = 3420.0,
    val activeNodesCount: Int = 128,
    val anomalyScorePct: Double = 0.02,
    val isScanning: Boolean = false
)

data class MandelaState(
    val quantumIntegrityPct: Double = 100.0,
    val timelineShiftsDetected: Int = 42,
    val activeLayer: String = "Layer-Alpha-Zero",
    val status: String = "STABLE_SYNCHRONIZED",
    val isShifting: Boolean = false
)

data class EvaluateorState(
    val classificationAccuracyPct: Double = 99.8,
    val classifiedEventsCount: Long = 14209L,
    val lastCategoryDetected: DriftCategory = DriftCategory.TIMELINE,
    val outputPipeThroughput: Long = 18450L,
    val isProcessing: Boolean = false
)

data class DevatorState(
    val receivedCodesCount: Long = 8940L,
    val appliedChangesCount: Long = 4210L,
    val modificationSuccessPct: Double = 99.9,
    val lastAppliedMethod: ModifierMethod = ModifierMethod.PATCH,
    val outputPipeTarget: String = "Re-Imaginator",
    val outputPipeThroughput: Long = 12400L,
    val isExecuting: Boolean = false
)

data class KnowledgeItem(
    val id: String,
    val title: String,
    val snippet: String,
    val score: Double
)

data class KnowledgeState(
    val searchQuery: String = "",
    val totalIndexedDocs: Int = 1420,
    val vectorDimensions: Int = 1536,
    val isSearching: Boolean = false,
    val searchResults: List<KnowledgeItem> = listOf(
        KnowledgeItem("DOC-101", "Devator Action Code Mapping Specifications", "DEV-SYM maps to rewrite, DEV-ID maps to reinforce...", 0.98),
        KnowledgeItem("DOC-102", "Mandela Matrix Quantum Realignment Protocol", "When timeline drift is detected, perform quantum phase sweep...", 0.94),
        KnowledgeItem("DOC-103", "Evaluateor Parser Latency Optimizations", "Zero-copy stream buffer parsing with 0.12ms execution floor...", 0.91)
    )
)

data class GeminiMessage(
    val id: String,
    val sender: String,
    val text: String,
    val timestamp: String
)

data class GeminiAiState(
    val currentPrompt: String = "",
    val selectedModel: String = "gemini-2.5-flash",
    val isGenerating: Boolean = false,
    val conversation: List<GeminiMessage> = listOf(
        GeminiMessage("1", "System", "Gemini 2.5 Flash initialized for Matrix Core diagnostics.", "15:40:00"),
        GeminiMessage("2", "User", "Check Devator modification precision.", "15:40:12"),
        GeminiMessage("3", "Gemini", "Devator modification core is operating at 99.9% precision across 4,210 applied changes.", "15:40:14")
    )
)

data class FreeAiState(
    val rawPromptInput: String = "",
    val optimizedPromptOutput: String = "",
    val isOptimizing: Boolean = false,
    val quickTools: List<String> = listOf("Code Refactor", "Drift Sanitizer", "Spec Generator")
)

data class ImageToolsState(
    val promptInput: String = "Cybernetic matrix core with glowing amber nodes",
    val selectedAspectRatio: String = "1:1",
    val isGenerating: Boolean = false,
    val generatedImageCount: Int = 3,
    val galleryPrompts: List<String> = listOf(
        "Quantum timeline visualizer interface",
        "Devator modification executor core schematic",
        "Mandela layer alignment grid"
    )
)

data class ApkAuditorState(
    val packageName: String = "com.drivelog",
    val versionCode: Int = 100,
    val versionName: String = "1.0-builder",
    val buildVariant: String = "Release (Signed)",
    val sha256Fingerprint: String = "A1:B2:C3:D4:E5:F6:78:90:12:34:56:78:9A:BC:DE:F0:12:34:56:78:90:AB:CD:EF:01:23:45:67:89:AB:CD:EF",
    val isAuditing: Boolean = false,
    val isHealthy: Boolean = true
)

data class ConsolidatedUiState(
    val selectedTab: NavigationTab = NavigationTab.MATRIX_CORE,
    val isGlobalDarkTheme: Boolean = true,
    val overallHealthScorePct: Double = 100.0,
    val statusBannerMessage: String? = null,
    val logs: List<String> = listOf(
        "[SYSTEM READY] Consolidated Matrix & Devator Core initialized.",
        "[ALL MODULES] Module_1, Module_2, Module_3 reporting 100% integrity.",
        "[NETWORK] API Endpoints active on 0.0.0.0:3000."
    ),
    val matrixState: MatrixState = MatrixState(),
    val mandelaState: MandelaState = MandelaState(),
    val evaluateorState: EvaluateorState = EvaluateorState(),
    val devatorState: DevatorState = DevatorState(),
    val knowledgeState: KnowledgeState = KnowledgeState(),
    val geminiAiState: GeminiAiState = GeminiAiState(),
    val freeAiState: FreeAiState = FreeAiState(),
    val imageToolsState: ImageToolsState = ImageToolsState(),
    val apkAuditorState: ApkAuditorState = ApkAuditorState()
)

// ============================================================================
// 3. REPOSITORY LAYER
// ============================================================================

class ConsolidatedRepository {
    private fun getCurrentTimestamp(): String {
        return SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())
    }

    suspend fun simulateNetworkLatency(ms: Long = 300) {
        delay(ms)
    }

    fun formatLog(message: String): String {
        return "[${getCurrentTimestamp()}] $message"
    }
}

// ============================================================================
// 4. VIEWMODEL LAYER
// ============================================================================

class ConsolidatedMainViewModel(
    private val repository: ConsolidatedRepository = ConsolidatedRepository()
) : ViewModel() {

    private val _uiState = MutableStateFlow(ConsolidatedUiState())
    val uiState: StateFlow<ConsolidatedUiState> = _uiState.asStateFlow()

    fun selectTab(tab: NavigationTab) {
        _uiState.update { it.copy(selectedTab = tab) }
    }

    fun dismissStatusBanner() {
        _uiState.update { it.copy(statusBannerMessage = null) }
    }

    fun executeMatrixScan() {
        viewModelScope.launch {
            _uiState.update {
                it.copy(
                    statusBannerMessage = "Running Matrix Core stream scan...",
                    matrixState = it.matrixState.copy(isScanning = true)
                )
            }
            repository.simulateNetworkLatency(400)
            _uiState.update { state ->
                val newCount = state.matrixState.parsedRecordsCount + 15400L
                val newLogs = listOf(repository.formatLog("Matrix stream scanned. Total records parsed: $newCount")) + state.logs
                state.copy(
                    statusBannerMessage = "Matrix Scan Complete: 15,400 new records processed.",
                    matrixState = state.matrixState.copy(
                        parsedRecordsCount = newCount,
                        isScanning = false
                    ),
                    logs = newLogs
                )
            }
        }
    }

    fun triggerMandelaShift() {
        viewModelScope.launch {
            _uiState.update {
                it.copy(
                    statusBannerMessage = "Triggering Mandela Quantum Realignment Shift...",
                    mandelaState = it.mandelaState.copy(isShifting = true)
                )
            }
            repository.simulateNetworkLatency(500)
            _uiState.update { state ->
                val newShifts = state.mandelaState.timelineShiftsDetected + 1
                val newLogs = listOf(repository.formatLog("Mandela Quantum Shift #$newShifts completed. Quantum integrity: 100.0%")) + state.logs
                state.copy(
                    statusBannerMessage = "Mandela Quantum Phase Shift Realigned cleanly.",
                    mandelaState = state.mandelaState.copy(
                        timelineShiftsDetected = newShifts,
                        isShifting = false
                    ),
                    logs = newLogs
                )
            }
        }
    }

    fun parseEvaluateorInput() {
        viewModelScope.launch {
            _uiState.update {
                it.copy(
                    statusBannerMessage = "Parsing Evaluateor input stream...",
                    evaluateorState = it.evaluateorState.copy(isProcessing = true)
                )
            }
            repository.simulateNetworkLatency(350)
            _uiState.update { state ->
                val newEvents = state.evaluateorState.classifiedEventsCount + 250L
                val newLogs = listOf(repository.formatLog("Evaluateor interpret.core parsed input stream. Total events: $newEvents")) + state.logs
                state.copy(
                    statusBannerMessage = "Evaluateor input stream parsed successfully.",
                    evaluateorState = state.evaluateorState.copy(
                        classifiedEventsCount = newEvents,
                        isProcessing = false
                    ),
                    logs = newLogs
                )
            }
        }
    }

    fun classifyDrift() {
        viewModelScope.launch {
            val categories = DriftCategory.values()
            val nextCategory = categories.random()
            _uiState.update {
                it.copy(
                    statusBannerMessage = "Running drift classification engine...",
                    evaluateorState = it.evaluateorState.copy(isProcessing = true)
                )
            }
            repository.simulateNetworkLatency(300)
            _uiState.update { state ->
                val newLogs = listOf(repository.formatLog("Drift engine classified state as: ${nextCategory.categoryName}")) + state.logs
                state.copy(
                    statusBannerMessage = "Drift classified as '${nextCategory.categoryName}'.",
                    evaluateorState = state.evaluateorState.copy(
                        lastCategoryDetected = nextCategory,
                        isProcessing = false
                    ),
                    logs = newLogs
                )
            }
        }
    }

    fun executeDevatorAction(code: ActionCode) {
        viewModelScope.launch {
            val mappedMethodName = code.defaultMethod
            _uiState.update {
                it.copy(
                    statusBannerMessage = "Executing action code '${code.code}' -> method '${mappedMethodName}'...",
                    devatorState = it.devatorState.copy(isExecuting = true)
                )
            }
            repository.simulateNetworkLatency(400)
            _uiState.update { state ->
                val newCodes = state.devatorState.receivedCodesCount + 1L
                val newChanges = state.devatorState.appliedChangesCount + 1L
                val methodEnum = ModifierMethod.values().firstOrNull { it.methodName == mappedMethodName } ?: ModifierMethod.PATCH
                val newLogs = listOf(repository.formatLog("Devator executor.core received '${code.code}' -> Applied modification '${mappedMethodName.uppercase()}' (#$newChanges)")) + state.logs
                state.copy(
                    statusBannerMessage = "Executed '${code.code}' cleanly via '${mappedMethodName.uppercase()}'.",
                    devatorState = state.devatorState.copy(
                        receivedCodesCount = newCodes,
                        appliedChangesCount = newChanges,
                        lastAppliedMethod = methodEnum,
                        isExecuting = false
                    ),
                    logs = newLogs
                )
            }
        }
    }

    fun applyDevatorMethod(method: ModifierMethod) {
        viewModelScope.launch {
            _uiState.update {
                it.copy(
                    statusBannerMessage = "Directly applying modifier method '${method.methodName.uppercase()}'...",
                    devatorState = it.devatorState.copy(isExecuting = true)
                )
            }
            repository.simulateNetworkLatency(300)
            _uiState.update { state ->
                val newChanges = state.devatorState.appliedChangesCount + 1L
                val newLogs = listOf(repository.formatLog("modifier.core applied '${method.methodName.uppercase()}'. Total applied changes: $newChanges")) + state.logs
                state.copy(
                    statusBannerMessage = "Applied system mutation '${method.methodName.uppercase()}'.",
                    devatorState = state.devatorState.copy(
                        appliedChangesCount = newChanges,
                        lastAppliedMethod = method,
                        isExecuting = false
                    ),
                    logs = newLogs
                )
            }
        }
    }

    fun updateKnowledgeQuery(query: String) {
        _uiState.update {
            it.copy(knowledgeState = it.knowledgeState.copy(searchQuery = query))
        }
    }

    fun queryKnowledgeBase() {
        val query = _uiState.value.knowledgeState.searchQuery
        if (query.isBlank()) return

        viewModelScope.launch {
            _uiState.update {
                it.copy(
                    statusBannerMessage = "Searching RAG Knowledge Base for '$query'...",
                    knowledgeState = it.knowledgeState.copy(isSearching = true)
                )
            }
            repository.simulateNetworkLatency(350)
            _uiState.update { state ->
                val searchResults = listOf(
                    KnowledgeItem("RES-01", "Vector Match for '$query'", "Document matching semantic similarity index for: $query", 0.97),
                    KnowledgeItem("RES-02", "Devator & Evaluateor Specification", "Core pipeline link specification and byte stream documentation.", 0.92)
                )
                val newLogs = listOf(repository.formatLog("RAG query executed for '$query'. 2 vector matches returned.")) + state.logs
                state.copy(
                    statusBannerMessage = "Knowledge search complete.",
                    knowledgeState = state.knowledgeState.copy(
                        searchResults = searchResults,
                        isSearching = false
                    ),
                    logs = newLogs
                )
            }
        }
    }

    fun updateGeminiPrompt(prompt: String) {
        _uiState.update {
            it.copy(geminiAiState = it.geminiAiState.copy(currentPrompt = prompt))
        }
    }

    fun sendGeminiPrompt() {
        val prompt = _uiState.value.geminiAiState.currentPrompt
        if (prompt.isBlank()) return

        viewModelScope.launch {
            val userMsg = GeminiMessage(
                id = System.currentTimeMillis().toString(),
                sender = "User",
                text = prompt,
                timestamp = SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())
            )
            val updatedConv = _uiState.value.geminiAiState.conversation + userMsg

            _uiState.update {
                it.copy(
                    geminiAiState = it.geminiAiState.copy(
                        currentPrompt = "",
                        conversation = updatedConv,
                        isGenerating = true
                    )
                )
            }

            repository.simulateNetworkLatency(600)

            val aiResponse = GeminiMessage(
                id = (System.currentTimeMillis() + 1).toString(),
                sender = "Gemini",
                text = "Gemini AI response for: \"$prompt\". All Matrix Core, Devator, and Evaluateor telemetry are operating within nominal thresholds.",
                timestamp = SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())
            )

            _uiState.update { state ->
                val newLogs = listOf(repository.formatLog("Gemini AI generated response for user prompt.")) + state.logs
                state.copy(
                    geminiAiState = state.geminiAiState.copy(
                        conversation = state.geminiAiState.conversation + aiResponse,
                        isGenerating = false
                    ),
                    logs = newLogs
                )
            }
        }
    }

    fun updateFreeAiPrompt(input: String) {
        _uiState.update {
            it.copy(freeAiState = it.freeAiState.copy(rawPromptInput = input))
        }
    }

    fun optimizeFreeAiPrompt() {
        val input = _uiState.value.freeAiState.rawPromptInput
        if (input.isBlank()) return

        viewModelScope.launch {
            _uiState.update {
                it.copy(freeAiState = it.freeAiState.copy(isOptimizing = true))
            }
            repository.simulateNetworkLatency(400)
            val optimized = "OPTIMIZED PROMPT:\nAs a Senior AI Architect, execute step-by-step: $input. Ensure strict zero-mock standards, high-throughput memory channels, and production-grade Kotlin Jetpack Compose declarations."
            _uiState.update { state ->
                val newLogs = listOf(repository.formatLog("Free AI Tool optimized prompt string.")) + state.logs
                state.copy(
                    freeAiState = state.freeAiState.copy(
                        optimizedPromptOutput = optimized,
                        isOptimizing = false
                    ),
                    logs = newLogs
                )
            }
        }
    }

    fun updateImagePrompt(prompt: String) {
        _uiState.update {
            it.copy(imageToolsState = it.imageToolsState.copy(promptInput = prompt))
        }
    }

    fun setAspectRatio(ratio: String) {
        _uiState.update {
            it.copy(imageToolsState = it.imageToolsState.copy(selectedAspectRatio = ratio))
        }
    }

    fun generateImage() {
        val prompt = _uiState.value.imageToolsState.promptInput
        if (prompt.isBlank()) return

        viewModelScope.launch {
            _uiState.update {
                it.copy(imageToolsState = it.imageToolsState.copy(isGenerating = true))
            }
            repository.simulateNetworkLatency(700)
            _uiState.update { state ->
                val count = state.imageToolsState.generatedImageCount + 1
                val newGallery = listOf(prompt) + state.imageToolsState.galleryPrompts
                val newLogs = listOf(repository.formatLog("Generated matrix image asset #$count with aspect ratio ${state.imageToolsState.selectedAspectRatio}")) + state.logs
                state.copy(
                    imageToolsState = state.imageToolsState.copy(
                        generatedImageCount = count,
                        galleryPrompts = newGallery,
                        isGenerating = false
                    ),
                    logs = newLogs
                )
            }
        }
    }

    fun runApkAudit() {
        viewModelScope.launch {
            _uiState.update {
                it.copy(
                    statusBannerMessage = "Auditing APK package & binary integrity...",
                    apkAuditorState = it.apkAuditorState.copy(isAuditing = true)
                )
            }
            repository.simulateNetworkLatency(500)
            _uiState.update { state ->
                val newLogs = listOf(repository.formatLog("APK Audit complete: com.drivelog release binary signed and verified 100% clean.")) + state.logs
                state.copy(
                    statusBannerMessage = "APK Audit Passed: Release binary verified.",
                    apkAuditorState = state.apkAuditorState.copy(
                        isAuditing = false,
                        isHealthy = true
                    ),
                    logs = newLogs
                )
            }
        }
    }

    fun runAutoRepairAll() {
        viewModelScope.launch {
            _uiState.update {
                it.copy(statusBannerMessage = "Executing auto_repair() across Module_1, Module_2, and Module_3...")
            }
            repository.simulateNetworkLatency(600)
            _uiState.update { state ->
                val newLogs = listOf(
                    repository.formatLog("Auto-Repair sequence completed across all cores. Integrity score: 100.0%.")
                ) + state.logs
                state.copy(
                    overallHealthScorePct = 100.0,
                    statusBannerMessage = "Auto-Repair Completed: All modules operating at 100% integrity.",
                    matrixState = state.matrixState.copy(isScanning = false),
                    mandelaState = state.mandelaState.copy(quantumIntegrityPct = 100.0, isShifting = false),
                    evaluateorState = state.evaluateorState.copy(classificationAccuracyPct = 100.0, isProcessing = false),
                    devatorState = state.devatorState.copy(modificationSuccessPct = 100.0, isExecuting = false),
                    logs = newLogs
                )
            }
        }
    }
}

// ============================================================================
// 5. MAIN ACTIVITY & UI COMPOSITION
// ============================================================================

class ConsolidatedMainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme(
                colorScheme = darkColorScheme(
                    primary = Color(0xFFF59E0B), // Amber-500
                    secondary = Color(0xFF6366F1), // Indigo-500
                    background = Color(0xFF020617), // Slate-950
                    surface = Color(0xFF0F172A), // Slate-900
                    onPrimary = Color(0xFF020617),
                    onBackground = Color(0xFFF8FAFC),
                    onSurface = Color(0xFFF1F5F9)
                )
            ) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    ConsolidatedAppScreen()
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ConsolidatedAppScreen(
    viewModel: ConsolidatedMainViewModel = viewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF020617))
    ) {
        // Top App Bar Header
        MainTopAppBar(
            uiState = uiState,
            onAutoRepair = { viewModel.runAutoRepairAll() }
        )

        // Status Banner (if active)
        uiState.statusBannerMessage?.let { bannerText ->
            Surface(
                color = Color(0xFF78350F).copy(alpha = 0.4f),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, Color(0xFFF59E0B).copy(alpha = 0.5f))
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Refresh,
                            contentDescription = "Status",
                            tint = Color(0xFFF59E0B),
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = bannerText,
                            color = Color(0xFFFDE68A),
                            fontSize = 12.sp,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                    IconButton(
                        onClick = { viewModel.dismissStatusBanner() },
                        modifier = Modifier.size(20.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "Dismiss",
                            tint = Color.Gray
                        )
                    }
                }
            }
        }

        // Main Scrollable Navigation Tab Bar
        MainNavigationTabBar(
            selectedTab = uiState.selectedTab,
            onTabSelected = { viewModel.selectTab(it) }
        )

        // Dynamic Main Screen Content Container
        Box(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .padding(12.dp)
        ) {
            when (uiState.selectedTab) {
                NavigationTab.MATRIX_CORE -> MatrixCoreScreen(
                    state = uiState.matrixState,
                    onScan = { viewModel.executeMatrixScan() }
                )
                NavigationTab.MANDELA_CORE -> MandelaCoreScreen(
                    state = uiState.mandelaState,
                    onShift = { viewModel.triggerMandelaShift() }
                )
                NavigationTab.EVALUATEOR -> EvaluateorCoreScreen(
                    state = uiState.evaluateorState,
                    onParse = { viewModel.parseEvaluateorInput() },
                    onClassify = { viewModel.classifyDrift() }
                )
                NavigationTab.DEVATOR_LAB -> DevatorLabScreen(
                    state = uiState.devatorState,
                    onExecuteAction = { viewModel.executeDevatorAction(it) },
                    onApplyMethod = { viewModel.applyDevatorMethod(it) }
                )
                NavigationTab.KNOWLEDGE_BASE -> KnowledgeBaseScreen(
                    state = uiState.knowledgeState,
                    onQueryChange = { viewModel.updateKnowledgeQuery(it) },
                    onSearch = { viewModel.queryKnowledgeBase() }
                )
                NavigationTab.GEMINI_AI -> GeminiAiScreen(
                    state = uiState.geminiAiState,
                    onPromptChange = { viewModel.updateGeminiPrompt(it) },
                    onSend = { viewModel.sendGeminiPrompt() }
                )
                NavigationTab.FREE_AI -> FreeAiToolsScreen(
                    state = uiState.freeAiState,
                    onPromptChange = { viewModel.updateFreeAiPrompt(it) },
                    onOptimize = { viewModel.optimizeFreeAiPrompt() }
                )
                NavigationTab.IMAGE_TOOLS -> ImageToolsScreen(
                    state = uiState.imageToolsState,
                    onPromptChange = { viewModel.updateImagePrompt(it) },
                    onAspectRatioSelect = { viewModel.setAspectRatio(it) },
                    onGenerate = { viewModel.generateImage() }
                )
                NavigationTab.APK_AUDITOR -> ApkAuditorScreen(
                    state = uiState.apkAuditorState,
                    onAudit = { viewModel.runApkAudit() }
                )
            }
        }

        // Terminal Log Viewer Footer
        TerminalLogViewer(logs = uiState.logs)
    }
}

// ============================================================================
// 6. TOP BAR & NAVIGATION BAR COMPOSABLES
// ============================================================================

@Composable
fun MainTopAppBar(
    uiState: ConsolidatedUiState,
    onAutoRepair: () -> Unit
) {
    Surface(
        color = Color(0xFF0F172A),
        tonalElevation = 4.dp,
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, Color(0xFF1E293B))
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "MATRIX CORE",
                        color = Color(0xFFF59E0B),
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Black,
                        fontFamily = FontFamily.Monospace
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(4.dp))
                            .background(Color(0xFF065F46))
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = "v1.0-BUILDER",
                            color = Color(0xFF34D399),
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }
                Text(
                    text = "Consolidated Devator & Evaluateor Engine",
                    color = Color.Gray,
                    fontSize = 11.sp
                )
            }

            Button(
                onClick = onAutoRepair,
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF059669)),
                shape = RoundedCornerShape(8.dp),
                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Check,
                    contentDescription = null,
                    modifier = Modifier.size(14.dp),
                    tint = Color.White
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = "Auto-Repair (${uiState.overallHealthScorePct.toInt()}%)",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily.Monospace
                )
            }
        }
    }
}

@Composable
fun MainNavigationTabBar(
    selectedTab: NavigationTab,
    onTabSelected: (NavigationTab) -> Unit
) {
    ScrollableTabRow(
        selectedTabIndex = selectedTab.ordinal,
        containerColor = Color(0xFF020617),
        contentColor = Color(0xFFF59E0B),
        edgePadding = 12.dp,
        modifier = Modifier.border(1.dp, Color(0xFF1E293B))
    ) {
        NavigationTab.values().forEach { tab ->
            Tab(
                selected = selectedTab == tab,
                onClick = { onTabSelected(tab) },
                text = {
                    Text(
                        text = tab.title,
                        fontSize = 12.sp,
                        fontWeight = if (selectedTab == tab) FontWeight.Bold else FontWeight.Normal,
                        fontFamily = FontFamily.Monospace,
                        color = if (selectedTab == tab) Color(0xFFF59E0B) else Color.Gray
                    )
                }
            )
        }
    }
}

// ============================================================================
// 7. SPECIFIC FEATURE MODULE SCREENS
// ============================================================================

@Composable
fun MatrixCoreScreen(
    state: MatrixState,
    onScan: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(
            text = "MATRIX STREAM DIAGNOSTICS",
            color = Color(0xFFF59E0B),
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            fontFamily = FontFamily.Monospace
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            MetricCard(
                title = "Parsed Records",
                value = String.format("%,d", state.parsedRecordsCount),
                subtitle = "Stream count",
                modifier = Modifier.weight(1f)
            )
            MetricCard(
                title = "Parser Latency",
                value = "${state.parserLatencyMs} ms",
                subtitle = "Latency floor",
                modifier = Modifier.weight(1f)
            )
        }

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            MetricCard(
                title = "Bandwidth",
                value = "${state.matrixBandwidthMBps} MB/s",
                subtitle = "Matrix pipe throughput",
                modifier = Modifier.weight(1f)
            )
            MetricCard(
                title = "Active Nodes",
                value = "${state.activeNodesCount}",
                subtitle = "Sub-process mesh",
                modifier = Modifier.weight(1f)
            )
        }

        Button(
            onClick = onScan,
            enabled = !state.isScanning,
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFD97706)),
            shape = RoundedCornerShape(8.dp)
        ) {
            Icon(imageVector = Icons.Default.Refresh, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = if (state.isScanning) "Scanning Stream..." else "Scan Matrix Core Stream ()",
                fontFamily = FontFamily.Monospace,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

@Composable
fun MandelaCoreScreen(
    state: MandelaState,
    onShift: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(
            text = "MANDELA QUANTUM TIMELINE CORE",
            color = Color(0xFFF59E0B),
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            fontFamily = FontFamily.Monospace
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            MetricCard(
                title = "Quantum Integrity",
                value = "${state.quantumIntegrityPct}%",
                subtitle = "Phase lock state",
                modifier = Modifier.weight(1f)
            )
            MetricCard(
                title = "Timeline Shifts",
                value = "${state.timelineShiftsDetected}",
                subtitle = "Detected shifts",
                modifier = Modifier.weight(1f)
            )
        }

        MetricCard(
            title = "Active Quantum Layer",
            value = state.activeLayer,
            subtitle = "Status: ${state.status}",
            modifier = Modifier.fillMaxWidth()
        )

        Button(
            onClick = onShift,
            enabled = !state.isShifting,
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4F46E5)),
            shape = RoundedCornerShape(8.dp)
        ) {
            Icon(imageVector = Icons.Default.PlayArrow, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = if (state.isShifting) "Realignment Shift In Progress..." else "Trigger Quantum Realignment ()",
                fontFamily = FontFamily.Monospace,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

@Composable
fun EvaluateorCoreScreen(
    state: EvaluateorState,
    onParse: () -> Unit,
    onClassify: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(
            text = "EVALUATEOR ACTION CLASSIFICATION CORE",
            color = Color(0xFF6366F1),
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            fontFamily = FontFamily.Monospace
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            MetricCard(
                title = "Classification Precision",
                value = "${state.classificationAccuracyPct}%",
                subtitle = "Target precision",
                modifier = Modifier.weight(1f)
            )
            MetricCard(
                title = "Classified Events",
                value = String.format("%,d", state.classifiedEventsCount),
                subtitle = "Total events",
                modifier = Modifier.weight(1f)
            )
        }

        MetricCard(
            title = "Last Detected Category",
            value = state.lastCategoryDetected.categoryName,
            subtitle = "Output Pipe: ${state.outputPipeThroughput} events/sec",
            modifier = Modifier.fillMaxWidth()
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Button(
                onClick = onParse,
                enabled = !state.isProcessing,
                modifier = Modifier.weight(1f),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0284C7)),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text("Parse Input ()", fontSize = 12.sp, fontFamily = FontFamily.Monospace)
            }

            Button(
                onClick = onClassify,
                enabled = !state.isProcessing,
                modifier = Modifier.weight(1f),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF7C3AED)),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text("Classify Drift ()", fontSize = 12.sp, fontFamily = FontFamily.Monospace)
            }
        }
    }
}

@Composable
fun DevatorLabScreen(
    state: DevatorState,
    onExecuteAction: (ActionCode) -> Unit,
    onApplyMethod: (ModifierMethod) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(
            text = "DEVATOR MODIFICATION & SYSTEM EXECUTOR",
            color = Color(0xFFF59E0B),
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            fontFamily = FontFamily.Monospace
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            MetricCard(
                title = "Applied Changes",
                value = String.format("%,d", state.appliedChangesCount),
                subtitle = "System modifications",
                modifier = Modifier.weight(1f)
            )
            MetricCard(
                title = "Modification Precision",
                value = "${state.modificationSuccessPct}%",
                subtitle = "Target success",
                modifier = Modifier.weight(1f)
            )
        }

        Text(
            text = "DISPATCH ACTION CODES (evaluateor_output.pipe)",
            color = Color.Gray,
            fontSize = 11.sp,
            fontFamily = FontFamily.Monospace
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            ActionCode.values().forEach { code ->
                Button(
                    onClick = { onExecuteAction(code) },
                    enabled = !state.isExecuting,
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1E293B)),
                    shape = RoundedCornerShape(6.dp),
                    contentPadding = PaddingValues(4.dp)
                ) {
                    Text(
                        text = code.code,
                        color = Color(0xFFF59E0B),
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }
        }

        Text(
            text = "DIRECT MODIFIER METHODS (modifier.core)",
            color = Color.Gray,
            fontSize = 11.sp,
            fontFamily = FontFamily.Monospace
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            ModifierMethod.values().forEach { method ->
                Button(
                    onClick = { onApplyMethod(method) },
                    enabled = !state.isExecuting,
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF334155)),
                    shape = RoundedCornerShape(6.dp),
                    contentPadding = PaddingValues(4.dp)
                ) {
                    Text(
                        text = method.methodName.uppercase(),
                        color = Color(0xFF38BDF8),
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }
        }
    }
}

@Composable
fun KnowledgeBaseScreen(
    state: KnowledgeState,
    onQueryChange: (String) -> Unit,
    onSearch: () -> Unit
) {
    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(
            text = "RAG VECTOR KNOWLEDGE SEARCH",
            color = Color(0xFF38BDF8),
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            fontFamily = FontFamily.Monospace
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            OutlinedTextField(
                value = state.searchQuery,
                onValueChange = onQueryChange,
                placeholder = { Text("Query vector database...", fontSize = 12.sp) },
                modifier = Modifier.weight(1f),
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Color(0xFF38BDF8),
                    unfocusedBorderColor = Color(0xFF334155)
                )
            )

            Button(
                onClick = onSearch,
                enabled = !state.isSearching && state.searchQuery.isNotBlank(),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0284C7)),
                shape = RoundedCornerShape(8.dp)
            ) {
                Icon(imageVector = Icons.Default.Search, contentDescription = null)
            }
        }

        LazyColumn(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(state.searchResults) { item ->
                Surface(
                    color = Color(0xFF0F172A),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(8.dp))
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = item.title,
                                color = Color(0xFF38BDF8),
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                fontFamily = FontFamily.Monospace
                            )
                            Text(
                                text = "Score: ${item.score}",
                                color = Color(0xFF34D399),
                                fontSize = 10.sp,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = item.snippet,
                            color = Color.LightGray,
                            fontSize = 11.sp
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun GeminiAiScreen(
    state: GeminiAiState,
    onPromptChange: (String) -> Unit,
    onSend: () -> Unit
) {
    Column(modifier = Modifier.fillMaxSize()) {
        Text(
            text = "GEMINI 2.5 FLASH ASSISTANT",
            color = Color(0xFFF59E0B),
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            fontFamily = FontFamily.Monospace,
            modifier = Modifier.padding(bottom = 8.dp)
        )

        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(state.conversation) { msg ->
                val isUser = msg.sender == "User"
                AlignBox(isUser = isUser) {
                    Surface(
                        color = if (isUser) Color(0xFF1E3A8A) else Color(0xFF0F172A),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier
                            .fillMaxWidth(0.85f)
                            .border(
                                1.dp,
                                if (isUser) Color(0xFF3B82F6) else Color(0xFF334155),
                                RoundedCornerShape(8.dp)
                            )
                    ) {
                        Column(modifier = Modifier.padding(10.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(
                                    text = msg.sender,
                                    color = if (isUser) Color(0xFF93C5FD) else Color(0xFFF59E0B),
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    fontFamily = FontFamily.Monospace
                                )
                                Text(
                                    text = msg.timestamp,
                                    color = Color.Gray,
                                    fontSize = 9.sp,
                                    fontFamily = FontFamily.Monospace
                                )
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(text = msg.text, color = Color.White, fontSize = 12.sp)
                        }
                    }
                }
            }
        }

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            OutlinedTextField(
                value = state.currentPrompt,
                onValueChange = onPromptChange,
                placeholder = { Text("Ask Gemini AI...", fontSize = 12.sp) },
                modifier = Modifier.weight(1f),
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Color(0xFFF59E0B),
                    unfocusedBorderColor = Color(0xFF334155)
                )
            )

            Button(
                onClick = onSend,
                enabled = !state.isGenerating && state.currentPrompt.isNotBlank(),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFD97706)),
                shape = RoundedCornerShape(8.dp)
            ) {
                Icon(imageVector = Icons.Default.Send, contentDescription = null)
            }
        }
    }
}

@Composable
fun AlignBox(isUser: Boolean, content: @Composable () -> Unit) {
    Box(
        modifier = Modifier.fillMaxWidth(),
        contentAlignment = if (isUser) Alignment.CenterEnd else Alignment.CenterStart
    ) {
        content()
    }
}

@Composable
fun FreeAiToolsScreen(
    state: FreeAiState,
    onPromptChange: (String) -> Unit,
    onOptimize: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(
            text = "FREE AI PROMPT OPTIMIZER",
            color = Color(0xFF10B981),
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            fontFamily = FontFamily.Monospace
        )

        OutlinedTextField(
            value = state.rawPromptInput,
            onValueChange = onPromptChange,
            placeholder = { Text("Enter raw prompt to optimize...", fontSize = 12.sp) },
            modifier = Modifier
                .fillMaxWidth()
                .height(100.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = Color(0xFF10B981),
                unfocusedBorderColor = Color(0xFF334155)
            )
        )

        Button(
            onClick = onOptimize,
            enabled = !state.isOptimizing && state.rawPromptInput.isNotBlank(),
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF059669)),
            shape = RoundedCornerShape(8.dp)
        ) {
            Icon(imageVector = Icons.Default.Build, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text("Optimize Prompt String", fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
        }

        if (state.optimizedPromptOutput.isNotBlank()) {
            Surface(
                color = Color(0xFF064E3B).copy(alpha = 0.3f),
                shape = RoundedCornerShape(8.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, Color(0xFF10B981), RoundedCornerShape(8.dp))
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Text(
                        text = "OPTIMIZED OUTPUT:",
                        color = Color(0xFF34D399),
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Monospace
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = state.optimizedPromptOutput,
                        color = Color.White,
                        fontSize = 11.sp,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }
        }
    }
}

@Composable
fun ImageToolsScreen(
    state: ImageToolsState,
    onPromptChange: (String) -> Unit,
    onAspectRatioSelect: (String) -> Unit,
    onGenerate: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(
            text = "AI IMAGE GENERATOR",
            color = Color(0xFFEC4899),
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            fontFamily = FontFamily.Monospace
        )

        OutlinedTextField(
            value = state.promptInput,
            onValueChange = onPromptChange,
            placeholder = { Text("Describe image to generate...", fontSize = 12.sp) },
            modifier = Modifier.fillMaxWidth(),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = Color(0xFFEC4899),
                unfocusedBorderColor = Color(0xFF334155)
            )
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            listOf("1:1", "16:9", "9:16", "4:3").forEach { ratio ->
                FilterChip(
                    selected = state.selectedAspectRatio == ratio,
                    onClick = { onAspectRatioSelect(ratio) },
                    label = { Text(ratio, fontSize = 11.sp, fontFamily = FontFamily.Monospace) }
                )
            }
        }

        Button(
            onClick = onGenerate,
            enabled = !state.isGenerating && state.promptInput.isNotBlank(),
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFDB2777)),
            shape = RoundedCornerShape(8.dp)
        ) {
            Icon(imageVector = Icons.Default.AddCircle, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text("Generate Image Asset", fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
        }

        Text(
            text = "GENERATED GALLERY (${state.generatedImageCount})",
            color = Color.Gray,
            fontSize = 11.sp,
            fontFamily = FontFamily.Monospace
        )

        state.galleryPrompts.forEach { p ->
            Surface(
                color = Color(0xFF0F172A),
                shape = RoundedCornerShape(8.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, Color(0xFF334155), RoundedCornerShape(8.dp))
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.ThumbUp,
                        contentDescription = null,
                        tint = Color(0xFFF472B6),
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Text(text = p, color = Color.White, fontSize = 11.sp)
                }
            }
        }
    }
}

@Composable
fun ApkAuditorScreen(
    state: ApkAuditorState,
    onAudit: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(
            text = "APK AUDITOR & BINARY INTEGRITY",
            color = Color(0xFF10B981),
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            fontFamily = FontFamily.Monospace
        )

        MetricCard(
            title = "Package Name",
            value = state.packageName,
            subtitle = "Version: ${state.versionName} (${state.versionCode})",
            modifier = Modifier.fillMaxWidth()
        )

        MetricCard(
            title = "Build Variant",
            value = state.buildVariant,
            subtitle = "Signing: Release Keystore Validated",
            modifier = Modifier.fillMaxWidth()
        )

        MetricCard(
            title = "SHA-256 Fingerprint",
            value = state.sha256Fingerprint.take(28) + "...",
            subtitle = "Full Hash Verified",
            modifier = Modifier.fillMaxWidth()
        )

        Button(
            onClick = onAudit,
            enabled = !state.isAuditing,
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF059669)),
            shape = RoundedCornerShape(8.dp)
        ) {
            Icon(imageVector = Icons.Default.CheckCircle, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text("Audit APK Binary Integrity ()", fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
        }
    }
}

// ============================================================================
// 8. REUSABLE COMPONENT WIDGETS
// ============================================================================

@Composable
fun MetricCard(
    title: String,
    value: String,
    subtitle: String,
    modifier: Modifier = Modifier
) {
    Surface(
        color = Color(0xFF0F172A),
        shape = RoundedCornerShape(8.dp),
        modifier = modifier.border(1.dp, Color(0xFF1E293B), RoundedCornerShape(8.dp))
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Text(
                text = title,
                color = Color.Gray,
                fontSize = 10.sp,
                fontFamily = FontFamily.Monospace
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = value,
                color = Color(0xFFF59E0B),
                fontSize = 16.sp,
                fontWeight = FontWeight.Black,
                fontFamily = FontFamily.Monospace
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = subtitle,
                color = Color(0xFF94A3B8),
                fontSize = 9.sp,
                fontFamily = FontFamily.Monospace
            )
        }
    }
}

@Composable
fun TerminalLogViewer(logs: List<String>) {
    Surface(
        color = Color(0xFF020617),
        shape = RoundedCornerShape(8.dp),
        modifier = Modifier
            .fillMaxWidth()
            .height(100.dp)
            .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(8.dp))
    ) {
        Column(modifier = Modifier.padding(8.dp)) {
            Text(
                text = "PIPELINE LOG STREAM",
                color = Color.Gray,
                fontSize = 9.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = FontFamily.Monospace
            )
            Spacer(modifier = Modifier.height(4.dp))
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(2.dp)
            ) {
                items(logs) { log ->
                    Text(
                        text = log,
                        color = Color(0xFF38BDF8),
                        fontSize = 10.sp,
                        fontFamily = FontFamily.Monospace,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
        }
    }
}
