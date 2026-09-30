function average(values) {
  return values.length ? values.reduce((total, value) => total + value, 0) / values.length : 0;
}

function weekdayFor(date) {
  return new Date(`${date}T12:00:00`).getDay();
}

function weightedRecentAverage(records) {
  const recent = records.slice(0, 3).map((record) => record.sold);
  const older = records.slice(3, 6).map((record) => record.sold);
  return older.length
    ? (average(recent) * 0.7) + (average(older) * 0.3)
    : average(recent);
}

export function predictBusinessItemDemand({ product, targetDate, timeSlot, history = [] }) {
  const productHistory = history
    .filter((record) => record.productId === product.id)
    .sort((first, second) => second.date.localeCompare(first.date));
  const targetWeekday = weekdayFor(targetDate);
  const comparableRecords = productHistory.filter((record) =>
    record.timeSlot === timeSlot && weekdayFor(record.date) === targetWeekday
  );
  const slotRecords = productHistory.filter((record) => record.timeSlot === timeSlot);
  const sourceRecords = comparableRecords.length >= 2
    ? comparableRecords
    : slotRecords.length
      ? slotRecords
      : productHistory;
  const expectedOrders = sourceRecords.length
    ? Math.max(0, Math.round(weightedRecentAverage(sourceRecords)))
    : Math.max(0, Math.round(product.baselineOrders || 0));

  return {
    expectedOrders,
    recommendedPreparation: Math.ceil(expectedOrders * 1.08),
    comparableRecordCount: sourceRecords.length,
    basis: comparableRecords.length >= 2
      ? `same weekday and ${timeSlot} history`
      : slotRecords.length
        ? `${timeSlot} history; limited weekday matches`
        : productHistory.length
          ? 'item history; no matching time-slot records'
          : 'manager baseline; no sales history'
  };
}

export function estimateBusinessIngredientRequirements(product, portions) {
  return (product.ingredients || []).map((ingredient) => ({
    ...ingredient,
    requiredQuantity: Number((ingredient.quantityPerOrder * portions).toFixed(3))
  }));
}
