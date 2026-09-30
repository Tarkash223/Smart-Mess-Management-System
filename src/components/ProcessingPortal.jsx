import React, { useEffect, useState } from 'react';
import { Activity, AlertTriangle, Eye, Factory, ImagePlus, LogOut, Plus, Zap } from 'lucide-react';
import { calculateProcessingMetrics, getProcessingBatchAlerts } from '../utils/processingAnalytics';
import { createDemoSensorDevice, createDemoStorageReading, DEMO_SENSOR_PROFILES, getStorageSensorAlerts, isDemoSensorSampleDue, markDemoSensorSampled } from '../utils/processingTelemetry';
import { createDemoVisualReview, DEMO_VISUAL_SCENARIOS } from '../utils/processingVisionDemo';

const STORAGE_KEY = 'smartmess_processing_batches_v1';
const SENSOR_READINGS_KEY = 'smartmess_processing_sensor_readings_v1';
const SENSOR_DEVICES_KEY = 'smartmess_processing_sensor_devices_v1';
const QUALITY_REVIEWS_KEY = 'smartmess_processing_quality_reviews_v1';
const EMPTY_BATCH_FORM = {
  batchCode: '',
  productName: '',
  plannedOutput: '',
  outputUnit: 'units',
  expectedMaterial: '',
  materialUnit: 'kg',
  materialTolerancePercent: '5',
  minTemperatureC: '',
  maxTemperatureC: '',
  minHumidityPercent: '',
  maxHumidityPercent: '',
  downtimeAlertPercent: '10'
};
const REQUIRED_ACTUAL_FIELDS = [
  'actualMaterialUsed',
  'actualOutput',
  'machineOperatingMinutes',
  'machineDowntimeMinutes',
  'storageTemperatureC',
  'storageHumidityPercent'
];

function readBatches() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function readSensorReadings() {
  try {
    const stored = JSON.parse(localStorage.getItem(SENSOR_READINGS_KEY) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function readSensorDevices() {
  try {
    const stored = JSON.parse(localStorage.getItem(SENSOR_DEVICES_KEY) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function readQualityReviews() {
  try {
    const stored = JSON.parse(localStorage.getItem(QUALITY_REVIEWS_KEY) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function summarizeByUnit(batches, quantitySelector, unitSelector) {
  const totals = batches.reduce((result, batch) => {
    const unit = unitSelector(batch);
    result[unit] = (result[unit] || 0) + quantitySelector(batch);
    return result;
  }, {});
  return Object.entries(totals).map(([unit, quantity]) => `${quantity.toLocaleString(undefined, { maximumFractionDigits: 1 })} ${unit}`).join(' · ') || '0';
}

export default function ProcessingPortal({ onLogout }) {
  const [batches, setBatches] = useState(readBatches);
  const [activeView, setActiveView] = useState('dashboard');
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [batchForm, setBatchForm] = useState(EMPTY_BATCH_FORM);
  const [actualDrafts, setActualDrafts] = useState({});
  const [sensorReadings, setSensorReadings] = useState(readSensorReadings);
  const [sensorDevices, setSensorDevices] = useState(readSensorDevices);
  const [sensorProfile, setSensorProfile] = useState('normal');
  const [qualityReviews, setQualityReviews] = useState(readQualityReviews);
  const [selectedQualityBatchId, setSelectedQualityBatchId] = useState('');
  const [qualityScenario, setQualityScenario] = useState('discoloration');
  const [qualityImage, setQualityImage] = useState(null);
  const [qualityDecisions, setQualityDecisions] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => () => {
    if (qualityImage?.previewUrl) URL.revokeObjectURL(qualityImage.previewUrl);
  }, [qualityImage?.previewUrl]);

  const commitBatches = (nextBatches) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextBatches));
    setBatches(nextBatches);
  };
  const completedBatches = batches.filter((batch) => batch.actualsRecordedAt);
  const totalPlanned = summarizeByUnit(batches, (batch) => batch.plannedOutput, (batch) => batch.outputUnit);
  const totalActual = summarizeByUnit(completedBatches, (batch) => batch.actualOutput, (batch) => batch.outputUnit);
  const totalMaterialExcess = summarizeByUnit(completedBatches, (batch) => Math.max(0, batch.actualMaterialUsed - batch.expectedMaterial), (batch) => batch.materialUnit);
  const totalDowntime = completedBatches.reduce((total, batch) => total + batch.machineDowntimeMinutes, 0);
  const energyRecordedBatches = completedBatches.filter((batch) => Number.isFinite(batch.energyKwh));
  const totalEnergyKwh = energyRecordedBatches.reduce((total, batch) => total + batch.energyKwh, 0);
  const averageEfficiency = completedBatches.length
    ? completedBatches.reduce((total, batch) => total + calculateProcessingMetrics(batch).productionEfficiencyPercent, 0) / completedBatches.length
    : null;
  const batchAlerts = completedBatches.flatMap((batch) => getProcessingBatchAlerts(batch).map((alert) => ({ ...alert, batchCode: batch.batchCode, productName: batch.productName })));
  const metricsByBatch = completedBatches.map((batch) => ({ batch, metrics: calculateProcessingMetrics(batch) }));
  const latestSensorReadings = sensorReadings.reduce((latest, reading) => {
    const current = latest[reading.batchId];
    if (!current || new Date(reading.recordedAt).getTime() > new Date(current.recordedAt).getTime()) {
      latest[reading.batchId] = reading;
    }
    return latest;
  }, {});
  const sensorAlerts = Object.values(latestSensorReadings).flatMap((reading) => {
    const batch = batches.find((item) => item.id === reading.batchId);
    return batch
      ? getStorageSensorAlerts(batch, reading).map((alert) => ({ ...alert, batchCode: batch.batchCode, productName: batch.productName }))
      : [];
  });

  useEffect(() => {
    if (activeView !== 'monitoring') return undefined;
    const pollDevices = () => {
      const currentReadings = readSensorReadings();
      const latestByBatch = currentReadings.reduce((latest, reading) => {
        const current = latest[reading.batchId];
        if (!current || new Date(reading.recordedAt).getTime() > new Date(current.recordedAt).getTime()) latest[reading.batchId] = reading;
        return latest;
      }, {});
      const batchById = new Map(batches.map((batch) => [batch.id, batch]));
      const dueDevices = sensorDevices.filter((device) => batchById.has(device.batchId) && isDemoSensorSampleDue(device, latestByBatch[device.batchId]));
      if (!dueDevices.length) return;

      const sampledAt = Date.now();
      const newReadings = dueDevices.map((device) => {
        const batch = batchById.get(device.batchId);
        return createDemoStorageReading({ ...batch, sensorId: device.id }, sensorProfile, sampledAt);
      });
      const sampledIds = new Set(dueDevices.map((device) => device.id));
      const updatedDevices = sensorDevices.map((device) => sampledIds.has(device.id) ? markDemoSensorSampled(device, sampledAt) : device);
      const nextReadings = [...newReadings, ...currentReadings].slice(0, 500);
      localStorage.setItem(SENSOR_READINGS_KEY, JSON.stringify(nextReadings));
      localStorage.setItem(SENSOR_DEVICES_KEY, JSON.stringify(updatedDevices));
      setSensorReadings(nextReadings);
      setSensorDevices(updatedDevices);
    };
    pollDevices();
    const intervalId = setInterval(pollDevices, 5000);
    return () => clearInterval(intervalId);
  }, [activeView, batches, sensorDevices, sensorProfile]);

  const updateBatchForm = (field, value) => setBatchForm((current) => ({ ...current, [field]: value }));

  const handleCreateBatch = (event) => {
    event.preventDefault();
    const plannedOutput = Number(batchForm.plannedOutput);
    const expectedMaterial = Number(batchForm.expectedMaterial);
    const rangeInputs = [batchForm.minTemperatureC, batchForm.maxTemperatureC, batchForm.minHumidityPercent, batchForm.maxHumidityPercent];
    const ranges = rangeInputs.map(Number);
    const tolerance = Number(batchForm.materialTolerancePercent);
    const downtimeThreshold = Number(batchForm.downtimeAlertPercent);
    if (!batchForm.batchCode.trim() || !batchForm.productName.trim() || !Number.isFinite(plannedOutput) || plannedOutput <= 0 || !Number.isFinite(expectedMaterial) || expectedMaterial <= 0) {
      setMessage('Enter a batch code, product, planned output, and expected material requirement.');
      return;
    }
    if (rangeInputs.some((value) => value === '') || ranges.some((value) => !Number.isFinite(value))) {
      setMessage('Set all four configured storage range limits.');
      return;
    }
    if (ranges[0] >= ranges[1] || ranges[2] >= ranges[3] || batchForm.materialTolerancePercent === '' || !Number.isFinite(tolerance) || tolerance < 0 || batchForm.downtimeAlertPercent === '' || !Number.isFinite(downtimeThreshold) || downtimeThreshold < 0 || downtimeThreshold > 100) {
      setMessage('Check that configured ranges increase and alert thresholds are valid percentages.');
      return;
    }

    const batch = {
      id: `PLANT-${Date.now()}`,
      batchCode: batchForm.batchCode.trim(),
      productName: batchForm.productName.trim(),
      plannedOutput,
      outputUnit: batchForm.outputUnit,
      expectedMaterial,
      materialUnit: batchForm.materialUnit,
      materialTolerancePercent: tolerance,
      minTemperatureC: ranges[0],
      maxTemperatureC: ranges[1],
      minHumidityPercent: ranges[2],
      maxHumidityPercent: ranges[3],
      downtimeAlertPercent: downtimeThreshold,
      status: 'Planned',
      createdAt: new Date().toISOString()
    };
    commitBatches([batch, ...batches]);
    const newSensorDevice = createDemoSensorDevice(batch);
    const nextSensorDevices = [newSensorDevice, ...sensorDevices];
    localStorage.setItem(SENSOR_DEVICES_KEY, JSON.stringify(nextSensorDevices));
    setSensorDevices(nextSensorDevices);
    setBatchForm(EMPTY_BATCH_FORM);
    setShowBatchForm(false);
    setMessage(`Batch ${batch.batchCode} planned. Record actuals after the production run.`);
  };

  const updateActualDraft = (batchId, field, value) => {
    setActualDrafts((current) => ({ ...current, [batchId]: { ...current[batchId], [field]: value } }));
  };

  const handleSaveActuals = (batch) => {
    const draft = actualDrafts[batch.id] || {};
    if (REQUIRED_ACTUAL_FIELDS.some((field) => draft[field] === undefined || draft[field] === '')) {
      setMessage(`${batch.batchCode}: enter material, output, runtime, downtime, temperature, and humidity readings.`);
      return;
    }
    const actuals = Object.fromEntries(REQUIRED_ACTUAL_FIELDS.map((field) => [field, Number(draft[field])]));
    const optionalEnergy = draft.energyKwh === '' || draft.energyKwh === undefined ? null : Number(draft.energyKwh);
    const optionalWater = draft.waterLitres === '' || draft.waterLitres === undefined ? null : Number(draft.waterLitres);
    const affectedOutput = draft.affectedOutput === '' || draft.affectedOutput === undefined ? null : Number(draft.affectedOutput);
    if (Object.values(actuals).some((value) => !Number.isFinite(value) || value < 0) || (optionalEnergy !== null && (!Number.isFinite(optionalEnergy) || optionalEnergy < 0)) || (optionalWater !== null && (!Number.isFinite(optionalWater) || optionalWater < 0)) || (affectedOutput !== null && (!Number.isFinite(affectedOutput) || affectedOutput < 0))) {
      setMessage(`${batch.batchCode}: measurements must be zero or positive numbers.`);
      return;
    }

    const updatedBatch = {
      ...batch,
      ...actuals,
      affectedOutput,
      energyKwh: optionalEnergy,
      waterLitres: optionalWater,
      visualQualityStatus: draft.visualQualityStatus || 'not-checked',
      qualityNotes: (draft.qualityNotes || '').trim(),
      actualsRecordedAt: new Date().toISOString(),
      status: 'Actuals recorded'
    };
    commitBatches(batches.map((item) => item.id === batch.id ? updatedBatch : item));
    setMessage(`${batch.batchCode}: actual output, material, machine, storage, and resource data saved.`);
  };

  const handleGenerateSensorReading = (batch) => {
    const currentDevice = sensorDevices.find((item) => item.batchId === batch.id) || createDemoSensorDevice(batch, new Date(batch.createdAt || 0).getTime());
    if (!currentDevice.connected) {
      setMessage(`${currentDevice.label} is offline. Connect the simulated device before requesting a reading.`);
      return;
    }
    const sampledAt = Date.now();
    const updatedDevice = markDemoSensorSampled(currentDevice, sampledAt);
    const reading = createDemoStorageReading({ ...batch, sensorId: currentDevice.id }, sensorProfile, sampledAt);
    const nextReadings = [reading, ...sensorReadings].slice(0, 500);
    const nextDevices = sensorDevices.some((item) => item.batchId === batch.id)
      ? sensorDevices.map((item) => item.batchId === batch.id ? updatedDevice : item)
      : [updatedDevice, ...sensorDevices];
    localStorage.setItem(SENSOR_READINGS_KEY, JSON.stringify(nextReadings));
    localStorage.setItem(SENSOR_DEVICES_KEY, JSON.stringify(nextDevices));
    setSensorReadings(nextReadings);
    setSensorDevices(nextDevices);
    setMessage(`${batch.batchCode}: simulated reading recorded. This value did not come from a physical sensor.`);
  };

  const updateSensorDevice = (batch, updates) => {
    const currentDevice = sensorDevices.find((item) => item.batchId === batch.id) || createDemoSensorDevice(batch, new Date(batch.createdAt || 0).getTime());
    const nextDevice = { ...currentDevice, ...updates, lastConfiguredAt: new Date().toISOString() };
    const nextDevices = sensorDevices.some((item) => item.batchId === batch.id)
      ? sensorDevices.map((item) => item.batchId === batch.id ? nextDevice : item)
      : [nextDevice, ...sensorDevices];
    localStorage.setItem(SENSOR_DEVICES_KEY, JSON.stringify(nextDevices));
    setSensorDevices(nextDevices);
  };

  const handleQualityImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 8 * 1024 * 1024) {
      setMessage('Choose an image file smaller than 8 MB.');
      event.target.value = '';
      return;
    }
    setQualityImage({ fileName: file.name, previewUrl: URL.createObjectURL(file) });
    setMessage('Image loaded for preview. The demo classification will not analyze its pixels.');
  };

  const handleGenerateQualityReview = () => {
    const batch = batches.find((item) => item.id === selectedQualityBatchId) || batches[0];
    if (!qualityImage || !batch) {
      setMessage('Choose a batch and image before generating a demo review.');
      return;
    }
    const review = createDemoVisualReview({ imageFileName: qualityImage.fileName, batch, scenarioId: qualityScenario });
    const nextReviews = [review, ...qualityReviews];
    localStorage.setItem(QUALITY_REVIEWS_KEY, JSON.stringify(nextReviews));
    setQualityReviews(nextReviews);
    setMessage('Simulated classification added. A qualified person must inspect the image and decide disposition.');
  };

  const handleSaveQualityDisposition = (reviewId) => {
    const disposition = qualityDecisions[reviewId];
    if (!disposition) {
      setMessage('Choose a human QA disposition first.');
      return;
    }
    const nextReviews = qualityReviews.map((review) => review.id === reviewId
      ? { ...review, disposition, humanReviewedAt: new Date().toISOString(), humanReviewedBy: 'Plant QA demo user' }
      : review);
    localStorage.setItem(QUALITY_REVIEWS_KEY, JSON.stringify(nextReviews));
    setQualityReviews(nextReviews);
    setMessage('Human QA disposition saved. This action does not certify food safety.');
  };

  const setDefaultActualDraft = (batch) => {
    if (actualDrafts[batch.id]) return actualDrafts[batch.id];
    return {
      actualMaterialUsed: batch.actualMaterialUsed ?? '',
      actualOutput: batch.actualOutput ?? '',
      machineOperatingMinutes: batch.machineOperatingMinutes ?? '',
      machineDowntimeMinutes: batch.machineDowntimeMinutes ?? '',
      affectedOutput: batch.affectedOutput ?? '',
      energyKwh: batch.energyKwh ?? '',
      waterLitres: batch.waterLitres ?? '',
      storageTemperatureC: batch.storageTemperatureC ?? '',
      storageHumidityPercent: batch.storageHumidityPercent ?? '',
      visualQualityStatus: batch.visualQualityStatus ?? 'not-checked',
      qualityNotes: batch.qualityNotes ?? ''
    };
  };

  const views = [
    { id: 'dashboard', label: 'Plant dashboard' },
    { id: 'batches', label: `Production batches (${batches.length})` },
    { id: 'monitoring', label: `Storage & alerts (${batchAlerts.length + sensorAlerts.length})` },
    { id: 'visual-qa', label: `Visual QA demo (${qualityReviews.length})` },
    { id: 'efficiency', label: 'Efficiency analytics' }
  ];

  const renderBatch = (batch) => {
    const draft = setDefaultActualDraft(batch);
    const metrics = batch.actualsRecordedAt ? calculateProcessingMetrics(batch) : null;
    const alerts = batch.actualsRecordedAt ? getProcessingBatchAlerts(batch) : [];
    return (
      <article key={batch.id} className="card-clean space-y-4 p-4">
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-bold text-slate-900">{batch.productName}</h3><span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-700">{batch.batchCode}</span><span className="text-[10px] text-slate-500">{batch.status}</span></div>
            <p className="mt-1 text-xs text-slate-600">Plan: {batch.plannedOutput} {batch.outputUnit} · Expected material: {batch.expectedMaterial} {batch.materialUnit}</p>
          </div>
          {metrics && <div className="rounded-lg bg-emerald-50 p-3 text-xs"><span className="block font-semibold text-emerald-800">Output efficiency</span><span className="text-lg font-extrabold text-emerald-950">{metrics.productionEfficiencyPercent.toFixed(1)}%</span></div>}
        </div>

        {!batch.actualsRecordedAt ? (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800">Record actual production</h4>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { field: 'actualMaterialUsed', label: `Actual material (${batch.materialUnit})`, required: true },
                { field: 'actualOutput', label: `Actual output (${batch.outputUnit})`, required: true },
                { field: 'machineOperatingMinutes', label: 'Machine run time (min)', required: true },
                { field: 'machineDowntimeMinutes', label: 'Downtime (min)', required: true },
                { field: 'affectedOutput', label: `Output affected (${batch.outputUnit})`, required: false },
                { field: 'energyKwh', label: 'Energy (kWh)', required: false },
                { field: 'waterLitres', label: 'Water (litres)', required: false },
                { field: 'storageTemperatureC', label: 'Storage temperature (°C)', required: true },
                { field: 'storageHumidityPercent', label: 'Storage humidity (%)', required: true }
              ].map((input) => <label key={input.field} className="space-y-1 text-[10px] font-semibold text-slate-600"><span>{input.label}{input.required ? ' *' : ''}</span><input type="number" min="0" step="0.1" value={draft[input.field]} onChange={(event) => updateActualDraft(batch.id, input.field, event.target.value)} className="w-full" /></label>)}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-xs font-semibold text-slate-700"><span>Manual visual quality observation</span><select value={draft.visualQualityStatus} onChange={(event) => updateActualDraft(batch.id, 'visualQualityStatus', event.target.value)} className="w-full"><option value="not-checked">Not checked</option><option value="clear">No visible concern noted</option><option value="concern">Visible concern — hold for QA review</option></select></label>
              <label className="space-y-1 text-xs font-semibold text-slate-700"><span>Quality observation notes</span><input type="text" value={draft.qualityNotes} onChange={(event) => updateActualDraft(batch.id, 'qualityNotes', event.target.value)} placeholder="Optional inspection note" className="w-full" /></label>
            </div>
            <p className="text-[10px] text-slate-500">Storage alerts compare manual/demo readings with the process-specific limits set on this batch. They do not certify food safety; visual checks are not computer vision.</p>
            <button type="button" onClick={() => handleSaveActuals(batch)} className="btn-primary justify-center text-xs">Save batch actuals</button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: 'Material variance', value: `${metrics.materialVariance.toFixed(1)} ${batch.materialUnit} (${metrics.materialVariancePercent.toFixed(1)}%)` },
              { label: 'Output shortfall', value: `${metrics.outputShortfall.toFixed(1)} ${batch.outputUnit}` },
              { label: 'Downtime', value: `${batch.machineDowntimeMinutes} min · ${metrics.downtimePercent.toFixed(1)}%` },
              { label: 'Downtime-affected output', value: batch.affectedOutput === null ? 'Not recorded' : `${batch.affectedOutput} ${batch.outputUnit}` },
              { label: 'Energy per output', value: metrics.energyPerOutputUnit === null ? 'No output' : `${metrics.energyPerOutputUnit.toFixed(3)} kWh / ${batch.outputUnit}` }
            ].map((metric) => <div key={metric.label} className="rounded-lg bg-slate-50 p-3"><span className="block text-[10px] font-semibold text-slate-500">{metric.label}</span><span className="mt-1 block text-sm font-bold text-slate-900">{metric.value}</span></div>)}
            {alerts.length > 0 && <div className="space-y-2 sm:col-span-2 lg:col-span-4">{alerts.map((alert) => <p key={alert.id} className="flex items-start gap-2 rounded-lg bg-amber-50 p-2 text-xs text-amber-950"><AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />{alert.message}</p>)}</div>}
            <p className="text-[10px] text-slate-500 sm:col-span-2 lg:col-span-4">Visual status: {batch.visualQualityStatus === 'concern' ? 'concern; QA review required' : batch.visualQualityStatus === 'clear' ? 'no visible concern noted by operator' : 'not checked'} · Actuals recorded {new Date(batch.actualsRecordedAt).toLocaleString()}</p>
          </div>
        )}
      </article>
    );
  };

  return (
    <section className="space-y-5" aria-labelledby="processing-portal-title">
      <header className="flex flex-col gap-4 rounded-xl bg-emerald-900 p-5 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-semibold text-emerald-200">Industrial Food Production</span>
          <h1 id="processing-portal-title" className="mt-1 text-xl font-bold">Plant efficiency and batch monitoring</h1>
          <p className="mt-1 text-xs text-emerald-100">Planned production → material use → output → loss and resource review</p>
        </div>
        <button type="button" onClick={onLogout} className="btn-secondary justify-center border-white/30 bg-white/10 text-white hover:bg-white/20"><LogOut className="h-4 w-4" /> Log out</button>
      </header>

      <nav className="flex flex-wrap gap-2 border-b border-slate-200 pb-3" aria-label="Processing plant sections">
        {views.map((view) => <button key={view.id} type="button" onClick={() => { setActiveView(view.id); setMessage(''); }} className={`rounded-lg px-3 py-2 text-xs font-bold ${activeView === view.id ? 'bg-emerald-700 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>{view.label}</button>)}
        <button type="button" onClick={() => { setShowBatchForm((current) => !current); setActiveView('batches'); }} className="btn-primary ml-auto justify-center text-xs"><Plus className="h-4 w-4" /> Plan batch</button>
      </nav>

      {message && <p role="status" className="rounded-lg bg-slate-100 p-3 text-xs font-semibold text-slate-700">{message}</p>}

      {showBatchForm && (
        <form onSubmit={handleCreateBatch} className="card-clean space-y-4 p-5">
          <h2 className="text-sm font-bold text-slate-900">Production batch plan</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="space-y-1 text-xs font-semibold text-slate-700"><span>Batch code</span><input type="text" value={batchForm.batchCode} onChange={(event) => updateBatchForm('batchCode', event.target.value)} className="w-full" /></label>
            <label className="space-y-1 text-xs font-semibold text-slate-700"><span>Product / line</span><input type="text" value={batchForm.productName} onChange={(event) => updateBatchForm('productName', event.target.value)} className="w-full" /></label>
            <label className="space-y-1 text-xs font-semibold text-slate-700"><span>Planned output</span><input type="number" min="0.01" step="0.01" value={batchForm.plannedOutput} onChange={(event) => updateBatchForm('plannedOutput', event.target.value)} className="w-full" /></label>
            <label className="space-y-1 text-xs font-semibold text-slate-700"><span>Output unit</span><select value={batchForm.outputUnit} onChange={(event) => updateBatchForm('outputUnit', event.target.value)} className="w-full"><option value="units">units</option><option value="kg">kg</option><option value="litres">litres</option><option value="cases">cases</option></select></label>
            <label className="space-y-1 text-xs font-semibold text-slate-700"><span>Expected raw material</span><input type="number" min="0.01" step="0.01" value={batchForm.expectedMaterial} onChange={(event) => updateBatchForm('expectedMaterial', event.target.value)} className="w-full" /></label>
            <label className="space-y-1 text-xs font-semibold text-slate-700"><span>Material unit</span><select value={batchForm.materialUnit} onChange={(event) => updateBatchForm('materialUnit', event.target.value)} className="w-full"><option>kg</option><option>litres</option><option>units</option></select></label>
            <label className="space-y-1 text-xs font-semibold text-slate-700"><span>Material overuse alert (%)</span><input type="number" min="0" step="0.1" value={batchForm.materialTolerancePercent} onChange={(event) => updateBatchForm('materialTolerancePercent', event.target.value)} className="w-full" /></label>
            <label className="space-y-1 text-xs font-semibold text-slate-700"><span>Downtime alert (%)</span><input type="number" min="0" max="100" step="0.1" value={batchForm.downtimeAlertPercent} onChange={(event) => updateBatchForm('downtimeAlertPercent', event.target.value)} className="w-full" /></label>
          </div>
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <h3 className="text-xs font-bold text-slate-800">Configured storage operating range (set for this product/process)</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { field: 'minTemperatureC', label: 'Min temperature (°C)' },
                { field: 'maxTemperatureC', label: 'Max temperature (°C)' },
                { field: 'minHumidityPercent', label: 'Min humidity (%)' },
                { field: 'maxHumidityPercent', label: 'Max humidity (%)' }
              ].map((input) => <label key={input.field} className="space-y-1 text-xs font-semibold text-slate-700"><span>{input.label}</span><input type="number" step="0.1" value={batchForm[input.field]} onChange={(event) => updateBatchForm(input.field, event.target.value)} className="w-full" /></label>)}
            </div>
          </div>
          <p className="text-[10px] text-slate-500">Thresholds are operator-configured process limits, not universal food-safety standards. IoT readings are not connected in this prototype.</p>
          <div className="flex flex-wrap gap-2"><button type="submit" className="btn-primary justify-center text-xs"><Factory className="h-4 w-4" /> Save batch plan</button><button type="button" onClick={() => setShowBatchForm(false)} className="btn-secondary justify-center text-xs">Cancel</button></div>
        </form>
      )}

      {activeView === 'dashboard' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: 'Planned output', value: totalPlanned.toLocaleString() },
              { label: 'Actual output', value: totalActual.toLocaleString() },
              { label: 'Average efficiency', value: averageEfficiency === null ? 'Awaiting actuals' : `${averageEfficiency.toFixed(1)}%` },
              { label: 'Material excess', value: totalMaterialExcess }
            ].map((metric) => <div key={metric.label} className="card-clean p-4"><span className="block text-xs font-semibold text-slate-500">{metric.label}</span><span className="mt-1 block text-xl font-extrabold text-slate-900">{metric.value}</span></div>)}
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <section className="card-clean space-y-3 p-4"><h2 className="flex items-center gap-2 text-sm font-bold text-slate-900"><Activity className="h-4 w-4 text-emerald-700" />Latest production batches</h2>{batches.length ? batches.slice(0, 4).map(renderBatch) : <p className="text-xs text-slate-600">Plan a batch to begin recording material and output efficiency.</p>}</section>
            <section className="card-clean space-y-3 p-4"><h2 className="flex items-center gap-2 text-sm font-bold text-slate-900"><AlertTriangle className="h-4 w-4 text-amber-600" />Open anomalies</h2>{batchAlerts.length + sensorAlerts.length ? [...batchAlerts, ...sensorAlerts].slice(0, 8).map((alert, index) => <p key={`${alert.batchCode}-${alert.id}-${index}`} className="rounded-lg bg-amber-50 p-3 text-xs text-amber-950"><strong>{alert.batchCode} · {alert.productName}:</strong> {alert.message}</p>) : <p className="text-xs text-slate-600">No configured threshold alerts. Add batch actuals or generate a simulated storage sample.</p>}</section>
          </div>
        </div>
      )}

      {activeView === 'batches' && <div className="space-y-4">{batches.length ? batches.map(renderBatch) : <div className="card-clean p-6 text-sm text-slate-600">No production batches yet. Create a plan to compare expected material with actual use and output.</div>}</div>}

      {activeView === 'monitoring' && (
        <section className="space-y-3">
          <div className="flex flex-col gap-3 rounded-lg bg-slate-50 p-4 sm:flex-row sm:items-end sm:justify-between">
            <div><h2 className="text-sm font-bold text-slate-900">Simulated storage sensor</h2><p className="mt-1 text-[11px] text-slate-600">Demo telemetry polls at each configured interval while this view is open. No physical IoT device is connected.</p></div>
            <label className="w-full space-y-1 text-xs font-semibold text-slate-700 sm:max-w-xs"><span>Reading profile</span><select value={sensorProfile} onChange={(event) => setSensorProfile(event.target.value)} className="w-full">{DEMO_SENSOR_PROFILES.map((profile) => <option key={profile.id} value={profile.id}>{profile.label}</option>)}</select></label>
          </div>
          {batches.length ? batches.map((batch) => {
            const reading = latestSensorReadings[batch.id];
            const device = sensorDevices.find((item) => item.batchId === batch.id) || createDemoSensorDevice(batch, new Date(batch.createdAt || 0).getTime());
            const alerts = reading ? getStorageSensorAlerts(batch, reading) : [];
            const readingsForBatch = sensorReadings.filter((item) => item.batchId === batch.id);
            return <article key={batch.id} className="card-clean space-y-3 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div><h3 className="text-sm font-bold text-slate-900">{batch.productName} · {batch.batchCode}</h3><p className="mt-1 text-xs text-slate-600">Configured temperature {batch.minTemperatureC}–{batch.maxTemperatureC}°C · humidity {batch.minHumidityPercent}–{batch.maxHumidityPercent}%</p></div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => updateSensorDevice(batch, { connected: !device.connected })} className="btn-secondary justify-center text-xs">{device.connected ? 'Disconnect simulated device' : 'Connect simulated device'}</button>
                  <button type="button" onClick={() => handleGenerateSensorReading(batch)} disabled={!device.connected} className="btn-primary justify-center text-xs disabled:cursor-not-allowed disabled:opacity-50">Generate demo reading</button>
                </div>
              </div>
              <div className="grid gap-2 rounded-lg bg-slate-50 p-3 text-xs sm:grid-cols-4">
                <div><span className="block text-[10px] text-slate-500">Device</span><strong>{device.label}</strong><span className="block text-[10px] text-slate-500">{device.id} · {device.source}</span></div>
                <div><span className="block text-[10px] text-slate-500">Connection</span><strong className={device.connected ? 'text-emerald-700' : 'text-red-700'}>{device.connected ? 'Online (simulated)' : 'Offline (simulated)'}</strong></div>
                <div><span className="block text-[10px] text-slate-500">Battery · signal</span><strong>{device.batteryPercent}% · {device.signalPercent}%</strong></div>
                <label className="space-y-1 text-[10px] font-semibold text-slate-600"><span>Sampling interval</span><select value={device.samplingIntervalSeconds} onChange={(event) => updateSensorDevice(batch, { samplingIntervalSeconds: Number(event.target.value) })} className="w-full"><option value="30">30 seconds</option><option value="60">1 minute</option><option value="300">5 minutes</option></select></label>
              </div>
              {reading ? <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-slate-50 p-3"><span className="block text-[10px] font-semibold text-slate-500">Temperature</span><strong className="text-sm text-slate-900">{reading.temperatureC}°C</strong></div>
                <div className="rounded-lg bg-slate-50 p-3"><span className="block text-[10px] font-semibold text-slate-500">Humidity</span><strong className="text-sm text-slate-900">{reading.humidityPercent}%</strong></div>
                <div className="rounded-lg bg-slate-50 p-3"><span className="block text-[10px] font-semibold text-slate-500">Sample status</span><strong className={`text-xs ${alerts.length ? 'text-amber-700' : 'text-emerald-700'}`}>{alerts.length ? `${alerts.length} configured alert(s)` : 'Within configured ranges'}</strong></div>
                {alerts.map((alert) => <p key={alert.id} className="rounded-lg bg-amber-50 p-2 text-xs text-amber-950 sm:col-span-3"><AlertTriangle className="mr-1 inline h-3.5 w-3.5" />{alert.message}</p>)}
                <p className="text-[10px] text-slate-500 sm:col-span-3">{reading.sensorId} · {reading.source} · {reading.profileLabel} · {new Date(reading.recordedAt).toLocaleString()} · {readingsForBatch.length} sample(s) stored</p>
              </div> : <p className="text-xs text-slate-600">No sensor sample recorded for this batch.</p>}
              {batch.actualsRecordedAt && <p className="text-[10px] text-slate-500">Manual production log reading: {batch.storageTemperatureC}°C · {batch.storageHumidityPercent}% RH. Kept separate from simulated sensor samples.</p>}
            </article>;
          }) : <div className="card-clean p-6 text-sm text-slate-600">Plan a production batch to configure limits and try the sensor demo.</div>}
          <p className="text-[10px] text-slate-500">Simulated readings exercise the same configured-range alert path for a prototype demonstration. They must not be used as operational sensor data or as a food-safety decision.</p>
        </section>
      )}

      {activeView === 'visual-qa' && (
        <section className="space-y-4">
          <header className="border-b border-slate-200 pb-3">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900"><Eye className="h-4 w-4 text-emerald-700" />Computer-vision concept demo</h2>
            <p className="mt-1 text-xs text-slate-600">Upload an image for local preview, then choose a simulated classifier outcome. The image pixels are not analyzed and no real computer-vision model is connected.</p>
          </header>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
            <div className="card-clean space-y-4 p-4">
              <label className="block space-y-1 text-xs font-semibold text-slate-700">
                <span>Production batch</span>
                <select value={selectedQualityBatchId || batches[0]?.id || ''} onChange={(event) => setSelectedQualityBatchId(event.target.value)} className="w-full">
                  {batches.map((batch) => <option key={batch.id} value={batch.id}>{batch.batchCode} · {batch.productName}</option>)}
                </select>
              </label>
              <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-xs text-slate-600 hover:border-emerald-500">
                <ImagePlus className="h-5 w-5 text-emerald-700" />
                <span>{qualityImage?.fileName || 'Choose a local image (maximum 8 MB)'}</span>
                <input type="file" accept="image/*" onChange={handleQualityImageSelect} className="sr-only" />
              </label>
              {qualityImage && <img src={qualityImage.previewUrl} alt="Local image preview; not analyzed by the demo classifier" className="max-h-72 w-full rounded-lg border border-slate-200 bg-slate-50 object-contain" />}
              <label className="block space-y-1 text-xs font-semibold text-slate-700">
                <span>Simulated visual finding</span>
                <select value={qualityScenario} onChange={(event) => setQualityScenario(event.target.value)} className="w-full">
                  {DEMO_VISUAL_SCENARIOS.map((scenario) => <option key={scenario.id} value={scenario.id}>{scenario.label}</option>)}
                </select>
              </label>
              <button type="button" onClick={handleGenerateQualityReview} disabled={!batches.length || !qualityImage} className="btn-primary justify-center text-xs disabled:cursor-not-allowed disabled:opacity-50">
                <Eye className="h-4 w-4" /> Generate simulated review
              </button>
            </div>

            <aside className="card-clean space-y-3 p-4">
              <h3 className="text-sm font-bold text-slate-900">Limits of this demo</h3>
              <ul className="list-disc space-y-2 pl-4 text-xs text-slate-600">
                <li>The selected finding comes from the dropdown, not image inference.</li>
                <li>Visible cues can help prioritize inspection; they cannot establish food safety.</li>
                <li>A qualified operator must inspect and record disposition.</li>
                <li>Image preview stays in this browser session; only filename and demo result are saved.</li>
              </ul>
            </aside>
          </div>

          <section className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Review history ({qualityReviews.length})</h3>
            {qualityReviews.length === 0 ? <div className="card-clean p-5 text-xs text-slate-600">No demo quality reviews recorded. Upload an image and generate a simulated finding to try the workflow.</div> : qualityReviews.map((review) => (
              <article key={review.id} className="card-clean space-y-3 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div><h4 className="text-sm font-bold text-slate-900">{review.classification}</h4><p className="mt-1 text-xs text-slate-600">{review.batchCode} · {review.productName} · {review.imageFileName}</p></div>
                  <span className={`rounded-md px-2 py-1 text-[10px] font-bold ${review.severity === 'low' ? 'bg-emerald-100 text-emerald-800' : review.severity === 'hold' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-900'}`}>{review.disposition === 'pending-review' ? 'Needs human review' : review.disposition.replaceAll('-', ' ')}</span>
                </div>
                <p className="text-xs text-slate-600">{review.cues.join(' ')} Simulated confidence: {(review.confidence * 100).toFixed(0)}% · {review.source}</p>
                <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <label className="space-y-1 text-xs font-semibold text-slate-700"><span>Human QA disposition</span><select value={qualityDecisions[review.id] ?? review.disposition} onChange={(event) => setQualityDecisions((current) => ({ ...current, [review.id]: event.target.value }))} className="w-full"><option value="pending-review">Pending review</option><option value="hold-for-qa">Hold for qualified QA</option><option value="accepted-after-inspection">Accepted after human inspection</option><option value="rejected">Rejected / do not use</option></select></label>
                  <button type="button" onClick={() => handleSaveQualityDisposition(review.id)} className="btn-secondary justify-center self-end text-xs">Save human decision</button>
                </div>
                {review.humanReviewedAt && <p className="text-[10px] text-slate-500">Human disposition saved {new Date(review.humanReviewedAt).toLocaleString()} by {review.humanReviewedBy}.</p>}
              </article>
            ))}
          </section>
        </section>
      )}

      {activeView === 'efficiency' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: 'Production shortfall', value: summarizeByUnit(completedBatches, (batch) => Math.max(0, batch.plannedOutput - batch.actualOutput), (batch) => batch.outputUnit) },
              { label: 'Machine downtime', value: `${totalDowntime} min` },
              { label: 'Material excess', value: totalMaterialExcess },
              { label: 'Energy used', value: energyRecordedBatches.length ? `${totalEnergyKwh.toFixed(1)} kWh` : 'No readings' }
            ].map((metric) => <div key={metric.label} className="card-clean p-4"><span className="block text-xs font-semibold text-slate-500">{metric.label}</span><span className="mt-1 block text-lg font-extrabold text-slate-900">{metric.value}</span></div>)}
          </div>
          <section className="card-clean space-y-3 p-5"><h2 className="flex items-center gap-2 text-sm font-bold text-slate-900"><Zap className="h-4 w-4 text-amber-600" />Batch efficiency and resource use</h2>{metricsByBatch.length ? metricsByBatch.map(({ batch, metrics }) => <div key={batch.id} className="grid gap-2 border-b border-slate-100 pb-3 text-xs sm:grid-cols-5"><span className="font-bold text-slate-800">{batch.batchCode} · {batch.productName}</span><span className="text-slate-600">Efficiency {metrics.productionEfficiencyPercent.toFixed(1)}%</span><span className="text-slate-600">Material variance {metrics.materialVariance.toFixed(1)} {batch.materialUnit}</span><span className="text-slate-600">Energy {batch.energyKwh === null ? 'not recorded' : `${batch.energyKwh} kWh`}</span><span className="text-slate-600">Water {batch.waterLitres === null ? 'not recorded' : `${batch.waterLitres} L`}</span></div>) : <p className="text-xs text-slate-600">Batch comparisons appear when actual production data is recorded.</p>}</section>
          <p className="text-[11px] text-slate-500">These are operational calculations and configured-threshold checks, not autonomous process control or food-safety certification. Sensor values and visual-review outcomes are simulated, not connected to hardware or an image model.</p>
        </div>
      )}
    </section>
  );
}
