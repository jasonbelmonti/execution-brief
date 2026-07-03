#!/usr/bin/env node
import { existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const PLACEHOLDERS = [
  "TODO",
  "TBD",
  "???",
  "/absolute/path/to/target-repo",
  "<brief-id>",
  "<target-repo>",
  "<target-branch>",
  "<checksum>",
  "EB-0000",
  "RB-0000",
  "State what must be achieved",
];

function usage() {
  return [
    "usage: validate_execution_brief.mjs --file EXECUTION_BRIEF.md --profile PROFILE.yaml [--format json]",
    "",
    "Runs markdown-engine profile validation plus frontmatter placeholder checks.",
  ].join("\n");
}

function parseArgs(argv) {
  const args = { format: "json" };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "-h" || arg === "--help") {
      args.help = true;
      continue;
    }
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`${arg} requires a value`);
    }
    index += 1;
    if (arg === "--file") {
      args.file = value;
    } else if (arg === "--profile") {
      args.profile = value;
    } else if (arg === "--format") {
      args.format = value;
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }
  if (args.help) {
    return args;
  }
  if (!args.file || !args.profile) {
    throw new Error("--file and --profile are required");
  }
  if (args.format !== "json") {
    throw new Error("--format json is the only supported output format");
  }
  return args;
}

function markdownEngineCommand() {
  if (process.env.MARKDOWN_ENGINE) {
    return process.env.MARKDOWN_ENGINE;
  }
  if (process.env.MARKDOWN_ENGINE_BIN_DIR) {
    return join(process.env.MARKDOWN_ENGINE_BIN_DIR, "markdown-engine");
  }
  const localDefault = join(process.env.HOME || "", ".local/bin/markdown-engine");
  return existsSync(localDefault) ? localDefault : "markdown-engine";
}

function runEngine(args) {
  const result = spawnSync(markdownEngineCommand(), args, {
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });
  if (result.error) {
    throw result.error;
  }
  return result;
}

function parseJson(stdout, context) {
  try {
    return JSON.parse(stdout);
  } catch (error) {
    throw new Error(`${context} did not return JSON: ${error.message}`);
  }
}

function frontmatterDiagnostics(frontmatter) {
  if (!frontmatter || typeof frontmatter !== "object" || Array.isArray(frontmatter)) {
    return [];
  }

  const diagnostics = [];
  for (const [field, value] of Object.entries(frontmatter)) {
    const text = typeof value === "string" ? value : JSON.stringify(value);
    if (!text) {
      continue;
    }
    for (const placeholder of PLACEHOLDERS) {
      if (text.includes(placeholder)) {
        diagnostics.push({
          code: "executionBrief.frontmatter.placeholderValue",
          message: `Frontmatter field "${field}" contains placeholder "${placeholder}".`,
          severity: "error",
        });
      }
    }
  }
  return diagnostics;
}

function hasError(diagnostics) {
  return diagnostics.some((diagnostic) => diagnostic.severity === "error");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return 0;
  }

  const validation = runEngine([
    "validate",
    "--file",
    args.file,
    "--profile",
    args.profile,
    "--format",
    "json",
  ]);
  if (validation.status === 2) {
    process.stderr.write(validation.stderr);
    return 2;
  }

  const validationResult = parseJson(validation.stdout, "markdown-engine validate");
  const normalized = runEngine(["--file", args.file]);
  if (normalized.status !== 0) {
    process.stdout.write(JSON.stringify(validationResult, null, 2));
    process.stdout.write("\n");
    return validation.status || 1;
  }

  const normalizedResult = parseJson(normalized.stdout, "markdown-engine normalize");
  const diagnostics = [
    ...(validationResult.diagnostics || []),
    ...frontmatterDiagnostics(normalizedResult.document?.frontmatter),
  ];
  const result = {
    ...validationResult,
    valid: !hasError(diagnostics),
    diagnostics,
    ...(validationResult.evidence
      ? {
          evidence: {
            ...validationResult.evidence,
            diagnostics,
          },
        }
      : {}),
  };

  process.stdout.write(JSON.stringify(result, null, 2));
  process.stdout.write("\n");
  return result.valid ? 0 : 1;
}

try {
  process.exitCode = main();
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 2;
}
