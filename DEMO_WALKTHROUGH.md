# UniAIMS 2.0 - Application Demo Script

This document outlines the recommended flow for demonstrating the key features of the UniAIMS 2.0 SEM Analysis Platform.

## Phase 1: Dashboard (Mission Control)

**Objective**: Show the high-level system status and management capabilities.

**Step 1: Overview & Metrics**
*   **Action**: Start on the main Dashboard page.
*   **Talking Point**: "Here is the Mission Control center. At a glance, we can see real-time system metrics: Analysis Tasks processed today, Active Fine-tuning jobs, and our System Health status."

**Step 2: Resource Monitoring**
*   **Action**: Click on the **"Resource Board"** tab in the main navigation bar.
*   **Talking Point**: "By switching to the Resource Board, we get a real-time view of our hardware. You can see the status of our 4 GPU nodes—temperature, memory usage, and current load—along with the active task queue waiting for processing."
*   **Action**: Click back to the **"Overview"** tab.

**Step 3: Task Management & Filtering**
*   **Action**: Scroll down to "Recent Activity".
*   **Action**: Type "fiber" into the **Search tasks...** bar.
*   **Talking Point**: "Managing high volumes of data is easy. I can instantly filter tasks by name or ID. Notice how the list updates immediately."
*   **Action**: Use the **"Status"** dropdown to select **"Completed"**.
*   **Talking Point**: "We can also filter by execution status to quickly find finished reports."

---

## Phase 2: Creating a New Analysis Task (The Core Workflow)

**Objective**: Demonstrate the intuitive, guided workflow for setting up complex scientific analysis.

**Step 1: Initiation**
*   **Action**: Click the large **"Upload New Image"** button card on the Dashboard.
*   **Transition**: "Let's start a new analysis batch."

**Step 2: Upload Interface**
*   **Observation**: The page is organized into three clear stages: Upload, Method Selection, and Configuration.
*   **Action**: Hover over the "Upload SEM Images" area.
*   **Talking Point**: "First, we have a robust drag-and-drop zone supporting standard SEM formats like TIFF and DM3. We also provide sample data for quick testing."

**Step 3: Visual Analysis Selection (Key Feature)**
*   **Action**: Scroll to the **"Analysis Method"** section.
*   **Action**: Click the **"Particle Analysis"** card (Left side).
*   **Observation**: Note the selection highlight (blue border/pulse).
*   **Talking Point**: "We've replaced complex technical menus with these visual cards. Selecting 'Particle Analysis' instantly loads the relevant context below."

**Step 4: Sub-task & Dynamic Information**
*   **Action**: Look at the "Dynamic Info" panel on the right.
*   **Action**: Under "Analysis Mode", click **"Crack Analysis"**.
*   **Observation**: **Crucial Moment** - Point out how the "About this Algorithm" text and the **Preview Image** change instantly.
*   **Talking Point**: "This is the power of the new interface. I can drill down into specific sub-tasks like 'Crack Analysis'. The system immediately educates the user on what this algorithm does, its capabilities, and shows a visual preview."
*   **Action**: Click **"Void Analysis"** to show another variation.
*   **Action**: Switch the main category to **"Fiber Analysis"** (Right card).
*   **Action**: Select **"Fine Fiber"** in the Analysis Mode.
*   **Talking Point**: "Seamlessly switching to Fiber analysis updates the entire context again, ensuring researchers always know exactly what method they are applying."

**Step 5: Task Configuration**
*   **Action**: Scroll to **"Task Configuration"**.
*   **Action**: Enter a name in **Task Name** (e.g., "Demo Batch 01").
*   **Action**: Toggle **"Execution Device"** between GPU and CPU.
*   **Talking Point**: "We offer explicit hardware control. For lighter tasks, you might offload to CPU, saving GPU resources for heavy training jobs."
*   **Action**: Type a note in the **Description** field.

**Step 6: Launch**
*   **Action**: Click the large **"Start Analysis"** button on the right.
*   **Talking Point**: "Once configured, a single click launches the pipeline."

---

## Phase 3: Fine-Tuning (Optional)

**Step 1: Navigation**
*   **Action**: Click **"Start Fine-tuning"** from the Dashboard or sidebar.
*   **Talking Point**: "For advanced users, we provide a dedicated environment to fine-tune models on their specific datasets, ensuring the system improves over time."
