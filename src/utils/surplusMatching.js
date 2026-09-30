export function findEligibleReceivers(listing, receivers, now = Date.now()) {
  const location = listing.location?.trim().toLowerCase() || '';
  const availableUntil = new Date(listing.availableUntil).getTime();
  if (
    listing.status !== 'Available' ||
    !listing.safetyVerified ||
    !listing.qualityVerified ||
    !Number.isInteger(listing.quantity) ||
    listing.quantity < 1 ||
    !location ||
    !Number.isFinite(availableUntil) ||
    availableUntil <= now
  ) return [];

  return receivers
    .filter((receiver) => receiver.active)
    .filter((receiver) => receiver.maxPortions >= listing.quantity)
    .filter((receiver) => receiver.acceptedFoodCategories.includes(listing.foodCategory))
    .filter((receiver) => receiver.serviceZones.some((zone) => location.includes(zone.toLowerCase())))
    .sort((first, second) => first.maxPortions - second.maxPortions);
}