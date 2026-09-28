package com.mandela.matrixos.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.BlurOn
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/**
 * Brand marks rendered from vector icons — the raster logos
 * (re_imaginator_logo / mandela_vs_matrix_logo) were never committed to the
 * repo, so builds referenced resources that do not exist. Drop the PNGs into
 * res/drawable later to swap these back to images.
 */
@Composable
fun AppLogo(
    modifier: Modifier = Modifier,
    size: Dp = 36.dp
) {
    Surface(
        shape = CircleShape,
        color = MaterialTheme.colorScheme.primaryContainer,
        modifier = modifier.size(size)
    ) {
        Box(contentAlignment = Alignment.Center) {
            Icon(
                Icons.Default.BlurOn,
                contentDescription = "Re-Imaginator",
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(size * 0.7f)
            )
        }
    }
}

@Composable
fun MandelaVsMatrixBanner(
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        AppLogo(size = 72.dp)
        Spacer(Modifier.height(6.dp))
        Text(
            "RE-IMAGINATOR",
            style = MaterialTheme.typography.labelLarge,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary
        )
        Text(
            "MANDELA  vs  MATRIX",
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}
