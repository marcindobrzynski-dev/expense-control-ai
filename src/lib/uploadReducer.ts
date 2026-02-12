import type { UploadState, UploadAction } from "./types";

function uploadReducer(state: UploadState, action: UploadAction): UploadState {
  switch (action.type) {
    case "SELECT_FILE":
      return {
        status: "SELECTED",
        file: action.file,
        previewUrl: action.previewUrl,
      };
    case "ANALYZE":
      if (state.status !== "SELECTED" && state.status !== "ERROR") return state;

      return { ...state, status: "ANALYZING" };
    case "ANALYZE_SUCCESS":
      if (state.status !== "ANALYZING") return state;

      return { ...state, status: "SUCCESS", data: action.data };
    case "ANALYZE_ERROR":
      if (state.status !== "ANALYZING") return state;
      
      return { ...state, status: "ERROR", error: action.error };
    case "RESET":
      return { status: "IDLE" };
    default:
      return state;
  }
}

export default uploadReducer;
