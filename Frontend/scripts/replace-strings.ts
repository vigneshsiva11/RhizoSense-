import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function replaceInFile(
  filePath: string,
  replacements: Array<{ search: string | RegExp; replace: string }>,
  injectImport: boolean = false,
) {
  let content = fs.readFileSync(filePath, "utf-8");
  const originalContent = content;

  for (const { search, replace } of replacements) {
    if (typeof search === "string") {
      content = content.split(search).join(replace);
    } else {
      content = content.replace(search, replace);
    }
  }

  if (content !== originalContent) {
    if (injectImport && !content.includes("useLanguage")) {
      // find last import
      const match = content.match(/import .* from '.*';\n/g);
      if (match) {
        const lastImport = match[match.length - 1];
        content = content.replace(
          lastImport,
          lastImport + `import { useLanguage } from "@/lib/i18n";\n`,
        );
      }
    }
    // inject const { t } = useLanguage(); inside the component
    // We'll have to manually do this for complex files or rely on standard function signatures
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

const SRC = path.resolve(__dirname, "../src");

// 1. OnboardingModal.tsx
const onboardingModal = path.join(SRC, "components/dashboard/OnboardingModal.tsx");
replaceInFile(onboardingModal, [
  { search: ">Farmer Name *<", replace: '>{t("onboarding.farmer_name")}<' },
  {
    search: 'placeholder="Enter farmer name"',
    replace: 'placeholder={t("onboarding.ph_farmer_name")}',
  },
  { search: ">Location *<", replace: '>{t("onboarding.location")}<' },
  {
    search: 'placeholder="e.g. Coimbatore, Tamil Nadu"',
    replace: 'placeholder={t("onboarding.ph_location")}',
  },
  { search: ">Crop Type *<", replace: '>{t("onboarding.crop_type")}<' },
  { search: 'placeholder="Select crop type"', replace: 'placeholder={t("onboarding.ph_crop")}' },
  { search: ">Farm Area (acres) *<", replace: '>{t("onboarding.farm_area")}<' },
  { search: 'placeholder="e.g. 3"', replace: 'placeholder={t("onboarding.ph_area")}' },
  { search: "Next →", replace: '{t("common.next")} →' },
  { search: "Upload Soil Sample Image", replace: '{t("onboarding.upload_title")}' },
  {
    search: "In production, this triggers lab sequencing. For this demo, we simulate the analysis.",
    replace: '{t("onboarding.upload_desc")}',
  },
  { search: 'alt="Soil sample preview"', replace: 'alt={t("onboarding.preview_alt")}' },
  { search: "Drop soil image here or click to browse", replace: '{t("onboarding.drop_image")}' },
  {
    search: "Your sample will be analysed using 16S rRNA metagenomic sequencing pipeline",
    replace: '{t("onboarding.sample_info")}',
  },
  { search: "Start Analysis →", replace: '{t("onboarding.start_analysis")} →' },
  { search: "Analysing Your Soil Sample…", replace: '{t("onboarding.analyzing")}' },
  { search: "Analysis Complete!", replace: '{t("onboarding.analysis_complete")}' },
  { search: "View Results <", replace: '{t("onboarding.view_results")} <' },
  { search: "> Retry<", replace: '> {t("common.retry")}<' },
  { search: "Deficiencies Detected", replace: '{t("onboarding.deficiencies_detected")}' },
  { search: "Top Recommendation", replace: '{t("onboarding.top_recommendation")}' },
  { search: " total cost<", replace: ' {t("onboarding.total_cost")}<' },
  {
    search: "estimated saving vs chemical fertilizer",
    replace: '{t("onboarding.estimated_saving")}',
  },
  { search: "View Full Dashboard <", replace: '{t("onboarding.view_dashboard")} <' },
  { search: ">Back to Home<", replace: '>{t("onboarding.back_home")}<' },
  { search: ">Add New Farm<", replace: '>{t("onboarding.add_new_farm")}<' },
  {
    search: "Onboarding wizard to add a new farm with soil analysis",
    replace: '{t("onboarding.add_new_farm_desc")}',
  },
  { search: '"Farm Details"', replace: 't("onboarding.label_1")' },
  { search: '"Soil Sample"', replace: 't("onboarding.label_2")' },
  { search: '"Processing"', replace: 't("onboarding.label_3")' },
  { search: '"Results"', replace: 't("onboarding.label_4")' },
  { search: '"Preprocessing soil image..."', replace: 't("onboarding.step_1")' },
  { search: '"Simulating 16S rRNA sequencing..."', replace: 't("onboarding.step_2")' },
  { search: '"Running Kraken2 taxonomic classification..."', replace: 't("onboarding.step_3")' },
  { search: '"Applying FAPROTAX functional annotation..."', replace: 't("onboarding.step_4")' },
  {
    search: '"Computing health score with Random Forest model..."',
    replace: 't("onboarding.step_5")',
  },
  { search: '"Generating biofertilizer recommendations..."', replace: 't("onboarding.step_6")' },
]);

let omContent = fs.readFileSync(onboardingModal, "utf-8");
if (!omContent.includes("useLanguage")) {
  omContent = omContent.replace(
    'import { useNavigate } from "@tanstack/react-router";',
    'import { useNavigate } from "@tanstack/react-router";\nimport { useLanguage } from "@/lib/i18n";',
  );
  omContent = omContent.replace(
    "export function OnboardingModal({",
    "export function OnboardingModal({\n  open,\n  onClose,\n}: {\n  open: boolean;\n  onClose: () => void;\n}) {\n  const { t } = useLanguage();",
  );
  omContent = omContent.replace(
    /export function OnboardingModal\(\{[\s\S]*?\}\) \{/,
    "export function OnboardingModal({\n  open,\n  onClose,\n}: {\n  open: boolean;\n  onClose: () => void;\n}) {\n  const { t } = useLanguage();",
  );
  // Also we need t in ProgressBar, StepFarmDetails, etc. But they are sub-components in the same file.
  // Instead of passing t around, let's just useLanguage in each sub-component.
  omContent = omContent.replace(
    "function ProgressBar({ step }: { step: Step }) {",
    "function ProgressBar({ step }: { step: Step }) {\n  const { t } = useLanguage();",
  );
  omContent = omContent.replace(
    "function StepFarmDetails({",
    "function StepFarmDetails({\n  form,\n  onChange,\n  onNext,\n}: {\n  form: FormData;\n  onChange: (f: FormData) => void;\n  onNext: () => void;\n}) {\n  const { t } = useLanguage();",
  );
  omContent = omContent.replace(
    /function StepFarmDetails\(\{[\s\S]*?\}\) \{/,
    "function StepFarmDetails({\n  form,\n  onChange,\n  onNext,\n}: {\n  form: FormData;\n  onChange: (f: FormData) => void;\n  onNext: () => void;\n}) {\n  const { t } = useLanguage();",
  );

  omContent = omContent.replace(
    "function StepSoilSample({ onNext }: { onNext: () => void }) {",
    "function StepSoilSample({ onNext }: { onNext: () => void }) {\n  const { t } = useLanguage();",
  );

  omContent = omContent.replace(
    /function StepProcessing\(\{[\s\S]*?\}\) \{/,
    "function StepProcessing({\n  form,\n  onComplete,\n}: {\n  form: FormData;\n  onComplete: (result: FarmDetail) => void;\n}) {\n  const { t } = useLanguage();",
  );

  omContent = omContent.replace(
    /function StepResults\(\{[\s\S]*?\}\) \{/,
    "function StepResults({\n  result,\n  onViewDashboard,\n  onBackHome,\n}: {\n  result: FarmDetail;\n  onViewDashboard: () => void;\n  onBackHome: () => void;\n}) {\n  const { t } = useLanguage();",
  );

  // clean up duplicate declarations
  omContent = omContent.replace(
    /const \{ t \} = useLanguage\(\);\s+const \{ t \} = useLanguage\(\);/g,
    "const { t } = useLanguage();",
  );

  // There are some duplicate replace issues from regex.
}
fs.writeFileSync(onboardingModal, omContent);

// 2. Recommendations.tsx
const recommendations = path.join(SRC, "components/dashboard/Recommendations.tsx");
replaceInFile(
  recommendations,
  [
    { search: ">/acre · ₹<", replace: '>{t("recommendations.per_acre")}<' },
    { search: "> total<", replace: '> {t("recommendations.total")}<' },
  ],
  true,
);
let recContent = fs.readFileSync(recommendations, "utf-8");
if (!recContent.includes("const { t } = useLanguage()")) {
  recContent = recContent.replace(
    "export function Recommendations({ recommendations }: { recommendations: Recommendation[] }) {",
    "export function Recommendations({ recommendations }: { recommendations: Recommendation[] }) {\n  const { t } = useLanguage();",
  );
  fs.writeFileSync(recommendations, recContent);
}

// 3. ScoreFactors.tsx
const scoreFactors = path.join(SRC, "components/dashboard/ScoreFactors.tsx");
replaceInFile(
  scoreFactors,
  [
    {
      search:
        "Powered by SHAP explainability — shows which microbial factors raised or lowered your\n        score vs an average farm.",
      replace: '{t("score_factors.powered_by")}',
    },
  ],
  true,
);
let sfContent = fs.readFileSync(scoreFactors, "utf-8");
if (!sfContent.includes("const { t } = useLanguage()")) {
  sfContent = sfContent.replace(
    "export function ScoreFactors({ impactFactors }: { impactFactors: ImpactFactor[] }) {",
    "export function ScoreFactors({ impactFactors }: { impactFactors: ImpactFactor[] }) {\n  const { t } = useLanguage();",
  );
  fs.writeFileSync(scoreFactors, sfContent);
}

// 4. ui/breadcrumb.tsx
const breadcrumb = path.join(SRC, "components/ui/breadcrumb.tsx");
replaceInFile(breadcrumb, [
  { search: 'aria-label="breadcrumb"', replace: 'aria-label={t("ui.breadcrumb")}' },
  { search: ">More<", replace: '>{t("common.more")}<' },
]);
let breadcrumbContent = fs.readFileSync(breadcrumb, "utf-8");
if (!breadcrumbContent.includes("useLanguage")) {
  breadcrumbContent = breadcrumbContent.replace(
    'import * as React from "react"',
    'import * as React from "react"\nimport { useLanguage } from "@/lib/i18n";',
  );
  breadcrumbContent = breadcrumbContent.replace(
    "const Breadcrumb = React.forwardRef<",
    'const Breadcrumb = React.forwardRef<\n  HTMLElement,\n  React.ComponentPropsWithoutRef<"nav"> & {\n    separator?: React.ReactNode\n  }\n>(\n  ({ ...props }, ref) => {\n    const { t } = useLanguage();\n    return <nav ref={ref} aria-label={t("ui.breadcrumb")} {...props} />\n  }\n)\nBreadcrumb.displayName = "Breadcrumb"\n\n/*',
  );
  // Replace the Breadcrumb component directly
}
// since UI components are tricky with forwardRef, let's just do it manually if script fails.
