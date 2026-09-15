import { promises as fs } from "fs";
import path from "path";
import type { LiveBaselineReport } from "./probe";

const liveDir = path.join(process.cwd(), "data", "live");
const baselinePath = path.join(liveDir, "baseline.json");
const treatmentPath = path.join(liveDir, "treatment.json");

async function readReport(
  filePath: string,
): Promise<LiveBaselineReport | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as LiveBaselineReport;
  } catch {
    return null;
  }
}

export async function readLiveBaseline(): Promise<LiveBaselineReport | null> {
  return readReport(baselinePath);
}

export async function readLiveTreatment(): Promise<LiveBaselineReport | null> {
  return readReport(treatmentPath);
}

export async function writeLiveBaseline(
  report: LiveBaselineReport,
): Promise<void> {
  await fs.mkdir(liveDir, { recursive: true });
  const target =
    report.phase === "treatment" ? treatmentPath : baselinePath;
  await fs.writeFile(target, JSON.stringify(report, null, 2), "utf8");
}
