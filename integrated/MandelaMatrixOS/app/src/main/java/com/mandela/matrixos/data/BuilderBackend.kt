package com.mandela.matrixos.data

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.util.concurrent.TimeUnit

/** Real local builder transport. It never reports success unless the backend does. */
object BuilderBackend {
    private const val DEFAULT_URL = "http://127.0.0.1:3000"
    private val client = OkHttpClient.Builder()
        .connectTimeout(3, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()

    data class Result(val ok: Boolean, val message: String, val buildId: String? = null, val artifactUrl: String? = null)

    fun normalizeUrl(value: String): String = value.trim().trimEnd('/').ifBlank { DEFAULT_URL }
    suspend fun health(baseUrl: String): Result = request("GET", "${normalizeUrl(baseUrl)}/health")

    suspend fun executeSwarm(baseUrl: String, task: String, plan: String, code: String, critic: String): Result =
        postJson("${normalizeUrl(baseUrl)}/swarm/execute", JSONObject().apply {
            put("task", task); put("plan", plan); put("code", code); put("critic", critic)
        })

    suspend fun buildApk(baseUrl: String, task: String, project: String): Result =
        postJson("${normalizeUrl(baseUrl)}/build/apk", JSONObject().apply {
            put("task", task); put("project", project); put("verifyArtifact", true)
        })

    suspend fun pollBuild(baseUrl: String, buildId: String, timeoutMs: Long = 180_000): Result {
        val start = System.currentTimeMillis()
        while (System.currentTimeMillis() - start < timeoutMs) {
            val result = request("GET", "${normalizeUrl(baseUrl)}/build/$buildId")
            if (result.ok && (result.artifactUrl != null || result.message.contains("success", true) || result.message.contains("complete", true))) return result
            if (!result.ok && !result.message.contains("running", true) && !result.message.contains("pending", true)) return result
            delay(1500)
        }
        return Result(false, "Build timed out after ${timeoutMs / 1000}s", buildId)
    }

    private suspend fun request(method: String, url: String): Result = withContext(Dispatchers.IO) {
        runCatching {
            val request = Request.Builder().url(url).method(method, null).build()
            client.newCall(request).execute().use { response -> parse(response.isSuccessful, response.message, response.body?.string().orEmpty()) }
        }.getOrElse { Result(false, "${it.javaClass.simpleName}: ${it.message ?: "connection failed"}") }
    }

    private suspend fun postJson(url: String, payload: JSONObject): Result = withContext(Dispatchers.IO) {
        runCatching {
            val request = Request.Builder().url(url).post(payload.toString().toRequestBody("application/json".toMediaType())).build()
            client.newCall(request).execute().use { response -> parse(response.isSuccessful, response.message, response.body?.string().orEmpty()) }
        }.getOrElse { Result(false, "${it.javaClass.simpleName}: ${it.message ?: "connection failed"}") }
    }

    private fun parse(ok: Boolean, httpMessage: String, body: String): Result {
        val json = runCatching { JSONObject(body) }.getOrNull()
        val message = json?.optString("message")?.takeIf { it.isNotBlank() }
            ?: json?.optString("status")?.takeIf { it.isNotBlank() }
            ?: body.take(2000).ifBlank { httpMessage }
        return Result(ok, message, json?.optString("buildId")?.takeIf { it.isNotBlank() }, json?.optString("artifactUrl")?.takeIf { it.isNotBlank() })
    }
}
