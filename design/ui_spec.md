# Mandela vs Mandela vs Matrix Re-imaginator — UI/UX Design Specification
**Version 1.0.0**  
**Classification: Front-End Design & Engineering Standard**

---

## 1. Visual Layout & Grid System
The Re-imaginator workspace utilizes a fluid, modern visual structure optimized for maximum utility and space density:

*   **Responsive Desktop Layout**:
    *   **Container Width**: Fluid `max-w-7xl` (`1280px` max-width) with `mx-auto` centering.
    *   **Margins**: Desktop `px-6` (`24px`), mobile `px-4` (`16px`).
    *   **Spacing Units**: Standard 4px-base increments (`p-1` = 4px, `p-2` = 8px, `p-3` = 12px, `p-4` = 16px, `p-6` = 24px, `p-8` = 32px).
*   **Column Division**:
    *   Left panel is dedicated to inputs, sliders, and parameter selectors (width: `w-full lg:w-5/12` / `span-5`).
    *   Right panel is dedicated to the terminal log reader and timeline visualizers (width: `w-full lg:w-7/12` / `span-7`).

---

## 2. Interactive Visual States
To guarantee cohesive user feedback across all browser types, all interactive elements must support explicit Tailwind style states:

1.  **Buttons (`.btn-brand` / `.btn-secondary`)**:
    *   *Default*: Linear gradient, solid typography.
    *   *Hover*: Increase brightness (`hover:brightness-110`), shift slightly upwards (`hover:-translate-y-0.5`), and scale the brand glow.
    *   *Active*: Depress slightly (`active:translate-y-0`) and scale down shadows.
    *   *Focus*: Display high-contrast outline rings for keyboard navigation.
2.  **Form Inputs (`.input-brand` / `.sim-select`)**:
    *   *Hover*: Shift border color to cyan highlight.
    *   *Focus*: High-contrast border ring in Matrix Green or Cyan, with a soft neon bloom background shadow.

---

## 3. Micro-Animations & Transitions
Animations are used intentionally to guide user focus through computational sequences:

*   **Entering Transitions**:
    *   Dialog modals and toasts must use standard fading and sliding movements:
        *   `opacity: 0` to `opacity: 1` with a slight vertical slide up of `10px` over `250ms` using `cubic-bezier(0.4, 0, 0.2, 1)`.
*   **Active Job Status**:
    *   The live build/simulation indicator must use a slow pulse animation:
        *   `scale(1)` to `scale(1.05)` with `opacity: 0.4` to `opacity: 1.0` repeating seamlessly.
*   **Loader Icons**:
    *   Spinning icons (such as `Loader2` or `RefreshCw`) must spin continuously:
        *   `rotate(0deg)` to `rotate(360deg)` over `1.5s` linear.

---

## 4. Dark Theme High-Contrast Standards
The **Cosmic Matrix** theme relies heavily on perfect typography contrast and accessible colors:

*   **Color Contrast ratios (WCAG 2.1 compliance)**:
    *   All primary body copy (`#f8fafc` against background `#070a13`) maintains a contrast ratio of **15.4:1**, exceeding AAA standards.
    *   Matrix Green and Cyan highlights against secondary slate backgrounds exceed **4.5:1** to guarantee maximum accessibility for visual readers.
*   **Anti-Glitter Rules**:
    *   Glow drop-shadows must use dark blur radii (`box-shadow: 0 0 15px rgba(16, 185, 129, 0.08)`) and low opacities. Excessive brightness causes reader fatigue and must be avoided.

---
*For UI inspection, interactive code prototypes, and web-component exports, contact the engineering systems manager at `[design-system-support]`.*
