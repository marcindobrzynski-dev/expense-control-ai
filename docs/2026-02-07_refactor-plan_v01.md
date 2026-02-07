# Refactoring Plan: Expense Control AI - UI/UX & Architecture Overhaul

**Date:** 2026-02-07
**Version:** v0.1
**Language:** English (UI & Code)
**Objective:** Refactor existing codebase to improve UX/UX, enforce structural data integrity (JSON), and implement SOLID/DRY principles without adding new business features.

---

## 1. Architecture Overview

### 1.1 Current State vs. Future State

- **Current:** Monolithic `UploadForm` handling state, UI, and logic. API returns raw Markdown string. No error feedback loops.
- **Future:** Component-driven architecture using a State Machine approach. API returns strict JSON validated by Zod. Mobile-first responsive design with shadcn/ui.

### 1.2 Tech Stack Additions

- **Validation:** `zod` (Server-side response validation).
- **Icons:** `lucide-react`.
- **Notifications:** `sonner` (Toast notifications).
- **UI Components:** `shadcn/ui` (Table, ScrollArea, Dialog/Modal).

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

- **Mobile:**
  - Vertical Stack.
  - Image Preview: `max-h-64` container with `object-contain`. Click opens Modal/Lightbox.
  - Results: Scrollable area.
  - Actions: Sticky Footer (Always visible at bottom) containing primary actions (Upload/Reset).
- **Desktop:**
  - 2-Column Grid.
  - Left: Full-height Image Preview / Dropzone.
  - Right: Scrollable Results Table.

### 3.2 State Machine

The UI will react to specific states rather than checking `if (file && !summary)` everywhere.

| State       | UI Component Visible                | Description                           |
| :---------- | :---------------------------------- | :------------------------------------ |
| `IDLE`      | `FileUploader`                      | Empty state, waiting for file drop.   |
| `SELECTED`  | `ReceiptPreview` + `AnalyzeButton`  | File selected, user verifies quality. |
| `ANALYZING` | `ReceiptPreview` + `SkeletonUI`     | Request in progress, input disabled.  |
| `SUCCESS`   | `ReceiptPreview` + `AnalysisResult` | Data displayed in Table.              |
| `ERROR`     | `ReceiptPreview` + `RetryButton`    | Error toast displayed.                |

---

## 4. Component Refactoring Plan

Split `UploadForm.tsx` into:

### 4.1 `FileUploader.tsx` (New)

- **Functionality:** Drag & drop zone.
- **Props:** `onFileSelect(file: File)`.
- **UX:**
  - Visual drop indicator.
  - `input` attribute: `capture="environment"` (opens rear camera on mobile).
  - Icon: `CloudUpload` from `lucide-react`.

### 4.2 `ReceiptPreview.tsx` (New)

- **Functionality:** Displays selected image.
- **Props:** `imageUrl: string`.
- **UX:**
  - Container `max-h-64`.
  - `onClick`: Opens full-screen Modal (`Dialog` from shadcn).

### 4.3 `AnalysisResult.tsx` (New)

- **Functionality:** Displays parsed JSON data.
- **Props:** `data: ReceiptAnalysis`.
- **UX:**
  - Header: Store Name + Date.
  - Body: `shadcn/ui/table` for items.
  - Footer: Highlighted Total Sum.
  - Comparison logic: Check if `sum(items) === total`. If not, show yellow warning icon.

### 4.4 `UploadForm.tsx` (Refactor)

- **Role:** Smart Container (Controller).
- **Responsibility:**
  - Manages State (`useUploadForm`).
  - Handles layout (Desktop vs Mobile grid).
  - Orchestrates sub-components.
  - Triggers Toast notifications.

---

## 5. Implementation Steps & Progress

### Phase 1: Foundation & Dependencies - DONE

- [x] Install `zod`, `sonner` (`lucide-react`, `clsx`, `tailwind-merge` already present)
- [x] Install `zod-to-json-schema` (for `responseFormat` schema conversion)
- [x] Install shadcn components: `table`, `dialog`, `scroll-area`, `skeleton`, `sonner`
- [x] Add `<Toaster client:load />` to `src/layouts/Layout.astro`

### Phase 2: API Refactoring (The Backend) - DONE

- [x] Create `src/lib/schemas.ts` with Zod definitions (`ReceiptItemSchema`, `ReceiptAnalysisSchema`)
- [x] Export `ReceiptItem` and `ReceiptAnalysis` types
- [x] Refactor API route (`src/pages/api/analyze-receipt.ts`):
  - [x] Guard clause for invalid image input (400)
  - [x] System prompt with business rules (unit price, quantity, date format)
  - [x] `responseFormat` with `json_schema` using `zodToJsonSchema()` for strict output
  - [x] `ReceiptAnalysisSchema.parse()` server-side validation
  - [x] Improved error handling (`SyntaxError` distinction)
  - [x] Response returns validated `ReceiptAnalysis` object directly (no `{ content }` wrapper)

### Phase 3: Component Development (The Frontend) - TODO

- [ ] Create `FileUploader.tsx` (Dropzone + Camera)
- [ ] Create `ReceiptPreview.tsx` (Image + Modal)
- [ ] Create `AnalysisResult.tsx` (Table + Skeleton)
- [ ] Refactor `useUploadForm` hook:
  - [ ] Update to handle `ReceiptAnalysis` type (replace `string` state)
  - [ ] Add state machine states (`IDLE`, `SELECTED`, `ANALYZING`, `SUCCESS`, `ERROR`)
  - [ ] Add Toast triggers
- [ ] Update `openRouter.ts` to return `ReceiptAnalysis` instead of `string`

### Phase 4: Integration & Layout - TODO

- [ ] Assemble `UploadForm` as smart container with sub-components
- [ ] Implement 2-column layout (desktop) / vertical stack (mobile)
- [ ] Implement Mobile Sticky Footer
- [ ] Add Tailwind animations (`animate-in`, `fade-in`)
- [ ] Ensure strict responsiveness
- [ ] Clean up unused components (`InputFile.tsx`, `UploadButton.tsx`, `ExpanseSummary.tsx`)

---

## 6. Prompt Engineering (for API) - DONE

**Approach:** System prompt for business rules + `responseFormat` with `json_schema` for structural enforcement.

**System prompt** provides rules for interpreting receipt data (unit price, quantity defaults, date format, null handling).

**Schema enforcement** via OpenRouter `responseFormat` using `zodToJsonSchema()` - Zod schema is the single source of truth for both LLM output constraint and server-side validation.

---

## 7. Future Considerations (Not included in this sprint)

- Manual editing of scanned items.
- User authentication / History saving.
- Currency conversion.
