// =====================================================
// SMART CITY DASHBOARD — DEMO DATA
// Islamabad & Rawalpindi
// =====================================================

let ZONES = [
  { name: "F-6 (Blue Area)", city: "ISL", aqi: 92, status: "yellow" },
  { name: "F-7 Markaz", city: "ISL", aqi: 78, status: "green" },
  { name: "F-10", city: "ISL", aqi: 85, status: "yellow" },
  { name: "G-9", city: "ISL", aqi: 140, status: "red" },
  { name: "G-11", city: "ISL", aqi: 96, status: "yellow" },
  { name: "I-8", city: "ISL", aqi: 70, status: "green" },
  { name: "Bahria Town", city: "ISL", aqi: 65, status: "green" },
  { name: "DHA Phase 2", city: "ISL", aqi: 74, status: "green" },
  { name: "Saddar", city: "RWP", aqi: 158, status: "red" },
  { name: "Committee Chowk", city: "RWP", aqi: 132, status: "red" },
  { name: "Satellite Town", city: "RWP", aqi: 101, status: "yellow" },
  { name: "Faizabad", city: "RWP", aqi: 145, status: "red" },
  { name: "Chaklala", city: "RWP", aqi: 88, status: "yellow" },
  { name: "Cantt Area", city: "RWP", aqi: 79, status: "green" },
  { name: "Airport Society", city: "RWP", aqi: 82, status: "yellow" }
];

let ROADS = [
  { name: "Srinagar Highway", zone: "ISL", speed: 34, vehicles: 2100, congestion: 42 },
  { name: "Kashmir Highway", zone: "ISL", speed: 28, vehicles: 3400, congestion: 61 },
  { name: "Murree Road", zone: "RWP", speed: 18, vehicles: 4200, congestion: 82 },
  { name: "IJP Road", zone: "ISL/RWP", speed: 22, vehicles: 3900, congestion: 71 },
  { name: "GT Road", zone: "RWP", speed: 25, vehicles: 3600, congestion: 66 },
  { name: "Faizabad Interchange", zone: "ISL/RWP", speed: 15, vehicles: 4700, congestion: 88 },
  { name: "Jinnah Avenue", zone: "ISL", speed: 38, vehicles: 1800, congestion: 33 }
];

const INCIDENTS = [
  { text: "Minor collision reported near Faizabad Interchange", time: "12 min ago", priority: "medium" },
  { text: "Traffic signal malfunction at Committee Chowk", time: "34 min ago", priority: "high" },
  { text: "Road construction slowing traffic on Murree Road", time: "1 hr ago", priority: "low" },
  { text: "Vehicle breakdown on Kashmir Highway, right lane blocked", time: "2 hr ago", priority: "medium" }
];

let ALERTS = [
  { text: "High traffic congestion expected near Faizabad, 5–7 PM", priority: "high", time: "5 min ago" },
  { text: "Poor air quality (AQI 158) recorded in Saddar", priority: "high", time: "18 min ago" },
  { text: "Water supply pressure low in G-11 sector", priority: "medium", time: "45 min ago" },
  { text: "CCTV camera offline near Committee Chowk", priority: "medium", time: "1 hr ago" },
  { text: "Scheduled load-shedding in I-8 sector, 3–4 PM", priority: "low", time: "2 hr ago" },
  { text: "Waste collection delayed in Satellite Town", priority: "low", time: "3 hr ago" }
];

const TRAFFIC_TREND_LABELS = [
  "00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"
];

const TRAFFIC_TREND_DATA = [22, 15, 38, 68, 55, 62, 85, 47];

const POLLUTANTS = {
  labels: ["PM2.5", "PM10", "CO2", "NO2"],
  values: [88, 112, 64, 40]
};

let WEATHER = {
  temp: 31,
  humidity: 58,
  wind: 12,
  condition: "Partly Cloudy"
};

// =====================================================
// PHASE 2 — RISK PREDICTION DEMO DATA
// =====================================================

const FLOOD_ZONES = [
  { name: "G-9", city: "ISL", drainageCapacity: 35, rainfallRisk: 70 },
  { name: "G-11", city: "ISL", drainageCapacity: 55, rainfallRisk: 60 },
  { name: "F-10", city: "ISL", drainageCapacity: 70, rainfallRisk: 55 },
  { name: "Saddar", city: "RWP", drainageCapacity: 30, rainfallRisk: 75 },
  { name: "Committee Chowk", city: "RWP", drainageCapacity: 25, rainfallRisk: 78 },
  { name: "Satellite Town", city: "RWP", drainageCapacity: 45, rainfallRisk: 65 },
  { name: "Bahria Town", city: "ISL", drainageCapacity: 80, rainfallRisk: 40 }
];

const WASTE_POINTS = [
  { location: "Satellite Town Collection Point", city: "RWP", fillLevel: 88, daysSinceCollection: 3 },
  { location: "Committee Chowk Depot", city: "RWP", fillLevel: 72, daysSinceCollection: 2 },
  { location: "F-7 Markaz Bins", city: "ISL", fillLevel: 45, daysSinceCollection: 1 },
  { location: "G-9 Sector Collection", city: "ISL", fillLevel: 91, daysSinceCollection: 4 },
  { location: "Bahria Town Depot", city: "ISL", fillLevel: 38, daysSinceCollection: 1 },
  { location: "Chaklala Collection Point", city: "RWP", fillLevel: 64, daysSinceCollection: 2 }
];

const WATER_PIPES = [
  { sector: "G-11", city: "ISL", pipeAgeYears: 22, pastLeaksCount: 3, pressure: 52 },
  { sector: "Saddar", city: "RWP", pipeAgeYears: 30, pastLeaksCount: 5, pressure: 41 },
  { sector: "F-7", city: "ISL", pipeAgeYears: 12, pastLeaksCount: 1, pressure: 71 },
  { sector: "Satellite Town", city: "RWP", pipeAgeYears: 26, pastLeaksCount: 4, pressure: 48 },
  { sector: "I-8", city: "ISL", pipeAgeYears: 15, pastLeaksCount: 0, pressure: 78 },
  { sector: "Chaklala", city: "RWP", pipeAgeYears: 18, pastLeaksCount: 2, pressure: 63 }
];

// =====================================================
// CHUNK 6 — CITY INTELLIGENCE MAP DATA
// =====================================================

const CITY_MAP_ISSUES = [
  { id: 1, type: "Traffic", city: "Rawalpindi", location: "Faizabad Interchange", lat: 33.6595, lng: 73.0895, severity: "High", status: "Active", description: "Heavy traffic congestion detected. Average speed is currently low." },
  { id: 2, type: "Traffic", city: "Rawalpindi", location: "Murree Road", lat: 33.6318, lng: 73.0663, severity: "High", status: "Active", description: "High congestion caused by increased vehicle volume." },
  { id: 3, type: "Garbage", city: "Rawalpindi", location: "Satellite Town", lat: 33.6415, lng: 73.0729, severity: "Medium", status: "Active", description: "Waste collection is delayed at multiple collection points." },
  { id: 4, type: "Water Leakage", city: "Islamabad", location: "G-11 Sector", lat: 33.6683, lng: 72.9950, severity: "Medium", status: "Active", description: "Low water pressure reported in the area." },
  { id: 5, type: "Electricity", city: "Islamabad", location: "I-8 Sector", lat: 33.6590, lng: 73.0665, severity: "Low", status: "Monitoring", description: "Scheduled electricity maintenance reported." },
  { id: 6, type: "Flood Risk", city: "Islamabad", location: "G-9 Sector", lat: 33.6700, lng: 73.0130, severity: "Critical", status: "Active", description: "Drainage monitoring required due to increased flood risk." },
  { id: 7, type: "Road Damage", city: "Rawalpindi", location: "Committee Chowk", lat: 33.6261, lng: 73.0714, severity: "Medium", status: "Active", description: "Road surface damage reported by the local monitoring system." },
  { id: 8, type: "Electricity", city: "Rawalpindi", location: "Saddar", lat: 33.5975, lng: 73.0479, severity: "Critical", status: "Active", description: "Electricity service issue detected in the Saddar area." },
  { id: 9, type: "Road Damage", city: "Islamabad", location: "F-10", lat: 33.6969, lng: 73.0169, severity: "High", status: "Active", description: "Road surface damage requires municipal attention." },
  { id: 10, type: "Flood Risk", city: "Rawalpindi", location: "Nullah Lai", lat: 33.6142, lng: 73.0776, severity: "Critical", status: "Active", description: "Critical flood risk due to high water level and blocked drainage." },
  { id: 11, type: "Garbage", city: "Rawalpindi", location: "Saddar", lat: 33.5980, lng: 73.0485, severity: "Critical", status: "Active", description: "Waste bins overflowing, collection overdue." },
  { id: 12, type: "Water Leakage", city: "Rawalpindi", location: "Saddar", lat: 33.5990, lng: 73.0495, severity: "Critical", status: "Active", description: "Major leak causing significant water loss, repair required." }
];

// =====================================================
// CHUNK 8 — FLOOD + WASTE + WATER DEMO DATA
// =====================================================

const FLOOD_DATA = {
  overallRisk: "HIGH",
  waterLevel: 72,
  rainfall: 38,
  blockedDrains: 14,
  criticalZones: 5,
  zones: [
    { location: "Nullah Lai", city: "Rawalpindi", risk: "CRITICAL", waterLevel: 89, drainage: "Blocked" },
    { location: "I-8", city: "Islamabad", risk: "HIGH", waterLevel: 71, drainage: "Partial" },
    { location: "Committee Chowk", city: "Rawalpindi", risk: "HIGH", waterLevel: 66, drainage: "Partial" },
    { location: "E-11", city: "Islamabad", risk: "MEDIUM", waterLevel: 48, drainage: "Normal" },
    { location: "Raja Bazaar", city: "Rawalpindi", risk: "HIGH", waterLevel: 74, drainage: "Blocked" },
    { location: "H-8", city: "Islamabad", risk: "MEDIUM", waterLevel: 44, drainage: "Normal" },
    { location: "Saddar", city: "Rawalpindi", risk: "MEDIUM", waterLevel: 51, drainage: "Partial" }
  ]
};

const WASTE_DATA = {
  totalWaste: 428,
  collected: 371,
  efficiency: 86.7,
  overflowingBins: 27,
  activeVehicles: 42,
  pendingPickups: 19,
  zones: [
    { area: "F-6", city: "Islamabad", level: 78, status: "Collected", priority: "MEDIUM", lastCollection: "Today 09:20" },
    { area: "G-9", city: "Islamabad", level: 91, status: "Pending", priority: "HIGH", lastCollection: "Yesterday 18:40" },
    { area: "Saddar", city: "Rawalpindi", level: 96, status: "Overflowing", priority: "CRITICAL", lastCollection: "Yesterday 15:10" },
    { area: "Raja Bazaar", city: "Rawalpindi", level: 88, status: "Pending", priority: "HIGH", lastCollection: "Today 07:50" },
    { area: "I-8", city: "Islamabad", level: 52, status: "Collected", priority: "LOW", lastCollection: "Today 10:05" },
    { area: "Committee Chowk", city: "Rawalpindi", level: 83, status: "Pending", priority: "HIGH", lastCollection: "Yesterday 20:15" }
  ]
};

const WATER_DATA = {
  demand: 520,
  supply: 468,
  availability: 90,
  activeLeaks: 18,
  reported: 31,
  resolved: 13,
  lowPressureAreas: 7,
  citySupply: {
    Islamabad: { supply: 94, pressure: "Normal", status: "Stable" },
    Rawalpindi: { supply: 86, pressure: "Low", status: "Warning" }
  },
  leaks: [
    { location: "G-10", city: "Islamabad", severity: "HIGH", loss: "18,000 L/day", status: "Investigating", reported: "Today 08:20" },
    { location: "Saddar", city: "Rawalpindi", severity: "CRITICAL", loss: "31,000 L/day", status: "Repair Required", reported: "Today 06:45" },
    { location: "I-8", city: "Islamabad", severity: "MEDIUM", loss: "9,000 L/day", status: "Monitoring", reported: "Yesterday" },
    { location: "Raja Bazaar", city: "Rawalpindi", severity: "HIGH", loss: "15,500 L/day", status: "Investigating", reported: "Today 07:10" },
    { location: "F-10", city: "Islamabad", severity: "LOW", loss: "3,200 L/day", status: "Monitoring", reported: "2 days ago" }
  ]
};

// =====================================================
// CHUNK 9 — MONGODB ZONES API INTEGRATION
// Fetches live zone data from the Express/MongoDB backend
// and safely replaces the ZONES array in place, keeping the
// exact same array reference and object shape everything
// else in the app already expects.
// =====================================================

const ZONES_API_URL = "http://localhost:5000/api/zones";
const FLOOD_API_URL = "http://localhost:5000/api/flood";
const WASTE_API_URL = "http://localhost:5000/api/waste";
const WATER_API_URL = "http://localhost:5000/api/water";

/**
 * Maps a single MongoDB zone document to the frontend zone shape.
 * Drops _id / createdAt / updatedAt / __v — the frontend never needs them.
 */
function mapApiZoneToFrontend(apiZone) {
  return {
    name: apiZone.name,
    city: apiZone.city,
    aqi: apiZone.aqi,
    trafficCongestion: apiZone.trafficCongestion,
    status: apiZone.status
  };
}

/**
 * Fetches zones from the MongoDB-backed API and replaces the contents
 * of the existing ZONES array IN PLACE (same reference, new contents),
 * so any code elsewhere that already holds a reference to ZONES sees
 * the update without needing to be rewritten.
 *
 * On any failure (network error, bad response, empty data), the existing
 * hardcoded ZONES array is left untouched and used as fallback.
 */
async function loadZonesFromAPI() {
  try {
    const response = await fetch(ZONES_API_URL);

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const result = await response.json();

    if (!result || result.success !== true || !Array.isArray(result.data) || result.data.length === 0) {
      throw new Error("API response missing success/data");
    }

    const mappedZones = result.data.map(mapApiZoneToFrontend);

    // Replace contents in place — keeps the same ZONES array reference
    // alive for every other file/function that already references it.
    ZONES.length = 0;
    ZONES.push(...mappedZones);

    console.log("Zones loaded from MongoDB:", ZONES);

    // Let any already-loaded rendering code know fresh data is in ZONES,
    // without assuming any particular function name exists.
    document.dispatchEvent(new CustomEvent("zonesUpdated", { detail: ZONES }));

    // If the rest of the app exposes a known refresh/render entry point,
    // call it so the UI reflects the live data immediately. These are
    // optional/no-op if the functions don't exist — nothing breaks either way.
    if (typeof window.renderDashboard === "function") window.renderDashboard();
    if (typeof window.renderZones === "function") window.renderZones();
    if (typeof window.updateDashboard === "function") window.updateDashboard();

  } catch (err) {
    console.warn("Zones API unavailable. Using demo zone data.");
    // No changes made — hardcoded ZONES array (already declared above)
    // remains exactly as-is and continues to power the dashboard.
  }
}

// Safe initialization: hook into DOMContentLoaded without creating a
// second/conflicting init system. If the app's main script already
// registers its own DOMContentLoaded listener elsewhere, this one
// simply runs alongside it — the browser supports multiple listeners
// for the same event with no conflict, and this listener only touches
// ZONES + dispatches an event, so it cannot break existing init logic.
document.addEventListener("DOMContentLoaded", () => {
  loadZonesFromAPI();
});// =====================================================
// CHUNK 8 — FLOOD + WASTE + WATER API INTEGRATION
// =====================================================

async function loadOperationsDataFromAPI() {

  try {

    const [floodResponse, wasteResponse, waterResponse] =
      await Promise.all([
        fetch(FLOOD_API_URL),
        fetch(WASTE_API_URL),
        fetch(WATER_API_URL)
      ]);

    if (
      !floodResponse.ok ||
      !wasteResponse.ok ||
      !waterResponse.ok
    ) {
      throw new Error("Operations API request failed");
    }

    const floodResult = await floodResponse.json();
    const wasteResult = await wasteResponse.json();
    const waterResult = await waterResponse.json();

    if (
      !floodResult.success ||
      !wasteResult.success ||
      !waterResult.success
    ) {
      throw new Error("Invalid operations API response");
    }

    // ---------------------------------------------
    // FLOOD
    // ---------------------------------------------

    if (floodResult.data) {

      Object.assign(
        FLOOD_DATA,
        floodResult.data
      );

      console.log(
        "🌊 Flood data loaded from MongoDB:",
        FLOOD_DATA
      );
    }

    // ---------------------------------------------
    // WASTE
    // ---------------------------------------------

    if (wasteResult.data) {

      Object.assign(
        WASTE_DATA,
        wasteResult.data
      );

      console.log(
        "🗑️ Waste data loaded from MongoDB:",
        WASTE_DATA
      );
    }

    // ---------------------------------------------
    // WATER
    // ---------------------------------------------

    if (waterResult.data) {

      Object.assign(
        WATER_DATA,
        waterResult.data
      );

      console.log(
        "💧 Water data loaded from MongoDB:",
        WATER_DATA
      );
    }

    // Tell dashboard that operations data changed
    document.dispatchEvent(
      new CustomEvent(
        "operationsDataUpdated",
        {
          detail: {
            flood: FLOOD_DATA,
            waste: WASTE_DATA,
            water: WATER_DATA
          }
        }
      )
    );

    // Refresh City Ops if function exists
    if (
      typeof window.renderCityOps === "function"
    ) {
      window.renderCityOps();
    }

    // Refresh AI sections if available
    if (
      typeof window.renderAIRecommendedActions === "function"
    ) {
      window.renderAIRecommendedActions();
    }

    if (
      typeof window.renderAIDecisionCenter === "function"
    ) {
      window.renderAIDecisionCenter();
    }

    console.log(
      "✅ Flood + Waste + Water backend integration complete"
    );

  } catch (error) {

    console.warn(
      "⚠️ Operations API unavailable. Using existing demo data.",
      error
    );

  }
}


// Load operations data after DOM is ready
document.addEventListener(
  "DOMContentLoaded",
  () => {
    loadOperationsDataFromAPI();
  }
);