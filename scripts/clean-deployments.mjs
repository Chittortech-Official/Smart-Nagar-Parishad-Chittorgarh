import { execSync } from "child_process";

const PROJECT_NAME = "tourism-testing-rptb";
const SCOPE = "chittor-tech";
const KEEP_COUNT = 2;

console.log(`🔍 Fetching deployments for "${PROJECT_NAME}" (Scope: ${SCOPE})...\n`);

try {
  // Fetch deployments in JSON format
  const rawOutput = execSync(
    `npx vercel list ${PROJECT_NAME} --scope ${SCOPE} --json --limit 100`,
    { encoding: "utf-8", stdio: ["inherit", "pipe", "pipe"] }
  );

  let data;
  try {
    data = JSON.parse(rawOutput.trim());
  } catch {
    // If output has extra text, find the json part
    const match = rawOutput.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
    if (match) {
      data = JSON.parse(match[0]);
    } else {
      throw new Error("Could not parse JSON output from Vercel CLI.");
    }
  }

  const deployments = Array.isArray(data) ? data : data.deployments || [];

  if (!deployments.length) {
    console.log("No deployments found.");
    process.exit(0);
  }

  // Sort newest first just in case
  deployments.sort((a, b) => (b.createdAt || b.created || 0) - (a.createdAt || a.created || 0));

  console.log(`Found total ${deployments.length} deployments.\n`);

  // Separate kept vs to delete
  const keep = deployments.slice(0, KEEP_COUNT);
  const toDelete = deployments.slice(KEEP_COUNT);

  console.log(`✅ Keeping the top ${keep.length} latest deployments:`);
  keep.forEach((d, idx) => {
    console.log(`   ${idx + 1}. ${d.url || d.uid || d.id} (${d.state || "READY"})`);
  });

  if (!toDelete.length) {
    console.log("\n🎉 No older deployments need deletion!");
    process.exit(0);
  }

  console.log(`\n🗑️  Found ${toDelete.length} old deployment(s) to delete:\n`);

  for (let i = 0; i < toDelete.length; i++) {
    const d = toDelete[i];
    const id = d.uid || d.id || d.url;
    console.log(`[${i + 1}/${toDelete.length}] Deleting ${id} (${d.url || ""})...`);

    try {
      execSync(`npx vercel rm ${id} --scope ${SCOPE} --yes`, {
        stdio: "inherit",
      });
      console.log(`   ✓ Successfully deleted ${id}\n`);
    } catch (err) {
      console.error(`   ⚠️ Failed to delete ${id}:`, err.message);
    }
  }

  console.log("✨ All older deployments have been cleaned up!");
} catch (error) {
  if (error.message?.includes("No existing credentials") || error.stderr?.includes("login")) {
    console.error("\n❌ You are not logged in to Vercel CLI.");
    console.error("👉 Please run: npx vercel login\n");
  } else {
    console.error("\n❌ Error:", error.message || error);
  }
  process.exit(1);
}
