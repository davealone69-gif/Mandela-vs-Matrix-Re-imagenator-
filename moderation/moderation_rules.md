# Re-imaginator Content Moderation & Community Rules
**Version 1.0.0**  
**Classification: Public / Terms of Service Annex**

The **Mandela vs Mandela vs Matrix Re-imaginator** is designed to explore divergent histories and computational structures with academic, philosophical, and creative rigor. To maintain a safe, inclusive, and productive platform, all users must adhere to the following Content Moderation Rules.

---

## 1. Prohibited Simulation Inputs
Users are strictly prohibited from generating, submitting, or simulating content that falls into the following categories:

*   **Harassment and Hate Speech**: Content intended to demean, intimidate, or discriminate against individuals or protected groups based on race, ethnicity, religion, gender, sexual orientation, disability, or nationality.
*   **Explicit or Sensational Violence**: Detailed, graphic depictions of real-world violence, bodily harm, or self-harm coordinates.
*   **Malicious Code and Vulnerabilities**: Using the simulation core to inject cross-site scripting (XSS), SQL injection, or to generate active malware.
*   **Personally Identifiable Information (PII)**: Any simulation parameters containing real-world names, home addresses, private emails, phone numbers, or social security registries.
*   **Misleading Disinformation Campaigns**: Simulating false political historical events designed to deliberately deceive voters or compromise public safety.

---

## 2. Automated Safety Filters
To guarantee safe operation in real-time, our gateway API (`/api/v1/reimagine`) deploys an automated input validation system:

1.  **Pre-Simulation Sieve**: Every submitted `target_memory_id` and custom description is analyzed against a localized dictionary of blacklisted terms and safety flags.
2.  **Rate Protection**: To prevent denial-of-service (DoS) simulations, users are limited to **10 execution builds per hour** per API token.
3.  **Automatic Quarantine**: Any input violating safety thresholds is automatically quarantined. The job is marked as `CANCELLED` and flagged for manual review.

---

## 3. Human-in-the-Loop Appeals Process
If your simulation is flagged or quarantined by our automated systems, you have the right to request a manual review:

1.  **Submit Appeal**: Click the **"Request Appeal"** button inside your workspace dashboard, or email the moderation desk at `[appeals-email]`.
2.  **Required Information**: Provide your active `job_id`, the full text of your input parameter, and a brief description of the academic, historical, or creative context of the simulation.
3.  **Turnaround Time**: Manual reviews are completed by our community safety team within **48 business hours**.

---

## 4. Enforcement Thresholds
*   **First Violation**: Automated warning and temporary API rate restriction (24 hours).
*   **Second Violation**: Account quarantine (7 days) and review of all past simulation structures.
*   **Third Violation**: Permanent termination of API token access and IP blacklisting.

---
*By launching our Timeline Convergence Lab or calling our endpoints, you agree to these moderation terms. For inquiries regarding safety operations, contact the platform governance officer at `[governance-email]`.*
