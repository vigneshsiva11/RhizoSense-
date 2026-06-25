import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
} from "recharts";
import {
  Tractor,
  Gauge,
  IndianRupee,
  AlertTriangle,
  FlaskConical,
  Dna,
  BrainCircuit,
  Activity,
  Smartphone,
  ArrowRight,
  Leaf,
  Droplet,
  Globe,
} from "lucide-react";
import type { FarmSummary } from "@/lib/api";
import { colorForScore, HEX } from "@/lib/api";
import { useLang } from "@/lib/i18n";

/* ------------------------------------------------------------------ */
/*  Helper data derived from the farms list                            */
/* ------------------------------------------------------------------ */

interface DerivedStats {
  farmCount: number;
  avgScore: number;
  totalSaving: number;
  totalDeficiencies: number;
  criticalFarms: FarmSummary[];
  amberFarms: FarmSummary[];
  greenFarms: FarmSummary[];
}

function deriveStats(farms: FarmSummary[]): DerivedStats {
  const farmCount = farms.length;
  const avgScore = Math.round(farms.reduce((s, f) => s + f.health_score, 0) / (farmCount || 1));
  const totalDeficiencies = farms.reduce((s, f) => s + f.deficiency_count, 0);

  // Hardcoded savings from the requirement spec
  const savingsMap: Record<string, number> = {
    farm_001: 7_140,
    farm_002: 5_200,
    farm_003: 6_650,
  };
  const totalSaving = farms.reduce((s, f) => s + (savingsMap[f.id] ?? 0), 0);

  return {
    farmCount,
    avgScore,
    totalSaving,
    totalDeficiencies,
    criticalFarms: farms.filter((f) => f.health_score < 50),
    amberFarms: farms.filter((f) => f.health_score >= 50 && f.health_score < 70),
    greenFarms: farms.filter((f) => f.health_score >= 70),
  };
}

/* ------------------------------------------------------------------ */
/*  Section 1 — Platform Stats Bar                                     */
/* ------------------------------------------------------------------ */

function StatBox({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color?: string;
}) {
  return (
    <div
      className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border-l-4 bg-white px-4 py-4 shadow-sm"
      style={{ borderLeftColor: color ?? "var(--brand)" }}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: (color ?? "var(--brand)") + "18" }}
      >
        <span style={{ color: color ?? "var(--brand)" }}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p
          className="truncate text-xl font-extrabold leading-tight"
          style={{ color: color ?? "var(--navy)" }}
        >
          {value}
        </p>
        <p className="truncate text-xs text-[var(--muted-foreground)]">{label}</p>
      </div>
    </div>
  );
}

export function PlatformStatsBar({ farms }: { farms: FarmSummary[] }) {
  const { t } = useLang();
  const s = deriveStats(farms);
  return (
    <section
      className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      aria-label={t("dashboard.platform_statistics")}
    >
      <StatBox
        icon={<Tractor className="h-5 w-5" />}
        value={String(s.farmCount)}
        label={t("dashboard.farms_monitored")}
        color="var(--brand)"
      />
      <StatBox
        icon={<Gauge className="h-5 w-5" />}
        value={String(s.avgScore)}
        label={t("dashboard.avg_soil_score")}
        color={HEX.amber}
      />
      <StatBox
        icon={<IndianRupee className="h-5 w-5" />}
        value={`₹${s.totalSaving.toLocaleString("en-IN")}`}
        label={t("dashboard.est_saving")}
        color={HEX.green}
      />
      <StatBox
        icon={<AlertTriangle className="h-5 w-5" />}
        value={String(s.totalDeficiencies)}
        label={t("dashboard.deficiencies_detected")}
        color={HEX.red}
      />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section 2 — How RhizoSense Works                                   */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    icon: FlaskConical,
    title: "Soil Sample",
    sub: "Collected from field",
  },
  {
    icon: Dna,
    title: "DNA Sequencing",
    sub: "16S rRNA analysis",
  },
  {
    icon: BrainCircuit,
    title: "AI Classification",
    sub: "Kraken2 + ML model",
  },
  {
    icon: Activity,
    title: "Health Score",
    sub: "0–100 score generated",
  },
  {
    icon: Smartphone,
    title: "Recommendation",
    sub: "Biofertilizer prescribed",
  },
];

export function HowItWorks() {
  const { t } = useLang();
  return (
    <section aria-label={t("dashboard.how_it_works_aria")}>
      <h2 className="mb-5 text-xl font-extrabold tracking-tight text-[var(--navy)]">
        {t("dashboard.how_it_works")}
      </h2>

      {/* Desktop horizontal flow */}
      <div className="hidden items-center justify-between gap-1 md:flex">
        {STEPS.map((step, i) => (
          <div key={step.title} className="contents">
            <div className="flex w-36 flex-col items-center gap-2 rounded-xl border-2 border-[var(--brand)] bg-white px-3 py-4 shadow-sm text-center">
              <step.icon className="h-7 w-7 text-[var(--brand)]" />
              <p className="text-sm font-bold text-[var(--navy)]">{step.title}</p>
              <p className="text-[11px] leading-tight text-[var(--muted-foreground)]">{step.sub}</p>
            </div>
            {i < STEPS.length - 1 && (
              <ArrowRight className="h-5 w-5 shrink-0 text-[var(--brand)]" />
            )}
          </div>
        ))}
      </div>

      {/* Mobile vertical flow */}
      <div className="flex flex-col items-center gap-2 md:hidden">
        {STEPS.map((step, i) => (
          <div key={step.title} className="contents">
            <div className="flex w-full max-w-xs items-center gap-3 rounded-xl border-2 border-[var(--brand)] bg-white px-4 py-3 shadow-sm">
              <step.icon className="h-6 w-6 shrink-0 text-[var(--brand)]" />
              <div>
                <p className="text-sm font-bold text-[var(--navy)]">{step.title}</p>
                <p className="text-[11px] text-[var(--muted-foreground)]">{step.sub}</p>
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <ArrowRight className="h-4 w-4 rotate-90 text-[var(--brand)]" />
            )}
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-xs italic text-[var(--muted-foreground)]">
        {t("dashboard.powered_by_ncbi")}
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section 3 — Soil Health Comparison Chart                           */
/* ------------------------------------------------------------------ */

function barColor(score: number) {
  return HEX[colorForScore(score)];
}

export function FarmHealthChart({ farms }: { farms: FarmSummary[] }) {
  const { t } = useLang();
  const shortNames: Record<string, string> = {
    farm_001: t("dashboard.farm_name", { name: "Ravi" }),
    farm_002: t("dashboard.farm_name", { name: "Suresh" }),
    farm_003: t("dashboard.farm_name", { name: "Meena" }),
  };
  const s = deriveStats(farms);
  const data = farms.map((f) => ({
    name: shortNames[f.id] ?? f.name,
    score: Math.round(f.health_score),
  }));

  return (
    <section aria-label={t("dashboard.farm_health_overview")}>
      <h2 className="mb-5 text-xl font-extrabold tracking-tight text-[var(--navy)]">
        {t("dashboard.farm_health_overview")}
      </h2>

      <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                borderRadius: "0.75rem",
                border: "1px solid var(--border)",
                fontSize: 13,
              }}
              formatter={(v: number) => [`${v}`, "Health Score"]}
            />
            <ReferenceLine
              y={70}
              stroke={HEX.green}
              strokeDasharray="6 4"
              label={{
                value: "Healthy threshold",
                position: "insideTopRight",
                fill: HEX.green,
                fontSize: 11,
              }}
            />
            <ReferenceLine
              y={50}
              stroke={HEX.red}
              strokeDasharray="6 4"
              label={{
                value: "Critical threshold",
                position: "insideBottomRight",
                fill: HEX.red,
                fontSize: 11,
              }}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={56}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={barColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Summary pills */}
        <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm font-medium">
          <span className="rounded-full bg-[var(--danger-soft)] px-3 py-1 text-[var(--danger)]">
            🔴 {s.criticalFarms.length}{" "}
            {s.criticalFarms.length !== 1
              ? t("dashboard.critical_farms")
              : t("dashboard.critical_farm")}
          </span>
          <span className="rounded-full bg-[var(--amber-soft)] px-3 py-1 text-[var(--amber)]">
            🟡 {s.amberFarms.length} {t("dashboard.need_attention")}
          </span>
          <span className="rounded-full bg-[var(--healthy-soft)] px-3 py-1 text-[var(--healthy)]">
            🟢 {s.greenFarms.length}{" "}
            {s.greenFarms.length !== 1 ? t("dashboard.healthy_farms") : t("dashboard.healthy_farm")}
          </span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section 4 — Critical Alert Banner                                  */
/* ------------------------------------------------------------------ */

export function CriticalAlertBanner({ farms }: { farms: FarmSummary[] }) {
  const { t } = useLang();
  const critical = farms.filter((f) => f.health_score < 50);
  if (critical.length === 0) return null;

  // Show the worst farm
  const worst = critical.reduce((a, b) => (a.health_score < b.health_score ? a : b));

  return (
    <section
      aria-label={t("dashboard.critical_alert")}
      className="flex flex-col gap-3 rounded-2xl border-l-4 border-[var(--danger)] bg-[var(--danger-soft)] px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm font-medium text-[var(--foreground)]">
        <span className="mr-1 text-base">⚠️</span>
        <strong>{t("dashboard.immediate_action")}</strong> —{" "}
        {t("dashboard.farm_name", { name: worst.name })}{" "}
        {t("dashboard.score_paren", { score: Math.round(worst.health_score) })}{" "}
        {worst.deficiency_count}{" "}
        {worst.deficiency_count === 1
          ? t("dashboard.deficiency_count")
          : t("dashboard.deficiencies_count")}{" "}
        {t("dashboard.urgent_intervention")}
      </p>
      <Link
        to="/farm/$id"
        params={{ id: worst.id }}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--danger)] px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-red-600"
      >
        {t("dashboard.view_farm")} <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section 5 — {t("dashboard.key_insights")} Row                                       */
/* ------------------------------------------------------------------ */

function InsightCard({
  tint,
  title,
  body,
}: {
  tint: "red" | "green" | "amber";
  title: string;
  body: string;
}) {
  const bg =
    tint === "red"
      ? "var(--danger-soft)"
      : tint === "green"
        ? "var(--healthy-soft)"
        : "var(--amber-soft)";
  const fg =
    tint === "red" ? "var(--danger)" : tint === "green" ? "var(--healthy)" : "var(--amber)";
  return (
    <div
      className="flex-1 rounded-xl border-l-4 px-4 py-4 shadow-sm"
      style={{ backgroundColor: bg, borderLeftColor: fg }}
    >
      <p className="text-xs font-bold uppercase tracking-wide" style={{ color: fg }}>
        {title}
      </p>
      <p className="mt-1.5 text-sm text-[var(--foreground)]">{body}</p>
    </div>
  );
}

export function KeyInsights() {
  const { t } = useLang();
  return (
    <section aria-label={t("dashboard.key_insights")}>
      <h2 className="mb-5 text-xl font-extrabold tracking-tight text-[var(--navy)]">
        {t("dashboard.key_insights")}
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <InsightCard
          tint="red"
          title={t("dashboard.most_deficient_farm")}
          body="Suresh Babu's Rice Farm — 4 deficiencies across all functional groups"
        />
        <InsightCard
          tint="green"
          title={t("dashboard.biggest_cost_saving")}
          body="Meena Patil's Wheat Farm — Save ₹6,650 by switching to biofertilizer"
        />
        <InsightCard
          tint="amber"
          title={t("dashboard.most_common_deficiency")}
          body="Phosphate Solubilizers — deficient in 2 out of 3 farms"
        />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section A — {t("dashboard.environmental_impact")} Counters                          */
/* ------------------------------------------------------------------ */

function useAnimatedCounter(end: number, durationMs: number = 1500) {
  const [count, setCount] = useState(0);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || hasTriggered) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasTriggered(true);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasTriggered]);

  useEffect(() => {
    if (!hasTriggered) return;
    let startTime: number | null = null;
    let animationFrameId: number;

    const easeOutQuad = (t: number) => t * (2 - t);

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / durationMs, 1);

      setCount(Math.round(end * easeOutQuad(percentage)));

      if (percentage < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [hasTriggered, end, durationMs]);

  return { count, ref };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ImpactCard({ icon: Icon, target, unit, label, sub }: any) {
  const { count, ref } = useAnimatedCounter(target);

  return (
    <div
      ref={ref}
      className="flex-1 rounded-xl border-l-4 bg-[#F0FAF0] p-5 shadow-sm"
      style={{ borderLeftColor: "#4EA72E" }}
    >
      <Icon className="mb-3 h-8 w-8 text-[#4EA72E]" />
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-bold text-[#2D6A0F]">{count}</span>
        <span className="text-sm font-semibold text-[#2D6A0F]">{unit}</span>
      </div>
      <p className="mt-1 font-bold text-[#0E2841]">{label}</p>
      <p className="mt-0.5 text-xs text-gray-500">{sub}</p>
    </div>
  );
}

export function EnvironmentalImpact() {
  const { t } = useLang();
  return (
    <section aria-label={t("dashboard.environmental_impact")}>
      <h2 className="mb-5 text-xl font-extrabold tracking-tight text-[#0E2841]">
        {t("dashboard.environmental_impact")}
      </h2>
      <div className="flex flex-col gap-4 md:flex-row">
        <ImpactCard
          icon={Leaf}
          target={47}
          unit="kg / season"
          label={t("dashboard.chemical_avoided")}
          sub="Across all 3 farms this season"
        />
        <ImpactCard
          icon={Droplet}
          target={2400}
          unit="L / season"
          label={t("dashboard.groundwater_protected")}
          sub="By reducing nitrogen leaching into soil"
        />
        <ImpactCard
          icon={Globe}
          target={38}
          unit="kg / season"
          label={t("dashboard.co2_saved")}
          sub="Switching from synthetic to bio-inputs"
        />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section B — Radar Chart and India Map side by side                 */
/* ------------------------------------------------------------------ */

const RADAR_DATA = [
  { subject: "N-Fixers", farm1: 14, farm2: 6, farm3: 95, baseline: 100 },
  { subject: "P-Solubilizers", farm1: 23, farm2: 14, farm3: 11, baseline: 100 },
  { subject: "Mycorrhizal", farm1: 43, farm2: 10, farm3: 17, baseline: 100 },
  { subject: "Biocontrol", farm1: 88, farm2: 16, farm3: 97, baseline: 100 },
  { subject: "Biodiversity", farm1: 69, farm2: 58, farm3: 84, baseline: 100 },
];

function MicrobialProfileRadar() {
  const { t } = useLang();
  return (
    <div className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-[#0E2841]">{t("dashboard.microbial_comparison")}</h3>
      <p className="mb-4 text-xs italic text-gray-500">{t("dashboard.axis_shows")}</p>

      <div className="flex-1 min-h-[320px]">
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_DATA}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "#0E2841", fontSize: 12 }} />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tickCount={3}
              tickLine={false}
              axisLine={false}
              tickFormatter={() => ""}
            />
            <Tooltip />

            <Radar
              name="Healthy Baseline"
              dataKey="baseline"
              stroke="#9CA3AF"
              strokeDasharray="5 5"
              strokeWidth={1.5}
              fill="none"
            />
            <Radar
              name={t("dashboard.farm_name", { name: "Ravi" })}
              dataKey="farm1"
              stroke="#F59E0B"
              strokeWidth={2}
              fill="#F59E0B"
              fillOpacity={0.15}
            />
            <Radar
              name={t("dashboard.farm_name", { name: "Suresh" })}
              dataKey="farm2"
              stroke="#EF4444"
              strokeWidth={2}
              fill="#EF4444"
              fillOpacity={0.15}
            />
            <Radar
              name={t("dashboard.farm_name", { name: "Meena" })}
              dataKey="farm3"
              stroke="#4EA72E"
              strokeWidth={2}
              fill="#4EA72E"
              fillOpacity={0.15}
            />

            <Legend
              wrapperStyle={{ fontSize: "12px", marginTop: "10px" }}
              payload={[
                {
                  value: `${t("dashboard.farm_name", { name: "Ravi" })} (61)`,
                  type: "circle",
                  color: "#F59E0B",
                },
                {
                  value: `${t("dashboard.farm_name", { name: "Suresh" })} (21)`,
                  type: "circle",
                  color: "#EF4444",
                },
                {
                  value: `${t("dashboard.farm_name", { name: "Meena" })} (62)`,
                  type: "circle",
                  color: "#4EA72E",
                },
                {
                  value: "Healthy Baseline",
                  type: "plainline",
                  color: "#9CA3AF",
                  payload: { strokeDasharray: "5 5" },
                },
              ]}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function FarmLocationsMap() {
  const { t } = useLang();
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-[#0E2841]">{t("dashboard.farm_locations")}</h3>
      <p className="mb-4 text-xs italic text-gray-500">{t("dashboard.click_pin")}</p>

      <div className="relative mx-auto flex flex-1 items-center justify-center">
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes ping-subtle {
            0% { transform: scale(1); opacity: 0.8; }
            75%, 100% { transform: scale(2.5); opacity: 0; }
          }
          .pin-pulse {
            transform-origin: center;
            animation: ping-subtle 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          .farm-pin {
            cursor: pointer;
            transition: transform 0.2s ease;
            transform-origin: center;
          }
          .farm-pin:hover {
            transform: scale(1.15);
          }
        `,
          }}
        />
        <svg viewBox="0 0 400 500" className="h-full w-full max-h-[320px]">
          <path
            d="M 190 20 L 210 18 L 240 25 L 265 30 L 280 45 L 290 60 L 295 80 L 300 95 L 310 105 L 320 115 L 330 130 L 335 148 L 330 165 L 320 178 L 310 190 L 305 205 L 308 220 L 315 235 L 318 250 L 312 268 L 300 282 L 288 295 L 275 308 L 262 322 L 250 338 L 240 355 L 232 370 L 225 385 L 220 400 L 215 415 L 210 430 L 205 445 L 200 460 L 196 448 L 192 435 L 188 420 L 184 405 L 178 390 L 172 375 L 165 360 L 158 345 L 150 330 L 140 315 L 128 302 L 115 292 L 102 280 L 90 268 L 80 255 L 72 240 L 68 225 L 65 210 L 62 195 L 60 180 L 58 165 L 60 150 L 65 135 L 72 122 L 82 110 L 92 98 L 100 85 L 108 72 L 115 60 L 122 48 L 132 38 L 142 30 L 155 24 L 170 20 L 190 20 Z"
            fill="#F1F5F9"
            stroke="#CBD5E1"
            strokeWidth="1"
          />

          {/* Pin 1: {t("dashboard.farm_name", { name: "Ravi" })} */}
          <g
            className="farm-pin"
            onClick={() => navigate({ to: "/farm/$id", params: { id: "farm_001" } })}
            style={{ transformOrigin: "195px 390px" }}
          >
            <circle cx="195" cy="390" r="10" fill="#F59E0B" className="pin-pulse" />
            <circle cx="195" cy="390" r="10" fill="#F59E0B" stroke="white" strokeWidth="2" />
            <text x="195" y="375" fontSize="9" textAnchor="middle" fill="#0E2841">
              {t("dashboard.farm_name", { name: "Ravi" })}
            </text>
            <text x="195" y="410" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#0E2841">
              {t("dashboard.score", { score: 61 })}
            </text>
          </g>

          {/* Pin 2: {t("dashboard.farm_name", { name: "Suresh" })} */}
          <g
            className="farm-pin"
            onClick={() => navigate({ to: "/farm/$id", params: { id: "farm_002" } })}
            style={{ transformOrigin: "215px 400px" }}
          >
            <circle cx="215" cy="400" r="10" fill="#EF4444" className="pin-pulse" />
            <circle cx="215" cy="400" r="10" fill="#EF4444" stroke="white" strokeWidth="2" />
            <text x="215" y="385" fontSize="9" textAnchor="middle" fill="#0E2841">
              {t("dashboard.farm_name", { name: "Suresh" })}
            </text>
            <text x="215" y="420" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#0E2841">
              {t("dashboard.score", { score: 21 })}
            </text>
          </g>

          {/* Pin 3: {t("dashboard.farm_name", { name: "Meena" })} */}
          <g
            className="farm-pin"
            onClick={() => navigate({ to: "/farm/$id", params: { id: "farm_003" } })}
            style={{ transformOrigin: "148px 248px" }}
          >
            <circle cx="148" cy="248" r="10" fill="#F59E0B" className="pin-pulse" />
            <circle cx="148" cy="248" r="10" fill="#F59E0B" stroke="white" strokeWidth="2" />
            <text x="148" y="233" fontSize="9" textAnchor="middle" fill="#0E2841">
              {t("dashboard.farm_name", { name: "Meena" })}
            </text>
            <text x="148" y="268" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#0E2841">
              {t("dashboard.score", { score: 62 })}
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
          <span>{t("dashboard.critical_below_50")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
          <span>{t("dashboard.needs_attention_50_69")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#4EA72E]" />
          <span>{t("dashboard.healthy_70")}</span>
        </div>
      </div>
    </div>
  );
}

export function RadarAndMapSection() {
  const { t } = useLang();
  return (
    <section
      aria-label={t("dashboard.radar_chart_aria")}
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      <MicrobialProfileRadar />
      <FarmLocationsMap />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  {t("dashboard.hidden_crisis")} — full-width dark section                        */
/* ------------------------------------------------------------------ */

function formatIndianNumber(n: number): string {
  const s = Math.floor(n).toString();
  if (s.length <= 3) return s;
  const last3 = s.slice(-3);
  let rest = s.slice(0, -3);
  const parts: string[] = [];
  while (rest.length > 2) {
    parts.unshift(rest.slice(-2));
    rest = rest.slice(0, -2);
  }
  if (rest.length > 0) parts.unshift(rest);
  return parts.join(",") + "," + last3;
}

function CrisisStatCard({
  number: num,
  label,
  sub,
  source,
  style,
}: {
  number: string;
  label: string;
  sub: string;
  source: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className="rounded-xl p-6" style={{ backgroundColor: "#1E3A5F", ...style }}>
      <p className="text-3xl font-bold text-white">{num}</p>
      <p className="mt-2 font-medium text-white">{label}</p>
      <p className="mt-1 text-sm text-[#9CA3AF]">{sub}</p>
      <p className="mt-3 text-[11px] text-[#6B7280]">{source}</p>
    </div>
  );
}

export function HiddenCrisis() {
  const { t } = useLang();
  const [counter, setCounter] = useState(0);
  const [cardsVisible, setCardsVisible] = useState(false);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Live counter — starts immediately, increments ₹2,535 every second
  useEffect(() => {
    const id = setInterval(() => {
      setCounter((prev) => prev + 2535);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Intersection observer for card stagger animation
  useEffect(() => {
    const node = cardsRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCardsVisible(true);
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      aria-label={t("dashboard.hidden_crisis")}
      className="w-full"
      style={{ backgroundColor: "#0E2841" }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes live-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .live-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #EF4444;
          margin-right: 6px;
          animation: live-pulse 1.2s ease-in-out infinite;
        }
        @keyframes crisis-card-in {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `,
        }}
      />

      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* Part 1 — Live Counter */}
        <div className="text-center">
          <span
            className="mb-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-bold"
            style={{ backgroundColor: "#F59E0B20", color: "#F59E0B" }}
          >
            <span className="live-dot" />
            {t("dashboard.live")}
          </span>

          <p className="mt-4 text-base text-white">{t("dashboard.spent_estimated")}</p>

          <p className="my-3" style={{ fontSize: "72px", fontWeight: 800, lineHeight: 1.1 }}>
            <span style={{ color: "#EF4444" }}>₹</span>
            <span className="text-white">{formatIndianNumber(counter)}</span>
          </p>

          <p className="text-base text-white">{t("dashboard.chemical_inputs")}</p>

          <p className="mt-3 text-sm italic text-[#9CA3AF]">{t("dashboard.estimated_from")}</p>
        </div>

        {/* Part 2 — 3 Stat Cards */}
        <div ref={cardsRef} className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              number: "30%",
              label: "Indian Agricultural Soil",
              sub: "classified as severely degraded — biological collapse of microbial communities",
              source: "Source: ICAR Soil Health Assessment 2022",
            },
            {
              number: "₹80,000 Cr",
              label: "Annual Chemical Fertilizer Spend",
              sub: "government subsidised, often applied without knowing actual soil deficiency",
              source: "Source: Dept. of Fertilizers, GoI Annual Report",
            },
            {
              number: "Only 2%",
              label: "Goes to Biofertilizer",
              sub: "despite peer-reviewed studies showing 25–40% equivalent yield with targeted microbial inputs",
              source: "Source: IARI Biofertilizer Review 2021",
            },
          ].map((card, i) => (
            <CrisisStatCard
              key={card.label}
              {...card}
              style={{
                opacity: cardsVisible ? 1 : 0,
                transform: cardsVisible ? "translateY(0)" : "translateY(24px)",
                animation: cardsVisible ? `crisis-card-in 0.5s ease-out ${i * 150}ms both` : "none",
              }}
            />
          ))}
        </div>

        {/* Part 3 — Contrast Line */}
        <div className="mt-12">
          <hr style={{ borderColor: "#2D4A6B" }} />

          <div className="mt-6 text-center">
            <span
              className="inline-block rounded-full px-4 py-1.5 text-sm font-bold text-white"
              style={{ backgroundColor: "#4EA72E" }}
            >
              {t("dashboard.rhizosense_difference")}
            </span>

            <p className="mx-auto mt-4 max-w-2xl text-base text-white">
              {t("dashboard.identify_exactly")}
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {["Soil-specific diagnosis", "Precision recommendation", "Measurable saving"].map(
                (pill) => (
                  <span
                    key={pill}
                    className="rounded-full border px-3 py-1 text-sm font-medium"
                    style={{ borderColor: "#4EA72E", color: "#4EA72E" }}
                  >
                    {pill}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
