const fs = require("fs");
const path = require("path");

const tsFiles = ["en.ts", "ta.ts", "hi.ts", "te.ts"];
const tDir = path.join(__dirname, "src", "lib", "i18n", "translations");

const translations = {
  "en.ts": {
    no_deficiencies: "No critical deficiencies detected",
    recommendations_loading: "Recommendations loading...",
    save_amount_pct: "Save ₹{amount} ({pct}%)",
  },
  "ta.ts": {
    no_deficiencies: "நெருக்கடியான குறைபாடுகள் கண்டறியப்படவில்லை",
    recommendations_loading: "பரிந்துரைகள் ஏற்றப்படுகின்றன...",
    save_amount_pct: "சேமிப்பு ₹{amount} ({pct}%)",
  },
  "hi.ts": {
    no_deficiencies: "कोई गंभीर कमी नहीं पाई गई",
    recommendations_loading: "सिफारिशें लोड हो रही हैं...",
    save_amount_pct: "₹{amount} बचाएं ({pct}%)",
  },
  "te.ts": {
    no_deficiencies: "ఎలాంటి క్లిష్టమైన లోపాలు కనుగొనబడలేదు",
    recommendations_loading: "సిఫార్సులు లోడ్ అవుతున్నాయి...",
    save_amount_pct: "₹{amount} ఆదా చేయండి ({pct}%)",
  },
};

for (const file of tsFiles) {
  const p = path.join(tDir, file);
  let content = fs.readFileSync(p, "utf8");

  // Insert under "onboarding": { ... }
  const blockStart = content.indexOf('"onboarding": {');
  if (blockStart === -1) {
    const obStart = content.indexOf("onboarding: {");
    if (obStart === -1) continue;
  }

  const strings = translations[file];
  let injection = ``;
  for (const [k, v] of Object.entries(strings)) {
    if (!content.includes(`"${k}"`)) {
      injection += `    "${k}": "${v}",\n`;
    }
  }

  // Find the exact line "onboarding": {
  let searchStr = '"onboarding": {';
  if (!content.includes(searchStr)) searchStr = "onboarding: {";

  if (injection && content.includes(searchStr)) {
    content = content.replace(searchStr, searchStr + "\n" + injection);
    fs.writeFileSync(p, content, "utf8");
  }
}

// Update OnboardingModal.tsx
const modalP = path.join(__dirname, "src", "components", "dashboard", "OnboardingModal.tsx");
let modalContent = fs.readFileSync(modalP, "utf8");

modalContent = modalContent.replace(
  '<p className="text-sm font-bold text-[#4EA72E]">\n            No critical deficiencies detected\n          </p>',
  '<p className="text-sm font-bold text-[#4EA72E]">\n            {t("onboarding.no_deficiencies")}\n          </p>',
);

modalContent = modalContent.replace(
  '<p className="mt-1 text-sm text-[var(--muted-foreground)]">\n            Recommendations loading...\n          </p>',
  '<p className="mt-1 text-sm text-[var(--muted-foreground)]">\n            {t("onboarding.recommendations_loading")}\n          </p>',
);

modalContent = modalContent.replace(
  'Save ₹{farm.cost_summary.saving_inr.toLocaleString("en-IN")} ({farm.cost_summary.saving_pct}%)',
  '{t("onboarding.save_amount_pct", { amount: farm.cost_summary.saving_inr.toLocaleString("en-IN"), pct: farm.cost_summary.saving_pct.toString() })}',
);

fs.writeFileSync(modalP, modalContent, "utf8");
console.log("Done");
