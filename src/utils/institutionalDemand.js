export const INSTITUTIONAL_DEMAND_HISTORY = {
  breakfast: [94, 98, 100, 99, 97, 95, 98],
  lunch: [102, 104, 106, 107, 105, 103, 106],
  snacks: [82, 84, 86, 83, 85, 81, 84],
  dinner: [100, 103, 105, 104, 101, 99, 105]
};

export function predictInstitutionalDemand({
  meal,
  activeResidents,
  messOffCount,
  feedbackRating,
  eventImpact = 0
}) {
  const history = INSTITUTIONAL_DEMAND_HISTORY[meal] ?? [];
  const recentHistory = history.slice(-3);
  const average = (values) => values.length
    ? values.reduce((total, value) => total + value, 0) / values.length
    : 0;
  const historicalAverage = average(history);
  const recentAverage = average(recentHistory);
  const weightedAttendance = (recentAverage * 0.6) + (historicalAverage * 0.4);
  const participationRate = activeResidents > 0
    ? Math.min(1, weightedAttendance / activeResidents)
    : 0;
  const availableResidents = Math.max(0, activeResidents - messOffCount);
  const feedbackAdjustment = Math.max(-0.03, Math.min(0.03, (feedbackRating - 4) * 0.015));
  const expectedDemand = Math.min(
    availableResidents,
    Math.max(0, Math.round(availableResidents * participationRate * (1 + eventImpact + feedbackAdjustment)))
  );
  const variance = average(history.map((value) => (value - historicalAverage) ** 2));
  const rangeMargin = Math.max(2, Math.ceil(Math.sqrt(variance)));

  return {
    historicalAverage: Math.round(historicalAverage),
    recentAverage: Math.round(recentAverage),
    participationRate,
    availableResidents,
    expectedDemand,
    recommendedPortions: Math.min(availableResidents, Math.ceil(expectedDemand * 1.03)),
    lowerBound: Math.max(0, expectedDemand - rangeMargin),
    upperBound: Math.min(availableResidents, expectedDemand + rangeMargin)
  };
}