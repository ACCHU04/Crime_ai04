import { Printer, Download } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { CaseReport, CaseSummary, TimelineData } from "@/features/investigations/types";

interface PrintReportProps {
  report: CaseReport | undefined;
  summary: CaseSummary | undefined;
  timeline: TimelineData | undefined;
  isLoading: boolean;
}

export function PrintReport({ report, summary, timeline, isLoading }: PrintReportProps) {
  const handlePrint = () => {
    window.print();
  };

  if (isLoading || !report) return null;

  return (
    <>
      {/* Screen-only button */}
      <Card className="no-print">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Printer className="h-4 w-4 text-[var(--accent)]" />
            Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <button
            onClick={handlePrint}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Printer className="h-4 w-4" />
            Print Case Report
          </button>
        </CardContent>
      </Card>

      {/* Print-only content */}
      <div className="hidden print:block print:m-0 print:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-black">Karnataka Police — Case Report</h1>
          <p className="text-sm text-gray-600">Generated on {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}</p>
        </div>

        <div className="mb-6 border border-gray-300 p-4">
          <h2 className="text-lg font-semibold mb-3 text-black">Case Details</h2>
          <div className="grid grid-cols-2 gap-2 text-sm text-black">
            <div><span className="font-medium">FIR Number:</span> {report.fir_number}</div>
            <div><span className="font-medium">Case ID:</span> {report.case_id}</div>
            <div><span className="font-medium">Crime Type:</span> {report.crime_head ?? "N/A"}</div>
            <div><span className="font-medium">Sub-Category:</span> {report.crime_subhead ?? "N/A"}</div>
            <div><span className="font-medium">Status:</span> {report.status ?? "N/A"}</div>
            <div><span className="font-medium">District:</span> {report.district ?? "N/A"}</div>
            <div><span className="font-medium">Investigating Officer:</span> {report.investigating_officer ?? "N/A"}</div>
            <div><span className="font-medium">FIR Date:</span> {report.fir_date ?? "N/A"}</div>
            <div><span className="font-medium">Occurrence Date:</span> {report.occurrence_date ?? "N/A"}</div>
            <div className="col-span-2"><span className="font-medium">Brief Facts:</span> {report.brief_facts ?? "N/A"}</div>
          </div>
        </div>

        {summary && (
          <div className="mb-6 border border-gray-300 p-4">
            <h2 className="text-lg font-semibold mb-3 text-black">Investigation Summary</h2>
            <p className="text-sm text-black leading-relaxed">{summary.summary}</p>
            {summary.suggested_actions.length > 0 && (
              <div className="mt-3">
                <p className="font-medium text-sm text-black">Suggested Actions:</p>
                <ul className="list-disc list-inside text-sm text-black mt-1">
                  {summary.suggested_actions.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {timeline && timeline.events.length > 0 && (
          <div className="mb-6 border border-gray-300 p-4">
            <h2 className="text-lg font-semibold mb-3 text-black">Timeline</h2>
            <div className="space-y-2">
              {timeline.events.map((event, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-black">
                  <span className="font-mono text-xs text-gray-500 w-24 shrink-0">
                    {new Date(event.date).toLocaleDateString("en-IN")}
                  </span>
                  <span className="font-medium">{event.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 border-t border-gray-300 pt-4 text-xs text-gray-500 text-center">
          Crime Intelligence Platform — Karnataka Police Datathon 2026
        </div>
      </div>
    </>
  );
}
