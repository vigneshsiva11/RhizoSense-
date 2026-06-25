const fs = require("fs");
const path = require("path");

const tsxFilePath = "d:/projects/sense/Frontend/src/components/dashboard/HomeSections.tsx";
let tsxContent = fs.readFileSync(tsxFilePath, "utf8");

tsxContent = tsxContent.replace(
  'aria-label="Platform statistics"',
  'aria-label={t("dashboard.platform_statistics")}',
);
tsxContent = tsxContent.replace(
  'aria-label="Radar Chart and {t("dashboard.farm_locations")}"',
  'aria-label={t("dashboard.radar_chart_aria")}',
);

tsxContent = tsxContent.replace(
  'name="{t("dashboard.farm_name", { name: "Ravi" })}"',
  'name={t("dashboard.farm_name", { name: "Ravi" })}',
);
tsxContent = tsxContent.replace(
  'name="{t("dashboard.farm_name", { name: "Suresh" })}"',
  'name={t("dashboard.farm_name", { name: "Suresh" })}',
);
tsxContent = tsxContent.replace(
  'name="{t("dashboard.farm_name", { name: "Meena" })}"',
  'name={t("dashboard.farm_name", { name: "Meena" })}',
);

tsxContent = tsxContent.replace(
  '"{t("dashboard.farm_name", { name: "Ravi" })} (61)"',
  '`${t("dashboard.farm_name", { name: "Ravi" })} (61)`',
);
tsxContent = tsxContent.replace(
  '"{t("dashboard.farm_name", { name: "Suresh" })} (21)"',
  '`${t("dashboard.farm_name", { name: "Suresh" })} (21)`',
);
tsxContent = tsxContent.replace(
  '"{t("dashboard.farm_name", { name: "Meena" })} (62)"',
  '`${t("dashboard.farm_name", { name: "Meena" })} (62)`',
);

// Also update PlatformStatsBar to use `const { t } = useLang();`
if (
  !tsxContent.includes(
    "export function PlatformStatsBar({ farms }: { farms: FarmSummary[] }) {\n  const { t } = useLang();",
  )
) {
  tsxContent = tsxContent.replace(
    "export function PlatformStatsBar({ farms }: { farms: FarmSummary[] }) {\n  const s = deriveStats(farms);",
    "export function PlatformStatsBar({ farms }: { farms: FarmSummary[] }) {\n  const { t } = useLang();\n  const s = deriveStats(farms);",
  );
}

// RadarAndMapSection
if (!tsxContent.includes("export function RadarAndMapSection() {\n  const { t } = useLang();")) {
  tsxContent = tsxContent.replace(
    "export function RadarAndMapSection() {\n  return (",
    "export function RadarAndMapSection() {\n  const { t } = useLang();\n  return (",
  );
}

fs.writeFileSync(tsxFilePath, tsxContent, "utf8");

const files = ["en.ts", "ta.ts", "hi.ts", "te.ts"];
const dir = path.join(__dirname, "src/lib/i18n/translations");

const newKeys = {
  "dashboard.platform_statistics": "Platform statistics",
  "dashboard.how_it_works_aria": "How RhizoSense Works",
  "dashboard.radar_chart_aria": "Radar Chart and Farm Locations",
};

files.forEach((file) => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, "utf8");

  const lastBraceIndex = content.lastIndexOf("};");
  if (lastBraceIndex === -1) return;

  let newEntries = "";
  for (const [key, value] of Object.entries(newKeys)) {
    if (!content.includes(`"${key}"`) && !content.includes(`'${key}'`)) {
      newEntries += `  "${key}": ${JSON.stringify(value)},\n`;
    }
  }

  if (newEntries) {
    content = content.slice(0, lastBraceIndex) + newEntries + "};\n";
    fs.writeFileSync(filePath, content, "utf8");
  }
});
console.log("Done");
