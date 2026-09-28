package com.mandela.matrixos.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.material.icons.filled.GridView
import androidx.compose.material.icons.filled.Security
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mandela.matrixos.data.AuditLevel
import com.mandela.matrixos.data.AuditLog
import com.mandela.matrixos.data.MatrixCoreDefaults
import com.mandela.matrixos.ui.components.MandelaVsMatrixBanner
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@Composable
fun MatrixCoreScreen(modifier: Modifier = Modifier) {
    var logs by remember { mutableStateOf(MatrixCoreDefaults.seedLogs) }
    var metrics by remember { mutableStateOf(MatrixCoreDefaults.initialMetrics) }
    var mutationCount by remember { mutableIntStateOf(0) }
    var uptimeSeconds by remember { mutableIntStateOf(0) }
    val listState = rememberLazyListState()
    val scope = rememberCoroutineScope()
    val timeFmt = remember { SimpleDateFormat("HH:mm:ss", Locale.getDefault()) }

    LaunchedEffect(Unit) {
        while (true) {
            delay(1000)
            uptimeSeconds++
            val h = uptimeSeconds / 3600
            val m = (uptimeSeconds % 3600) / 60
            val s = uptimeSeconds % 60
            metrics = metrics.map {
                if (it.name == "Uptime") it.copy(value = "%02d:%02d:%02d".format(h, m, s)) else it
            }
        }
    }
    LaunchedEffect(logs.size) {
        if (logs.isNotEmpty()) listState.animateScrollToItem(logs.size - 1)
    }

    fun appendLog(level: AuditLevel, message: String) {
        logs = logs + AuditLog(level = level, message = message)
    }

    Column(modifier = modifier.fillMaxSize().background(MaterialTheme.colorScheme.background)) {
        MandelaVsMatrixBanner(modifier = Modifier.padding(top = 8.dp, bottom = 4.dp))
        Surface(tonalElevation = 2.dp, modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.GridView, null, tint = MaterialTheme.colorScheme.primary)
                    Spacer(Modifier.width(8.dp))
                    Text("Matrix Core", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                }
                Text("System status - mutations - audit logs", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
        LazyRow(contentPadding = PaddingValues(12.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            items(metrics) { metric ->
                Surface(shape = RoundedCornerShape(10.dp), color = MaterialTheme.colorScheme.primaryContainer) {
                    Column(modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(metric.value, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold)
                        Text(metric.name, style = MaterialTheme.typography.labelSmall)
                    }
                }
            }
        }
        Row(modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            FilledTonalButton(onClick = {
                mutationCount++
                appendLog(AuditLevel.MUTATION, "Mutation STATE_SYNC #$mutationCount")
            }, modifier = Modifier.weight(1f)) {
                Icon(Icons.Default.Bolt, null, Modifier.size(16.dp))
                Spacer(Modifier.width(4.dp))
                Text("Mutate")
            }
            FilledTonalButton(onClick = {
                appendLog(AuditLevel.SECURITY, "Security audit started")
                scope.launch {
                    delay(600)
                    appendLog(AuditLevel.SECURITY, "Audit complete - Nominal")
                }
            }, modifier = Modifier.weight(1f)) {
                Icon(Icons.Default.Security, null, Modifier.size(16.dp))
                Spacer(Modifier.width(4.dp))
                Text("Audit")
            }
        }
        Text("Audit Reality Logs", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold, modifier = Modifier.padding(16.dp))
        LazyColumn(state = listState, modifier = Modifier.fillMaxSize().padding(horizontal = 12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
            items(logs, key = { it.id }) { log ->
                val color = when (log.level) {
                    AuditLevel.INFO -> Color(0xFF80CBC4)
                    AuditLevel.WARN -> Color(0xFFFFD54F)
                    AuditLevel.ERROR -> Color(0xFFFF8A80)
                    AuditLevel.MUTATION -> Color(0xFFEA80FC)
                    AuditLevel.SECURITY -> Color(0xFF82B1FF)
                }
                Row(modifier = Modifier.fillMaxWidth().background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.35f), RoundedCornerShape(6.dp)).padding(8.dp)) {
                    Text(timeFmt.format(Date(log.timestamp)), fontFamily = FontFamily.Monospace, style = MaterialTheme.typography.labelSmall, modifier = Modifier.width(64.dp))
                    Text(log.level.name.take(3), color = color, fontWeight = FontWeight.Bold, style = MaterialTheme.typography.labelSmall, modifier = Modifier.width(40.dp))
                    Text(log.message, style = MaterialTheme.typography.bodySmall, fontSize = 12.sp)
                }
            }
        }
    }
}
