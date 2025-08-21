/**
 * Script Usage Examples
 *
 * This file demonstrates how to use the predefined results generation script
 * with various configurations and parameters.
 */

console.log("🎰 Predefined Results Script Usage Examples\n");

console.log("=== Available NPM Scripts ===");
console.log("npm run generate          # Default: 120 boards, 97% RTP");
console.log("npm run generate:demo     # Quick: 50 boards, 97% RTP");
console.log("npm run generate:batch    # Multiple configurations");
console.log("npm run generate:help     # Show help\n");

console.log("=== Command Line Examples ===");

console.log("\n1. Basic Usage:");
console.log("   npx ts-node scripts/generate-predefined-results.ts");
console.log("   # Generates 120 boards with 97% RTP using default settings");

console.log("\n2. Custom Configuration:");
console.log("   npx ts-node scripts/generate-predefined-results.ts \\");
console.log("     --boards 100 \\");
console.log("     --rtp 0.96 \\");
console.log("     --tolerance 0.02 \\");
console.log("     --max-retries 15 \\");
console.log("     --output 'custom-game.json' \\");
console.log("     --difficulty 'Hard' \\");
console.log("     --description 'High variance custom configuration'");

console.log("\n3. Using Custom Payout Rules:");
console.log("   npx ts-node scripts/generate-predefined-results.ts \\");
console.log("     --boards 80 \\");
console.log("     --rules './examples/high-volatility-rules.json' \\");
console.log("     --output 'high-volatility-results.json'");

console.log("\n4. Quick Demo/Testing:");
console.log("   npx ts-node scripts/generate-predefined-results.ts \\");
console.log("     --boards 30 \\");
console.log("     --rtp 0.95 \\");
console.log("     --tolerance 0.05 \\");
console.log("     --output 'quick-test.json'");

console.log("\n5. Dry Run (Test Configuration):");
console.log("   npx ts-node scripts/generate-predefined-results.ts \\");
console.log("     --boards 200 \\");
console.log("     --rtp 0.98 \\");
console.log("     --dry-run");

console.log("\n6. Batch Generation:");
console.log("   npx ts-node scripts/generate-predefined-results.ts --batch");
console.log("   # Generates multiple configurations automatically");

console.log("\n=== Output Files ===");
console.log("Generated files are saved to the 'output/' directory:");
console.log("- {name}.json         # Complete board data with metadata");
console.log("- {name}-summary.txt  # Human-readable summary");

console.log("\n=== Tips for Successful Generation ===");
console.log("1. For tighter RTP targets:");
console.log("   - Increase --max-retries (e.g., 20)");
console.log("   - Use smaller --tolerance (e.g., 0.01)");
console.log("   - Consider fewer boards for testing");

console.log("\n2. For faster generation:");
console.log("   - Use larger --tolerance (e.g., 0.03)");
console.log("   - Reduce --max-retries");
console.log("   - Use easier difficulty");

console.log("\n3. For testing/development:");
console.log("   - Start with 30-50 boards");
console.log("   - Use tolerance of 0.05");
console.log("   - Use --dry-run first to validate config");

console.log("\n✅ Examples completed! Try running one of the commands above.");

export default {};
