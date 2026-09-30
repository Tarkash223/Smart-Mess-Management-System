import React, { useEffect, useState } from 'react';
import { Activity, Database, Leaf, RefreshCw, Recycle, TrendingDown } from 'lucide-react';
import { calculatePlatformImpact } from '../utils/platformImpact';

const SOURCE_KEYS = {
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

function readImpactSources() {
  return {
    institutionalOperations: readObject(SOURCE_KEYS.institutionalOperations),
    cateringEvents: readArray(SOURCE_KEYS.cateringEvents),
    businessRecords: readArray(SOURCE_KEYS.businessRecords),
    processingBatches: readArray(SOURCE_KEYS.processingBatches),
    surplusListings: readArray(SOURCE_KEYS.surplusListings),
    carbonFactor: readObject(SOURCE_KEYS.carbonFactor)
  };
}

function formatUnitTotals(values) {
  const entries = Object.entries(values);
  return entries.length
    ? entries.map(([unit, value]) => `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })} ${unit}`).join(' · ')
    : 'No recorded quantities';
}

export default function ImpactPage() {
  const [sources, setSources] = useState(readImpactSources);
  const [lastRefreshed, setLastRefreshed] = useState(() => new Date().toLocaleString());
  const refresh = () => {
    setSources(readImpactSources());
    setLastRefreshed(new Date().toLocaleString());
  };

  useEffect(() => {
    const syncSources = (event) => {
      if (!event || Object.values(SOURCE_KEYS).includes(event.key)) refresh();
    };
    window.addEventListener('storage', syncSources);
    return () => window.removeEventListener('storage', syncSources);
  }, []);

  const impact = calculatePlatformImpact({
    institutionalOperations: sources.institutionalOperations,
    cateringEvents: sources.cateringEvents,
    businessRecords: sources.businessRecords,
    processingBatches: sources.processingBatches,
    surplusListings: sources.surplusListings,
    carbonFactor: sources.carbonFactor.value,
    carbonFactorUnit: sources.carbonFactor.unitDefinition,
    carbonFactorSource: sources.carbonFactor.source
  });
  const recordedSectors = impact.institutional.outcomeCount + impact.catering.outcomeCount + impact.business.recordCount + impact.processing.batchCount;
  const metrics = [
    { label: 'Recorded sector outcomes', value: recordedSectors, icon: Database },
    { label: 'Active surplus listings', value: impact.redistribution.activeListings, icon: TrendingDown },
    { label: 'Receiver-confirmed handoffs', value: impact.redistribution.completedEvents, icon: Recycle },
    { label: 'Confirmed quantity by unit', value: formatUnitTotals(impact.redistribution.receiverConfirmedQuantityByUnit), icon: Leaf }
  ];
  const sectorSummaries = [
    { name: 'Institutional kitchens', records: impact.institutional.outcomeCount, details: `${impact.institutional.preparedPortions} prepared · ${impact.institutional.consumedPortions} consumed · ${impact.institutional.wastePortions} waste portions` },
    { name: 'Cafeteria and catering', records: impact.catering.outcomeCount, details: `${impact.catering.wastePortions} waste portions · ${impact.catering.surplusPortions} surplus portions` },
    { name: 'Food businesses', records: impact.business.recordCount, details: `${impact.business.soldUnits} item units sold · ${impact.business.unsoldUnits} unsold · ${impact.business.wasteUnits} waste` },
    { name: 'Food processing', records: impact.processing.batchCount, details: `Material excess: ${formatUnitTotals(impact.processing.materialExcessByUnit)} · Energy: ${impact.processing.energyKwh === null ? 'not recorded' : `${impact.processing.energyKwh.toFixed(1)} kWh`}` }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadeIn">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <span className="badge badge-emerald">Recorded platform activity</span>
          <h1 className="text-3xl font-extrabold text-slate-900">Food Recovery & Resource Impact</h1>
          <p className="max-w-3xl text-sm text-slate-600">Current totals are calculated from saved browser records. Quantities remain in their source units and receiver-confirmed handoffs are counted separately.</p>
        </div>
        <div className="text-right"><button type="button" onClick={refresh} className="btn-secondary justify-center text-xs"><RefreshCw className="h-4 w-4" /> Refresh records</button><p className="mt-1 text-[10px] text-slate-500">Updated {lastRefreshed}</p></div>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map((metric) => <article key={metric.label} className="card-clean p-4"><div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold text-slate-500">{metric.label}</span><metric.icon className="h-4 w-4 text-emerald-700" /></div><span className="mt-2 block text-xl font-extrabold text-slate-900">{metric.value}</span></article>)}
      </div>

      <section className="space-y-3">
        <div><h2 className="flex items-center gap-2 text-sm font-bold text-slate-900"><Activity className="h-4 w-4 text-emerald-700" />Recorded outcomes by sector</h2><p className="mt-1 text-xs text-slate-500">Food portions, business item units, and production material units are not combined into a single waste total.</p></div>
        <div className="grid gap-3 md:grid-cols-2">
          {sectorSummaries.map((sector) => <article key={sector.name} className="card-clean space-y-2 p-4"><div className="flex items-center justify-between gap-2"><h3 className="text-sm font-bold text-slate-900">{sector.name}</h3><span className="badge badge-slate text-[10px]">{sector.records} records</span></div><p className="text-xs text-slate-600">{sector.details}</p></article>)}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="card-clean space-y-3 p-5"><h2 className="flex items-center gap-2 text-sm font-bold text-slate-900"><Recycle className="h-4 w-4 text-emerald-700" />Redistribution confirmation</h2><p className="text-xs text-slate-600">Only delivered/completed records with a receiver-entered received quantity count here.</p><p className="rounded-lg bg-emerald-50 p-3 text-sm font-bold text-emerald-950">{impact.redistribution.completedEvents} completed handoffs · {formatUnitTotals(impact.redistribution.receiverConfirmedQuantityByUnit)}</p></article>
        <article className="card-clean space-y-3 p-5"><h2 className="flex items-center gap-2 text-sm font-bold text-slate-900"><Leaf className="h-4 w-4 text-emerald-700" />Environmental estimate</h2>{impact.redistribution.carbonEstimateKg === null ? <p className="text-xs text-slate-600">No compatible sourced factor is configured. No carbon result is inferred.</p> : <p className="text-xs text-slate-700"><strong>{impact.redistribution.carbonEstimateKg.toFixed(2)} kg CO₂e estimate</strong> from {impact.redistribution.carbonEstimateQuantity} {impact.redistribution.carbonEstimateUnit} × configured factor. Source: {impact.redistribution.carbonFactorSource}.</p>}</article>
      </section>

      <p className="flex items-start gap-2 text-[11px] text-slate-500"><Database className="mt-0.5 h-3.5 w-3.5 shrink-0" />This view summarizes data saved in this browser; it is not a central live database, audited sustainability report, or independently verified environmental account.</p>
    </div>
  );
}
