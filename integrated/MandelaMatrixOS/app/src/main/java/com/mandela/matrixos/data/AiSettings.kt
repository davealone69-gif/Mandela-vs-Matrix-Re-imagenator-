package com.mandela.matrixos.data

import android.content.Context
import android.content.SharedPreferences
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey

/** Supported LLM providers. Keys are never shipped; users add their own free-tier keys. */
enum class LlmProvider(
    val displayName: String,
    val baseUrl: String,
    val defaultModel: String,
    val needsKey: Boolean
) {
    GEMINI("Gemini (Google AI free tier)", "https://generativelanguage.googleapis.com/v1beta", "gemini-3.7-flash", true),
    GROQ("Groq (free)", "https://api.groq.com/openai/v1", "llama-3.1-8b-instant", true),
    OPENROUTER("OpenRouter (free)", "https://openrouter.ai/api/v1", "mistralai/mistral-7b-instruct:free", true),
    OPENAI_COMPAT_LOCAL("Local OpenAI-compatible", "http://127.0.0.1:8081/v1", "local-model", false)
}

data class AiConfig(
    val provider: LlmProvider = LlmProvider.GEMINI,
    val apiKey: String = "",
    val model: String = provider.defaultModel,
    val baseUrl: String = provider.baseUrl
) {
    val usable: Boolean get() = !provider.needsKey || apiKey.isNotBlank()
}

/**
 * Central store for AI provider settings. API keys live in Android Keystore-backed
 * encrypted preferences. Falls back to plain prefs on devices with a broken
 * keystore (extremely rare) so the app never crash-loops.
 */
object AiSettings {

    @Volatile
    private var prefs: SharedPreferences? = null

    private fun prefs(context: Context): SharedPreferences =
        prefs ?: synchronized(this) {
            prefs ?: createPrefs(context.applicationContext).also { prefs = it }
        }

    private fun createPrefs(context: Context): SharedPreferences {
        return try {
            val masterKey = MasterKey.Builder(context, MasterKey.DEFAULT_MASTER_KEY_ALIAS)
                .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                .build()
            EncryptedSharedPreferences.create(
                context,
                "mandela_secure_prefs",
                masterKey,
                EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
                EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
            )
        } catch (e: Exception) {
            context.getSharedPreferences("mandela_prefs_fallback", Context.MODE_PRIVATE)
        }
    }

    fun load(context: Context): AiConfig {
        val p = prefs(context)
        val provider = runCatching {
            LlmProvider.valueOf(p.getString(KEY_PROVIDER, LlmProvider.GEMINI.name) ?: LlmProvider.GEMINI.name)
        }.getOrDefault(LlmProvider.GEMINI)
        return AiConfig(
            provider = provider,
            apiKey = p.getString(KEY_API_KEY, "") ?: "",
            model = p.getString(KEY_MODEL, provider.defaultModel) ?: provider.defaultModel,
            baseUrl = p.getString(KEY_BASE_URL, provider.baseUrl) ?: provider.baseUrl
        )
    }

    fun save(context: Context, config: AiConfig) {
        prefs(context).edit()
            .putString(KEY_PROVIDER, config.provider.name)
            .putString(KEY_API_KEY, config.apiKey.trim())
            .putString(KEY_MODEL, config.model.trim().ifBlank { config.provider.defaultModel })
            .putString(KEY_BASE_URL, config.baseUrl.trim().ifBlank { config.provider.baseUrl })
            .apply()
    }

    private const val KEY_PROVIDER = "ai_provider"
    private const val KEY_API_KEY = "ai_api_key"
    private const val KEY_MODEL = "ai_model"
    private const val KEY_BASE_URL = "ai_base_url"
}
