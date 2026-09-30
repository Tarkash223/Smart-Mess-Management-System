export function transitionReceiverListing(listing, action, receiver, receivedQuantity, now = Date.now()) {
  if (!listing) return { error: 'This surplus listing could not be found.' };

  if (action === 'request') {
    const availableUntil = new Date(listing.availableUntil).getTime();
    if (listing.status !== 'Available' || !listing.safetyVerified || !listing.qualityVerified || availableUntil <= now) {
      return { error: 'This listing is no longer available or has not passed its required checks.' };
    }
    return {
      listing: {
        ...listing,
        status: 'Requested',
        receiverId: receiver.id,
        receiverName: receiver.name,
        requestedBy: 'receiver',
        requestedAt: new Date(now).toISOString()
      }
    };
  }

  if (listing.receiverId !== receiver.id) return { error: 'This listing is assigned to another receiver.' };

  if (action === 'accept' && listing.status === 'Requested' && listing.requestedBy === 'provider') {
    return { listing: { ...listing, status: 'Accepted', acceptedAt: new Date(now).toISOString() } };
  }

  if (action === 'decline' && listing.status === 'Requested' && listing.requestedBy === 'provider') {
    const { receiverId, receiverName, requestedAt, requestedBy, ...availableListing } = listing;
    return { listing: { ...availableListing, status: 'Available' } };
  }

  if (action === 'schedule' && listing.status === 'Accepted') {
    return { listing: { ...listing, status: 'Pickup scheduled', pickupScheduledAt: new Date(now).toISOString() } };
  }

  if (action === 'receive' && listing.status === 'Pickup scheduled') {
    if (!Number.isInteger(receivedQuantity) || receivedQuantity < 1 || receivedQuantity > listing.quantity) {
      return { error: `Enter a received quantity from 1 to ${listing.quantity}.` };
    }
    return {
      listing: {
        ...listing,
        status: 'Delivered',
        receivedQuantity,
        receivedAt: new Date(now).toISOString()
      }
    };
  }

  return { error: 'That action is not available for the current listing status.' };
}