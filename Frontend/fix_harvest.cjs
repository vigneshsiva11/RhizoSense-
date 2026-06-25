const fs = require("fs");

const harvestPath = "d:/projects/sense/Frontend/src/components/dashboard/HarvestFeedback.tsx";
let harvestContent = fs.readFileSync(harvestPath, "utf8");

const harvestReplacements = [
  { from: `Projected next score`, to: `{t("harvest.projected_score")}` },
  { from: `Expected lift`, to: `{t("harvest.expected_lift")}` },
  { from: `title="Harvest Feedback"`, to: `title={t("harvest.title")}` },
  { from: `Yield per acre`, to: `{t("harvest.yield_per_acre")}` },
  { from: `kg per acre after harvest`, to: `{t("harvest.kg_per_acre")}` },
  { from: `Recommendation followed`, to: `{t("harvest.recommendation_followed")}` },
  { from: `Biofertilizer protocol`, to: `{t("harvest.biofertilizer_protocol")}` },
  {
    from: `aria-label="Toggle whether recommendation was followed"`,
    to: `aria-label={t("harvest.toggle_recommendation")}`,
  },
  { from: `Farmer rating`, to: `{t("harvest.farmer_rating")}` },
  { from: `>Notes<`, to: `>{t("harvest.notes")}<` },
  {
    from: `placeholder="Observed crop response, disease pressure, rainfall, or application notes"`,
    to: `placeholder={t("harvest.notes_placeholder")}`,
  },
  {
    from: `Feedback could not be submitted. Check that the backend is running on localhost:8000.`,
    to: `{t("harvest.submit_error", { url: "localhost:8000" })}`,
  },
];

if (!harvestContent.includes("useLang")) {
  harvestContent = harvestContent.replace(
    'import { Button } from "@/components/ui/button";',
    'import { Button } from "@/components/ui/button";\nimport { useLang } from "@/lib/i18n";',
  );
}

for (const rep of harvestReplacements) {
  harvestContent = harvestContent.replace(rep.from, rep.to);
}

// Ensure t() is available
if (!harvestContent.includes("const { t } = useLang();")) {
  harvestContent = harvestContent.replace(
    "export function HarvestFeedback({ farm, onFeedbackSubmitted }: HarvestFeedbackProps) {",
    "export function HarvestFeedback({ farm, onFeedbackSubmitted }: HarvestFeedbackProps) {\n  const { t } = useLang();",
  );
}

fs.writeFileSync(harvestPath, harvestContent, "utf8");

const farmPath = "d:/projects/sense/Frontend/src/routes/farm.$id.tsx";
let farmContent = fs.readFileSync(farmPath, "utf8");
farmContent = farmContent.replace(
  "localhost:8000.",
  '{t("farm.unreachable", { url: "localhost:8000" })}',
);
fs.writeFileSync(farmPath, farmContent, "utf8");

const indexPath = "d:/projects/sense/Frontend/src/routes/index.tsx";
let indexContent = fs.readFileSync(indexPath, "utf8");
indexContent = indexContent.replace(
  "localhost:8000.",
  '{t("farm.unreachable", { url: "localhost:8000" })}',
);
fs.writeFileSync(indexPath, indexContent, "utf8");

console.log("Done");
