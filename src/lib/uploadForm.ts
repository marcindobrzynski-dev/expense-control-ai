import { useReducer } from "react";
import { getOpenRouterResult } from "./openRouter";
import { toast } from "sonner";
import uploadReducer from "./uploadReducer";
import { convertToBase64 } from "./utils";

export function useUploadForm() {
  const [state, dispatch] = useReducer(uploadReducer, { status: "IDLE" });

  const handleFileSelect = (file: File) => {
    if ("previewUrl" in state) {
      URL.revokeObjectURL(state.previewUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    dispatch({ type: "SELECT_FILE", file, previewUrl });
  }

  const handleAnalyze = async () => {
    if (state.status !== "SELECTED" && state.status !== "ERROR") return;
 
    dispatch({ type: "ANALYZE" });

    try {
      const base64File = await convertToBase64(state.file);
      const data = await getOpenRouterResult(base64File);
      
      dispatch({ type: "ANALYZE_SUCCESS", data });
      toast.success("Receipt analyzed successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      
      dispatch({ type: "ANALYZE_ERROR", error: message });
      toast.error("Failed to analyze receipt");
    }
  }

  const handleReset = () => {
    if ("previewUrl" in state) {
      URL.revokeObjectURL(state.previewUrl);
    }

    dispatch({ type: "RESET" });
  }

  return { 
    state, 
    handleFileSelect, 
    handleAnalyze, 
    handleReset 
  };
}
