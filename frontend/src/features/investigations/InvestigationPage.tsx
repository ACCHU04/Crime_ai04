import { useState } from "react";
import { useParams } from "react-router-dom";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import * as casesApi from "./api/casesApi";
import { useCase } from "./hooks/useCase";
import { usePeople } from "./hooks/usePeople";
import { useInvestigation } from "./hooks/useInvestigation";
import { CaseHeader } from "./components/CaseHeader";
import { CaseOverview } from "./components/CaseOverview";
import { Timeline } from "./components/Timeline";
import { VictimsPanel } from "./components/VictimsPanel";
import { SuspectsPanel } from "./components/SuspectsPanel";
import { OfficersPanel } from "./components/OfficersPanel";
import { AIInvestigationSummary } from "./components/AIInvestigationSummary";
import { RecommendationsPanel } from "./components/RecommendationsPanel";
import { OfficerAssistant } from "@/features/intelligence/components/OfficerAssistant";
import { CaseSimilarity } from "@/features/intelligence/components/CaseSimilarity";
import { RelationshipNetwork } from "./components/RelationshipNetwork";

export default function InvestigationPage() {
  const { caseId: paramId } = useParams<{ caseId: string }>();
  const [selectedId, setSelectedId] = useState<number | null>(
    paramId ? Number(paramId) : null,
  );

  const allCases = useQuery({
    queryKey: ["all-cases"],
    queryFn: () => casesApi.getAllCases(0, 50),
    select: (res) => res.data,
  });

  const caseData = useCase(selectedId);
  const people = usePeople(selectedId);
  const investigation = useInvestigation(
    selectedId,
    caseData.report?.investigating_officer ?? null,
  );

  if (!selectedId) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Investigation"
          description="Deep-dive into case timelines, evidence, and relationships"
        />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Search className="h-4 w-4 text-[var(--accent)]" />
              Select a Case
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allCases.isLoading && <LoadingSkeleton variant="table" count={5} />}
            {allCases.data && (
              <div className="space-y-2">
                {allCases.data.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className="flex w-full items-center justify-between rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3 text-left transition-colors hover:border-[var(--accent)] hover:bg-[var(--bg-card)]"
                  >
                    <div>
                      <span className="font-medium text-[var(--text-primary)]">{c.fir_number}</span>
                      <span className="ml-3 text-sm text-[var(--text-muted)]">ID: {c.id}</span>
                    </div>
                    <span className="text-xs text-[var(--text-muted)]">
                      {c.occurrence_date ? new Date(c.occurrence_date).toLocaleDateString("en-IN") : "N/A"}
                    </span>
                  </button>
                ))}
              </div>
            )}
            {allCases.isError && (
              <ErrorState
                title="Failed to load cases"
                message="Could not fetch cases from the backend."
                onRetry={() => allCases.refetch()}
              />
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (caseData.isError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Investigation"
          description="Deep-dive into case timelines, evidence, and relationships"
        />
        <ErrorState
          title="Failed to load case"
          message="The case could not be found or the backend is unreachable."
          onRetry={() => setSelectedId(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Investigation"
        description="Deep-dive into case timelines, evidence, and relationships"
        action={
          <button
            onClick={() => setSelectedId(null)}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-card)]"
          >
            Change Case
          </button>
        }
      />

      <CaseHeader report={caseData.report} isLoading={caseData.isLoading} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <CaseOverview report={caseData.report} isLoading={caseData.isLoading} />
          <Timeline timeline={caseData.timeline} isLoading={caseData.isLoading} />
          <AIInvestigationSummary
            summary={investigation.summary}
            isLoading={investigation.isLoading}
          />
          {caseData.case && (
            <CaseSimilarity currentCase={caseData.case} />
          )}
        </div>

        <div className="space-y-6">
          <VictimsPanel victims={people.victims} isLoading={people.isLoading} />
          <SuspectsPanel accused={people.accused} isLoading={people.isLoading} />
          {caseData.report && (
            <OfficerAssistant
              caseId={caseData.report.case_id}
              crimeType={caseData.report.crime_head ?? ""}
              status={caseData.report.status ?? ""}
              district={caseData.report.district ?? ""}
              daysPending={caseData.report.fir_date
                ? Math.floor((Date.now() - new Date(caseData.report.fir_date).getTime()) / 86400000)
                : 0}
              accusedCount={people.accused?.length ?? 0}
              victimCount={people.victims?.length ?? 0}
            />
          )}
          <OfficersPanel report={caseData.report} isLoading={caseData.isLoading} />
          <RecommendationsPanel
            summary={investigation.summary}
            isLoading={investigation.isLoading}
          />
          <RelationshipNetwork
            associates={investigation.associates}
            isLoading={investigation.isLoading}
          />
        </div>
      </div>
    </div>
  );
}
