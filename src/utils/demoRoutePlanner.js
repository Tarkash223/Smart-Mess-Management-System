const DEMO_LOCATIONS = [
  { match: 'central mess', name: 'Central Mess A', latitude: 25.2382, longitude: 87.0719 },
  { match: 'sabour auditorium', name: 'Sabour Auditorium', latitude: 25.2366, longitude: 87.0701 },
  { match: 'conference hall', name: 'Sabour Conference Hall', latitude: 25.2374, longitude: 87.0692 },
  { match: 'innovation centre', name: 'Bhagalpur Innovation Centre', latitude: 25.2428, longitude: 86.9841 },
  { match: 'smart bites demo', name: 'Smart Bites Demo', latitude: 25.2318, longitude: 87.0634 },
  { match: 'sabour', name: 'Sabour Campus', latitude: 25.236, longitude: 87.067 },
  { match: 'bhagalpur', name: 'Bhagalpur', latitude: 25.242, longitude: 86.984 }
];

const MODE_SPEED_KMH = { van: 25, car: 32, bicycle: 14, walking: 4 };

export function resolveDemoRouteLocation(location) {
  const normalized = location?.toLowerCase() || '';
  const match = DEMO_LOCATIONS.find((item) => normalized.includes(item.match));
  return match
    ? { name: match.name, latitude: match.latitude, longitude: match.longitude }
    : null;
}

function haversineKm(first, second) {
  const radians = (degrees) => degrees * (Math.PI / 180);
  const latitudeDelta = radians(second.latitude - first.latitude);
  const longitudeDelta = radians(second.longitude - first.longitude);
  const arc = Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(radians(first.latitude)) * Math.cos(radians(second.latitude)) * Math.sin(longitudeDelta / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(arc), Math.sqrt(1 - arc));
}

export function planDemoPickupRoute({ listings, receiver, transportMode, pickupWindow, contactName, contactPhone, now = Date.now() }) {
  if (!Array.isArray(listings) || listings.length === 0) return { error: 'Select at least one accepted pickup.' };
  if (!receiver || !Number.isFinite(receiver.latitude) || !Number.isFinite(receiver.longitude)) {
    return { error: 'This receiver has no configured demo destination coordinates.' };
  }
  if (!MODE_SPEED_KMH[transportMode]) return { error: 'Choose a supported demo transport mode.' };
  if (!contactName?.trim() || !contactPhone?.trim() || !pickupWindow) {
    return { error: 'Enter pickup contact name, phone, and time window.' };
  }
  const pickupTimestamp = new Date(pickupWindow).getTime();
  if (!Number.isFinite(pickupTimestamp) || pickupTimestamp <= now) {
    return { error: 'Choose a pickup time in the future.' };
  }
  if (listings.some((listing) => pickupTimestamp > new Date(listing.availableUntil).getTime())) {
    return { error: 'The selected pickup time is later than at least one food availability deadline.' };
  }

  const stops = listings.map((listing) => {
    const point = resolveDemoRouteLocation(listing.location);
    return point ? { ...point, listingId: listing.id, foodName: listing.foodName, quantity: listing.quantity, quantityUnit: listing.quantityUnit || 'reported units' } : null;
  });
  if (stops.some((stop) => !stop)) return { error: 'At least one pickup location has no demo map coordinates.' };
  if (listings.some((listing) => listing.status !== 'Accepted' || listing.receiverId !== receiver.id)) {
    return { error: 'Only pickups accepted by this receiver can be planned.' };
  }

  let currentPoint = { latitude: receiver.latitude, longitude: receiver.longitude };
  const remaining = [...stops];
  const orderedStops = [];
  while (remaining.length) {
    let closestIndex = 0;
    let closestDistance = haversineKm(currentPoint, remaining[0]);
    for (let index = 1; index < remaining.length; index += 1) {
      const distance = haversineKm(currentPoint, remaining[index]);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    }
    const [nextStop] = remaining.splice(closestIndex, 1);
    orderedStops.push(nextStop);
    currentPoint = nextStop;
  }

  const path = [
    { name: receiver.name, latitude: receiver.latitude, longitude: receiver.longitude, type: 'receiver' },
    ...orderedStops.map((stop) => ({ ...stop, type: 'pickup' })),
    { name: `${receiver.name} return`, latitude: receiver.latitude, longitude: receiver.longitude, type: 'receiver' }
  ];
  const straightLineKm = path.slice(1).reduce((total, point, index) => total + haversineKm(path[index], point), 0);
  const estimatedDistanceKm = Number((straightLineKm * 1.3).toFixed(1));
  const estimatedTravelMinutes = Math.ceil((estimatedDistanceKm / MODE_SPEED_KMH[transportMode]) * 60);
  const estimatedEtaMinutes = estimatedTravelMinutes + (orderedStops.length * 8);

  return {
    route: {
      id: `DEMO-ROUTE-${Date.now()}`,
      receiverId: receiver.id,
      receiverName: receiver.name,
      transportMode,
      pickupWindow,
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
      stops: orderedStops,
      path,
      estimatedDistanceKm,
      estimatedEtaMinutes,
      source: 'SIMULATED ROUTE - DEMO COORDINATES AND STRAIGHT-LINE DISTANCE FACTOR',
      status: 'Planned',
      createdAt: new Date().toISOString(),
      demoData: true
    }
  };
}
