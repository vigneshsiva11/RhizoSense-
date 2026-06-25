import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_DIR = path.resolve(__dirname, "../src");
const IGNORE_DIRS = ["translations"];

let totalFilesScanned = 0;
let totalViolations = 0;

function walkDir(dir: string, callback: (filePath: string) => void) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.includes(entry.name)) {
        walkDir(fullPath, callback);
      }
    } else if (entry.isFile() && fullPath.endsWith(".tsx")) {
      callback(fullPath);
    }
  }
}

function checkFile(filePath: string) {
  totalFilesScanned++;
  const sourceCode = fs.readFileSync(filePath, "utf-8");
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceCode,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  let fileViolations = 0;

  function visit(node: ts.Node) {
    // Check JSX Text nodes
    if (ts.isJsxText(node)) {
      const text = node.text.trim();
      // Ignore empty strings or strings with only special characters/numbers
      if (text.length > 0 && /[A-Za-z]/.test(text)) {
        console.warn(
          `[JSX Text] ${filePath}:${ts.getLineAndCharacterOfPosition(sourceFile, node.getStart()).line + 1}`,
        );
        console.warn(`  Found hardcoded text: "${text}"\n`);
        fileViolations++;
      }
    }

    // Check JSX attributes for string literals (like placeholder, title, etc)
    if (ts.isJsxAttribute(node) && node.initializer) {
      const attrName = node.name.text;
      const targetAttributes = ["placeholder", "title", "alt", "aria-label", "label"];

      if (targetAttributes.includes(attrName)) {
        if (ts.isStringLiteral(node.initializer)) {
          const text = node.initializer.text.trim();
          if (text.length > 0 && /[A-Za-z]/.test(text)) {
            console.warn(
              `[JSX Attribute '${attrName}'] ${filePath}:${ts.getLineAndCharacterOfPosition(sourceFile, node.getStart()).line + 1}`,
            );
            console.warn(`  Found hardcoded text: "${text}"\n`);
            fileViolations++;
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  if (fileViolations > 0) {
    totalViolations += fileViolations;
  }
}

console.log("Starting i18n validation...\n");

walkDir(TARGET_DIR, checkFile);

console.log("-----------------------------------");
console.log(`Total files scanned: ${totalFilesScanned}`);
console.log(`Total violations found: ${totalViolations}`);
console.log("-----------------------------------");

if (totalViolations > 0) {
  console.error(
    "\n❌ i18n validation failed! Please replace hardcoded strings with the t() helper.",
  );
  process.exit(1);
} else {
  console.log("\n✅ i18n validation passed!");
}
