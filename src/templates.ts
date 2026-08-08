import { FileItem } from './types';

export const TEMPLATE_KOTLIN: FileItem[] = [
  {
    name: 'MainActivity.kt',
    path: 'App/src/main/java/com/drivelog/MainActivity.kt',
    language: 'kotlin',
    content: `package com.drivelog

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    GreetingScreen()
                }
            }
        }
    }
}

@Composable
fun GreetingScreen() {
    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.Center
    ) {
        Text(text = "Welcome to Mandela vs Matrix Re-Imaginator!", style = MaterialTheme.typography.headlineMedium)
        Spacer(modifier = Modifier.height(8.dp))
        Text(text = "Start building your Android app using Jetpack Compose.")
    }
}`
  },
  {
    name: 'AndroidManifest.xml',
    path: 'App/src/main/AndroidManifest.xml',
    language: 'xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.drivelog">
    <application
        android:allowBackup="true"
        android:label="Mandela vs Matrix Re-Imaginator"
        android:theme="@style/Theme.AppCompat.Light.NoActionBar">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`
  },
  {
    name: 'build.gradle',
    path: 'App/build.gradle',
    language: 'groovy',
    content: `plugins {
    id 'com.android.application'
    id 'kotlin-android'
}

android {
    compileSdk 34
    defaultConfig {
        applicationId "com.drivelog"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0"
    }
}

dependencies {
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.compose.ui:ui:1.5.4'
    implementation 'androidx.compose.material3:material3:1.1.2'
}`
  },
  {
    name: 'README.md',
    path: 'README.md',
    language: 'markdown',
    content: `# Mandela vs Matrix Re-Imaginator Workspace\n\nWelcome to your interactive Jetpack Compose development playground.\n\nUse the sidebar to explore files, write prompts, run simulations, or export your final build.`
  }
];

export const TEMPLATE_XML: FileItem[] = [
  {
    name: 'MainActivity.kt',
    path: 'App/src/main/java/com/drivelog/MainActivity.kt',
    language: 'kotlin',
    content: `package com.drivelog

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {
    
    // Simulated API client
    private val api = ApiClient()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val openAiButton = findViewById<Button>(R.id.open_ai)
        openAiButton.setOnClickListener {
            Toast.makeText(this, "Launching Builder AI Assistant...", Toast.LENGTH_SHORT).show()
            
            // Example 1: Launch via custom action intent
            val actionIntent = Intent("com.drivelog.ACTION_OPEN_AI")
            
            // Example 2: Launch explicit class intent
            val intent = Intent(this, AiAssistantActivity::class.java)
            startActivity(intent)
        }

        val openJobsButton = findViewById<Button>(R.id.open_jobs)
        openJobsButton.setOnClickListener {
            Toast.makeText(this, "Fetching active Builder Jobs...", Toast.LENGTH_SHORT).show()
            
            // Fetch jobs asynchronously inside lifecycleScope
            lifecycleScope.launch {
                try {
                    val jobs = api.getJobs()   // GET /api/v1/jobs
                    Toast.makeText(this@MainActivity, "Loaded \${jobs.size} active jobs!", Toast.LENGTH_SHORT).show()
                } catch (e: Exception) {
                    Toast.makeText(this@MainActivity, "Failed to load jobs", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
}

// Simulated network model
class ApiClient {
    suspend fun getJobs(): List<String> {
        kotlinx.coroutines.delay(1000)
        return listOf("Android Developer", "AI Engineer", "Kotlin Expert")
    }
}

class AiAssistantActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Toast.makeText(this, "Welcome to Builder AI Assistant Screen!", Toast.LENGTH_SHORT).show()
    }
}`
  },
  {
    name: 'activity_main.xml',
    path: 'App/src/main/res/layout/activity_main.xml',
    language: 'xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:padding="16dp">

    <TextView
        android:id="@+id/title"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Builder AI"
        android:textSize="24sp"
        android:textStyle="bold"
        android:layout_centerHorizontal="true"
        android:layout_marginTop="20dp" />

    <Button
        android:id="@+id/open_ai"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Open AI"
        android:layout_below="@id/title"
        android:layout_marginTop="30dp" />

    <Button
        android:id="@+id/open_jobs"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Builder Jobs"
        android:layout_below="@id/open_ai"
        android:layout_marginTop="20dp" />

</RelativeLayout>`
  },
  {
    name: 'AndroidManifest.xml',
    path: 'App/src/main/AndroidManifest.xml',
    language: 'xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.drivelog">
    <application
        android:allowBackup="true"
        android:label="Mandela vs Matrix Re-Imaginator"
        android:theme="@style/Theme.AppCompat.Light.NoActionBar">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`
  },
  {
    name: 'build.gradle',
    path: 'App/build.gradle',
    language: 'groovy',
    content: `plugins {
    id 'com.android.application'
    id 'kotlin-android'
}

android {
    compileSdk 34
    defaultConfig {
        applicationId "com.drivelog"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0"
    }
}`
  }
];
