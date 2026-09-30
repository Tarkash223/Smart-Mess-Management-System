import React, { useEffect, useState } from 'react';
import { CalendarDays, CheckCircle2, ClipboardList, LogOut, Plus, TrendingDown, Utensils } from 'lucide-react';
import { getSurplusListingValidationMessage } from '../utils/surplusSafety';
import { predictCateringDemand } from '../utils/cateringDemand';

const EVENTS_STORAGE_KEY = 'smartmess_catering_events_v1';
const SURPLUS_STORAGE_KEY = 'smartmess_surplus_listings_v1';

function localDateTimeValue(date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function readStoredArray(key) {
  try {
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function getEmptyEventForm() {
  return {
    title: '',
    eventType: 'cafeteria',
    location: '',
    eventAt: localDateTimeValue(new Date(Date.now() + 86400000)),
    expectedGuests: ''
  };
}

export default function CateringPortal({ onLogout }) {
  const [events, setEvents] = useState(() => readStoredArray(EVENTS_STORAGE_KEY));
  const [surplusListings, setSurplusListings] = useState(() => readStoredArray(SURPLUS_STORAGE_KEY));
  const [activeView, setActiveView] = useState('dashboard');
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventForm, setEventForm] = useState(getEmptyEventForm);
  const [menuItems, setMenuItems] = useState([{ id: 1, name: '', foodCategory: 'vegetarian' }]);
  const [eventMessage, setEventMessage] = useState('');
  const [outcomeDrafts, setOutcomeDrafts] = useState({});
  const [feedbackDrafts, setFeedbackDrafts] = useState({});
  const [surplusDrafts, setSurplusDrafts] = useState({});
  const [surplusMessage, setSurplusMessage] = useState('');
  const [currentTimestamp, setCurrentTimestamp] = useState(0);

  useEffect(() => {
    const refreshTimestamp = () => setCurrentTimestamp(Date.now());
    refreshTimestamp();
    const intervalId = setInterval(refreshTimestamp, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const commitEvents = (nextEvents) => {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(nextEvents));
    setEvents(nextEvents);
  };

  const completedEvents = events.filter((event) => event.status === 'Completed');
  const upcomingEvents = events.filter((event) => event.status !== 'Completed' && new Date(event.eventAt).getTime() >= currentTimestamp);
  const eventWaste = (event) => event.items.reduce((total, item) => total + (item.outcome?.waste || 0), 0);
  const eventSurplus = (event) => event.items.reduce((total, item) => total + (item.outcome?.surplus || 0), 0);
  const totalWaste = completedEvents.reduce((total, event) => total + eventWaste(event), 0);
  const averageSurplus = completedEvents.length
    ? Math.round(completedEvents.reduce((total, event) => total + eventSurplus(event), 0) / completedEvents.length)
    : 0;
  const forecastAccuracy = completedEvents.length
    ? Math.round(completedEvents.reduce((total, event) => {
      const actualPerItem = event.items.reduce((sum, item) => sum + item.outcome.consumed, 0) / event.items.length;
      return total + (actualPerItem > 0
        ? Math.max(0, 100 - (Math.abs(event.forecast.predictedConsumption - actualPerItem) / actualPerItem) * 100)
        : 0);
    }, 0) / completedEvents.length)
    : null;
  const wasteByItem = Object.values(completedEvents.flatMap((event) => event.items.map((item) => ({
    name: item.name,
    waste: item.outcome?.waste || 0
  }))).reduce((totals, item) => {
    totals[item.name] = totals[item.name] || { name: item.name, waste: 0 };
    totals[item.name].waste += item.waste;
    return totals;
  }, {})).sort((first, second) => second.waste - first.waste);
  const mostWastedItem = wasteByItem.find((item) => item.waste > 0);

  const updateEventForm = (field, value) => setEventForm((current) => ({ ...current, [field]: value }));

  const handleCreateEvent = (event) => {
    event.preventDefault();
    const expectedGuests = Number(eventForm.expectedGuests);
    const eventTimestamp = new Date(eventForm.eventAt).getTime();
    const cleanedMenuItems = menuItems.filter((item) => item.name.trim());
    if (!eventForm.title.trim() || !eventForm.location.trim() || !Number.isInteger(expectedGuests) || expectedGuests < 1 || !Number.isFinite(eventTimestamp) || eventTimestamp <= Date.now() || cleanedMenuItems.length === 0) {
      setEventMessage('Add an event name, future date/time, location, positive guest count, and at least one food item.');
      return;
    }

    const forecast = predictCateringDemand({ expectedGuests, eventType: eventForm.eventType, events });
    const createdAt = new Date().toISOString();
    const newEvent = {
      id: `CAT-${Date.now()}`,
      title: eventForm.title.trim(),
      eventType: eventForm.eventType,
      location: eventForm.location.trim(),
      eventAt: new Date(eventTimestamp).toISOString(),
      expectedGuests,
      status: 'Planned',
      forecast,
      items: cleanedMenuItems.map((item, index) => ({
        id: `${Date.now()}-${index}`,
        name: item.name.trim(),
        foodCategory: item.foodCategory,
        predictedConsumption: forecast.predictedConsumption,
        recommendedPreparation: forecast.recommendedPreparation,
        approvedPreparation: null,
        outcome: null
      })),
      createdAt
    };
    commitEvents([newEvent, ...events]);
    setEventForm(getEmptyEventForm());
    setMenuItems([{ id: Date.now(), name: '', foodCategory: 'vegetarian' }]);
    setShowEventForm(false);
    setEventMessage('Event created. The prep estimate is ready for manager review.');
  };

  const handleApprovePreparation = (eventId) => {
    const nextEvents = events.map((event) => event.id === eventId
      ? {
        ...event,
        status: 'Prep approved',
        items: event.items.map((item) => ({ ...item, approvedPreparation: item.recommendedPreparation })),
        prepApprovedAt: new Date().toISOString()
      }
      : event);
    commitEvents(nextEvents);
    setEventMessage('Recommended preparation approved. Staff can still record actual quantities item by item.');
  };

  const updateOutcomeDraft = (key, field, value) => {
    setOutcomeDrafts((current) => ({ ...current, [key]: { ...current[key], [field]: value } }));
  };

  const handleRecordOutcome = (eventId, itemId, item) => {
    const key = `${eventId}:${itemId}`;
    const draft = outcomeDrafts[key] || {};
    const prepared = Number(draft.prepared ?? item.outcome?.prepared ?? item.approvedPreparation ?? item.recommendedPreparation);
    const consumedValue = draft.consumed ?? item.outcome?.consumed;
    const wasteValue = draft.waste ?? item.outcome?.waste;
    const consumed = Number(consumedValue);
    const waste = Number(wasteValue);
    if (consumedValue === undefined || consumedValue === '' || wasteValue === undefined || wasteValue === '') {
      setEventMessage(`Enter consumed and wasted portions for ${item.name}.`);
      return;
    }
    if (!Number.isInteger(prepared) || prepared < 1 || !Number.isInteger(consumed) || consumed < 0 || consumed > prepared) {
      setEventMessage(`${item.name}: consumed portions must be between zero and the prepared quantity.`);
      return;
    }
    const remaining = prepared - consumed;
    if (!Number.isInteger(waste) || waste < 0 || waste > remaining) {
      setEventMessage(`${item.name}: waste must be between zero and the remaining quantity.`);
      return;
    }

    const outcome = { prepared, consumed, remaining, waste, surplus: remaining - waste, recordedAt: new Date().toISOString() };
    const nextEvents = events.map((event) => {
      if (event.id !== eventId) return event;
      const updatedItems = event.items.map((eventItem) => eventItem.id === itemId ? { ...eventItem, outcome } : eventItem);
      return {
        ...event,
        items: updatedItems,
        status: updatedItems.every((eventItem) => eventItem.outcome) ? 'Completed' : 'In progress'
      };
    });
    commitEvents(nextEvents);
    setEventMessage(`${item.name}: actual consumption, surplus, and waste recorded.`);
  };

  const updateFeedbackDraft = (eventId, field, value) => {
    setFeedbackDrafts((current) => ({ ...current, [eventId]: { ...current[eventId], [field]: value } }));
  };

  const handleSaveFeedback = (eventId, savedFeedback) => {
    const feedback = { ...savedFeedback, ...feedbackDrafts[eventId] };
    const ratings = [feedback.taste, feedback.quality, feedback.quantity, feedback.overall].map(Number);
    if (ratings.some((rating) => !Number.isInteger(rating) || rating < 1 || rating > 5)) {
      setEventMessage('Feedback ratings must be from 1 to 5.');
      return;
    }
    commitEvents(events.map((event) => event.id === eventId
      ? { ...event, feedback: { taste: ratings[0], quality: ratings[1], quantity: ratings[2], overall: ratings[3], recordedAt: new Date().toISOString() } }
      : event));
    setEventMessage('Organizer feedback saved with this event.');
  };

  const updateSurplusDraft = (key, field, value) => {
    setSurplusDrafts((current) => ({ ...current, [key]: { ...current[key], [field]: value } }));
  };

  const getSurplusDraft = (key, event) => surplusDrafts[key] || {
    preparedAt: localDateTimeValue(new Date(event.eventAt)),
    availableUntil: '',
    temperatureC: '',
    safetyVerified: false,
    qualityVerified: false
  };

  const handleListSurplus = (eventId, item) => {
    const key = `${eventId}:${item.id}`;
    const event = events.find((entry) => entry.id === eventId);
    const draft = getSurplusDraft(key, event);
    if (!event || !item.outcome || item.outcome.surplus < 1 || item.surplusListingId) {
      setSurplusMessage('There is no unlisted surplus quantity for this food item.');
      return;
    }
    const listing = {
      foodName: item.name,
      foodCategory: item.foodCategory,
      quantity: item.outcome.surplus,
      quantityUnit: 'portions',
      sourceSector: 'catering',
      sourceEventId: event.id,
      sourceOrganization: event.organizationName || 'Demo Catering Organization',
      location: event.location,
      preparedAt: draft.preparedAt,
      availableUntil: draft.availableUntil,
      temperatureC: draft.temperatureC,
      safetyVerified: draft.safetyVerified,
      qualityVerified: draft.qualityVerified
    };
    const validationMessage = getSurplusListingValidationMessage(listing);
    if (validationMessage) {
      setSurplusMessage(validationMessage);
      return;
    }

    const surplusListing = {
      ...listing,
      id: `CAT-SURPLUS-${Date.now()}`,
      status: 'Available',
      createdAt: new Date().toISOString(),
      verifiedByRole: 'Catering Manager'
    };
    const nextListings = [surplusListing, ...surplusListings];
    localStorage.setItem(SURPLUS_STORAGE_KEY, JSON.stringify(nextListings));
    setSurplusListings(nextListings);
    commitEvents(events.map((eventItem) => eventItem.id === eventId
      ? { ...eventItem, items: eventItem.items.map((menuItem) => menuItem.id === item.id ? { ...menuItem, surplusListingId: surplusListing.id } : menuItem) }
      : eventItem));
    setSurplusMessage(`${item.name} surplus listed after the required safety and quality checks.`);
  };

  const renderEvent = (event) => (
    <article key={event.id} className="card-clean space-y-4 p-4">
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">{event.title}</h3>
            <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-700">{event.status}</span>
          </div>
          <p className="mt-1 text-xs capitalize text-slate-600">{event.eventType} · {event.expectedGuests} expected guests</p>
          <p className="mt-1 text-xs text-slate-500">{event.location} · {new Date(event.eventAt).toLocaleString()}</p>
        </div>
        <div className="rounded-lg bg-emerald-50 p-3 text-xs">
          <span className="block font-semibold text-emerald-800">Predicted / prepare</span>
          <span className="mt-1 block font-extrabold text-emerald-950">{event.forecast.predictedConsumption} / {event.forecast.recommendedPreparation} portions</span>
          <span className="text-[10px] text-emerald-800">{event.forecast.basis} · {event.forecast.comparableEventCount} comparable events</span>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase text-slate-600">Menu item planning and actuals</h4>
        {event.items.map((item) => {
          const key = `${event.id}:${item.id}`;
          const draft = outcomeDrafts[key] || {};
          const preparedValue = draft.prepared ?? item.outcome?.prepared ?? item.approvedPreparation ?? item.recommendedPreparation;
          const consumedValue = draft.consumed ?? item.outcome?.consumed ?? '';
          const wasteValue = draft.waste ?? item.outcome?.waste ?? '';
          const surplusDraft = getSurplusDraft(key, event);
          return (
            <div key={item.id} className="space-y-3 rounded-lg bg-slate-50 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-slate-900">{item.name}</p>
                  <p className="text-[10px] capitalize text-slate-500">{item.foodCategory} · predicted {item.predictedConsumption} · recommended prep {item.recommendedPreparation}</p>
                </div>
                {item.outcome && <span className="text-[10px] font-semibold text-emerald-700">{item.outcome.surplus} surplus · {item.outcome.waste} waste</span>}
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { field: 'prepared', label: 'Prepared', value: preparedValue },
                  { field: 'consumed', label: 'Consumed', value: consumedValue },
                  { field: 'waste', label: 'Wasted', value: wasteValue }
                ].map((input) => (
                  <label key={input.field} className="space-y-1 text-[10px] font-semibold text-slate-600">
                    <span>{input.label} portions</span>
                    <input type="number" min="0" step="1" value={input.value} onChange={(change) => updateOutcomeDraft(key, input.field, change.target.value === '' ? '' : Number(change.target.value))} className="w-full" />
                  </label>
                ))}
                <div className="rounded-md bg-white p-2 text-[10px] text-slate-600">
                  <span className="block font-semibold">Unserved</span>
                  <span className="mt-1 block text-sm font-bold text-slate-900">{consumedValue === '' ? '—' : Math.max(0, Number(preparedValue) - Number(consumedValue))}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] text-slate-600">{item.outcome ? `Saved ${new Date(item.outcome.recordedAt).toLocaleString()}` : 'Record this item after service.'}</span>
                <button type="button" onClick={() => handleRecordOutcome(event.id, item.id, item)} className="btn-secondary justify-center text-xs">Save actuals</button>
              </div>
              {item.outcome?.surplus > 0 && (
                <div className="space-y-3 border-t border-slate-200 pt-3">
                  {item.surplusListingId ? (
                    <p className="text-xs font-semibold text-emerald-800">Surplus listed to the shared network · {item.outcome.surplus} portions</p>
                  ) : (
                    <>
                      <p className="text-xs font-bold text-slate-800">Safety review before redistribution · {item.outcome.surplus} eligible portions</p>
                      <div className="grid gap-2 sm:grid-cols-3">
                        {[
                          { field: 'preparedAt', label: 'Prepared at', type: 'datetime-local' },
                          { field: 'availableUntil', label: 'Available until', type: 'datetime-local' },
                          { field: 'temperatureC', label: 'Storage temp (°C)', type: 'number' }
                        ].map((input) => (
                          <label key={input.field} className="space-y-1 text-[10px] font-semibold text-slate-600">
                            <span>{input.label}</span>
                            <input type={input.type} step={input.type === 'number' ? '0.1' : undefined} value={surplusDraft[input.field]} onChange={(change) => updateSurplusDraft(key, input.field, change.target.value)} className="w-full" />
                          </label>
                        ))}
                      </div>
                      <label className="flex items-start gap-2 text-[11px] text-slate-700">
                        <input type="checkbox" checked={surplusDraft.safetyVerified} onChange={(change) => updateSurplusDraft(key, 'safetyVerified', change.target.checked)} className="mt-0.5" />
                        <span>Time, temperature, and handling checked against applicable food-safety requirements.</span>
                      </label>
                      <label className="flex items-start gap-2 text-[11px] text-slate-700">
                        <input type="checkbox" checked={surplusDraft.qualityVerified} onChange={(change) => updateSurplusDraft(key, 'qualityVerified', change.target.checked)} className="mt-0.5" />
                        <span>Food quality inspected and suitable to offer.</span>
                      </label>
                      <button type="button" onClick={() => handleListSurplus(event.id, item)} className="btn-primary justify-center text-xs">Verify and list surplus</button>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {event.status === 'Planned' && (
        <button type="button" onClick={() => handleApprovePreparation(event.id)} className="btn-primary justify-center text-xs">
          <CheckCircle2 className="h-4 w-4" /> Approve recommended prep
        </button>
      )}

      {event.status === 'Completed' && (
        <div className="grid gap-3 border-t border-slate-100 pt-3 sm:grid-cols-4">
          {[
            { field: 'taste', label: 'Taste' },
            { field: 'quality', label: 'Quality' },
            { field: 'quantity', label: 'Quantity' },
            { field: 'overall', label: 'Overall' }
          ].map((rating) => (
            <label key={rating.field} className="space-y-1 text-[10px] font-semibold text-slate-600">
              <span>{rating.label} rating (1–5)</span>
              <select value={feedbackDrafts[event.id]?.[rating.field] ?? event.feedback?.[rating.field] ?? 5} onChange={(change) => updateFeedbackDraft(event.id, rating.field, Number(change.target.value))} className="w-full">
                {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
          ))}
          <button type="button" onClick={() => handleSaveFeedback(event.id, event.feedback || { taste: 5, quality: 5, quantity: 5, overall: 5 })} className="btn-secondary justify-center text-xs sm:col-span-4">Save organizer feedback</button>
        </div>
      )}
      {surplusMessage && <p role="status" className="rounded-lg bg-slate-100 p-2 text-xs font-semibold text-slate-700">{surplusMessage}</p>}
    </article>
  );

  const viewTabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'events', label: `Events (${events.length})` },
    { id: 'analytics', label: 'Analytics' }
  ];

  return (
    <section className="space-y-5" aria-labelledby="catering-portal-title">
      <header className="flex flex-col gap-4 rounded-xl bg-emerald-900 p-5 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-semibold text-emerald-200">Cafeteria & Catering Operations</span>
          <h1 id="catering-portal-title" className="mt-1 text-xl font-bold">Event demand and food planning</h1>
          <p className="mt-1 text-xs text-emerald-100">Forecast → prepare → record actuals → prevent surplus waste</p>
        </div>
        <button type="button" onClick={onLogout} className="btn-secondary justify-center border-white/30 bg-white/10 text-white hover:bg-white/20">
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </header>

      <nav className="flex flex-wrap gap-2 border-b border-slate-200 pb-3" aria-label="Catering portal sections">
        {viewTabs.map((tab) => (
          <button key={tab.id} type="button" onClick={() => { setActiveView(tab.id); setEventMessage(''); }} className={`rounded-lg px-3 py-2 text-xs font-bold ${activeView === tab.id ? 'bg-emerald-700 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
            {tab.label}
          </button>
        ))}
        <button type="button" onClick={() => { setActiveView('events'); setShowEventForm(true); }} className="btn-primary ml-auto justify-center text-xs">
          <Plus className="h-4 w-4" /> Create event
        </button>
      </nav>

      {eventMessage && <p role="status" className="rounded-lg bg-slate-100 p-3 text-xs font-semibold text-slate-700">{eventMessage}</p>}

      {activeView === 'dashboard' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: 'Upcoming events', value: upcomingEvents.length },
              { label: 'Completed events', value: completedEvents.length },
              { label: 'Average surplus / event', value: `${averageSurplus} portions` },
              { label: 'Forecast accuracy', value: forecastAccuracy === null ? 'Awaiting outcomes' : `${forecastAccuracy}%` }
            ].map((metric) => (
              <div key={metric.label} className="card-clean p-4">
                <span className="block text-xs font-semibold text-slate-500">{metric.label}</span>
                <span className="mt-1 block text-xl font-extrabold text-slate-900">{metric.value}</span>
              </div>
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <section className="card-clean space-y-3 p-4">
              <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900"><CalendarDays className="h-4 w-4 text-emerald-700" />Next events</h2>
              {upcomingEvents.length ? upcomingEvents.slice(0, 4).map(renderEvent) : <p className="text-xs text-slate-600">Create an event to see demand and prep recommendations.</p>}
            </section>
            <section className="card-clean space-y-3 p-4">
              <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900"><TrendingDown className="h-4 w-4 text-emerald-700" />Waste signals</h2>
              <p className="text-xs text-slate-600">Recorded waste across completed events: <strong>{totalWaste} portions</strong>.</p>
              {mostWastedItem
                ? <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-950">Most wasted: <strong>{mostWastedItem.name}</strong> ({mostWastedItem.waste} portions recorded). Review its next prep quantity.</p>
                : <p className="text-xs text-slate-500">Record completed event outcomes to surface food-item waste patterns.</p>}
            </section>
          </div>
          <p className="text-[11px] text-slate-500">Demand is a demo heuristic: it uses completed same-type events when available, otherwise a visible event-type baseline. It is not a trained ML model.</p>
        </div>
      )}

      {activeView === 'events' && (
        <div className="space-y-4">
          {showEventForm && (
            <form onSubmit={handleCreateEvent} className="card-clean space-y-4 p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-slate-900">Create cafeteria or catering event</h2>
                <button type="button" onClick={() => setShowEventForm(false)} className="text-xs font-semibold text-slate-500 hover:text-slate-900">Close</button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <label className="space-y-1 text-xs font-semibold text-slate-700"><span>Event name</span><input type="text" value={eventForm.title} onChange={(event) => updateEventForm('title', event.target.value)} className="w-full" /></label>
                <label className="space-y-1 text-xs font-semibold text-slate-700"><span>Event type</span><select value={eventForm.eventType} onChange={(event) => updateEventForm('eventType', event.target.value)} className="w-full"><option value="cafeteria">Cafeteria service</option><option value="corporate">Corporate cafeteria</option><option value="conference">Conference</option><option value="celebration">Celebration</option><option value="wedding">Wedding / large event</option><option value="other">Other</option></select></label>
                <label className="space-y-1 text-xs font-semibold text-slate-700"><span>Expected guests</span><input type="number" min="1" step="1" value={eventForm.expectedGuests} onChange={(event) => updateEventForm('expectedGuests', event.target.value)} className="w-full" /></label>
                <label className="space-y-1 text-xs font-semibold text-slate-700"><span>Date and time</span><input type="datetime-local" value={eventForm.eventAt} onChange={(event) => updateEventForm('eventAt', event.target.value)} className="w-full" /></label>
                <label className="space-y-1 text-xs font-semibold text-slate-700 sm:col-span-2"><span>Location</span><input type="text" value={eventForm.location} onChange={(event) => updateEventForm('location', event.target.value)} className="w-full" /></label>
              </div>

              <div className="space-y-3 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xs font-bold text-slate-800">Menu items</h3>
                  <button type="button" onClick={() => setMenuItems((current) => [...current, { id: Date.now(), name: '', foodCategory: 'vegetarian' }])} className="btn-secondary justify-center text-xs"><Plus className="h-3.5 w-3.5" /> Add food item</button>
                </div>
                {menuItems.map((item) => (
                  <div key={item.id} className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_220px_auto]">
                    <input type="text" value={item.name} onChange={(event) => setMenuItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, name: event.target.value } : entry))} placeholder="Food item" className="text-xs" />
                    <select value={item.foodCategory} onChange={(event) => setMenuItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, foodCategory: event.target.value } : entry))} className="text-xs"><option value="vegetarian">Vegetarian</option><option value="non-vegetarian">Non-vegetarian</option><option value="packaged">Packaged / sealed</option></select>
                    <button type="button" onClick={() => setMenuItems((current) => current.length > 1 ? current.filter((entry) => entry.id !== item.id) : current)} className="btn-secondary justify-center text-xs">Remove</button>
                  </div>
                ))}
              </div>
              <button type="submit" className="btn-primary justify-center text-xs"><ClipboardList className="h-4 w-4" /> Create event and forecast demand</button>
            </form>
          )}

          {events.length === 0
            ? <div className="card-clean p-6 text-sm text-slate-600">No events yet. Create one to generate a preparation plan.</div>
            : <div className="space-y-4">{events.map(renderEvent)}</div>}
        </div>
      )}

      {activeView === 'analytics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: 'Events with actuals', value: completedEvents.length },
              { label: 'Total recorded waste', value: `${totalWaste} portions` },
              { label: 'Average surplus', value: `${averageSurplus} portions / event` },
              { label: 'Prediction accuracy', value: forecastAccuracy === null ? '—' : `${forecastAccuracy}%` }
            ].map((metric) => <div key={metric.label} className="card-clean p-4"><span className="block text-xs font-semibold text-slate-500">{metric.label}</span><span className="mt-1 block text-lg font-extrabold text-slate-900">{metric.value}</span></div>)}
          </div>
          <section className="card-clean space-y-4 p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900"><Utensils className="h-4 w-4 text-emerald-700" />Waste by food item</h2>
            {wasteByItem.length === 0
              ? <p className="text-xs text-slate-600">No item-level waste outcomes recorded yet.</p>
              : wasteByItem.slice(0, 8).map((item) => (
                <div key={item.name} className="flex items-center gap-3 text-xs">
                  <span className="w-28 truncate font-semibold text-slate-700">{item.name}</span>
                  <div className="h-2 flex-1 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-amber-500" style={{ width: `${Math.max(2, item.waste / Math.max(1, wasteByItem[0].waste) * 100)}%` }} /></div>
                  <span className="w-20 text-right font-bold text-slate-800">{item.waste} portions</span>
                </div>
              ))}
          </section>
          <section className="card-clean space-y-3 p-5">
            <h2 className="text-sm font-bold text-slate-900">Event-wise outcomes</h2>
            {completedEvents.length === 0 ? <p className="text-xs text-slate-600">Complete event outcomes to compare actuals, surplus, and waste.</p> : completedEvents.map((event) => <div key={event.id} className="flex flex-wrap justify-between gap-2 border-b border-slate-100 pb-2 text-xs"><span className="font-semibold text-slate-800">{event.title}</span><span className="text-slate-600">{event.forecast.predictedConsumption} predicted · {event.items.reduce((sum, item) => sum + item.outcome.consumed, 0) / event.items.length} avg. consumed/item · {eventWaste(event)} waste</span></div>)}
          </section>
          <p className="text-[11px] text-slate-500">Accuracy compares predicted consumption with average consumed portions per menu item. It is directional; keep guest counts and item portions consistent when entering outcomes.</p>
        </div>
      )}
    </section>
  );
}
