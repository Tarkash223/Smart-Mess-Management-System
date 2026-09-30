export const DEMO_SENSOR_PROFILES = [
  { id: 'normal', label: 'Within configured range' },
  { id: 'high-temperature', label: 'High temperature excursion' },
  { id: 'high-humidity', label: 'High humidity excursion' },
  { id: 'combined-excursion', label: 'Combined excursion' }
];

export function createDemoSensorDevice(batch, now = Date.now()) {
  return {
    id: `SIM-SENSOR-${batch.id}`,
    batchId: batch.id,
    batchCode: batch.batchCode,
    label: `${batch.productName} storage probe`,
    connected: true,
    batteryPercent: 88,
    signalPercent: 82,
    samplingIntervalSeconds: 60,
    lastSeenAt: new Date(now).toISOString(),
    source: 'SIMULATED DEVICE STATUS - NOT HARDWARE'
  };
}

export function markDemoSensorSampled(device, now = Date.now()) {
  return {
    ...device,
    batteryPercent: Math.max(5, device.batteryPercent - 1),
    lastSeenAt: new Date(now).toISOString()
  };
}

export function isDemoSensorSampleDue(device, lastReading, now = Date.now()) {
  if (!device.connected || !Number.isFinite(device.samplingIntervalSeconds) || device.samplingIntervalSeconds <= 0) return false;
  if (!lastReading) return true;
  return now - new Date(lastReading.recordedAt).getTime() >= device.samplingIntervalSeconds * 1000;
}

export function createDemoStorageReading(batch, profile, now = Date.now()) {
  const temperatureMidpoint = (batch.minTemperatureC + batch.maxTemperatureC) / 2;
  const humidityMidpoint = (batch.minHumidityPercent + batch.maxHumidityPercent) / 2;
  const temperatureC = ['high-temperature', 'combined-excursion'].includes(profile)
    ? batch.maxTemperatureC + 2
    : profile === 'high-humidity'
      ? temperatureMidpoint
      : temperatureMidpoint;
  const humidityPercent = ['high-humidity', 'combined-excursion'].includes(profile)
    ? batch.maxHumidityPercent + 5
    : humidityMidpoint;
  const profileDetails = DEMO_SENSOR_PROFILES.find((item) => item.id === profile) || DEMO_SENSOR_PROFILES[0];

  return {
    id: `SIM-${batch.id}-${now}`,
    sensorId: batch.sensorId || `SIM-SENSOR-${batch.id}`,
    batchId: batch.id,
    batchCode: batch.batchCode,
    productName: batch.productName,
    temperatureC: Number(temperatureC.toFixed(1)),
    humidityPercent: Number(humidityPercent.toFixed(1)),
    profile,
    profileLabel: profileDetails.label,
    source: 'SIMULATED DEMO DATA - NOT FROM HARDWARE',
    recordedAt: new Date(now).toISOString()
  };
}

export function getStorageSensorAlerts(batch, reading) {
  const alerts = [];
  if (reading.temperatureC < batch.minTemperatureC || reading.temperatureC > batch.maxTemperatureC) {
    alerts.push({
      id: 'sensor-temperature',
      message: `Simulated temperature ${reading.temperatureC}°C is outside the configured ${batch.minTemperatureC}–${batch.maxTemperatureC}°C range.`
    });
  }
  if (reading.humidityPercent < batch.minHumidityPercent || reading.humidityPercent > batch.maxHumidityPercent) {
    alerts.push({
      id: 'sensor-humidity',
      message: `Simulated humidity ${reading.humidityPercent}% is outside the configured ${batch.minHumidityPercent}–${batch.maxHumidityPercent}% range.`
    });
  }
  return alerts;
}
