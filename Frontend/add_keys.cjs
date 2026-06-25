const fs = require("fs");
const path = require("path");

const files = ["en.ts", "ta.ts", "hi.ts", "te.ts"];
const dir = path.join(__dirname, "src/lib/i18n/translations");

const newKeys = {
  "dashboard.avg_soil_score": "Average Soil Score",
  "dashboard.est_saving": "Est. Saving / Season",
  "dashboard.deficiencies_detected": "Deficiencies Detected",
  "dashboard.how_it_works_aria": "How RhizoSense Works",
  "dashboard.how_it_works": "How It Works",
  "dashboard.powered_by_ncbi":
    "Powered by real metagenomic data from NCBI SRA + Random Forest ML model",
  "dashboard.farm_health_overview": "Farm Health Overview",
  "dashboard.critical_farm": "Critical Farm",
  "dashboard.critical_farms": "Critical Farms",
  "dashboard.need_attention": "Need Attention",
  "dashboard.healthy_farm": "Healthy Farm",
  "dashboard.healthy_farms": "Healthy Farms",
  "dashboard.critical_alert": "Critical alert",
  "dashboard.immediate_action": "Immediate Action Required",
  "dashboard.score_paren": "(Score: {score}) has",
  "dashboard.deficiency_count": "deficiency",
  "dashboard.deficiencies_count": "deficiencies",
  "dashboard.urgent_intervention": "and needs urgent biofertilizer intervention.",
  "dashboard.view_farm": "View Farm",
  "dashboard.key_insights": "Key Insights",
  "dashboard.most_deficient_farm": "Most Deficient Farm",
  "dashboard.biggest_cost_saving": "Biggest Cost Saving",
  "dashboard.most_common_deficiency": "Most Common Deficiency",
  "dashboard.environmental_impact": "Environmental Impact",
  "dashboard.chemical_avoided": "Chemical Fertilizer Avoided",
  "dashboard.groundwater_protected": "Groundwater Protected",
  "dashboard.co2_saved": "CO₂ Equivalent Saved",
  "dashboard.microbial_comparison": "Microbial Profile Comparison",
  "dashboard.axis_shows": "Each axis shows % of healthy baseline for that microbial group",
  "dashboard.farm_locations": "Farm Locations",
  "dashboard.click_pin": "Click any pin to view farm dashboard",
  "dashboard.farm_name": "{name}'s Farm",
  "dashboard.score": "Score: {score}",
  "dashboard.critical_below_50": "Critical (below 50)",
  "dashboard.needs_attention_50_69": "Needs Attention (50–69)",
  "dashboard.healthy_70": "Healthy (70+)",
  "dashboard.radar_chart_aria": "Radar Chart and Farm Locations",
  "dashboard.hidden_crisis": "The Hidden Crisis",
  "dashboard.live": "⚠️ LIVE",
  "dashboard.spent_estimated":
    "While this page has been open, Indian farmers have spent an estimated",
  "dashboard.chemical_inputs":
    "on chemical fertilizer inputs that targeted biofertilizer could partially replace.",
  "dashboard.estimated_from":
    "Estimated from ₹80,000 crore annual chemical fertilizer expenditure across Indian agriculture (Dept. of Fertilizers, GoI)",
  "dashboard.rhizosense_difference": "✅ The RhizoSense Difference",
  "dashboard.identify_exactly":
    "We identify exactly which microbial groups are deficient in your specific field — so every rupee of biofertilizer spend is targeted, not generic.",
  "dashboard.farms_monitored": "Farms Monitored",
  "common.retry": "Retry",
  "recommendations.per_acre_cost": "/acre · ₹{cost}",
  "recommendations.total_cost_calc": "total",
};

files.forEach((file) => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, "utf8");

  // Find the last closing brace
  const lastBraceIndex = content.lastIndexOf("};");
  if (lastBraceIndex === -1) {
    console.error(`Could not find closing brace in ${file}`);
    return;
  }

  let newEntries = "";
  for (const [key, value] of Object.entries(newKeys)) {
    if (!content.includes(`"${key}"`) && !content.includes(`'${key}'`)) {
      newEntries += `  "${key}": ${JSON.stringify(value)},\n`;
    }
  }

  if (newEntries) {
    content = content.slice(0, lastBraceIndex) + newEntries + "};\n";
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Updated ${file}`);
  } else {
    console.log(`No new keys for ${file}`);
  }
});
