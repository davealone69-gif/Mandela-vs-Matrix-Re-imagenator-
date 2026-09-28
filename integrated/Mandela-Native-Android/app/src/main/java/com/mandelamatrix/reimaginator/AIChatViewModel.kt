package com.mandelamatrix.reimaginator

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory

data class ChatMessage(
    val id: String = java.util.UUID.randomUUID().toString(),
    val text: String,
    val isUser: Boolean,
    val isThinking: Boolean = false
)

class AIChatViewModel : ViewModel() {
    private val _messages = MutableStateFlow(
        listOf(ChatMessage(text = "Hello! I am your Mandela AI assistant. How can I help?", isUser = false))
    )
    val messages: StateFlow<List<ChatMessage>> = _messages.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val moshi = Moshi.Builder().add(KotlinJsonAdapterFactory()).build()

    fun sendMessage(text: String, useThinking: Boolean = false) {
        if (text.isBlank()) return

        val userMsg = ChatMessage(text = text, isUser = true)
        _messages.value = _messages.value + userMsg

        val aiMsgId = java.util.UUID.randomUUID().toString()
        _messages.value = _messages.value + ChatMessage(id = aiMsgId, text = "", isUser = false, isThinking = useThinking)
        _isLoading.value = true

        viewModelScope.launch(Dispatchers.IO) {
            try {
                val apiKey = BuildConfig.GEMINI_API_KEY
                val history = _messages.value.dropLast(1).mapNotNull {
                    if (it.text.isNotBlank() && !it.isThinking) {
                        Content(parts = listOf(Part(text = it.text)), role = if (it.isUser) "user" else "model")
                    } else null
                }.toMutableList()
                history.add(Content(parts = listOf(Part(text = text)), role = "user"))

                val config = if (useThinking) GenerationConfig(thinkingConfig = ThinkingConfig("HIGH")) else null
                val request = GenerateContentRequest(contents = history, generationConfig = config)

                val responseStream = if (useThinking) {
                    RetrofitClient.service.generateProContentStream(apiKey, request)
                } else {
                    RetrofitClient.service.generateContentStream(apiKey, request)
                }

                var fullResponse = ""
                responseStream.byteStream().bufferedReader().use { reader ->
                    var line: String?
                    while (reader.readLine().also { line = it } != null) {
                        if (line!!.startsWith("data: ")) {
                            val data = line!!.removePrefix("data: ").trim()
                            if (data == "[DONE]") continue
                            try {
                                val chunk = moshi.adapter(GenerateContentResponse::class.java).fromJson(data)
                                val textPart = chunk?.candidates?.firstOrNull()?.content?.parts?.firstOrNull()?.text
                                if (textPart != null) {
                                    fullResponse += textPart
                                    _messages.value = _messages.value.map {
                                        if (it.id == aiMsgId) it.copy(text = fullResponse, isThinking = false) else it
                                    }
                                }
                            } catch (_: Exception) {}
                        }
                    }
                }
            } catch (e: Exception) {
                _messages.value = _messages.value.map {
                    if (it.id == aiMsgId) it.copy(text = "Error: ${e.message}", isThinking = false) else it
                }
            } finally {
                _isLoading.value = false
            }
        }
    }
}
