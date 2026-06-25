const fs = require("fs");

const filePath = "d:/projects/sense/Frontend/src/components/dashboard/HomeSections.tsx";
let content = fs.readFileSync(filePath, "utf8");

const replacements = [
  {
    from: `label="Average Soil Score"`,
    to: `label={t("dashboard.avg_soil_score")}`,
  },
  {
    from: `label="Est. Saving / Season"`,
    to: `label={t("dashboard.est_saving")}`,
  },
  {
    from: `label="Deficiencies Detected"`,
    to: `label={t("dashboard.deficiencies_detected")}`,
  },
  {
    from: `aria-label="How RhizoSense Works"`,
    to: `aria-label={t("dashboard.how_it_works_aria")}`,
  },
  {
    from: `How It Works`,
    to: `{t("dashboard.how_it_works")}`,
  },
  {
    from: `Powered by real metagenomic data from NCBI SRA + Random Forest ML model`,
    to: `{t("dashboard.powered_by_ncbi")}`,
  },
  {
    from: `aria-label="Farm Health Overview"`,
    to: `aria-label={t("dashboard.farm_health_overview")}`,
  },
  {
    from: `Farm Health Overview`,
    to: `{t("dashboard.farm_health_overview")}`,
  },
  {
    from: `🔴 {s.criticalFarms.length} Critical Farm{s.criticalFarms.length !== 1 ? "s" : ""}`,
    to: `🔴 {s.criticalFarms.length} {s.criticalFarms.length !== 1 ? t("dashboard.critical_farms") : t("dashboard.critical_farm")}`,
  },
  {
    from: `🟡 {s.amberFarms.length} Need Attention`,
    to: `🟡 {s.amberFarms.length} {t("dashboard.need_attention")}`,
  },
  {
    from: `🟢 {s.greenFarms.length} Healthy Farm{s.greenFarms.length !== 1 ? "s" : ""}`,
    to: `🟢 {s.greenFarms.length} {s.greenFarms.length !== 1 ? t("dashboard.healthy_farms") : t("dashboard.healthy_farm")}`,
  },
  {
    from: `aria-label="Critical alert"`,
    to: `aria-label={t("dashboard.critical_alert")}`,
  },
  {
    from: `<strong>Immediate Action Required</strong> — {worst.name} (Score:{" "}
        {Math.round(worst.health_score)}) has {worst.deficiency_count}{" "}
        deficienc{worst.deficiency_count === 1 ? "y" : "ies"} and needs urgent
        biofertilizer intervention.`,
    to: `<strong>{t("dashboard.immediate_action")}</strong> — {t("dashboard.farm_name", { name: worst.name })} {t("dashboard.score_paren", { score: Math.round(worst.health_score) })} {worst.deficiency_count}{" "}
        {worst.deficiency_count === 1 ? t("dashboard.deficiency_count") : t("dashboard.deficiencies_count")} {t("dashboard.urgent_intervention")}`,
  },
  {
    from: `View Farm <ArrowRight className="h-4 w-4" />`,
    to: `{t("dashboard.view_farm")} <ArrowRight className="h-4 w-4" />`,
  },
  {
    from: `aria-label="Key Insights"`,
    to: `aria-label={t("dashboard.key_insights")}`,
  },
  {
    from: `Key Insights`,
    to: `{t("dashboard.key_insights")}`,
  },
  {
    from: `title="Most Deficient Farm"`,
    to: `title={t("dashboard.most_deficient_farm")}`,
  },
  {
    from: `title="Biggest Cost Saving"`,
    to: `title={t("dashboard.biggest_cost_saving")}`,
  },
  {
    from: `title="Most Common Deficiency"`,
    to: `title={t("dashboard.most_common_deficiency")}`,
  },
  {
    from: `aria-label="Environmental Impact"`,
    to: `aria-label={t("dashboard.environmental_impact")}`,
  },
  {
    from: `Environmental Impact`,
    to: `{t("dashboard.environmental_impact")}`,
  },
  {
    from: `label="Chemical Fertilizer Avoided"`,
    to: `label={t("dashboard.chemical_avoided")}`,
  },
  {
    from: `label="Groundwater Protected"`,
    to: `label={t("dashboard.groundwater_protected")}`,
  },
  {
    from: `label="CO₂ Equivalent Saved"`,
    to: `label={t("dashboard.co2_saved")}`,
  },
  {
    from: `Microbial Profile Comparison`,
    to: `{t("dashboard.microbial_comparison")}`,
  },
  {
    from: `Each axis shows % of healthy baseline for that microbial group`,
    to: `{t("dashboard.axis_shows")}`,
  },
  {
    from: `Farm Locations`,
    to: `{t("dashboard.farm_locations")}`,
  },
  {
    from: `Click any pin to view farm dashboard`,
    to: `{t("dashboard.click_pin")}`,
  },
  {
    from: `Ravi's Farm`,
    to: `{t("dashboard.farm_name", { name: "Ravi" })}`,
  },
  {
    from: `Score: 61`,
    to: `{t("dashboard.score", { score: 61 })}`,
  },
  {
    from: `Suresh's Farm`,
    to: `{t("dashboard.farm_name", { name: "Suresh" })}`,
  },
  {
    from: `Score: 21`,
    to: `{t("dashboard.score", { score: 21 })}`,
  },
  {
    from: `Meena's Farm`,
    to: `{t("dashboard.farm_name", { name: "Meena" })}`,
  },
  {
    from: `Score: 62`,
    to: `{t("dashboard.score", { score: 62 })}`,
  },
  {
    from: `Critical (below 50)`,
    to: `{t("dashboard.critical_below_50")}`,
  },
  {
    from: `Needs Attention (50–69)`,
    to: `{t("dashboard.needs_attention_50_69")}`,
  },
  {
    from: `Healthy (70+)`,
    to: `{t("dashboard.healthy_70")}`,
  },
  {
    from: `aria-label="Radar Chart and Farm Locations"`,
    to: `aria-label={t("dashboard.radar_chart_aria")}`,
  },
  {
    from: `aria-label="The Hidden Crisis"`,
    to: `aria-label={t("dashboard.hidden_crisis")}`,
  },
  {
    from: `The Hidden Crisis`,
    to: `{t("dashboard.hidden_crisis")}`,
  },
  {
    from: `⚠️ LIVE`,
    to: `{t("dashboard.live")}`,
  },
  {
    from: `While this page has been open, Indian farmers have spent an estimated`,
    to: `{t("dashboard.spent_estimated")}`,
  },
  {
    from: `on chemical fertilizer inputs that targeted biofertilizer could partially replace.`,
    to: `{t("dashboard.chemical_inputs")}`,
  },
  {
    from: `Estimated from ₹80,000 crore annual chemical fertilizer expenditure across Indian agriculture (Dept. of Fertilizers, GoI)`,
    to: `{t("dashboard.estimated_from")}`,
  },
  {
    from: `✅ The RhizoSense Difference`,
    to: `{t("dashboard.rhizosense_difference")}`,
  },
  {
    from: `We identify exactly which microbial groups are deficient in your specific field — so every rupee of biofertilizer spend is targeted, not generic.`,
    to: `{t("dashboard.identify_exactly")}`,
  },
  {
    from: `label="Farms Monitored"`,
    to: `label={t("dashboard.farms_monitored")}`,
  },
];

// Add the import for useLang if missing
if (!content.includes("useLang")) {
  content = content.replace(
    'import { Link } from "@tanstack/react-router";',
    'import { Link } from "@tanstack/react-router";\nimport { useLang } from "@/lib/i18n";',
  );
}

for (const rep of replacements) {
  if (content.includes(rep.from)) {
    content = content.replace(rep.from, rep.to);
  } else {
    // Only replacing the first occurrence usually, maybe there are duplicates but replacing first is usually fine
    // For string replacements like "How It Works", it might be used twice
  }
  // Replace all globally for some smaller strings
  content = content.split(rep.from).join(rep.to);
}

// Add const { t } = useLang(); inside components if not there
const componentsToPatch = [
  "function SummaryCards",
  "function HowItWorks",
  "function FarmHealthOverview",
  "function CriticalAlertBanner",
  "function KeyInsights",
  "function EnvironmentalImpact",
  "function RegionalMap",
  "function HiddenCrisisBanner",
  "function RhizoSenseDifference",
];

componentsToPatch.forEach((c) => {
  if (content.includes(c) && !content.includes(c + "({\n  const { t } = useLang();")) {
    content = content.replace(
      c + "({ farms }: { farms: FarmSummary[] }) {",
      c + "({ farms }: { farms: FarmSummary[] }) {\n  const { t } = useLang();",
    );
    content = content.replace(c + "() {", c + "() {\n  const { t } = useLang();");
  }
});

fs.writeFileSync(filePath, content, "utf8");
console.log("Successfully replaced in HomeSections.tsx");
