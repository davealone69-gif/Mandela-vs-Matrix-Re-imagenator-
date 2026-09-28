package com.mandela.matrixos.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Science
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

data class MutationProposal(
    val id: String = System.currentTimeMillis().toString() + (0..99).random(),
    val title: String,
    val payload: String,
    val score: Int = 0,
    val submitted: Boolean = false
)

@Composable
fun DevatorLabScreen(modifier: Modifier = Modifier) {
    var title by remember { mutableStateOf("") }
    var payload by remember { mutableStateOf("") }
    var proposals by remember {
        mutableStateOf(
            listOf(
                MutationProposal(title = "Hoist theme state", payload = "Move isDark to ViewModel", score = 78, submitted = true),
                MutationProposal(title = "Add Room cache", payload = "Entity AuditLog + DAO", score = 65, submitted = true)
            )
        )
    }

    Column(modifier = modifier.fillMaxSize().background(MaterialTheme.colorScheme.background)) {
        Surface(tonalElevation = 2.dp, modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Science, null, tint = MaterialTheme.colorScheme.primary)
                    Spacer(Modifier.width(8.dp))
                    Text("Devator Lab", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                }
                Spacer(Modifier.height(4.dp))
                Text(
                    "Mutation proposal pipeline",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }

        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            OutlinedTextField(
                value = title,
                onValueChange = { title = it },
                label = { Text("Proposal title") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )
            OutlinedTextField(
                value = payload,
                onValueChange = { payload = it },
                label = { Text("DSL / payload") },
                modifier = Modifier.fillMaxWidth(),
                minLines = 3
            )
            val previewScore = ((title.length + payload.length) % 40 + 55).coerceIn(0, 100)
            Text("Evaluateor preview score: $previewScore", style = MaterialTheme.typography.labelMedium)
            Button(
                onClick = {
                    if (title.isNotBlank() && payload.isNotBlank()) {
                        proposals = listOf(
                            MutationProposal(title = title.trim(), payload = payload.trim(), score = previewScore, submitted = true)
                        ) + proposals
                        title = ""
                        payload = ""
                    }
                },
                enabled = title.isNotBlank() && payload.isNotBlank(),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Submit to consensus")
            }
        }

        Text(
            "Mutation list",
            style = MaterialTheme.typography.titleSmall,
            fontWeight = FontWeight.SemiBold,
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp)
        )

        LazyColumn(
            contentPadding = PaddingValues(12.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(proposals, key = { it.id }) { p ->
                Card(modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(10.dp)) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(p.title, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
                            Text("${p.score}", fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                        }
                        Spacer(Modifier.height(4.dp))
                        Text(p.payload, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            }
        }
    }
}
