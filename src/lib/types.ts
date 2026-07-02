import type { ReceiptAnalysis } from "./schemas";

type UploadState =
  | { status: "IDLE" }
  | { status: "SELECTED"; file: File; previewUrl: string }
  | { status: "ANALYZING"; file: File; previewUrl: string }
  | { status: "SUCCESS"; file: File; previewUrl: string; data: ReceiptAnalysis }
  | { status: "ERROR"; file: File; previewUrl: string; error: string };

type UploadAction =
  | { type: "SELECT_FILE"; file: File; previewUrl: string }
  | { type: "ANALYZE" }
  | { type: "ANALYZE_SUCCESS"; data: ReceiptAnalysis }
  | { type: "ANALYZE_ERROR"; error: string }
  | { type: "RESET" };

export type { UploadState, UploadAction };
