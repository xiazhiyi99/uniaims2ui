# UniAIMS 2.0 System Swimlane Diagram

This document illustrates the efficient interaction flow between the User, the Dashboard UI, the Task Management System, and the Compute Resources (GPU/CPU) within UniAIMS 2.0.

```mermaid
sequenceDiagram
    autonumber
    actor User as Researcher (User)
    participant UI as Dashboard UI
    participant System as Task Manager (Backend)
    participant Compute as Compute Engine (GPU/CPU)

    note over User, UI: Phase 1: System Monitoring
    User->>UI: Access Dashboard
    UI->>System: Fetch System Health & Resource Status
    System-->>UI: Return GPU Load, Queue Status, Active Jobs
    UI-->>User: Display "Mission Control" & Resource Board

    note over User, UI: Phase 2: Task Creation Flow
    User->>UI: Click "Upload New Image"
    User->>UI: Drag & Drop SEM Images (TIFF/DM3)
    UI->>System: Upload Files (Temp Storage)
    System-->>UI: Confirm Upload & Show Previews

    User->>UI: Select "Analysis Method" (Particle/Fiber)
    note right of User: Visual Cards Selection
    User->>UI: Select Sub-task (e.g. Crack/Void/Fine Fiber)
    UI-->>User: Update Dynamic Info (Preview & Description)

    User->>UI: Configure Task (Name, Description)
    User->>UI: Select Hardware (CPU vs GPU)
    User->>UI: Click "Start Analysis"

    note over User, Compute: Phase 3: Execution Pipeline
    UI->>System: Submit Analysis Job Request
    System->>System: Validate Request & Create Task ID
    System->>UI: Acknowledge Submission (Redirect to List)
    
    System->>Compute: Dispatch Job to Queue
    loop Execution
        Compute->>Compute: Load Model (v1.1/v1.2)
        Compute->>Compute: Run Algorithm (Sub-task specific)
        Compute-->>System: Update Progress (Streaming)
    end

    Compute-->>System: Return Final Results (JSON/Overlay)
    System->>System: Save Results & Assets
    System->>UI: Push Notification "Task Completed"
    
    User->>UI: Click "View Report"
    UI->>System: Fetch Analysis Results
    System-->>UI: Return Images & Metrics
    UI-->>User: Display Interactive Report
```

## Diagram Legend

*   **Researcher (User)**: The scientific user interacting with the platform.
*   **Dashboard UI**: The React-based frontend (UploadView, DashboardView).
*   **Task Manager**: The backend system handling file management, job orchestration, and database state.
*   **Compute Engine**: The hardware resources (GPUs/CPUs) executing the actual computer vision models.
