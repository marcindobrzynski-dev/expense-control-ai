import { useUploadForm } from "@/lib/uploadForm";
import FileUploader from "./FileUploader";
import ReceiptPreview from "./ReceiptPreview";
import AnalysisResult from "./AnalysisResult";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";

export default function UploadForm() {
  const { state, handleFileSelect, handleAnalyze, handleReset } = useUploadForm();

  const hasTwoColumns = state.status === "ANALYZING" || state.status === "SUCCESS" || state.status === "ERROR";

  return (
    <div className={hasTwoColumns ? "w-full" : "max-w-md mx-auto"}>
      <div className={`grid grid-cols-1 ${hasTwoColumns ? "md:grid-cols-2" : ""} gap-6`}>
        <div>
          {state.status === "IDLE" ? (
            <FileUploader onFileSelect={handleFileSelect} />
          ) : (
            <ReceiptPreview imageUrl={state.previewUrl} />
          )}
        </div>

        {state.status !== "IDLE" && (
          <div>
            {state.status === "ANALYZING" && (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-32 w-full" />
              </div>
            )}
            {state.status === "SUCCESS" && <AnalysisResult data={state.data} />}
            {state.status === "ERROR" && <p className="text-sm text-destructive">{state.error}</p>}
          </div>
        )}

        <div className="flex justify-center gap-2 md:col-span-2 mt-5">
          {state.status === "SELECTED" && (
            <>
              <Button onClick={handleAnalyze}>Analyze Receipt</Button>
              <Button variant="outline" onClick={handleReset}>
                Other Receipt
              </Button>
            </>
          )}
          {state.status === "ANALYZING" && <Button disabled>Analyzing...</Button>}
          {state.status === "SUCCESS" && (
            <Button variant="outline" onClick={handleReset}>
              New Receipt
            </Button>
          )}
          {state.status === "ERROR" && (
            <>
              <Button onClick={handleAnalyze}>Try Again</Button>
              <Button variant="outline" onClick={handleReset}>
                New Receipt
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
