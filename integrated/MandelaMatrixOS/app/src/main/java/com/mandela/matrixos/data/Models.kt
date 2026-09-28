package com.mandela.matrixos.data

data class ChatMessage(
    val id: String = System.currentTimeMillis().toString(),
    val role: String,
    val content: String,
    val timestamp: Long = System.currentTimeMillis()
)

data class LlmModel(
    val id: String,
    val name: String,
    val provider: String,
    val isFree: Boolean = true,
    val description: String = ""
)

object FreeModels {
    val list = listOf(
        LlmModel("gemini-3.7-flash", "Gemini 3.7 Flash", "Gemini", true, "Google AI free tier — fast default"),
        LlmModel("llama-3.3-70b-versatile", "Llama 3.3 70B", "Groq", true, "Strong reasoning, free tier"),
        LlmModel("llama-3.1-8b-instant", "Llama 3.1 8B Instant", "Groq", true, "Fastest free tier"),
        LlmModel("gemma2-9b-it", "Gemma 2 9B", "Groq", true, "Google open model"),
        LlmModel("mistralai/mistral-7b-instruct:free", "Mistral 7B Free", "OpenRouter", true, "Rotating free pool"),
        LlmModel("local-model", "Local endpoint", "On-device/LAN", true, "Ollama / llama.cpp / LM Studio")
    )
}

enum class BuildScore { SUCCESS, PARTIAL, FAIL }

data class BuildTrajectory(
    val id: String = System.currentTimeMillis().toString(),
    val task: String,
    val agentRoles: List<String>,
    val steps: List<String>,
    val score: BuildScore,
    val quality: Int,
    val notes: String = "",
    val timestamp: Long = System.currentTimeMillis()
)

data class SkillEntry(
    val id: String = System.currentTimeMillis().toString(),
    val title: String,
    val description: String,
    val promptSnippet: String,
    val sourceTrajectoryId: String? = null,
    val timesApplied: Int = 0
)

object TrainingData {
    val sampleTrajectories = listOf(
        BuildTrajectory(
            task = "Create a Jetpack Compose settings screen",
            agentRoles = listOf("Planner", "Coder", "Reviewer"),
            steps = listOf("Planner broke task into 4 components", "Coder generated Scaffold + Switch preferences", "Reviewer fixed state hoisting issue", "Final compile succeeded"),
            score = BuildScore.SUCCESS,
            quality = 92,
            notes = "Clean separation of concerns"
        ),
        BuildTrajectory(
            task = "Add dark theme toggle",
            agentRoles = listOf("Coder", "Tester"),
            steps = listOf("Coder added isDark state", "Missed MaterialTheme propagation", "Partial UI update only"),
            score = BuildScore.PARTIAL,
            quality = 61,
            notes = "Needs better theme cascade understanding"
        ),
        BuildTrajectory(
            task = "Implement Room database for logs",
            agentRoles = listOf("Planner", "Coder"),
            steps = listOf("Planner skipped Entity definition", "Coder produced incomplete DAO", "Build failed on missing annotations"),
            score = BuildScore.FAIL,
            quality = 28,
            notes = "Agents need stronger Room skill"
        )
    )
    val sampleSkills = listOf(
        SkillEntry(
            title = "Compose State Hoisting",
            description = "Always lift state to the lowest common parent and pass events down.",
            promptSnippet = "When writing Compose UI, hoist mutable state to the caller. Use (value, onValueChange) pattern. Never keep business state inside leaf composables."
        ),
        SkillEntry(
            title = "Room Entity Checklist",
            description = "Ensure @Entity, primary key, and DAO methods are complete before coding.",
            promptSnippet = "For Room: 1) Define @Entity with @PrimaryKey 2) Create @Dao interface 3) Build @Database 4) Only then write usage code."
        ),
        SkillEntry(
            title = "Scaffold + TopAppBar Pattern",
            description = "Standard Material 3 screen shell used in successful builds.",
            promptSnippet = "Always start screens with Scaffold(topBar = { TopAppBar(...) }) { padding -> ... }. Apply paddingValues to the content root."
        )
    )
}

enum class SwarmTopology { SEQUENTIAL, PARALLEL, DEBATE, HIERARCHICAL, BUILDER_CRITIC }

data class SwarmAgent(
    val id: String = System.currentTimeMillis().toString() + (0..999).random(),
    val name: String,
    val role: String,
    val modelId: String,
    val systemPrompt: String
)

data class SwarmMessage(
    val id: String = System.currentTimeMillis().toString() + (0..999).random(),
    val agentName: String,
    val role: String,
    val content: String,
    val timestamp: Long = System.currentTimeMillis()
)

data class SwarmConfig(
    val id: String = System.currentTimeMillis().toString(),
    val name: String,
    val topology: SwarmTopology,
    val agents: List<SwarmAgent>,
    val task: String = ""
)

object SwarmDefaults {
    val defaultAgents = listOf(
        SwarmAgent(
            name = "Planner",
            role = "Planner",
            modelId = "llama3-8b-8192",
            systemPrompt = "You are a senior software planner. Break the building task into clear, ordered steps. Output only the plan."
        ),
        SwarmAgent(
            name = "Coder",
            role = "Coder",
            modelId = "llama3-70b-8192",
            systemPrompt = "You are an expert Kotlin/Jetpack Compose developer. Write clean, compilable code for the given plan. Prefer Material 3 and modern Android patterns."
        ),
        SwarmAgent(
            name = "Critic",
            role = "Reviewer",
            modelId = "mixtral-8x7b-32768",
            systemPrompt = "You are a strict code reviewer. Find bugs, missing imports, state issues, and suggest concrete fixes. Be concise."
        )
    )
}

enum class AuditLevel { INFO, WARN, ERROR, MUTATION, SECURITY }

data class AuditLog(
    val id: String = System.currentTimeMillis().toString() + (0..999).random(),
    val level: AuditLevel,
    val message: String,
    val source: String = "MatrixCore",
    val timestamp: Long = System.currentTimeMillis()
)

data class SystemMetric(val name: String, val value: String, val healthy: Boolean = true)

object MatrixCoreDefaults {
    val initialMetrics = listOf(
        SystemMetric("Uptime", "00:00:00", true),
        SystemMetric("Agents", "3 active", true),
        SystemMetric("Skills", "3 loaded", true),
        SystemMetric("Consensus", "-", true),
        SystemMetric("Build queue", "0", true),
        SystemMetric("Security", "Nominal", true)
    )
    val seedLogs = listOf(
        AuditLog(level = AuditLevel.INFO, message = "Matrix Core online"),
        AuditLog(level = AuditLevel.INFO, message = "Loaded 3 default swarm agents"),
        AuditLog(level = AuditLevel.SECURITY, message = "Permission INTERNET granted"),
        AuditLog(level = AuditLevel.INFO, message = "Training Centre skill library ready")
    )
}

data class KnowledgeEntry(
    val id: String = System.currentTimeMillis().toString() + (0..999).random(),
    val title: String,
    val body: String,
    val tags: List<String> = emptyList(),
    val anomalyScore: Int = 0,
    val timestamp: Long = System.currentTimeMillis()
)

object KnowledgeDefaults {
    val seed = listOf(
        KnowledgeEntry(
            title = "Compose state hoisting anomaly",
            body = "Leaf composables holding business state caused recomposition storms. Fix: hoist to ViewModel / parent.",
            tags = listOf("compose", "state", "performance"),
            anomalyScore = 72
        ),
        KnowledgeEntry(
            title = "Room missing @PrimaryKey",
            body = "Build failed - Entity without primary key. Checklist: @Entity + @PrimaryKey before DAO.",
            tags = listOf("room", "build", "android"),
            anomalyScore = 88
        ),
        KnowledgeEntry(
            title = "Swarm critic over-rejected valid code",
            body = "Critic agent flagged Material3 TopAppBar as deprecated incorrectly. Tightened critic prompt.",
            tags = listOf("swarm", "prompt", "false-positive"),
            anomalyScore = 41
        ),
        KnowledgeEntry(
            title = "Gradle Kotlin 2.0 Compose mismatch",
            body = "kotlinCompilerExtensionVersion incompatible with Kotlin 2.0. Switch to org.jetbrains.kotlin.plugin.compose.",
            tags = listOf("gradle", "compose", "kotlin"),
            anomalyScore = 95
        )
    )
}
