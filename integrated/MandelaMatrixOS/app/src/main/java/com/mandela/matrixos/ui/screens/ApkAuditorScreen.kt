package com.mandela.matrixos.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

data class ComplianceItem(
    val name: String,
    val detail: String,
    val ok: Boolean
)

@Composable
fun ApkAuditorScreen(modifier: Modifier = Modifier) {
    var scanning by remember { mutableStateOf(false) }
    var items by remember {
        mutableStateOf(
            listOf(
                ComplianceItem("Gradle", "Wrapper 8.7", true),
                ComplianceItem("AGP", "8.5.2", true),
                ComplianceItem("Compile SDK", "35", true),
                ComplianceItem("Min SDK", "26", true),
                ComplianceItem("Kotlin", "2.0.20 + Compose plugin", true),
                ComplianceItem("AXML / Manifest", "INTERNET only, exported launcher", true),
                ComplianceItem("DEX", "Pending full binary scan", false),
                ComplianceItem("Signing", "Debug unsigned release", false)
            )
        )
    }
    val scope = rememberCoroutineScope()
    val passCount = items.count { it.ok }

    Column(modifier = modifier.fillMaxSize().background(MaterialTheme.colorScheme.background)) {
        Surface(tonalElevation = 2.dp, modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Verified, null, tint = MaterialTheme.colorScheme.primary)
                    Spacer(Modifier.width(8.dp))
                    Text("APK Auditor", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                }
                Spacer(Modifier.height(4.dp))
                Text(
                    "Build specs • DEX • AGP compliance",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }

        Card(
            modifier = Modifier.fillMaxWidth().padding(12.dp),
            shape = RoundedCornerShape(12.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    "$passCount / ${items.size}",
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Text("checks passed", style = MaterialTheme.typography.bodySmall)
                Spacer(Modifier.height(12.dp))
                Button(
                    onClick = {
                        if (scanning) return@Button
                        scanning = true
                        scope.launch {
                            delay(1200)
                            items = items.map {
                                if (it.name == "DEX") it.copy(ok = true, detail = "Classes verified (simulated)")
                                else if (it.name == "Signing") it.copy(detail = "CI artifact — sign on release")
                                else it
                            }
                            scanning = false
                        }
                    },
                    enabled = !scanning,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    if (scanning) {
                        CircularProgressIndicator(Modifier.size(18.dp), strokeWidth = 2.dp)
                        Spacer(Modifier.width(8.dp))
                        Text("Scanning…")
                    } else {
                        Text("Run compliance scan")
                    }
                }
            }
        }

        LazyColumn(
            contentPadding = PaddingValues(12.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(items, key = { it.name }) { item ->
                Card(modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(10.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(item.name, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
                            Text(item.detail, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                        Text(
                            if (item.ok) "PASS" else "WARN",
                            fontWeight = FontWeight.Bold,
                            color = if (item.ok) Color(0xFF69F0AE) else Color(0xFFFFAB00)
                        )
                    }
                }
            }
        }
    }
}
