export const DEMO_VISUAL_SCENARIOS = [
  { id: 'clear', label: 'No obvious visible defect', severity: 'low', confidence: 0.96, cues: ['Surface appears uniform in this simulated result.'] },
  { id: 'discoloration', label: 'Possible surface discoloration', severity: 'review', confidence: 0.84, cues: ['Color variation flagged for human inspection.'] },
  { id: 'seal-defect', label: 'Possible package seal defect', severity: 'review', confidence: 0.89, cues: ['Seal-edge irregularity flagged for human inspection.'] },
  { id: 'visible-spots', label: 'Visible spots suspected', severity: 'hold', confidence: 0.91, cues: ['Visible spot-like pattern flagged; qualified QA review required.'] }
];

export function createDemoVisualReview({ imageFileName, batch, scenarioId, now = Date.now() }) {
  const scenario = DEMO_VISUAL_SCENARIOS.find((item) => item.id === scenarioId) || DEMO_VISUAL_SCENARIOS[0];
  return {
    id: `DEMO-CV-${batch.id}-${now}`,
    batchId: batch.id,
    batchCode: batch.batchCode,
    productName: batch.productName,
    imageFileName,
    scenario: scenario.id,
    classification: scenario.label,
    severity: scenario.severity,
    confidence: scenario.confidence,
    cues: [...scenario.cues],
    disposition: scenario.severity === 'low' ? 'pending-review' : 'hold-for-qa',
    source: 'SIMULATED CLASSIFIER RESULT - IMAGE NOT ANALYZED',
    reviewedAt: new Date(now).toISOString(),
    demoData: true
  };
}
