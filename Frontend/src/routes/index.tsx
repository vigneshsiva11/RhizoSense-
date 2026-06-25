import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Leaf, MapPin, Sprout, AlertTriangle, CheckCircle2 } from "lucide-react";
import { fetchFarms, FALLBACK_FARMS, colorForScore, HEX, type FarmSummary } from "@/lib/api";
import { useLang } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  PlatformStatsBar,
  HowItWorks,
  FarmHealthChart,
  CriticalAlertBanner,
  KeyInsights,
  EnvironmentalImpact,
  RadarAndMapSection,
  HiddenCrisis,
} from "@/components/dashboard/HomeSections";
import { OnboardingModal } from "@/components/dashboard/OnboardingModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RhizoSense — Farm Soil Health Dashboard" },
      {
        name: "description",
        content:
          "View soil microbiome health scores for your farms and detect microbial deficiencies with RhizoSense.",
      },
      { property: "og:title", content: "RhizoSense — Farm Soil Health Dashboard" },
      {
        property: "og:description",
        content: "Soil microbiome health scores and deficiency detection for Indian farmers.",
      },
    ],
  }),
  component: FarmList,
});

function AppHeader() {
  const { t } = useLang();
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10">
            <Leaf className="h-6 w-6 text-brand" aria-hidden />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-navy">
              {t("index.rhizosense")}
            </h1>
            <p className="text-sm text-muted-foreground">{t("app_subtitle")}</p>
          </div>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  );
}

function FarmCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="h-5 w-2/3 rounded bg-muted" />
          <div className="h-3 w-1/3 rounded bg-muted" />
          <div className="flex gap-2">
            <div className="h-6 w-20 rounded-full bg-muted" />
            <div className="h-6 w-16 rounded-full bg-muted" />
          </div>
          <div className="h-3 w-1/2 rounded bg-muted" />
        </div>
        <div className="h-20 w-20 rounded-xl bg-muted" />
      </div>
    </div>
  );
}

function Tag({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
      {icon}
      {children}
    </span>
  );
}

function FarmCard({ farm }: { farm: FarmSummary }) {
  const { t } = useLang();
  const color = colorForScore(farm.health_score);
  const hex = HEX[color];
  const statusLabel =
    farm.deficiency_count <= 0
      ? t("healthy")
      : color === "red"
        ? t("critical")
        : t("needs_attention");

  return (
    <Link
      to="/farm/$id"
      params={{ id: farm.id }}
      className="group block rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-bold text-navy">{farm.name}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{farm.farmer_name}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <Tag icon={<MapPin className="h-3.5 w-3.5" />}>{farm.location}</Tag>
            <Tag icon={<Sprout className="h-3.5 w-3.5" />}>{farm.crop}</Tag>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            {farm.area_acres} {t("farm.acres")}
            {farm.soil_type ? ` · ${farm.soil_type}` : ""}
          </p>

          {farm.deficiency_count > 0 ? (
            <p className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-danger">
              <AlertTriangle className="h-4 w-4" />
              {farm.deficiency_count} {t("deficiencies")}
            </p>
          ) : (
            <p className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-healthy">
              <CheckCircle2 className="h-4 w-4" />
              {t("healthy")}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-xl text-3xl font-extrabold text-white shadow-sm"
            style={{ backgroundColor: hex }}
          >
            {Math.round(farm.health_score)}
          </div>
          <span className="max-w-20 text-center text-xs font-semibold" style={{ color: hex }}>
            {statusLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}

function FarmList() {
  const { t } = useLang();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["farms"],
    queryFn: fetchFarms,
    retry: false,
  });

  const farms = isError || !data || data.length === 0 ? FALLBACK_FARMS : data;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Constrained section above the dark break */}
      <div className="mx-auto max-w-5xl px-4 pt-6">
        {isError && (
          <div className="mb-5 rounded-xl border border-amber/40 bg-amber-soft px-4 py-3 text-sm text-foreground">
            {t("farm.showing_demo")} <code>{"localhost:8000"}</code> {t("farm.unreachable")}
          </div>
        )}

        <div className="space-y-8">
          {/* Section 1 — Platform Stats Bar */}
          {!isLoading && <PlatformStatsBar farms={farms} />}
        </div>
      </div>

      {/* Full-width dark section */}
      <div className="mt-8">
        <HiddenCrisis />
      </div>

      {/* Remaining constrained sections */}
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="space-y-8">
          <EnvironmentalImpact />
          <RadarAndMapSection />

          {/* Section 2 — How It Works */}
          <HowItWorks />

          {/* Section 3 — Farm Health Comparison Chart */}
          {!isLoading && <FarmHealthChart farms={farms} />}

          {/* Section 4 — Critical Alert Banner */}
          {!isLoading && <CriticalAlertBanner farms={farms} />}

          {/* Section 5 — Key Insights */}
          <KeyInsights />

          {/* Existing Farm Cards */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-extrabold tracking-tight text-navy">
                {t("index.farm_portfolio")}
              </h2>
              <button
                onClick={() => setShowOnboarding(true)}
                className="flex items-center gap-1.5 rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#3e8c22]"
              >
                {t("index.add_new")}
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => <FarmCardSkeleton key={i} />)
                : farms.map((farm) => <FarmCard key={farm.id} farm={farm} />)}
            </div>
          </section>

          <OnboardingModal open={showOnboarding} onClose={() => setShowOnboarding(false)} />
        </div>
      </main>
    </div>
  );
}
