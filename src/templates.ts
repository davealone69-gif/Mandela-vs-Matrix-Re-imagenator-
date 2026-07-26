import { FileItem } from './types';

/** Factory-generated app package — intentionally separate from host appId com.mandelamatrix.reimaginator */
const GEN_PKG = 'com.example.aiapp';

export const TEMPLATE_KOTLIN: FileItem[] = [
  {
    name: 'MainActivity.kt',
    path: `App/src/main/java/${GEN_PKG.replace(/\./g, '/')}/MainActivity.kt`,
    language: 'kotlin',
    content: `package ${GEN_PKG}

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
        HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp))
        Text(text = "Factory template v1A — Material3 BOM 2024.06.00")
    }
}`
  },
  {
    name: 'AndroidManifest.xml',
    path: 'App/src/main/AndroidManifest.xml',
    language: 'xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application
        android:allowBackup="true"
        android:label="Generated App"
        android:theme="@android:style/Theme.Material.Light.NoActionBar">
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
    name: 'build.gradle.kts',
    path: 'App/build.gradle.kts',
    language: 'kotlin',
    content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "${GEN_PKG}"
    compileSdk = 36

    defaultConfig {
        applicationId = "${GEN_PKG}"
        minSdk = 26
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.14"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.3")
    implementation("androidx.activity:activity-compose:1.9.0")
    implementation(platform("androidx.compose:compose-bom:2024.06.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
}`
  },
  {
    name: 'README.md',
    path: 'README.md',
    language: 'markdown',
    content: `# Generated Android App\n\nBuilt by **Mandela vs Matrix Re-Imaginator** factory.\n\nPackage: \\`${GEN_PKG}\\` (host shell uses \\`com.mandelamatrix.reimaginator\\` — do not mix).\n\nCompose BOM: 2024.06.00 | compileSdk 36`
  }
];

export const TEMPLATE_XML: FileItem[] = [
  {
    name: 'MainActivity.java',
    path: `App/src/main/java/${GEN_PKG.replace(/\./g, '/')}/MainActivity.java`,
    language: 'java',
    content: `package ${GEN_PKG};

import android.os.Bundle;
import android.widget.Button;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Button openAiButton = findViewById(R.id.open_ai);
        if (openAiButton != null) {
            openAiButton.setOnClickListener(v ->
                Toast.makeText(this, "Launching Builder AI Assistant...", Toast.LENGTH_SHORT).show()
            );
        }
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
</RelativeLayout>`
  },
  {
    name: 'AndroidManifest.xml',
    path: 'App/src/main/AndroidManifest.xml',
    language: 'xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application
        android:allowBackup="true"
        android:label="Generated App"
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
}

android {
    namespace '${GEN_PKG}'
    compileSdk 36
    defaultConfig {
        applicationId "${GEN_PKG}"
        minSdk 26
        targetSdk 36
        versionCode 1
        versionName "1.0"
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.7.0'
    implementation 'com.google.android.material:material:1.12.0'
}`
  }
];
