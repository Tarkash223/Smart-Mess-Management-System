export const DEMO_BUSINESS_PRODUCTS = [
  {
    id: 'demo-chicken-biryani',
    name: 'Chicken Biryani',
    category: 'non-vegetarian',
    baselineOrders: 120,
    ingredients: [
      { name: 'Rice', quantityPerOrder: 0.18, unit: 'kg' },
      { name: 'Chicken', quantityPerOrder: 0.12, unit: 'kg' }
    ]
  },
  {
    id: 'demo-veg-biryani',
    name: 'Vegetable Biryani',
    category: 'vegetarian',
    baselineOrders: 80,
    ingredients: [
      { name: 'Rice', quantityPerOrder: 0.16, unit: 'kg' },
      { name: 'Mixed vegetables', quantityPerOrder: 0.1, unit: 'kg' }
    ]
  },
  {
    id: 'demo-paneer-wrap',
    name: 'Paneer Wrap',
    category: 'vegetarian',
    baselineOrders: 55,
    ingredients: [
      { name: 'Paneer', quantityPerOrder: 0.08, unit: 'kg' },
      { name: 'Flatbread', quantityPerOrder: 1, unit: 'unit' }
    ]
  }
];

const PLATFORM_DEMO_STORES = {
  smartmess_meal_operations_v1: 'object',
  smartmess_catering_events_v1: 'array',
  smartmess_business_products_v1: 'array',
  smartmess_business_records_v1: 'array',
  smartmess_processing_batches_v1: 'array',
  smartmess_processing_sensor_readings_v1: 'array',
  smartmess_processing_sensor_devices_v1: 'array',
  smartmess_processing_quality_reviews_v1: 'array',
  smartmess_surplus_listings_v1: 'array',
  smartmess_demo_routes_v1: 'array',
  smartmess_platform_carbon_factor_v1: 'object'
};
const DEMO_DATA_VERSION_KEY = 'smartmess_demo_data_version_v1';
const DEMO_DATA_VERSION = 3;

function dateAtOffset(now, days) {
  const date = new Date(now);
  date.setDate(date.getDate() + days);
  return date;
}

function isoAtOffset(now, hours) {
  return new Date(now + (hours * 60 * 60 * 1000)).toISOString();
}

function buildBusinessRecords(now) {
  const records = [];
  for (let dayOffset = -7; dayOffset <= 0; dayOffset += 1) {
    for (const product of DEMO_BUSINESS_PRODUCTS) {
      const trend = 0.82 + ((dayOffset + 7) * 0.035);
      const sold = Math.round(product.baselineOrders * trend);
      const unsold = 4 + ((dayOffset + product.id.length) % 5);
      const waste = 1 + ((dayOffset + product.name.length) % 3);
      records.push({
        id: `DEMO-SALE-${product.id}-${dateAtOffset(now, dayOffset).toISOString().slice(0, 10)}-lunch`,
        productId: product.id,
        productName: product.name,
        category: product.category,
        date: dateAtOffset(now, dayOffset).toISOString().slice(0, 10),
        timeSlot: 'lunch',
        prepared: sold + unsold,
        sold,
        unsold,
        waste: Math.min(waste, unsold),
        redistributable: Math.max(0, unsold - waste),
        forecastOrders: Math.max(0, sold - 2),
        forecastBasis: 'simulated demo history',
        location: 'Smart Bites Demo, Sabour',
        recordedAt: dateAtOffset(now, dayOffset).toISOString(),
        surplusListingId: null,
        demoData: true
      });
    }
  }
  return records;
}

export function createPlatformDemoData(now = Date.now()) {
  const eventOneDate = dateAtOffset(now, -7);
  const eventTwoDate = dateAtOffset(now, -14);
  const upcomingDate = dateAtOffset(now, 2);
  const completedListingId = 'DEMO-SURPLUS-CATERING-COMPLETE';
  const businessRecords = buildBusinessRecords(now);
  const currentBusinessRecord = businessRecords.find((record) => record.productId === 'demo-paneer-wrap' && record.date === dateAtOffset(now, 0).toISOString().slice(0, 10));

  const eventOne = {
    id: 'DEMO-CAT-EVENT-1',
    title: 'Regional Skills Summit Lunch',
    eventType: 'conference',
    organizationName: 'Smart Catering Demo',
    location: 'Sabour Conference Hall',
    eventAt: new Date(eventOneDate.setHours(12, 30, 0, 0)).toISOString(),
    expectedGuests: 240,
    status: 'Completed',
    forecast: { predictedConsumption: 221, recommendedPreparation: 230, comparableEventCount: 0, basis: 'simulated demo event' },
    items: [
      { id: 'DEMO-CAT-ITEM-1', name: 'Vegetable Pulao', foodCategory: 'vegetarian', predictedConsumption: 220, recommendedPreparation: 230, approvedPreparation: 230, outcome: { prepared: 230, consumed: 219, remaining: 11, waste: 3, surplus: 8, recordedAt: isoAtOffset(now, -160) }, surplusListingId: completedListingId, demoData: true },
      { id: 'DEMO-CAT-ITEM-2', name: 'Dal Tadka', foodCategory: 'vegetarian', predictedConsumption: 222, recommendedPreparation: 232, approvedPreparation: 232, outcome: { prepared: 232, consumed: 222, remaining: 10, waste: 2, surplus: 8, recordedAt: isoAtOffset(now, -160) }, demoData: true }
    ],
    feedback: { taste: 4, quality: 5, quantity: 4, overall: 4, demoData: true }
  };
  const eventTwo = {
    id: 'DEMO-CAT-EVENT-2',
    title: 'Corporate Team Workshop Breakfast',
    eventType: 'conference',
    organizationName: 'Smart Catering Demo',
    location: 'Bhagalpur Innovation Centre',
    eventAt: new Date(eventTwoDate.setHours(8, 0, 0, 0)).toISOString(),
    expectedGuests: 180,
    status: 'Completed',
    forecast: { predictedConsumption: 166, recommendedPreparation: 174, comparableEventCount: 0, basis: 'simulated demo event' },
    items: [
      { id: 'DEMO-CAT-ITEM-3', name: 'Poha and fruit', foodCategory: 'vegetarian', predictedConsumption: 165, recommendedPreparation: 174, approvedPreparation: 174, outcome: { prepared: 174, consumed: 163, remaining: 11, waste: 2, surplus: 9, recordedAt: isoAtOffset(now, -330) }, demoData: true },
      { id: 'DEMO-CAT-ITEM-4', name: 'Sealed juice packs', foodCategory: 'packaged', predictedConsumption: 168, recommendedPreparation: 177, approvedPreparation: 177, outcome: { prepared: 177, consumed: 168, remaining: 9, waste: 1, surplus: 8, recordedAt: isoAtOffset(now, -330) }, demoData: true }
    ],
    feedback: { taste: 4, quality: 4, quantity: 5, overall: 4, demoData: true }
  };
  const upcomingEvent = {
    id: 'DEMO-CAT-EVENT-3',
    title: 'Campus Research Symposium',
    eventType: 'conference',
    organizationName: 'Smart Catering Demo',
    location: 'Sabour Auditorium',
    eventAt: new Date(upcomingDate.setHours(12, 0, 0, 0)).toISOString(),
    expectedGuests: 320,
    status: 'Planned',
    forecast: { predictedConsumption: 295, recommendedPreparation: 307, comparableEventCount: 2, basis: 'simulated comparable conference events' },
    items: [
      { id: 'DEMO-CAT-ITEM-5', name: 'Seasonal veg thali', foodCategory: 'vegetarian', predictedConsumption: 295, recommendedPreparation: 307, approvedPreparation: null, outcome: null, demoData: true },
      { id: 'DEMO-CAT-ITEM-6', name: 'Fruit cups', foodCategory: 'vegetarian', predictedConsumption: 295, recommendedPreparation: 307, approvedPreparation: null, outcome: null, demoData: true }
    ],
    demoData: true
  };

  const completedSurplus = {
    id: completedListingId,
    foodName: 'Vegetable Pulao',
    foodCategory: 'vegetarian',
    quantity: 8,
    quantityUnit: 'portions',
    receivedQuantity: 7,
    sourceSector: 'catering',
    sourceEventId: eventOne.id,
    sourceOrganization: 'Smart Catering Demo',
    location: 'Sabour Conference Hall',
    preparedAt: isoAtOffset(now, -162),
    availableUntil: isoAtOffset(now, -156),
    temperatureC: 4.2,
    safetyVerified: true,
    qualityVerified: true,
    status: 'Completed',
    receiverId: 'bhagalpur-community-kitchen',
    receiverName: 'Bhagalpur Community Kitchen',
    requestedBy: 'receiver',
    createdAt: isoAtOffset(now, -161),
    verifiedByRole: 'Catering Manager',
    demoData: true
  };
  const availableInstitutionSurplus = {
    id: 'DEMO-SURPLUS-INSTITUTION-1',
    foodName: 'Seasonal vegetable rice',
    foodCategory: 'vegetarian',
    quantity: 42,
    quantityUnit: 'portions',
    sourceSector: 'institutional',
    sourceOrganization: 'Bihar Institute Demo Campus',
    location: 'Central Mess A, Sabour Main Campus',
    preparedAt: isoAtOffset(now, -1),
    availableUntil: isoAtOffset(now, 5),
    temperatureC: 4.4,
    safetyVerified: true,
    qualityVerified: true,
    status: 'Available',
    createdAt: isoAtOffset(now, -0.5),
    verifiedByRole: 'Mess Manager',
    demoData: true
  };
  const availableCateringSurplus = {
    id: 'DEMO-SURPLUS-CATERING-1',
    foodName: 'Sealed fruit cups',
    foodCategory: 'packaged',
    quantity: 36,
    quantityUnit: 'portions',
    sourceSector: 'catering',
    sourceEventId: eventTwo.id,
    sourceOrganization: 'Smart Catering Demo',
    location: 'Bhagalpur Innovation Centre, Bhagalpur',
    preparedAt: isoAtOffset(now, -0.7),
    availableUntil: isoAtOffset(now, 4),
    temperatureC: 3.8,
    safetyVerified: true,
    qualityVerified: true,
    status: 'Available',
    createdAt: isoAtOffset(now, -0.6),
    verifiedByRole: 'Catering Manager',
    demoData: true
  };
  const availableBusinessSurplus = {
    id: 'DEMO-SURPLUS-BUSINESS-1',
    foodName: 'Paneer Wrap',
    foodCategory: 'vegetarian',
    quantity: currentBusinessRecord?.redistributable || 5,
    quantityUnit: 'item units',
    sourceSector: 'food-business',
    sourceRecordId: currentBusinessRecord?.id,
    sourceOrganization: 'Smart Bites Demo',
    location: 'Smart Bites Demo, Sabour',
    preparedAt: isoAtOffset(now, -0.4),
    availableUntil: isoAtOffset(now, 3),
    temperatureC: 4.1,
    safetyVerified: true,
    qualityVerified: true,
    status: 'Available',
    createdAt: isoAtOffset(now, -0.3),
    verifiedByRole: 'Business Manager',
    demoData: true
  };
  const acceptedInstitutionPickup = {
    id: 'DEMO-SURPLUS-ACCEPTED-INSTITUTION',
    foodName: 'Khichdi and seasonal vegetables',
    foodCategory: 'vegetarian',
    quantity: 28,
    quantityUnit: 'portions',
    sourceSector: 'institutional',
    sourceOrganization: 'Bihar Institute Demo Campus',
    location: 'Central Mess A, Sabour Main Campus',
    preparedAt: isoAtOffset(now, -0.8),
    availableUntil: isoAtOffset(now, 4),
    temperatureC: 4.1,
    safetyVerified: true,
    qualityVerified: true,
    status: 'Accepted',
    receiverId: 'bhagalpur-community-kitchen',
    receiverName: 'Bhagalpur Community Kitchen',
    requestedBy: 'provider',
    createdAt: isoAtOffset(now, -0.7),
    acceptedAt: isoAtOffset(now, -0.5),
    verifiedByRole: 'Mess Manager',
    demoData: true
  };
  const acceptedCateringPickup = {
    id: 'DEMO-SURPLUS-ACCEPTED-CATERING',
    foodName: 'Dal Tadka',
    foodCategory: 'vegetarian',
    quantity: 18,
    quantityUnit: 'portions',
    sourceSector: 'catering',
    sourceEventId: eventOne.id,
    sourceOrganization: 'Smart Catering Demo',
    location: 'Sabour Conference Hall',
    preparedAt: isoAtOffset(now, -0.6),
    availableUntil: isoAtOffset(now, 5),
    temperatureC: 4.3,
    safetyVerified: true,
    qualityVerified: true,
    status: 'Accepted',
    receiverId: 'bhagalpur-community-kitchen',
    receiverName: 'Bhagalpur Community Kitchen',
    requestedBy: 'receiver',
    requestedAt: isoAtOffset(now, -0.5),
    acceptedAt: isoAtOffset(now, -0.3),
    verifiedByRole: 'Catering Manager',
    demoData: true
  };

  const eventOneSurplus = eventOne.items.find((item) => item.id === 'DEMO-CAT-ITEM-1');
  eventOneSurplus.surplusListingId = completedListingId;
  if (currentBusinessRecord) currentBusinessRecord.surplusListingId = availableBusinessSurplus.id;

  return {
    smartmess_meal_operations_v1: {
      breakfast: { prepared: 108, consumed: 99, remaining: 9, waste: 2, outcomeRecordedAt: isoAtOffset(now, -10), demoData: true },
      lunch: { prepared: 112, consumed: 104, remaining: 8, waste: 2, outcomeRecordedAt: isoAtOffset(now, -6), demoData: true },
      dinner: { prepared: 106, consumed: 101, remaining: 5, waste: 1, outcomeRecordedAt: isoAtOffset(now, -2), demoData: true }
    },
    smartmess_catering_events_v1: [eventOne, eventTwo, upcomingEvent],
    smartmess_business_products_v1: DEMO_BUSINESS_PRODUCTS.map((product) => ({ ...product, demoData: true })),
    smartmess_business_records_v1: businessRecords,
    smartmess_processing_batches_v1: [
      {
        id: 'DEMO-PLANT-BATCH-1',
        batchCode: 'DEMO-PASTA-042',
        productName: 'Tomato Passata 500ml',
        plannedOutput: 500,
        outputUnit: 'units',
        expectedMaterial: 210,
        materialUnit: 'kg',
        materialTolerancePercent: 5,
        minTemperatureC: 2,
        maxTemperatureC: 6,
        minHumidityPercent: 35,
        maxHumidityPercent: 60,
        downtimeAlertPercent: 10,
        actualMaterialUsed: 216,
        actualOutput: 480,
        machineOperatingMinutes: 400,
        machineDowntimeMinutes: 20,
        affectedOutput: 12,
        energyKwh: 230,
        waterLitres: 140,
        storageTemperatureC: 4.2,
        storageHumidityPercent: 48,
        visualQualityStatus: 'clear',
        qualityNotes: 'Demo operator check completed.',
        actualsRecordedAt: isoAtOffset(now, -80),
        status: 'Actuals recorded',
        demoData: true
      },
      {
        id: 'DEMO-PLANT-BATCH-2',
        batchCode: 'DEMO-MEAL-117',
        productName: 'Ready Meal Tray',
        plannedOutput: 320,
        outputUnit: 'units',
        expectedMaterial: 150,
        materialUnit: 'kg',
        materialTolerancePercent: 5,
        minTemperatureC: 2,
        maxTemperatureC: 8,
        minHumidityPercent: 30,
        maxHumidityPercent: 60,
        downtimeAlertPercent: 12,
        actualMaterialUsed: 160,
        actualOutput: 300,
        machineOperatingMinutes: 300,
        machineDowntimeMinutes: 65,
        affectedOutput: 38,
        energyKwh: null,
        waterLitres: 95,
        storageTemperatureC: 9.1,
        storageHumidityPercent: 66,
        visualQualityStatus: 'concern',
        qualityNotes: 'Visible packaging-seal concern. QA hold for demo.',
        actualsRecordedAt: isoAtOffset(now, -30),
        status: 'Actuals recorded',
        demoData: true
      }
    ],
    smartmess_processing_sensor_readings_v1: [
      { id: 'DEMO-SIM-TEMP-1', batchId: 'DEMO-PLANT-BATCH-1', batchCode: 'DEMO-PASTA-042', productName: 'Tomato Passata 500ml', temperatureC: 4, humidityPercent: 47.5, profile: 'normal', profileLabel: 'Within configured range', source: 'SIMULATED DEMO DATA - NOT FROM HARDWARE', recordedAt: isoAtOffset(now, -4), demoData: true },
      { id: 'DEMO-SIM-TEMP-2', batchId: 'DEMO-PLANT-BATCH-2', batchCode: 'DEMO-MEAL-117', productName: 'Ready Meal Tray', temperatureC: 10, humidityPercent: 65, profile: 'combined-excursion', profileLabel: 'Combined excursion', source: 'SIMULATED DEMO DATA - NOT FROM HARDWARE', recordedAt: isoAtOffset(now, -1), demoData: true }
    ],
    smartmess_processing_sensor_devices_v1: [
      { id: 'SIM-SENSOR-PASTA-01', batchId: 'DEMO-PLANT-BATCH-1', batchCode: 'DEMO-PASTA-042', label: 'Cold room probe A', connected: true, batteryPercent: 92, signalPercent: 88, samplingIntervalSeconds: 60, lastSeenAt: isoAtOffset(now, -4), source: 'SIMULATED DEVICE STATUS', demoData: true },
      { id: 'SIM-SENSOR-MEAL-02', batchId: 'DEMO-PLANT-BATCH-2', batchCode: 'DEMO-MEAL-117', label: 'Holding area probe B', connected: true, batteryPercent: 67, signalPercent: 74, samplingIntervalSeconds: 30, lastSeenAt: isoAtOffset(now, -1), source: 'SIMULATED DEVICE STATUS', demoData: true }
    ],
    smartmess_processing_quality_reviews_v1: [
      { id: 'DEMO-CV-PASTA-001', batchId: 'DEMO-PLANT-BATCH-1', batchCode: 'DEMO-PASTA-042', productName: 'Tomato Passata 500ml', imageFileName: 'demo-passata-surface.jpg', scenario: 'clear', classification: 'No obvious visible defect', severity: 'low', confidence: 0.96, cues: ['Surface appears uniform in this simulated result.'], disposition: 'accepted-after-inspection', source: 'SIMULATED CLASSIFIER RESULT - IMAGE NOT ANALYZED', reviewedAt: isoAtOffset(now, -78), humanReviewedAt: isoAtOffset(now, -76), humanReviewedBy: 'Plant QA demo user', demoData: true },
      { id: 'DEMO-CV-MEAL-002', batchId: 'DEMO-PLANT-BATCH-2', batchCode: 'DEMO-MEAL-117', productName: 'Ready Meal Tray', imageFileName: 'demo-seal-edge.jpg', scenario: 'seal-defect', classification: 'Possible package seal defect', severity: 'review', confidence: 0.89, cues: ['Seal-edge irregularity flagged for human inspection.'], disposition: 'hold-for-qa', source: 'SIMULATED CLASSIFIER RESULT - IMAGE NOT ANALYZED', reviewedAt: isoAtOffset(now, -28), demoData: true }
    ],
    smartmess_surplus_listings_v1: [
      completedSurplus,
      availableInstitutionSurplus,
      availableCateringSurplus,
      availableBusinessSurplus,
      acceptedInstitutionPickup,
      acceptedCateringPickup
    ],
    smartmess_demo_routes_v1: [],
    smartmess_platform_carbon_factor_v1: {
      value: 0.35,
      unitDefinition: 'portions',
      source: 'Illustrative demo assumption; replace with an approved lifecycle methodology.',
      demoData: true
    }
  };
}

export function ensureDemoPlatformData(storage = globalThis.localStorage, now = Date.now()) {
  const data = createPlatformDemoData(now);
  const currentVersion = Number(storage.getItem(DEMO_DATA_VERSION_KEY) || 0);
  if (currentVersion >= DEMO_DATA_VERSION) return data;

  Object.entries(data).forEach(([key, seed]) => {
    const storedValue = storage.getItem(key);
    if (storedValue) {
      try {
        const parsed = JSON.parse(storedValue);
        if (PLATFORM_DEMO_STORES[key] === 'array' && Array.isArray(parsed)) {
          const existingIds = new Set(parsed.map((item) => item?.id).filter(Boolean));
          const additions = seed.filter((item) => !item.id || !existingIds.has(item.id));
          storage.setItem(key, JSON.stringify([...parsed, ...additions]));
          return;
        }
        if (PLATFORM_DEMO_STORES[key] === 'object' && parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          storage.setItem(key, JSON.stringify({ ...seed, ...parsed }));
          return;
        }
      } catch {
        // Replace malformed demo storage with a valid sample structure.
      }
    }
    storage.setItem(key, JSON.stringify(seed));
  });
  storage.setItem(DEMO_DATA_VERSION_KEY, String(DEMO_DATA_VERSION));
  return data;
}
