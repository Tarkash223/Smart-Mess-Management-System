function asNumber(value) {
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

function sumByUnit(records, quantity, unit) {
  return records.reduce((totals, record) => {
    const recordUnit = unit(record) || 'unspecified';
    totals[recordUnit] = (totals[recordUnit] || 0) + asNumber(quantity(record));
    return totals;
  }, {});
}

export function calculatePlatformImpact({
  institutionalOperations = {},
  cateringEvents = [],
  businessRecords = [],
  processingBatches = [],
  surplusListings = [],
  carbonFactor = null,
  carbonFactorUnit = '',
  carbonFactorSource = '',
  now = Date.now()
}) {
  const institutionalMeals = Object.values(institutionalOperations);
  const cateringOutcomes = cateringEvents.flatMap((event) =>
    (event.items || [])
      .filter((item) => item.outcome)
      .map((item) => ({ ...item.outcome, foodName: item.name, eventId: event.id }))
  );
  const recordedProcessingBatches = processingBatches.filter((batch) => batch.actualsRecordedAt);
  const completedRedistributions = surplusListings.filter((listing) =>
    ['Delivered', 'Completed'].includes(listing.status) &&
    Number.isFinite(Number(listing.receivedQuantity)) &&
    Number(listing.receivedQuantity) > 0
  );
  const activeSurplusListings = surplusListings.filter((listing) =>
    ['Available', 'Requested', 'Accepted', 'Pickup scheduled'].includes(listing.status) &&
    new Date(listing.availableUntil).getTime() > now
  );
  const materialExcessByUnit = sumByUnit(
    recordedProcessingBatches,
    (batch) => Math.max(0, asNumber(batch.actualMaterialUsed) - asNumber(batch.expectedMaterial)),
    (batch) => batch.materialUnit
  );
  const productionShortfallByUnit = sumByUnit(
    recordedProcessingBatches,
    (batch) => Math.max(0, asNumber(batch.plannedOutput) - asNumber(batch.actualOutput)),
    (batch) => batch.outputUnit
  );
  const energyBatches = recordedProcessingBatches.filter((batch) => batch.energyKwh !== null && batch.energyKwh !== undefined && Number.isFinite(Number(batch.energyKwh)));
  const waterBatches = recordedProcessingBatches.filter((batch) => batch.waterLitres !== null && batch.waterLitres !== undefined && Number.isFinite(Number(batch.waterLitres)));
  const receiverConfirmedQuantityByUnit = completedRedistributions.reduce((totals, listing) => {
    const unit = listing.quantityUnit || 'unspecified';
    totals[unit] = (totals[unit] || 0) + Number(listing.receivedQuantity);
    return totals;
  }, {});
  const normalizedCarbonFactor = Number(carbonFactor);
  const normalizedCarbonFactorUnit = carbonFactorUnit.trim();
  const carbonFactorQuantity = receiverConfirmedQuantityByUnit[normalizedCarbonFactorUnit] || 0;
  const hasCarbonFactor = carbonFactor !== null && carbonFactor !== '' && Number.isFinite(normalizedCarbonFactor) && normalizedCarbonFactor > 0 && normalizedCarbonFactorUnit !== '' && normalizedCarbonFactorUnit !== 'unspecified' && carbonFactorQuantity > 0 && Boolean(carbonFactorSource.trim());

  return {
    institutional: {
      outcomeCount: institutionalMeals.filter((meal) => meal.outcomeRecordedAt).length,
      wastePortions: institutionalMeals.reduce((total, meal) => total + asNumber(meal.waste), 0),
      preparedPortions: institutionalMeals.reduce((total, meal) => total + asNumber(meal.prepared), 0),
      consumedPortions: institutionalMeals.reduce((total, meal) => total + asNumber(meal.consumed), 0)
    },
    catering: {
      outcomeCount: cateringOutcomes.length,
      wastePortions: cateringOutcomes.reduce((total, outcome) => total + asNumber(outcome.waste), 0),
      surplusPortions: cateringOutcomes.reduce((total, outcome) => total + asNumber(outcome.surplus), 0)
    },
    business: {
      recordCount: businessRecords.length,
      soldUnits: businessRecords.reduce((total, record) => total + asNumber(record.sold), 0),
      unsoldUnits: businessRecords.reduce((total, record) => total + asNumber(record.unsold), 0),
      wasteUnits: businessRecords.reduce((total, record) => total + asNumber(record.waste), 0)
    },
    processing: {
      batchCount: recordedProcessingBatches.length,
      materialExcessByUnit,
      productionShortfallByUnit,
      energyKwh: energyBatches.length ? energyBatches.reduce((total, batch) => total + Number(batch.energyKwh), 0) : null,
      waterLitres: waterBatches.length ? waterBatches.reduce((total, batch) => total + Number(batch.waterLitres), 0) : null
    },
    redistribution: {
      completedEvents: completedRedistributions.length,
      receiverConfirmedQuantityByUnit,
      activeListings: activeSurplusListings.length,
      carbonEstimateQuantity: hasCarbonFactor ? carbonFactorQuantity : null,
      carbonEstimateUnit: hasCarbonFactor ? normalizedCarbonFactorUnit : null,
      carbonEstimateKg: hasCarbonFactor ? carbonFactorQuantity * normalizedCarbonFactor : null,
      carbonFactorSource: hasCarbonFactor ? carbonFactorSource.trim() : null
    }
  };
}
