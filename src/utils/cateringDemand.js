const DEFAULT_CONSUMPTION_RATES = {
  cafeteria: 0.9,
  corporate: 0.92,
  conference: 0.9,
  celebration: 0.96,
  wedding: 0.95,
  other: 0.9
};

function getEventConsumptionRate(event) {
  const itemRates = event.items
    .filter((item) => item.outcome && event.expectedGuests > 0)
    .map((item) => item.outcome.consumed / event.expectedGuests);
  return itemRates.length
    ? itemRates.reduce((total, rate) => total + rate, 0) / itemRates.length
    : null;
}

export function predictCateringDemand({ expectedGuests, eventType, events = [] }) {
  const comparableEvents = events
    .filter((event) => event.status === 'Completed' && event.eventType === eventType)
    .map(getEventConsumptionRate)
    .filter((rate) => Number.isFinite(rate));
  const defaultRate = DEFAULT_CONSUMPTION_RATES[eventType] ?? DEFAULT_CONSUMPTION_RATES.other;
  const consumptionRate = comparableEvents.length
    ? comparableEvents.reduce((total, rate) => total + rate, 0) / comparableEvents.length
    : defaultRate;
  const predictedConsumption = Math.max(0, Math.round(expectedGuests * consumptionRate));
  const recommendedPreparation = Math.ceil(predictedConsumption * 1.04);

  return {
    consumptionRate,
    comparableEventCount: comparableEvents.length,
    predictedConsumption,
    recommendedPreparation,
    expectedSurplus: Math.max(0, recommendedPreparation - predictedConsumption),
    basis: comparableEvents.length ? 'completed comparable events' : 'event-type demo baseline'
  };
}