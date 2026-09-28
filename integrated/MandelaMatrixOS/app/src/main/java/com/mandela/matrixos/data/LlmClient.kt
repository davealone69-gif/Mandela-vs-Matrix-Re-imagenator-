package com.mandela.matrixos.data

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException
import java.util.concurrent.TimeUnit

/**
 * Multi-provider chat client with retries and per-provider wire formats:
 *  - Gemini:  POST {baseUrl}/models/{model}:generateContent  (x-goog-api-key header)
 *  - Groq / OpenRouter / local: OpenAI-compatible {baseUrl}/chat/completions
 *
 * No keys are stored here — every call takes a [Config].
 */
object LlmClient {
    private val client = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(120, TimeUnit.SECONDS)
        .writeTimeout(60, TimeUnit.SECONDS)
        .build()

    private val JSON = "application/json; charset=utf-8".toMediaType()

    data class Config(
        val apiKey: String,
        val provider: LlmProvider = LlmProvider.GROQ,
        val baseUrl: String = provider.baseUrl,
        val model: String = provider.defaultModel
    )

    suspend fun chat(
        config: Config,
        systemPrompt: String? = null,
        userMessage: String,
        history: List<ChatMessage> = emptyList()
    ): Result<String> = withContext(Dispatchers.IO) {
        if (config.provider.needsKey && config.apiKey.isBlank()) {
            return@withContext Result.failure(
                IllegalStateException("${config.provider.displayName}: API key required — add it on the FreeAI tab")
            )
        }
        if (config.model.isBlank()) {
            return@withContext Result.failure(IllegalStateException("No model selected"))
        }
        executeWithRetry(config, systemPrompt, userMessage, history)
    }

    // ── retry core ───────────────────────────────────────────────────────────

    private const val MAX_ATTEMPTS = 4

    private suspend fun executeWithRetry(
        config: Config,
        systemPrompt: String?,
        userMessage: String,
        history: List<ChatMessage>
    ): Result<String> {
        var lastError: String = "Unknown LLM error"
        repeat(MAX_ATTEMPTS) { attempt ->
            try {
                val request = if (config.provider == LlmProvider.GEMINI) {
                    geminiRequest(config, systemPrompt, userMessage, history)
                } else {
                    openAiRequest(config, systemPrompt, userMessage, history)
                }
                client.newCall(request).execute().use { resp ->
                    val raw = resp.body?.string()?.trim().orEmpty()
                    if (resp.isSuccessful) {
                        val content = runCatching {
                            if (config.provider == LlmProvider.GEMINI) extractGeminiContent(raw)
                            else extractChatContent(raw)
                        }
                        return if (content.isSuccess && content.getOrThrow().isNotBlank()) {
                            Result.success(content.getOrThrow())
                        } else {
                            lastError = "HTTP ${resp.code}: provider returned no usable content"
                            Result.failure(Exception(lastError))
                        }
                    }
                    lastError = "HTTP ${resp.code}: ${raw.take(300).ifBlank { "empty response" }}"
                    val retryable = resp.code == 429 || resp.code in 500..599
                    if (!retryable || attempt == MAX_ATTEMPTS - 1) {
                        return Result.failure(Exception(lastError))
                    }
                }
            } catch (e: IOException) {
                lastError = "Network error: ${e.message ?: e.javaClass.simpleName}"
                if (attempt == MAX_ATTEMPTS - 1) return Result.failure(Exception(lastError))
            } catch (e: Exception) {
                return Result.failure(e)
            }
            delay((1500L * (attempt + 1)).coerceAtMost(6000L))
        }
        return Result.failure(Exception(lastError))
    }

    // ── Gemini wire format ───────────────────────────────────────────────────

    private fun geminiRequest(
        config: Config,
        systemPrompt: String?,
        userMessage: String,
        history: List<ChatMessage>
    ): Request {
        val contents = JSONArray()
        history.takeLast(10).forEach { msg ->
            contents.put(
                JSONObject()
                    .put("role", if (msg.role == "assistant") "model" else "user")
                    .put("parts", JSONArray().put(JSONObject().put("text", msg.content)))
            )
        }
        contents.put(
            JSONObject()
                .put("role", "user")
                .put("parts", JSONArray().put(JSONObject().put("text", userMessage)))
        )
        val body = JSONObject()
            .put("contents", contents)
            .put("generationConfig", JSONObject().put("temperature", 0.7).put("maxOutputTokens", 2048))
        if (!systemPrompt.isNullOrBlank()) {
            body.put("systemInstruction", JSONObject().put("parts", JSONArray().put(JSONObject().put("text", systemPrompt))))
        }
        return Request.Builder()
            .url("${config.baseUrl.trimEnd('/')}/models/${config.model}:generateContent")
            .header("x-goog-api-key", config.apiKey)
            .post(body.toString().toRequestBody(JSON))
            .build()
    }

    private fun extractGeminiContent(raw: String): String {
        if (raw.isBlank()) throw Exception("Gemini returned an empty response")
        val candidates = JSONObject(raw).optJSONArray("candidates")
            ?: throw Exception("Gemini returned no candidates: ${raw.take(200)}")
        if (candidates.length() == 0) throw Exception("Gemini returned 0 candidates (possibly safety-blocked)")
        val parts = candidates.getJSONObject(0).optJSONObject("content")?.optJSONArray("parts")
            ?: throw Exception("Gemini candidate had no content parts")
        val sb = StringBuilder()
        for (i in 0 until parts.length()) sb.append(parts.getJSONObject(i).optString("text"))
        return sb.toString().trim()
    }

    // ── OpenAI-compatible wire format ────────────────────────────────────────

    private fun openAiRequest(
        config: Config,
        systemPrompt: String?,
        userMessage: String,
        history: List<ChatMessage>
    ): Request {
        val messages = JSONArray()
        if (!systemPrompt.isNullOrBlank()) {
            messages.put(JSONObject().put("role", "system").put("content", systemPrompt))
        }
        history.takeLast(12).forEach { msg ->
            val role = if (msg.role == "assistant") "assistant" else "user"
            messages.put(JSONObject().put("role", role).put("content", msg.content))
        }
        messages.put(JSONObject().put("role", "user").put("content", userMessage))
        val body = JSONObject()
            .put("model", config.model)
            .put("messages", messages)
            .put("temperature", 0.7)
        return Request.Builder()
            .url("${config.baseUrl.trimEnd('/')}/chat/completions")
            .apply { if (config.apiKey.isNotBlank()) header("Authorization", "Bearer ${config.apiKey}") }
            .header("Content-Type", "application/json")
            .post(body.toString().toRequestBody(JSON))
            .build()
    }

    private fun extractChatContent(raw: String): String {
        if (raw.isBlank()) throw Exception("provider returned an empty response")
        val content = JSONObject(raw)
            .optJSONArray("choices")
            ?.optJSONObject(0)
            ?.optJSONObject("message")
            ?.optString("content")
            ?.trim()
            .orEmpty()
        if (content.isBlank()) throw Exception("provider returned valid JSON but no choices[0].message.content")
        return content
    }
}
