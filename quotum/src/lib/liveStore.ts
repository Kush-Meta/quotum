import { promises as fs } from "fs";
import path from "path";
import type { LiveBaselineReport } from "./probe";

const liveDir = path.join(process.cwd(), "data", "live");
const baselinePath = path.join(liveDir, "baseline.json");

export async function readLiveBaseline(): Promise<LiveBaselineReport | null> {
  try {
    const raw = await fs.readFile(baselinePath, "utf8");
    return JSON.parse(raw) as LiveBaselineReport;
  } catch {
    return null;
  }
}

export async function writeLiveBaseline(
  report: LiveBaselineReport,
): Promise<void> {
  await fs.mkdir(liveDir, { recursive: true });
  await fs.writeFile(baselinePath, JSON.stringify(report, null, 2), "utf8");
}
