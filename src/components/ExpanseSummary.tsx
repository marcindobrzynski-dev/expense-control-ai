import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";

interface ExpanseSummaryProps {
  summary: string | null;
}

export default function ExpanseSummary({ summary }: ExpanseSummaryProps) {
  return (
    <>
      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>Summary of expenses</CardTitle>
            <CardDescription>Here you will find a summary of your expenses.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{summary}</p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
