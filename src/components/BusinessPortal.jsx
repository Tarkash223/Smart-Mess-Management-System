import React, { useState } from 'react';
import { BarChart3, LogOut, Plus, TrendingDown } from 'lucide-react';
import { DEMO_BUSINESS_PRODUCTS } from '../data/demoPlatformData';
import { getSurplusListingValidationMessage } from '../utils/surplusSafety';
import { estimateBusinessIngredientRequirements, predictBusinessItemDemand } from '../utils/businessDemand';

const PRODUCTS_KEY = 'smartmess_business_products_v1';
const RECORDS_KEY = 'smartmess_business_records_v1';
const SURPLUS_KEY = 'smartmess_surplus_listings_v1';
function readArray(key, fallback = []) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null');
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function localDateString(date = new Date()) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function BusinessPortal({ onLogout }) {
  const [products, setProducts] = useState(() => readArray(PRODUCTS_KEY, DEMO_BUSINESS_PRODUCTS));
  const [records, setRecords] = useState(() => readArray(RECORDS_KEY));
  const [surplusListings, setSurplusListings] = useState(() => readArray(SURPLUS_KEY));
  const [businessLocation, setBusinessLocation] = useState(() => localStorage.getItem('smartmess_business_location_v1') || 'Smart Bites, Sabour Campus');
  const [targetDate, setTargetDate] = useState(() => localDateString());
  const [timeSlot, setTimeSlot] = useState('lunch');
  const [activeView, setActiveView] = useState('plan');
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState({ name: '', category: 'vegetarian', baselineOrders: '' });
  const [ingredientDrafts, setIngredientDrafts] = useState([{ id: 1, name: '', quantityPerOrder: '', unit: 'kg' }]);
  const [outcomeDrafts, setOutcomeDrafts] = useState({});
  const [surplusDrafts, setSurplusDrafts] = useState({});
  const [message, setMessage] = useState('');

  const commitProducts = (nextProducts) => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(nextProducts));
    setProducts(nextProducts);
  };
  const commitRecords = (nextRecords) => {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(nextRecords));
    setRecords(nextRecords);
  };

  const historyBeforeTarget = records.filter((record) => record.date < targetDate);
  const forecasts = products.map((product) => ({
    product,
    forecast: predictBusinessItemDemand({ product, targetDate, timeSlot, history: historyBeforeTarget })
  }));
  const todayRecords = records.filter((record) => record.date === targetDate && record.timeSlot === timeSlot);
  const totalPrepared = todayRecords.reduce((total, record) => total + record.prepared, 0);
  const totalSold = todayRecords.reduce((total, record) => total + record.sold, 0);
  const totalWaste = todayRecords.reduce((total, record) => total + record.waste, 0);
  const itemStats = products.map((product) => {
    const productRecords = records.filter((record) => record.productId === product.id);
    return {
      product,
      records: productRecords,
      sold: productRecords.reduce((total, record) => total + record.sold, 0),
      unsold: productRecords.reduce((total, record) => total + record.unsold, 0),
      waste: productRecords.reduce((total, record) => total + record.waste, 0),
      averageWaste: productRecords.length
        ? productRecords.reduce((total, record) => total + record.waste, 0) / productRecords.length
        : 0
    };
  });
  const topOrdered = [...itemStats].filter((item) => item.records.length).sort((first, second) => second.sold - first.sold)[0];
  const leastOrdered = [...itemStats].filter((item) => item.records.length).sort((first, second) => first.sold - second.sold)[0];
  const mostWasted = [...itemStats].sort((first, second) => second.waste - first.waste)[0];
  const mostUnsold = [...itemStats].sort((first, second) => second.unsold - first.unsold)[0];
  const largestWaste = Math.max(1, ...itemStats.map((item) => item.waste));
  const recentTrendDates = [...new Set(records.map((record) => record.date))].sort().slice(-7);
  const salesWasteTrend = recentTrendDates.map((date) => ({
    date,
    sold: records.filter((record) => record.date === date).reduce((total, record) => total + record.sold, 0),
    waste: records.filter((record) => record.date === date).reduce((total, record) => total + record.waste, 0)
  }));

  const handleAddProduct = (event) => {
    event.preventDefault();
    const baselineOrders = Number(productForm.baselineOrders);
    if (!productForm.name.trim() || !Number.isInteger(baselineOrders) || baselineOrders < 0) {
      setMessage('Enter an item name and a whole-number baseline of zero or more orders.');
      return;
    }
    const ingredientRows = ingredientDrafts.filter((ingredient) => ingredient.name.trim() || ingredient.quantityPerOrder !== '');
    if (ingredientRows.some((ingredient) => !ingredient.name.trim() || !Number.isFinite(Number(ingredient.quantityPerOrder)) || Number(ingredient.quantityPerOrder) <= 0)) {
      setMessage('Complete each ingredient name and positive per-order quantity, or remove the unused row.');
      return;
    }
    const product = {
      id: `biz-${Date.now()}`,
      name: productForm.name.trim(),
      category: productForm.category,
      baselineOrders,
      ingredients: ingredientRows.map((ingredient) => ({ name: ingredient.name.trim(), quantityPerOrder: Number(ingredient.quantityPerOrder), unit: ingredient.unit })),
      createdAt: new Date().toISOString()
    };
    commitProducts([product, ...products]);
    setProductForm({ name: '', category: 'vegetarian', baselineOrders: '' });
    setIngredientDrafts([{ id: Date.now(), name: '', quantityPerOrder: '', unit: 'kg' }]);
    setShowProductForm(false);
    setMessage(`${product.name} added. Its forecast will use the manager baseline until sales are recorded.`);
  };

  const updateOutcomeDraft = (key, field, value) => {
    setOutcomeDrafts((current) => ({ ...current, [key]: { ...current[key], [field]: value } }));
  };

  const handleSaveActuals = (product, forecast) => {
    const key = `${product.id}:${targetDate}:${timeSlot}`;
    const existingRecord = records.find((record) => record.productId === product.id && record.date === targetDate && record.timeSlot === timeSlot);
    const draft = outcomeDrafts[key] || {};
    const prepared = Number(draft.prepared ?? existingRecord?.prepared ?? forecast.recommendedPreparation);
    const soldValue = draft.sold ?? existingRecord?.sold;
    const wasteValue = draft.waste ?? existingRecord?.waste;
    if (soldValue === undefined || soldValue === '' || wasteValue === undefined || wasteValue === '') {
      setMessage(`Enter sold and wasted quantities for ${product.name}.`);
      return;
    }
    const sold = Number(soldValue);
    const waste = Number(wasteValue);
    if (!Number.isInteger(prepared) || prepared < 0 || !Number.isInteger(sold) || sold < 0 || sold > prepared) {
      setMessage(`${product.name}: sold quantity must be between zero and prepared quantity.`);
      return;
    }
    const unsold = prepared - sold;
    if (!Number.isInteger(waste) || waste < 0 || waste > unsold) {
      setMessage(`${product.name}: waste must be between zero and unsold quantity.`);
      return;
    }

    const record = {
      id: existingRecord?.id || `SALE-${product.id}-${targetDate}-${timeSlot}`,
      productId: product.id,
      productName: product.name,
      category: product.category,
      date: targetDate,
      timeSlot,
      prepared,
      sold,
      unsold,
      waste,
      redistributable: unsold - waste,
      forecastOrders: forecast.expectedOrders,
      forecastBasis: forecast.basis,
      location: businessLocation,
      recordedAt: new Date().toISOString(),
      surplusListingId: existingRecord?.surplusListingId || null
    };
    const nextRecords = existingRecord
      ? records.map((item) => item.id === existingRecord.id ? record : item)
      : [record, ...records];
    commitRecords(nextRecords);
    setMessage(`${product.name}: production, sales, unsold, and waste actuals saved.`);
  };

  const getSurplusDraft = (record) => surplusDrafts[record.id] || {
    preparedAt: '',
    availableUntil: '',
    temperatureC: '',
    safetyVerified: false,
    qualityVerified: false
  };

  const handleListBusinessSurplus = (record) => {
    const draft = getSurplusDraft(record);
    const listing = {
      foodName: record.productName,
      foodCategory: record.category,
      quantity: record.redistributable,
      quantityUnit: 'item units',
      sourceSector: 'food-business',
      sourceRecordId: record.id,
      sourceOrganization: 'Smart Bites Demo',
      location: businessLocation,
      preparedAt: draft.preparedAt,
      availableUntil: draft.availableUntil,
      temperatureC: draft.temperatureC,
      safetyVerified: draft.safetyVerified,
      qualityVerified: draft.qualityVerified
    };
    const validationMessage = getSurplusListingValidationMessage(listing);
    if (validationMessage) {
      setMessage(validationMessage);
      return;
    }

    const newListing = {
      ...listing,
      id: `BIZ-SURPLUS-${Date.now()}`,
      status: 'Available',
      createdAt: new Date().toISOString(),
      verifiedByRole: 'Business Manager'
    };
    const nextListings = [newListing, ...surplusListings];
    localStorage.setItem(SURPLUS_KEY, JSON.stringify(nextListings));
    setSurplusListings(nextListings);
    commitRecords(records.map((item) => item.id === record.id ? { ...item, surplusListingId: newListing.id } : item));
    setMessage(`${record.productName} surplus listed after the required safety and quality checks.`);
  };

  const updateBusinessLocation = (value) => {
    setBusinessLocation(value);
    localStorage.setItem('smartmess_business_location_v1', value);
  };

  const views = [
    { id: 'plan', label: 'Demand & Production' },
    { id: 'analytics', label: 'Item Analytics' }
  ];

  return (
    <section className="space-y-5" aria-labelledby="business-portal-title">
      <header className="flex flex-col gap-4 rounded-xl bg-emerald-900 p-5 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-semibold text-emerald-200">Food Business Operations</span>
          <h1 id="business-portal-title" className="mt-1 text-xl font-bold">Demand, production, and unsold food</h1>
          <p className="mt-1 text-xs text-emerald-100">Plan item quantities from sales history; log actuals after each service.</p>
        </div>
        <button type="button" onClick={onLogout} className="btn-secondary justify-center border-white/30 bg-white/10 text-white hover:bg-white/20">
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </header>

      <div className="flex flex-col gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <nav className="flex flex-wrap gap-2" aria-label="Food business sections">
          {views.map((view) => <button key={view.id} type="button" onClick={() => { setActiveView(view.id); setMessage(''); }} className={`rounded-lg px-3 py-2 text-xs font-bold ${activeView === view.id ? 'bg-emerald-700 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>{view.label}</button>)}
        </nav>
        <button type="button" onClick={() => { setShowProductForm((current) => !current); setActiveView('plan'); }} className="btn-primary justify-center text-xs"><Plus className="h-4 w-4" /> Add food item</button>
      </div>

      {message && <p role="status" className="rounded-lg bg-slate-100 p-3 text-xs font-semibold text-slate-700">{message}</p>}

      {showProductForm && (
        <form onSubmit={handleAddProduct} className="card-clean space-y-3 p-4">
          <h2 className="text-sm font-bold text-slate-900">Add a menu item and cold-start baseline</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="space-y-1 text-xs font-semibold text-slate-700"><span>Item name</span><input type="text" value={productForm.name} onChange={(event) => setProductForm((current) => ({ ...current, name: event.target.value }))} className="w-full" /></label>
            <label className="space-y-1 text-xs font-semibold text-slate-700"><span>Food category</span><select value={productForm.category} onChange={(event) => setProductForm((current) => ({ ...current, category: event.target.value }))} className="w-full"><option value="vegetarian">Vegetarian</option><option value="non-vegetarian">Non-vegetarian</option><option value="packaged">Packaged / sealed</option></select></label>
            <label className="space-y-1 text-xs font-semibold text-slate-700"><span>Baseline orders per service</span><input type="number" min="0" step="1" value={productForm.baselineOrders} onChange={(event) => setProductForm((current) => ({ ...current, baselineOrders: event.target.value }))} className="w-full" /></label>
          </div>
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div><h3 className="text-xs font-bold text-slate-800">Optional ingredient recipe</h3><p className="text-[10px] text-slate-500">Enter raw-material quantity needed for one order to estimate prep requirements.</p></div>
              <button type="button" onClick={() => setIngredientDrafts((current) => [...current, { id: Date.now(), name: '', quantityPerOrder: '', unit: 'kg' }])} className="btn-secondary justify-center text-xs"><Plus className="h-3.5 w-3.5" /> Add ingredient</button>
            </div>
            {ingredientDrafts.map((ingredient) => <div key={ingredient.id} className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_140px_100px_auto]">
              <input type="text" value={ingredient.name} onChange={(event) => setIngredientDrafts((current) => current.map((entry) => entry.id === ingredient.id ? { ...entry, name: event.target.value } : entry))} placeholder="Ingredient" className="text-xs" />
              <input type="number" min="0.001" step="0.001" value={ingredient.quantityPerOrder} onChange={(event) => setIngredientDrafts((current) => current.map((entry) => entry.id === ingredient.id ? { ...entry, quantityPerOrder: event.target.value } : entry))} placeholder="Per order" className="text-xs" />
              <select value={ingredient.unit} onChange={(event) => setIngredientDrafts((current) => current.map((entry) => entry.id === ingredient.id ? { ...entry, unit: event.target.value } : entry))} className="text-xs"><option>kg</option><option>g</option><option>litre</option><option>ml</option><option>unit</option></select>
              <button type="button" onClick={() => setIngredientDrafts((current) => current.length > 1 ? current.filter((entry) => entry.id !== ingredient.id) : current)} className="btn-secondary justify-center text-xs">Remove</button>
            </div>)}
          </div>
          <button type="submit" className="btn-primary justify-center text-xs">Save item</button>
        </form>
      )}

      {activeView === 'plan' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: 'Items planned', value: products.length },
              { label: 'Prepared this service', value: totalPrepared },
              { label: 'Sold this service', value: totalSold },
              { label: 'Waste logged this service', value: totalWaste }
            ].map((metric) => <div key={metric.label} className="card-clean p-4"><span className="block text-xs font-semibold text-slate-500">{metric.label}</span><span className="mt-1 block text-2xl font-extrabold text-slate-900">{metric.value}</span></div>)}
          </div>

          <div className="flex flex-col gap-3 rounded-lg bg-slate-50 p-4 sm:flex-row sm:items-end">
            <label className="space-y-1 text-xs font-semibold text-slate-700"><span>Planning date</span><input type="date" value={targetDate} onChange={(event) => setTargetDate(event.target.value)} className="w-full" /></label>
            <label className="space-y-1 text-xs font-semibold text-slate-700"><span>Service period</span><select value={timeSlot} onChange={(event) => setTimeSlot(event.target.value)} className="w-full"><option value="breakfast">Breakfast</option><option value="lunch">Lunch</option><option value="evening">Evening</option><option value="dinner">Dinner</option></select></label>
            <label className="min-w-0 flex-1 space-y-1 text-xs font-semibold text-slate-700"><span>Business pickup location</span><input type="text" value={businessLocation} onChange={(event) => updateBusinessLocation(event.target.value)} className="w-full" /></label>
          </div>

          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Item demand and production plan</h2>
                <p className="text-xs text-slate-500">Forecast uses prior sales for this item and service period; sparse history falls back to the entered baseline.</p>
              </div>
              <span className="text-xs text-slate-500">{DAY_NAMES[new Date(`${targetDate}T12:00:00`).getDay()]}</span>
            </div>

            {forecasts.length === 0 ? <div className="card-clean p-6 text-sm text-slate-600">Add a food item to start recording sales and production.</div> : (
              <div className="space-y-3">
                {forecasts.map(({ product, forecast }) => {
                  const key = `${product.id}:${targetDate}:${timeSlot}`;
                  const record = records.find((item) => item.productId === product.id && item.date === targetDate && item.timeSlot === timeSlot);
                  const draft = outcomeDrafts[key] || {};
                  const prepared = draft.prepared ?? record?.prepared ?? forecast.recommendedPreparation;
                  const ingredientPlan = estimateBusinessIngredientRequirements(product, forecast.recommendedPreparation);
                  const sold = draft.sold ?? record?.sold ?? '';
                  const waste = draft.waste ?? record?.waste ?? '';
                  return (
                    <article key={product.id} className="card-clean space-y-3 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-bold text-slate-900">{product.name}</h3><span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] capitalize font-bold text-slate-600">{product.category}</span></div>
                          <p className="mt-1 text-[11px] text-slate-500">{forecast.basis} · {forecast.comparableRecordCount} records</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-right">
                          <div><span className="block text-[10px] font-bold uppercase text-slate-500">Expected orders</span><span className="text-lg font-extrabold text-blue-800">{forecast.expectedOrders}</span></div>
                          <div><span className="block text-[10px] font-bold uppercase text-slate-500">Recommended prep</span><span className="text-lg font-extrabold text-emerald-800">{forecast.recommendedPreparation}</span></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {[
                          { field: 'prepared', label: 'Prepared', value: prepared },
                          { field: 'sold', label: 'Sold / orders', value: sold },
                          { field: 'waste', label: 'Wasted', value: waste }
                        ].map((input) => <label key={input.field} className="space-y-1 text-[10px] font-semibold text-slate-600"><span>{input.label}</span><input type="number" min="0" step="1" value={input.value} onChange={(event) => updateOutcomeDraft(key, input.field, event.target.value === '' ? '' : Number(event.target.value))} className="w-full" /></label>)}
                        <div className="rounded-md bg-slate-50 p-2 text-[10px] text-slate-600"><span className="block font-semibold">Unsold</span><span className="mt-1 block text-sm font-bold text-slate-900">{sold === '' ? '—' : Math.max(0, Number(prepared) - Number(sold))}</span></div>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-500">{record ? `Saved ${new Date(record.recordedAt).toLocaleString()} · ${record.unsold - record.waste} portions not marked as waste` : 'Record actuals after this service.'}</span>
                        <button type="button" onClick={() => handleSaveActuals(product, forecast)} className="btn-primary justify-center text-xs">Save actuals</button>
                      </div>
                      {ingredientPlan.length > 0 && <p className="rounded-md bg-blue-50 p-2 text-[11px] text-blue-900">Approximate ingredients for {forecast.recommendedPreparation} portions: {ingredientPlan.map((ingredient) => `${ingredient.requiredQuantity} ${ingredient.unit} ${ingredient.name}`).join(' · ')}</p>}

                      {record?.redistributable > 0 && (
                        <div className="space-y-2 border-t border-slate-100 pt-3">
                          {record.surplusListingId ? <p className="text-xs font-semibold text-emerald-800">Eligible surplus listed to the shared network.</p> : (
                            <>
                              <p className="text-xs font-bold text-slate-800">{record.redistributable} portions may be offered after safety verification</p>
                              {[
                                { field: 'preparedAt', label: 'Prepared at', type: 'datetime-local' },
                                { field: 'availableUntil', label: 'Available until', type: 'datetime-local' },
                                { field: 'temperatureC', label: 'Storage temperature (°C)', type: 'number' }
                              ].map((input) => <label key={input.field} className="block max-w-sm space-y-1 text-[10px] font-semibold text-slate-600"><span>{input.label}</span><input type={input.type} step={input.type === 'number' ? '0.1' : undefined} value={getSurplusDraft(record)[input.field]} onChange={(event) => setSurplusDrafts((current) => ({ ...current, [record.id]: { ...getSurplusDraft(record), [input.field]: event.target.value } }))} className="w-full" /></label>)}
                              <label className="flex items-start gap-2 text-[11px] text-slate-700"><input type="checkbox" checked={getSurplusDraft(record).safetyVerified} onChange={(event) => setSurplusDrafts((current) => ({ ...current, [record.id]: { ...getSurplusDraft(record), safetyVerified: event.target.checked } }))} className="mt-0.5" /><span>Time, temperature, and handling checked against applicable food-safety requirements.</span></label>
                              <label className="flex items-start gap-2 text-[11px] text-slate-700"><input type="checkbox" checked={getSurplusDraft(record).qualityVerified} onChange={(event) => setSurplusDrafts((current) => ({ ...current, [record.id]: { ...getSurplusDraft(record), qualityVerified: event.target.checked } }))} className="mt-0.5" /><span>Food quality inspected and suitable to offer.</span></label>
                              <button type="button" onClick={() => handleListBusinessSurplus(record)} className="btn-secondary justify-center text-xs">Verify and list surplus</button>
                            </>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
          <p className="text-[11px] text-slate-500">This is a transparent historical heuristic, not a trained ML model. Sales and preparation data are demo-local and can be replaced with a POS/order import later; billing is not part of this module.</p>
        </div>
      )}

      {activeView === 'analytics' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: 'Most ordered', value: topOrdered?.product.name || 'Awaiting sales' },
              { label: 'Least ordered', value: leastOrdered?.product.name || 'Awaiting sales' },
              { label: 'Most wasted', value: mostWasted?.waste ? mostWasted.product.name : 'No waste logged' },
              { label: 'Most overproduced', value: mostUnsold?.unsold ? `${mostUnsold.product.name} (${mostUnsold.unsold})` : 'No unsold logged' }
            ].map((metric) => <div key={metric.label} className="card-clean p-4"><span className="block text-xs font-semibold text-slate-500">{metric.label}</span><span className="mt-1 block truncate text-lg font-extrabold text-slate-900">{metric.value}</span></div>)}
          </div>

          <section className="card-clean space-y-4 p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900"><BarChart3 className="h-4 w-4 text-emerald-700" />Sales and waste by item</h2>
            {itemStats.filter((item) => item.records.length).length === 0 ? <p className="text-xs text-slate-600">Save service actuals to see sales and waste patterns.</p> : itemStats.filter((item) => item.records.length).map((item) => <div key={item.product.id} className="grid grid-cols-[minmax(90px,1fr)_2fr_auto] items-center gap-3 text-xs"><span className="truncate font-semibold text-slate-700">{item.product.name}</span><div className="space-y-1"><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-600" style={{ width: `${Math.max(2, item.sold / Math.max(1, topOrdered?.sold || 1) * 100)}%` }} /></div><div className="h-1.5 rounded-full bg-slate-100"><div className="h-1.5 rounded-full bg-amber-500" style={{ width: `${Math.max(item.waste ? 2 : 0, item.waste / largestWaste * 100)}%` }} /></div></div><span className="text-right text-slate-600">{item.sold} sold · {item.waste} waste</span></div>)}
          </section>

          <section className="card-clean space-y-4 p-5">
            <h2 className="text-sm font-bold text-slate-900">Recent sales and waste trend</h2>
            {salesWasteTrend.length === 0 ? <p className="text-xs text-slate-600">Trend charts appear after actual sales are recorded.</p> : salesWasteTrend.map((day) => {
              const maxValue = Math.max(1, ...salesWasteTrend.map((entry) => Math.max(entry.sold, entry.waste)));
              return <div key={day.date} className="grid grid-cols-[72px_minmax(0,1fr)_120px] items-center gap-3 text-xs"><span className="text-slate-600">{new Date(`${day.date}T12:00:00`).toLocaleDateString()}</span><div className="space-y-1"><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-600" style={{ width: `${day.sold / maxValue * 100}%` }} /></div><div className="h-1.5 rounded-full bg-slate-100"><div className="h-1.5 rounded-full bg-amber-500" style={{ width: `${day.waste / maxValue * 100}%` }} /></div></div><span className="text-right text-slate-600">{day.sold} sold · {day.waste} waste</span></div>;
            })}
          </section>

          <section className="card-clean space-y-3 p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900"><TrendingDown className="h-4 w-4 text-amber-600" />Data-backed recommendations</h2>
            {itemStats.filter((item) => item.records.length).length === 0 ? <p className="text-xs text-slate-600">Recommendations appear after recording sales and unsold quantities.</p> : itemStats.filter((item) => item.records.length).map((item) => {
              const recentRecords = [...item.records].sort((first, second) => second.date.localeCompare(first.date)).slice(0, 5);
              const averageWaste = recentRecords.reduce((total, record) => total + record.waste, 0) / recentRecords.length;
              const averageSold = recentRecords.reduce((total, record) => total + record.sold, 0) / recentRecords.length;
              return <p key={item.product.id} className="border-b border-slate-100 pb-2 text-xs text-slate-700"><strong>{item.product.name}:</strong> {averageWaste > 0 ? `last ${recentRecords.length} services averaged ${Math.round(averageSold)} sold and ${averageWaste.toFixed(1)} wasted; review the prep target before the next comparable service.` : `last ${recentRecords.length} services averaged ${Math.round(averageSold)} sold with no logged waste; keep monitoring before changing the baseline.`}</p>;
            })}
          </section>
          <p className="text-[11px] text-slate-500">Recommendations summarize recorded outcomes; they are not generated when there is no supporting sales/waste history.</p>
        </div>
      )}
    </section>
  );
}
