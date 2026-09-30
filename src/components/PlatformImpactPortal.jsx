import React, { useEffect, useState } from 'react';
import { BarChart3, Database, Leaf, LogOut, RefreshCw, Recycle, ShieldAlert } from 'lucide-react';
import { calculatePlatformImpact } from '../utils/platformImpact';

const STORAGE_KEYS = {
  institutionalOperations: 'smartmess_meal_operations_v1',
  cateringEvents: 'smartmess_catering_events_v1',
  businessRecords: 'smartmess_business_records_v1',
  processingBatches: 'smartmess_processing_batches_v1',
  surplusListings: 'smartmess_surplus_listings_v1',
  carbonFactor: 'smartmess_platform_carbon_factor_v1'
};

function readArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function readObject(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '{}');
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}

function readPlatformData() {
  return {
    institutionalOperations: readObject(STORAGE_KEYS.institutionalOperations),
    cateringEvents: readArray(STORAGE_KEYS.cateringEvents),
    businessRecords: readArray(STORAGE_KEYS.businessRecords),
    processingBatches: readArray(STORAGE_KEYS.processingBatches),
    surplusListings: readArray(STORAGE_KEYS.surplusListings)
  };
}

function readCarbonFactor() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEYS.carbonFactor) || 'null');
    return value && typeof value === 'object' ? value : { value: '', source: '', unitDefinition: '' };
  } catch {
    return { value: '', source: '', unitDefinition: '' };
  }
}

function formatUnitTotals(values) {
  const entries = Object.entries(values);
  return entries.length
    ? entries.map(([unit, value]) => `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })} ${unit}`).join(' · ')
    : 'No recorded quantities';
}

export default function PlatformImpactPortal({ onLogout }) {
  const [sourceData, setSourceData] = useState(readPlatformData);
  const [carbonFactor, setCarbonFactor] = useState(readCarbonFactor);
  const [factorForm, setFactorForm] = useState(readCarbonFactor);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(() => new Date().toLocaleString());
  const [message, setMessage] = useState('');

  const refreshData = () => {
    setSourceData(readPlatformData());
    setCarbonFactor(readCarbonFactor());
    setFactorForm(readCarbonFactor());
    setLastRefreshedAt(new Date().toLocaleString());
  };

  useEffect(() => {
    const syncData = (event) => {
      if (!event || Object.values(STORAGE_KEYS).includes(event.key)) refreshData();
    };
    window.addEventListener('storage', syncData);
    return () => window.removeEventListener('storage', syncData);
  }, []);

  const impact = calculatePlatformImpact({
    ...sourceData,
    carbonFactor: carbonFactor.value,
    carbonFactorUnit: carbonFactor.unitDefinition,
    carbonFactorSource: carbonFactor.source
  });
  const outcomeCount = impact.institutional.outcomeCount + impact.catering.outcomeCount + impact.business.recordCount + impact.processing.batchCount;
  const dataCoverage = [
    { label: 'Institution meal records', value: impact.institutional.outcomeCount },
    { label: 'Catering item outcomes', value: impact.catering.outcomeCount },
    { label: 'Business service records', value: impact.business.recordCount },
    { label: 'Processing batches', value: impact.processing.batchCount }
  ];

  const handleSaveFactor = (event) => {
    event.preventDefault();
    const numericFactor = Number(factorForm.value);
    if (!Number.isFinite(numericFactor) || numericFactor <= 0 || !factorForm.source.trim() || !factorForm.unitDefinition.trim()) {
      setMessage('Enter a positive factor, its measurement unit, and a traceable source or methodology.');
      return;
    }
    const nextFactor = { ...factorForm, value: numericFactor };
    localStorage.setItem(STORAGE_KEYS.carbonFactor, JSON.stringify(nextFactor));
    setCarbonFactor(nextFactor);
    setFactorForm(nextFactor);
    setMessage('Carbon factor saved. The result will be shown as an estimate with its assumptions.');
  };

  return (
    <section className="space-y-5" aria-labelledby="platform-impact-title">
      <header className="flex flex-col gap-4 rounded-xl bg-emerald-900 p-5 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-semibold text-emerald-200">Cross-sector platform analytics</span>
          <h1 id="platform-impact-title" className="mt-1 text-xl font-bold">Food recovery and resource impact</h1>
          <p className="mt-1 text-xs text-emerald-100">Only saved operational records and receiver-confirmed handoffs are included.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={refreshData} className="btn-secondary justify-center border-white/30 bg-white/10 text-white hover:bg-white/20"><RefreshCw className="h-4 w-4" /> Refresh data</button>
          <button type="button" onClick={onLogout} className="btn-secondary justify-center border-white/30 bg-white/10 text-white hover:bg-white/20"><LogOut className="h-4 w-4" /> Log out</button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Recorded sector outcomes', value: outcomeCount },
          { label: 'Receiver-confirmed handoffs', value: impact.redistribution.completedEvents },
          { label: 'Confirmed quantity by unit', value: formatUnitTotals(impact.redistribution.receiverConfirmedQuantityByUnit) },
          { label: 'Active surplus listings', value: impact.redistribution.activeListings }
        ].map((metric) => <div key={metric.label} className="card-clean p-4"><span className="block text-xs font-semibold text-slate-500">{metric.label}</span><span className="mt-1 block text-xl font-extrabold text-slate-900">{metric.value.toLocaleString()}</span></div>)}
      </div>

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2 border-b border-slate-200 pb-3">
          <div><h2 className="flex items-center gap-2 text-sm font-bold text-slate-900"><BarChart3 className="h-4 w-4 text-emerald-700" />Operational impact by sector</h2><p className="mt-1 text-xs text-slate-500">Units remain separated; these values are not added into a cross-sector “food weight” total.</p></div>
          <span className="text-[10px] text-slate-500">Last refreshed {lastRefreshedAt}</span>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          <article className="card-clean space-y-3 p-4">
            <h3 className="text-sm font-bold text-slate-900">Institutional kitchens</h3>
            <div className="grid grid-cols-3 gap-2 text-xs"><div><span className="block text-slate-500">Prepared</span><strong>{impact.institutional.preparedPortions} portions</strong></div><div><span className="block text-slate-500">Consumed</span><strong>{impact.institutional.consumedPortions} portions</strong></div><div><span className="block text-slate-500">Waste recorded</span><strong>{impact.institutional.wastePortions} portions</strong></div></div>
            <p className="text-[10px] text-slate-500">{impact.institutional.outcomeCount} saved meal-shift records · values reflect current saved shift records.</p>
          </article>

          <article className="card-clean space-y-3 p-4">
            <h3 className="text-sm font-bold text-slate-900">Cafeteria & catering</h3>
            <div className="grid grid-cols-2 gap-2 text-xs"><div><span className="block text-slate-500">Item outcomes</span><strong>{impact.catering.outcomeCount}</strong></div><div><span className="block text-slate-500">Waste recorded</span><strong>{impact.catering.wastePortions} portions</strong></div></div>
            <p className="text-xs text-slate-600">Remaining redistributable surplus: {impact.catering.surplusPortions} portions, before confirmation by a receiver.</p>
          </article>

          <article className="card-clean space-y-3 p-4">
            <h3 className="text-sm font-bold text-slate-900">Food businesses</h3>
            <div className="grid grid-cols-3 gap-2 text-xs"><div><span className="block text-slate-500">Sold</span><strong>{impact.business.soldUnits} item units</strong></div><div><span className="block text-slate-500">Unsold</span><strong>{impact.business.unsoldUnits} item units</strong></div><div><span className="block text-slate-500">Waste</span><strong>{impact.business.wasteUnits} item units</strong></div></div>
            <p className="text-[10px] text-slate-500">{impact.business.recordCount} saved product/service records · business units are not assumed to equal servings or weight.</p>
          </article>

          <article className="card-clean space-y-3 p-4">
            <h3 className="text-sm font-bold text-slate-900">Food processing</h3>
            <div className="grid gap-2 text-xs sm:grid-cols-2"><div><span className="block text-slate-500">Material excess by unit</span><strong>{formatUnitTotals(impact.processing.materialExcessByUnit)}</strong></div><div><span className="block text-slate-500">Output shortfall by unit</span><strong>{formatUnitTotals(impact.processing.productionShortfallByUnit)}</strong></div><div><span className="block text-slate-500">Energy readings</span><strong>{impact.processing.energyKwh === null ? 'Not recorded' : `${impact.processing.energyKwh.toFixed(1)} kWh`}</strong></div><div><span className="block text-slate-500">Water readings</span><strong>{impact.processing.waterLitres === null ? 'Not recorded' : `${impact.processing.waterLitres.toFixed(1)} litres`}</strong></div></div>
            <p className="text-[10px] text-slate-500">{impact.processing.batchCount} batches with actuals · material excess means measured use above the configured plan, not a verified disposal weight.</p>
          </article>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="card-clean space-y-3 p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900"><Recycle className="h-4 w-4 text-emerald-700" />Redistribution outcomes</h2>
          <p className="text-xs text-slate-600">Only receiver-confirmed quantities from delivered/completed listings count. Available, requested, or merely accepted surplus is not counted as recovered food.</p>
          <div className="rounded-lg bg-emerald-50 p-3"><span className="block text-[10px] font-bold uppercase text-emerald-800">Receiver-confirmed quantity by unit</span><span className="mt-1 block text-lg font-extrabold text-emerald-950">{formatUnitTotals(impact.redistribution.receiverConfirmedQuantityByUnit)}</span><span className="text-[10px] text-emerald-800">{impact.redistribution.completedEvents} completed handoffs</span></div>
          <p className="text-[10px] text-slate-500">Portions and business item units are reported separately; unknown legacy units are not combined with either.</p>
        </article>

        <article className="card-clean space-y-3 p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900"><Leaf className="h-4 w-4 text-emerald-700" />Optional carbon estimate</h2>
          <p className="text-xs text-slate-600">No environmental factor is assumed. Enter one only when its unit matches the source-reported quantity and its methodology is traceable.</p>
          <form onSubmit={handleSaveFactor} className="space-y-3">
            <label className="block space-y-1 text-xs font-semibold text-slate-700"><span>kg CO₂e avoided per unit</span><input type="number" min="0.0001" step="0.0001" value={factorForm.value} onChange={(event) => setFactorForm((current) => ({ ...current, value: event.target.value }))} className="w-full" /></label>
            <label className="block space-y-1 text-xs font-semibold text-slate-700"><span>Factor applies to</span><select value={factorForm.unitDefinition} onChange={(event) => setFactorForm((current) => ({ ...current, unitDefinition: event.target.value }))} className="w-full"><option value="">Choose a matching unit</option><option value="portions">Receiver-confirmed portions</option><option value="item units">Receiver-confirmed business item units</option></select></label>
            <label className="block space-y-1 text-xs font-semibold text-slate-700"><span>Factor source / method</span><input type="text" value={factorForm.source} onChange={(event) => setFactorForm((current) => ({ ...current, source: event.target.value }))} placeholder="Reference or approved methodology" className="w-full" /></label>
            <button type="submit" className="btn-primary justify-center text-xs">Save sourced factor</button>
          </form>
          {impact.redistribution.carbonEstimateKg === null
            ? <p className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">Estimate unavailable until a positive factor, unit definition, and source are configured.</p>
            : <p className="rounded-lg bg-emerald-50 p-3 text-xs text-emerald-950"><strong>Estimated avoided emissions: {impact.redistribution.carbonEstimateKg.toFixed(2)} kg CO₂e.</strong> Basis: {impact.redistribution.carbonEstimateQuantity} {impact.redistribution.carbonEstimateUnit} × {carbonFactor.value} kg CO₂e per unit. Source: {carbonFactor.source}.</p>}
        </article>
      </section>

      <section className="card-clean space-y-3 p-5">
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900"><Database className="h-4 w-4 text-blue-700" />Data coverage</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{dataCoverage.map((item) => <div key={item.label} className="rounded-lg bg-slate-50 p-3"><span className="block text-[10px] font-semibold text-slate-500">{item.label}</span><span className="mt-1 block text-lg font-extrabold text-slate-900">{item.value}</span></div>)}</div>
        <p className="flex items-start gap-2 text-[10px] text-slate-500"><ShieldAlert className="h-3.5 w-3.5 shrink-0" />Prototype analytics read browser-local demo records only. They are not a central live database, audited impact report, food-safety decision, or verified carbon account.</p>
      </section>

      {message && <p role="status" className="rounded-lg bg-slate-100 p-3 text-xs font-semibold text-slate-700">{message}</p>}
    </section>
  );
}
