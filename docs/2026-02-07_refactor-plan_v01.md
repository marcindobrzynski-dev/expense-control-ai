# Refactoring Plan: Expense Control AI - UI/UX & Architecture Overhaul

**Date:** 2026-02-07
**Version:** v0.1
**Language:** English (UI & Code)
**Objective:** Refactor existing codebase to improve UX/UX, enforce structural data integrity (JSON), and implement SOLID/DRY principles without adding new business features.

---

## 1. Architecture Overview

### 1.1 Current State vs. Future State
*   **Current:** Monolithic `UploadForm` handling state, UI, and logic. API returns raw Markdown string. No error feedback loops.
*   **Future:** Component-driven architecture using a State Machine approach. API returns strict JSON validated by Zod. Mobile-first responsive design with shadcn/ui.

### 1.2 Tech Stack Additions
*   **Validation:** `zod` (Server-side response validation).
*   **Icons:** `lucide-react`.
*   **Notifications:** `sonner` (Toast notifications).
*   **UI Components:** `shadcn/ui` (Table, ScrollArea, Dialog/Modal).

---

## 2. Data Structure (JSON Schema)

The API will no longer return text. It must return a structured JSON object.

```typescript
// src/schemas/receipt.ts (New File)
import { z } from "zod";

export const ReceiptItemSchema = z.object({
  name: z.string().describe("Name of the product"),
  price: z.number().describe("Price of the single unit"),
  quantity: z.number().default(1).describe("Quantity of the product"),
});

export const ReceiptAnalysisSchema = z.object({
  storeName: z.string().nullable().describe("Name of the shop/store"),
  date: z.string().nullable().describe("Date of purchase in YYYY-MM-DD format"),
  items: z.array(ReceiptItemSchema),
  total: z.number().describe("Total sum from the receipt"),
});

export type ReceiptAnalysis = z.infer<typeof ReceiptAnalysisSchema>;
```

---

## 3. UI/UX Workflow (Mobile First)

### 3.1 Layout Strategy
*   **Mobile:**
    *   Vertical Stack.
    *   Image Preview: `max-h-64` container with `object-contain`. Click opens Modal/Lightbox.
    *   Results: Scrollable area.
    *   Actions: Sticky Footer (Always visible at bottom) containing primary actions (Upload/Reset).
*   **Desktop:**
    *   2-Column Grid.
    *   Left: Full-height Image Preview / Dropzone.
    *   Right: Scrollable Results Table.

### 3.2 State Machine
The UI will react to specific states rather than checking `if (file && !summary)` everywhere.

| State | UI Component Visible | Description |
| :--- | :--- | :--- |
| `IDLE` | `FileUploader` | Empty state, waiting for file drop. |
| `SELECTED` | `ReceiptPreview` + `AnalyzeButton` | File selected, user verifies quality. |
| `ANALYZING` | `ReceiptPreview` + `SkeletonUI` | Request in progress, input disabled. |
| `SUCCESS` | `ReceiptPreview` + `AnalysisResult` | Data displayed in Table. |
| `ERROR` | `ReceiptPreview` + `RetryButton` | Error toast displayed. |

---

## 4. Component Refactoring Plan

Split `UploadForm.tsx` into:

### 4.1 `FileUploader.tsx` (New)
*   **Functionality:** Drag & drop zone.
*   **Props:** `onFileSelect(file: File)`.
*   **UX:**
    *   Visual drop indicator.
    *   `input` attribute: `capture="environment"` (opens rear camera on mobile).
    *   Icon: `CloudUpload` from `lucide-react`.

### 4.2 `ReceiptPreview.tsx` (New)
*   **Functionality:** Displays selected image.
*   **Props:** `imageUrl: string`.
*   **UX:**
    *   Container `max-h-64`.
    *   `onClick`: Opens full-screen Modal (`Dialog` from shadcn).

### 4.3 `AnalysisResult.tsx` (New)
*   **Functionality:** Displays parsed JSON data.
*   **Props:** `data: ReceiptAnalysis`.
*   **UX:**
    *   Header: Store Name + Date.
    *   Body: `shadcn/ui/table` for items.
    *   Footer: Highlighted Total Sum.
    *   Comparison logic: Check if `sum(items) === total`. If not, show yellow warning icon.

### 4.4 `UploadForm.tsx` (Refactor)
*   **Role:** Smart Container (Controller).
*   **Responsibility:**
    *   Manages State (`useUploadForm`).
    *   Handles layout (Desktop vs Mobile grid).
    *   Orchestrates sub-components.
    *   Triggers Toast notifications.

---

## 5. Implementation Steps

### Phase 1: Foundation & Dependencies
1.  **Install Packages:**
    *   `npm install zod lucide-react sonner clsx tailwind-merge`
    *   Install shadcn components: `npx shadcn@latest add table dialog scroll-area skeleton toast`
2.  **Setup Global Toaster:**
    *   Add `<Toaster />` to `src/layouts/Layout.astro`.

### Phase 2: API Refactoring (The Backend)
3.  **Create Schema:**
    *   Create `src/lib/schemas.ts` with Zod definitions.
4.  **Update API Route (`src/pages/api/analyze-receipt.ts`):**
    *   Modify LLM Prompt to request strictly structured JSON.
    *   Implement `zod.parse()` on the LLM response.
    *   Improve Error Handling (return standard HTTP errors with messages).

### Phase 3: Component Development (The Frontend)
5.  **Create Dumb Components:**
    *   Implement `FileUploader` (Dropzone + Camera).
    *   Implement `ReceiptPreview` (Image + Modal).
    *   Implement `AnalysisResult` (Table + Skeleton).
6.  **Refactor Hook (`useUploadForm`):**
    *   Update to handle JSON types.
    *   Add loading states variables.
    *   Add Toast triggers.

### Phase 4: Integration & Layout
7.  **Assemble `UploadForm`:**
    *   Implement the 2-column layout.
    *   Implement Mobile Sticky Footer.
8.  **Styling & Polish:**
    *   Add Tailwind animations (`animate-in`, `fade-in`).
    *   Ensure strict responsiveness.

---

## 6. Prompt Engineering (for API)

We will use a "System Prompt" approach to ensure JSON validity.

**Instructions to LLM:**
> "You are a receipt scanning machine. You only output valid JSON. Do not output Markdown formatting. Do not output text before or after the JSON."

**Structure Enforcement:**
> Provide the exact Zod schema structure in the prompt example.

---

## 7. Future Considerations (Not included in this sprint)
*   Manual editing of scanned items.
*   User authentication / History saving.
*   Currency conversion.
