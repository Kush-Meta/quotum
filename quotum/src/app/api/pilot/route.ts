import { NextResponse } from "next/server";
import {
  baselineProbes,
  treatmentProbes,
  pilotMeta,
} from "@/lib/pilot";
import { scoreAnswerShare } from "@/lib/schema";

export async function GET() {
  const baseline = scoreAnswerShare(baselineProbes);
  const treatment = scoreAnswerShare(treatmentProbes);
  return NextResponse.json({
    meta: pilotMeta,
    baseline: { score: baseline, probes: baselineProbes },
    treatment: { score: treatment, probes: treatmentProbes },
    delta: {
      answerShare: Number(
        (treatment.answerShare - baseline.answerShare).toFixed(1),
      ),
      mentionRate: Number(
        (treatment.mentionRate - baseline.mentionRate).toFixed(3),
      ),
      citationRate: Number(
        (treatment.citationRate - baseline.citationRate).toFixed(3),
      ),
      recommendRate: Number(
        (treatment.recommendRate - baseline.recommendRate).toFixed(3),
      ),
    },
  });
}
