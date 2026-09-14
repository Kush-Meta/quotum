import { NextResponse } from "next/server";
import { readLiveBaseline } from "@/lib/liveStore";
import {
  baselineProbes,
  treatmentProbes,
  pilotMeta,
} from "@/lib/pilot";
import { scoreAnswerShare } from "@/lib/schema";

export async function GET() {
  const live = await readLiveBaseline();
  const simulatedBaseline = scoreAnswerShare(baselineProbes);
  const simulatedTreatment = scoreAnswerShare(treatmentProbes);

  return NextResponse.json({
    meta: pilotMeta,
    simulated: {
      baseline: { score: simulatedBaseline, probes: baselineProbes },
      treatment: { score: simulatedTreatment, probes: treatmentProbes },
      delta: {
        answerShare: Number(
          (simulatedTreatment.answerShare - simulatedBaseline.answerShare).toFixed(1),
        ),
      },
    },
    live,
  });
}
