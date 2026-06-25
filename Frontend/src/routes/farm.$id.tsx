import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { fetchFarm, FALLBACK_FARM } from "@/lib/api";
import { useLang } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { HealthGauge } from "@/components/dashboard/HealthGauge";
import { MicrobialBreakdown } from "@/components/dashboard/MicrobialBreakdown";
import { Recommendations } from "@/components/dashboard/Recommendations";
import { CostComparison } from "@/components/dashboard/CostComparison";
import { SeasonalTrend } from "@/components/dashboard/SeasonalTrend";
import { ScoreFactors } from "@/components/dashboard/ScoreFactors";
import { HarvestFeedback } from "@/components/dashboard/HarvestFeedback";

export const Route = createFileRoute("/farm/$id")({
  head: () => ({
    meta: [
      { title: "Farm Dashboard — RhizoSense" },
      {
        name: "description",
        content:
          "Detailed soil microbiome health dashboard: deficiency breakdown, biofertilizer recommendations, cost savings and AI score explanation.",
      },
    ],
  }),
  component: FarmDashboard,
});

function TopNav({ farmName }: { farmName: string }) {
  const { t } = useLang();
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
        <Link
          to="/"
          aria-label={t("back_home")}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-navy transition-colors hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="min-w-0 flex-1 truncate text-base font-bold text-navy sm:text-lg">
          {farmName}
        </h1>
        <LanguageSwitcher />
      </div>
    </header>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-56 animate-pulse rounded-2xl border border-border bg-card shadow-sm"
        />
      ))}
    </div>
  );
}

function FarmDashboard() {
  const { id } = Route.useParams();
  const { t } = useLang();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["farm", id],
    queryFn: () => fetchFarm(id),
    retry: false,
  });

  const farm = isError || !data ? { ...FALLBACK_FARM, id } : data;

  return (
    <div className="min-h-screen bg-background">
      <TopNav farmName={isLoading ? "…" : farm.name} />

      <main className="mx-auto max-w-4xl px-4 py-6">
        {isError && (
          <div className="mb-5 rounded-xl border border-amber/40 bg-amber-soft px-4 py-3 text-sm text-foreground">
            {t("farm.showing_demo")} <code>{"localhost:8000"}</code> {t("farm.unreachable")}
          </div>
        )}

        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <div className="space-y-5">
            <div className="mb-1">
              <p className="text-sm text-muted-foreground">
                {farm.farmer_name} · {farm.location} · {farm.crop} · {farm.area_acres}{" "}
                {t("farm.acres")}
                {farm.soil_type ? ` · ${farm.soil_type}` : ""}
              </p>
            </div>
            <HealthGauge farm={farm} />
            <MicrobialBreakdown farm={farm} />
            <Recommendations farm={farm} />
            <CostComparison farm={farm} />
            <SeasonalTrend farm={farm} />
            <HarvestFeedback farm={farm} />
            <ScoreFactors farm={farm} />
          </div>
        )}
      </main>
    </div>
  );
}
