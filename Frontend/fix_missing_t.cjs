const fs = require("fs");

const file = "d:/projects/sense/Frontend/src/components/dashboard/HomeSections.tsx";
let content = fs.readFileSync(file, "utf8");

const functionsToFix = [
  "MicrobialProfileRadar",
  "FarmLocationsMap",
  "HiddenCrisis",
  "TakeAction",
  "SoilScienceOverview",
];

for (const fn of functionsToFix) {
  const searchRegex = new RegExp(`(function ${fn}\\s*\\([^)]*\\)\\s*\\{)`);
  content = content.replace(searchRegex, `$1\n  const { t } = useLang();`);
}

// Also wait, what about HarvestFeedback.tsx?
const harvestFile = "d:/projects/sense/Frontend/src/components/dashboard/HarvestFeedback.tsx";
let harvestContent = fs.readFileSync(harvestFile, "utf8");
if (!harvestContent.includes("const { t } = useLang();")) {
  harvestContent = harvestContent.replace(
    "export function HarvestFeedback({ farm, onFeedbackSubmitted }: HarvestFeedbackProps) {",
    "export function HarvestFeedback({ farm, onFeedbackSubmitted }: HarvestFeedbackProps) {\n  const { t } = useLang();",
  );
  fs.writeFileSync(harvestFile, harvestContent, "utf8");
} else {
  // Maybe it's missing in `HarvestFeedback` but present in `FeedbackImpact`?
  if (
    harvestContent.indexOf("const { t } = useLang();") ===
    harvestContent.lastIndexOf("const { t } = useLang();")
  ) {
    // only 1 occurrence, let's just make sure both have it
    harvestContent = harvestContent.replace(
      "export function HarvestFeedback({ farm, onFeedbackSubmitted }: HarvestFeedbackProps) {",
      "export function HarvestFeedback({ farm, onFeedbackSubmitted }: HarvestFeedbackProps) {\n  const { t } = useLang();",
    );
    fs.writeFileSync(harvestFile, harvestContent, "utf8");
  }
}

fs.writeFileSync(file, content, "utf8");
console.log("Fixed missing t");
