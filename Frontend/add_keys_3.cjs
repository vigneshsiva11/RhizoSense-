const fs = require("fs");
const path = require("path");

const files = ["en.ts", "ta.ts", "hi.ts", "te.ts"];
const dir = path.join(__dirname, "src/lib/i18n/translations");

const newKeys = {
  "harvest.projected_score": "Projected next score",
  "harvest.expected_lift": "Expected lift",
  "harvest.title": "Harvest Feedback",
  "harvest.yield_per_acre": "Yield per acre",
  "harvest.kg_per_acre": "kg per acre after harvest",
  "harvest.recommendation_followed": "Recommendation followed",
  "harvest.biofertilizer_protocol": "Biofertilizer protocol",
  "harvest.toggle_recommendation": "Toggle whether recommendation was followed",
  "harvest.farmer_rating": "Farmer rating",
  "harvest.notes": "Notes",
  "harvest.notes_placeholder":
    "Observed crop response, disease pressure, rainfall, or application notes",
  "harvest.submit_error":
    "Feedback could not be submitted. Check that the backend is running on {url}.",
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
