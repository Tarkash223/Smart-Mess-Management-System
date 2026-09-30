export function calculateProcessingMetrics(batch) {
  const materialVariance = batch.actualMaterialUsed - batch.expectedMaterial;
  const operatingMinutes = batch.machineOperatingMinutes + batch.machineDowntimeMinutes;
  return {
    materialVariance,
    materialVariancePercent: batch.expectedMaterial > 0 ? (materialVariance / batch.expectedMaterial) * 100 : 0,
    outputShortfall: Math.max(0, batch.plannedOutput - batch.actualOutput),
    productionEfficiencyPercent: batch.plannedOutput > 0 ? (batch.actualOutput / batch.plannedOutput) * 100 : 0,
    downtimePercent: operatingMinutes > 0 ? (batch.machineDowntimeMinutes / operatingMinutes) * 100 : 0,
    energyPerOutputUnit: batch.actualOutput > 0 && Number.isFinite(batch.energyKwh)
      ? batch.energyKwh / batch.actualOutput
      : null
  };
}

export function getProcessingBatchAlerts(batch) {
  if (!batch.actualsRecordedAt) return [];
  const metrics = calculateProcessingMetrics(batch);
  const alerts = [];
  if (metrics.materialVariancePercent > batch.materialTolerancePercent) {
    alerts.push({ id: 'material-loss', severity: 'warning', message: `Material use is ${metrics.materialVariancePercent.toFixed(1)}% above the expected requirement.` });
  }
  if (metrics.downtimePercent >= batch.downtimeAlertPercent) {
    alerts.push({ id: 'machine-downtime', severity: 'warning', message: `Machine downtime is ${metrics.downtimePercent.toFixed(1)}% of recorded running time.` });
  }
  if (batch.storageTemperatureC < batch.minTemperatureC || batch.storageTemperatureC > batch.maxTemperatureC) {
    alerts.push({ id: 'storage-temperature', severity: 'warning', message: `Storage temperature is outside the configured ${batch.minTemperatureC}–${batch.maxTemperatureC}°C range.` });
  }
  if (batch.storageHumidityPercent < batch.minHumidityPercent || batch.storageHumidityPercent > batch.maxHumidityPercent) {
    alerts.push({ id: 'storage-humidity', severity: 'warning', message: `Storage humidity is outside the configured ${batch.minHumidityPercent}–${batch.maxHumidityPercent}% range.` });
  }
  if (batch.visualQualityStatus === 'concern') {
    alerts.push({ id: 'quality-review', severity: 'review', message: 'Visible quality concern recorded; hold this batch for qualified quality review.' });
  }
  return alerts;
}
