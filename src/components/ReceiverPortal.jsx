import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock3, HandHeart, LogOut, MapPin, PackageCheck, Route, Truck } from 'lucide-react';
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { REDISTRIBUTION_RECEIVERS } from '../data/redistribution';
import { planDemoPickupRoute } from '../utils/demoRoutePlanner';
import { findEligibleReceivers } from '../utils/surplusMatching';
import { transitionReceiverListing } from '../utils/receiverWorkflow';

const LISTINGS_STORAGE_KEY = 'smartmess_surplus_listings_v1';
const ROUTES_STORAGE_KEY = 'smartmess_demo_routes_v1';

function localDateTimeValue(date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function readListings() {
  try {
    const listings = JSON.parse(localStorage.getItem(LISTINGS_STORAGE_KEY) || '[]');
    return Array.isArray(listings) ? listings : [];
  } catch {
    return [];
  }
}

function DemoRouteMap({ route }) {
  const center = [route.path[0].latitude, route.path[0].longitude];
  const positions = route.path.map((point) => [point.latitude, point.longitude]);
  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: '300px', width: '100%', borderRadius: '8px' }}>
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Polyline positions={positions} pathOptions={{ color: '#047857', dashArray: '7 7', weight: 4 }} />
      {route.path.map((point, index) => (
        <CircleMarker key={`${route.id}-${point.type}-${index}`} center={[point.latitude, point.longitude]} radius={point.type === 'receiver' ? 9 : 7} pathOptions={{ color: point.type === 'receiver' ? '#0f172a' : '#047857', fillColor: point.type === 'receiver' ? '#0f172a' : '#34d399', fillOpacity: 0.9 }}>
          <Popup>{point.name}{point.foodName ? ` · ${point.foodName} · ${point.quantity} portions` : ''}</Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

export default function ReceiverPortal({ currentUser, onLogout }) {
  const receiver = REDISTRIBUTION_RECEIVERS.find((item) => item.id === currentUser.receiverId) || REDISTRIBUTION_RECEIVERS[0];
  const [listings, setListings] = useState(readListings);
  const [routePlans, setRoutePlans] = useState(readRoutes);
  const [activeView, setActiveView] = useState('available');
  const [receivedQuantities, setReceivedQuantities] = useState({});
  const [foodCategoryFilter, setFoodCategoryFilter] = useState('all');
  const [serviceZoneFilter, setServiceZoneFilter] = useState('all');
  const [selectedPickupIds, setSelectedPickupIds] = useState([]);
  const [transportMode, setTransportMode] = useState('van');
  const [handoffMethod, setHandoffMethod] = useState('receiver-pickup');
  const [pickupWindow, setPickupWindow] = useState(() => localDateTimeValue(new Date(Date.now() + 60 * 60 * 1000)));
  const [pickupContactName, setPickupContactName] = useState('Demo Driver');
  const [pickupContactPhone, setPickupContactPhone] = useState('0000000000');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const syncListings = (event) => {
      if (!event || event.key === LISTINGS_STORAGE_KEY) setListings(readListings());
    };
    window.addEventListener('storage', syncListings);
    return () => window.removeEventListener('storage', syncListings);
  }, []);

  const matchingListings = listings.filter((listing) =>
    findEligibleReceivers(listing, [receiver]).some((match) => match.id === receiver.id)
  ).filter((listing) => foodCategoryFilter === 'all' || listing.foodCategory === foodCategoryFilter)
    .filter((listing) => serviceZoneFilter === 'all' || listing.location?.toLowerCase().includes(serviceZoneFilter));
  const receiverRequests = listings.filter((listing) => listing.receiverId === receiver.id && listing.status === 'Requested');
  const acceptedPickups = listings.filter((listing) => listing.receiverId === receiver.id && listing.status === 'Accepted');
  const scheduledPickups = listings.filter((listing) => listing.receiverId === receiver.id && listing.status === 'Pickup scheduled');
  const activePickups = [...acceptedPickups, ...scheduledPickups];
  const completedListings = listings.filter((listing) =>
    listing.receiverId === receiver.id && ['Delivered', 'Completed'].includes(listing.status)
  );

  const saveTransition = (listingId, action) => {
    const existingListing = listings.find((listing) => listing.id === listingId);
    const result = transitionReceiverListing(
      existingListing,
      action,
      receiver,
      Number(receivedQuantities[listingId] ?? existingListing?.quantity)
    );
    if (result.error) {
      setMessage(result.error);
      return;
    }

    const nextListings = listings.map((listing) => listing.id === listingId ? result.listing : listing);
    localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(nextListings));
    setListings(nextListings);
    setMessage('Redistribution record updated. The provider can see the latest status.');
  };

  const handlePickupSelection = (listingId, checked) => {
    setSelectedPickupIds((current) => checked
      ? [...new Set([...current, listingId])]
      : current.filter((id) => id !== listingId));
  };

  const handlePlanPickupRoute = () => {
    const selectedListings = acceptedPickups.filter((listing) => selectedPickupIds.includes(listing.id));
    const result = planDemoPickupRoute({
      listings: selectedListings,
      receiver,
      transportMode,
      pickupWindow,
      contactName: pickupContactName,
      contactPhone: pickupContactPhone
    });
    if (result.error) {
      setMessage(result.error);
      return;
    }

    const route = { ...result.route, handoffMethod };
    const nextRoutes = [route, ...routePlans];
    const nextListings = listings.map((listing) => selectedPickupIds.includes(listing.id) && listing.status === 'Accepted'
      ? {
        ...listing,
        status: 'Pickup scheduled',
        routeId: route.id,
        handoffMethod,
        transportMode,
        pickupWindow,
        pickupContactName,
        pickupContactPhone,
        pickupScheduledAt: route.createdAt
      }
      : listing);
    localStorage.setItem(ROUTES_STORAGE_KEY, JSON.stringify(nextRoutes));
    localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(nextListings));
    setRoutePlans(nextRoutes);
    setListings(nextListings);
    setSelectedPickupIds([]);
    setMessage(`Demo route planned for ${route.stops.length} pickup(s). Distance and ETA are estimates from demo coordinates.`);
  };

  const views = [
    { id: 'available', label: 'Available', count: matchingListings.length },
    { id: 'requests', label: 'Requests', count: receiverRequests.length },
    { id: 'pickups', label: 'Pickups', count: activePickups.length },
    { id: 'history', label: 'History', count: completedListings.length }
  ];

  const renderListing = (listing) => (
    <article key={listing.id} className="card-clean space-y-3 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">{listing.foodName}</h3>
          <p className="mt-1 text-xs capitalize text-slate-600">{listing.foodCategory || 'Food category not specified'} · {listing.quantity} {listing.quantityUnit || 'reported units'}</p>
        </div>
        <span className="rounded-md bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-800">{listing.status}</span>
      </div>
      <div className="grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
        <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 shrink-0" />{listing.location}</p>
        <p className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 shrink-0" />Pickup by {new Date(listing.availableUntil).toLocaleString()}</p>
      </div>
      <p className="text-[11px] text-slate-500">
        Prepared {new Date(listing.preparedAt).toLocaleString()} · Storage reading {listing.temperatureC}°C · Provider recorded safety and quality checks.
      </p>

      {activeView === 'available' && (
        <button type="button" onClick={() => saveTransition(listing.id, 'request')} className="btn-primary justify-center text-xs">
          <HandHeart className="h-4 w-4" /> Request pickup
        </button>
      )}

      {activeView === 'requests' && listing.requestedBy === 'provider' && (
        <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
          <button type="button" onClick={() => saveTransition(listing.id, 'accept')} className="btn-primary justify-center text-xs">
            <CheckCircle2 className="h-4 w-4" /> Accept offer
          </button>
          <button type="button" onClick={() => saveTransition(listing.id, 'decline')} className="btn-secondary justify-center text-xs">Decline</button>
        </div>
      )}

      {activeView === 'requests' && listing.requestedBy === 'receiver' && (
        <p className="border-t border-slate-100 pt-3 text-xs text-slate-600">Pickup request sent. Waiting for the provider to accept.</p>
      )}

      {activeView === 'pickups' && listing.status === 'Accepted' && (
        <label className="flex items-start gap-2 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-700">
          <input type="checkbox" checked={selectedPickupIds.includes(listing.id)} onChange={(event) => handlePickupSelection(listing.id, event.target.checked)} className="mt-0.5" />
          <span>Add this accepted offer to the pickup route.</span>
        </label>
      )}

      {activeView === 'pickups' && listing.status === 'Pickup scheduled' && (
        <div className="space-y-2 border-t border-slate-100 pt-3">
          <p className="text-[11px] text-slate-600">Pickup {listing.pickupWindow ? new Date(listing.pickupWindow).toLocaleString() : 'time not set'} · {listing.handoffMethod === 'provider-delivery' ? 'Provider delivery' : 'Receiver pickup'} · Contact {listing.pickupContactName || 'not set'} ({listing.pickupContactPhone || 'not set'})</p>
          <label className="block max-w-xs space-y-1 text-xs font-semibold text-slate-700">
            <span>Quantity received (portions)</span>
            <input
              type="number"
              min="1"
              max={listing.quantity}
              value={receivedQuantities[listing.id] ?? listing.quantity}
              onChange={(event) => setReceivedQuantities((current) => ({ ...current, [listing.id]: event.target.value === '' ? '' : Number(event.target.value) }))}
              className="w-full"
            />
          </label>
          <button type="button" onClick={() => saveTransition(listing.id, 'receive')} className="btn-primary justify-center text-xs">
            <PackageCheck className="h-4 w-4" /> Confirm food received
          </button>
        </div>
      )}

      {activeView === 'history' && (
        <p className="border-t border-slate-100 pt-3 text-xs text-slate-600">
          Received {listing.receivedQuantity ?? listing.quantity} of {listing.quantity} portions · {listing.receivedAt ? new Date(listing.receivedAt).toLocaleString() : 'Provider completion pending'}
        </p>
      )}
    </article>
  );

  const visibleListings = activeView === 'available'
    ? matchingListings
    : activeView === 'requests'
      ? receiverRequests
      : activeView === 'pickups'
        ? activePickups
        : completedListings;
    const selectedPickupListings = acceptedPickups.filter((listing) => selectedPickupIds.includes(listing.id));

  return (
    <section className="space-y-5" aria-labelledby="receiver-portal-title">
      <header className="flex flex-col gap-4 rounded-xl bg-emerald-900 p-5 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-semibold text-emerald-200">Food Redistribution Network</span>
          <h1 id="receiver-portal-title" className="mt-1 text-xl font-bold">{receiver.name}</h1>
          <p className="mt-1 text-xs text-emerald-100">Service area: {receiver.serviceZones.join(', ')} · Capacity up to {receiver.maxPortions} portions</p>
        </div>
        <button type="button" onClick={onLogout} className="btn-secondary justify-center border-white/30 bg-white/10 text-white hover:bg-white/20">
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Matching offers', value: matchingListings.length },
          { label: 'Open requests', value: receiverRequests.length },
          { label: 'Active pickups', value: activePickups.length },
          { label: 'Received listings', value: completedListings.length }
        ].map((metric) => (
          <div key={metric.label} className="card-clean p-4">
            <span className="block text-xs font-semibold text-slate-500">{metric.label}</span>
            <span className="mt-1 block text-2xl font-extrabold text-slate-900">{metric.value}</span>
          </div>
        ))}
      </div>

      <section className="space-y-4">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3" role="tablist" aria-label="Receiver listings">
          {views.map((view) => (
            <button
              key={view.id}
              type="button"
              role="tab"
              aria-selected={activeView === view.id}
              onClick={() => { setActiveView(view.id); setMessage(''); }}
              className={`rounded-lg px-3 py-2 text-xs font-bold ${activeView === view.id ? 'bg-emerald-700 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
            >
              {view.label} ({view.count})
            </button>
          ))}
        </div>

        {activeView === 'available' && (
          <div className="grid gap-3 rounded-lg bg-slate-50 p-3 sm:grid-cols-2">
            <label className="space-y-1 text-xs font-semibold text-slate-700"><span>Food category</span><select value={foodCategoryFilter} onChange={(event) => setFoodCategoryFilter(event.target.value)} className="w-full"><option value="all">All accepted types</option><option value="vegetarian">Vegetarian</option><option value="non-vegetarian">Non-vegetarian</option><option value="packaged">Packaged / sealed</option></select></label>
            <label className="space-y-1 text-xs font-semibold text-slate-700"><span>Service zone</span><select value={serviceZoneFilter} onChange={(event) => setServiceZoneFilter(event.target.value)} className="w-full"><option value="all">All service zones</option>{receiver.serviceZones.map((zone) => <option key={zone} value={zone}>{zone}</option>)}</select></label>
          </div>
        )}

        {message && <p role="status" className="rounded-lg bg-slate-100 p-3 text-xs font-semibold text-slate-700">{message}</p>}
        {visibleListings.length === 0 ? (
          <div className="card-clean p-6 text-sm text-slate-600">No listings in this view right now.</div>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">{visibleListings.map(renderListing)}</div>
        )}
      </section>

      {activeView === 'pickups' && (
        <section className="space-y-4">
          <div className="card-clean space-y-4 p-4">
            <div className="flex items-center gap-2"><Route className="h-4 w-4 text-emerald-700" /><h2 className="text-sm font-bold text-slate-900">Pickup and delivery planning</h2></div>
            <p className="text-xs text-slate-600">Choose accepted offers above. The demo orders stops by nearest-next pickup using configured coordinates; road distance and ETA are estimates, not live navigation.</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <label className="space-y-1 text-xs font-semibold text-slate-700"><span>Pickup window</span><input type="datetime-local" value={pickupWindow} onChange={(event) => setPickupWindow(event.target.value)} className="w-full" /></label>
              <label className="space-y-1 text-xs font-semibold text-slate-700"><span>Transport mode</span><select value={transportMode} onChange={(event) => setTransportMode(event.target.value)} className="w-full"><option value="van">Van</option><option value="car">Car</option><option value="bicycle">Bicycle</option><option value="walking">Walking</option></select></label>
              <label className="space-y-1 text-xs font-semibold text-slate-700"><span>Handoff method</span><select value={handoffMethod} onChange={(event) => setHandoffMethod(event.target.value)} className="w-full"><option value="receiver-pickup">Receiver pickup</option><option value="provider-delivery">Provider delivery</option></select></label>
              <label className="space-y-1 text-xs font-semibold text-slate-700"><span>Pickup contact</span><input type="text" value={pickupContactName} onChange={(event) => setPickupContactName(event.target.value)} className="w-full" /></label>
              <label className="space-y-1 text-xs font-semibold text-slate-700"><span>Contact phone</span><input type="tel" value={pickupContactPhone} onChange={(event) => setPickupContactPhone(event.target.value)} className="w-full" /></label>
            </div>
            <button type="button" onClick={handlePlanPickupRoute} disabled={!selectedPickupListings.length} className="btn-primary justify-center text-xs disabled:cursor-not-allowed disabled:opacity-50"><Truck className="h-4 w-4" /> Plan selected pickup route ({selectedPickupListings.length})</button>
          </div>

          {routePlans.filter((route) => route.receiverId === receiver.id).map((route) => (
            <article key={route.id} className="card-clean space-y-3 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><h3 className="text-sm font-bold text-slate-900">Route plan · {route.transportMode} · {route.stops.length} stops</h3><p className="mt-1 text-xs text-slate-600">{route.estimatedDistanceKm} estimated km · {route.estimatedEtaMinutes} estimated minutes · {new Date(route.pickupWindow).toLocaleString()}</p></div>
                <span className="rounded-md bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-900">{route.status} · Demo route</span>
              </div>
              <DemoRouteMap route={route} />
              <ol className="grid gap-2 sm:grid-cols-2">{route.stops.map((stop, index) => <li key={stop.listingId} className="rounded-lg bg-slate-50 p-3 text-xs"><strong>{index + 1}. {stop.name}</strong><span className="block text-slate-600">{stop.foodName} · {stop.quantity} {stop.quantityUnit}</span></li>)}</ol>
              <p className="text-[10px] text-slate-500">{route.source} · Contact: {route.contactName} ({route.contactPhone}) · {route.handoffMethod === 'provider-delivery' ? 'Provider delivery' : 'Receiver pickup'}</p>
            </article>
          ))}
        </section>
      )}
      <p className="text-[11px] text-slate-500">Demo workflow: availability is matched using configured zones, food category, and portion capacity. Coordinate the real pickup with the provider; no live notification or route service is connected.</p>
    </section>
  );
}

function readRoutes() {
  try {
    const routes = JSON.parse(localStorage.getItem(ROUTES_STORAGE_KEY) || '[]');
    return Array.isArray(routes) ? routes : [];
  } catch {
    return [];
  }
}