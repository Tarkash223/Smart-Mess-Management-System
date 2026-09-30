export function getSurplusListingValidationMessage(listing, now = Date.now()) {
  if (!listing.foodName?.trim()) return 'Enter the food item before listing surplus.';
  if (!Number.isInteger(listing.quantity) || listing.quantity < 1) return 'There are no eligible portions available to list.';
  if (!listing.location?.trim()) return 'Enter a pickup location.';
  if (listing.temperatureC === '' || !Number.isFinite(Number(listing.temperatureC))) return 'Enter the measured storage temperature.';

  const preparedAt = new Date(listing.preparedAt).getTime();
  const availableUntil = new Date(listing.availableUntil).getTime();
  if (!Number.isFinite(preparedAt) || preparedAt > now) return 'Enter a valid preparation time that is not in the future.';
  if (!Number.isFinite(availableUntil) || availableUntil <= now || availableUntil <= preparedAt) {
    return 'Availability must end after preparation and in the future.';
  }
  if (!listing.safetyVerified) return 'Verify time and temperature handling against applicable food-safety rules first.';
  if (!listing.qualityVerified) return 'Confirm the food quality and handling inspection first.';
  return '';
}