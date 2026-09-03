// ========================================
// CHUNK 6 — CITY INTELLIGENCE MAP
// Islamabad & Rawalpindi
// ========================================

let cityMap = null;
let mapInitialized = false;
let cityMarkers = [];

// ----------------------------------------
// MAP CONFIGURATION
// ----------------------------------------

const ISSUE_COLORS = {
  Traffic: "#ff4d5e",
  Garbage: "#ffb020",
  "Water Leakage": "#00e5ff",
  Electricity: "#a855f7",
  "Flood Risk": "#3b82f6",
  "Road Damage": "#f97316"
};

const SEVERITY_ORDER = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1
};

// ----------------------------------------
// INITIALIZE CITY MAP
// ----------------------------------------

function initializeCityMap() {

  const mapElement = document.getElementById("cityMap");

  if (!mapElement) return;

  // Prevent duplicate Leaflet initialization
  if (mapInitialized && cityMap) {
    setTimeout(() => {
      cityMap.invalidateSize();
    }, 100);

    return;
  }

  // Check Leaflet
  if (typeof L === "undefined") {
    showMapError();
    return;
  }

  try {

    cityMap = L.map("cityMap", {
      zoomControl: true,
      scrollWheelZoom: true
    });

    cityMap.setView([33.6844, 73.0479], 12);

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19
      }
    ).addTo(cityMap);

    mapInitialized = true;

    renderMapMarkers();
    setupMapFilters();
    setupMapCityFilter();
    populateMapSearch();
    updateMapStatistics();
    renderCriticalAreas();

    setTimeout(() => {
      cityMap.invalidateSize();
    }, 200);

  } catch (error) {

    console.error("City map initialization failed:", error);
    showMapError();

  }
}

// ----------------------------------------
// CREATE ISSUE MARKER
// ----------------------------------------

function createIssueMarker(issue) {

  const color = ISSUE_COLORS[issue.type] || "#00e5ff";

  return L.divIcon({
    className: "smart-marker",

    html: `
      <div
        class="marker-pulse"
        style="
          background: ${color};
          box-shadow: 0 0 18px ${color};
        "
      ></div>
    `,

    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
}

// ----------------------------------------
// CREATE POPUP
// ----------------------------------------

function createIssuePopup(issue) {

  return `
    <div class="issue-popup">

      <div class="issue-popup-type">
        ${issue.type}
      </div>

      <h3>${issue.location}</h3>

      <div class="issue-popup-row">
        <strong>City:</strong>
        <span>${issue.city}</span>
      </div>

      <div class="issue-popup-row">
        <strong>Severity:</strong>
        <span class="severity-${issue.severity.toLowerCase()}">
          ${issue.severity}
        </span>
      </div>

      <div class="issue-popup-row">
        <strong>Status:</strong>
        <span>${issue.status}</span>
      </div>

      <p>${issue.description}</p>

    </div>
  `;
}

// ----------------------------------------
// RENDER MAP MARKERS
// ----------------------------------------

function renderMapMarkers() {

  if (!cityMap) return;

  cityMarkers.forEach(({ marker }) => {

    if (cityMap.hasLayer(marker)) {
      cityMap.removeLayer(marker);
    }

  });

  cityMarkers = [];

  CITY_MAP_ISSUES.forEach(issue => {

    const marker = L.marker(
      [issue.lat, issue.lng],
      {
        icon: createIssueMarker(issue)
      }
    );

    marker.bindPopup(createIssuePopup(issue));

    cityMarkers.push({
      marker,
      issue
    });

    marker.addTo(cityMap);

  });

}

// ----------------------------------------
// MAP FILTERS
// ----------------------------------------

function setupMapFilters() {

  const checkboxes = document.querySelectorAll(
    ".map-filter-checkbox"
  );

  checkboxes.forEach(checkbox => {

    checkbox.removeEventListener(
      "change",
      applyMapFilters
    );

    checkbox.addEventListener(
      "change",
      applyMapFilters
    );

  });

}

function setupMapCityFilter() {

  const citySelect = document.getElementById(
    "mapCityFilter"
  );

  if (!citySelect) return;

  citySelect.removeEventListener(
    "change",
    applyMapFilters
  );

  citySelect.addEventListener(
    "change",
    applyMapFilters
  );

}

function applyMapFilters() {

  if (!cityMap) return;

  const activeTypes = Array.from(
    document.querySelectorAll(
      ".map-filter-checkbox:checked"
    )
  ).map(
    checkbox => checkbox.dataset.type
  );

  const citySelect = document.getElementById(
    "mapCityFilter"
  );

  const selectedCity = citySelect
    ? citySelect.value
    : "All";

  cityMarkers.forEach(({ marker, issue }) => {

    const typeVisible =
      activeTypes.length === 0 ||
      activeTypes.includes(issue.type);

    const cityVisible =
      selectedCity === "All" ||
      issue.city === selectedCity;

    const shouldShow =
      typeVisible && cityVisible;

    if (shouldShow) {

      if (!cityMap.hasLayer(marker)) {
        marker.addTo(cityMap);
      }

    } else {

      if (cityMap.hasLayer(marker)) {
        cityMap.removeLayer(marker);
      }

    }

  });

}

// ----------------------------------------
// SEARCH / JUMP TO ISSUE
// ----------------------------------------

function populateMapSearch() {

  const select = document.getElementById(
    "mapSearchSelect"
  );

  if (!select) return;

  select.innerHTML = `
    <option value="">
      Jump to an issue…
    </option>
  `;

  CITY_MAP_ISSUES.forEach(issue => {

    const option = document.createElement("option");

    option.value = issue.id;

    option.textContent =
      `${issue.type} — ${issue.location}`;

    select.appendChild(option);

  });

  select.addEventListener(
    "change",
    handleMapSearch
  );

}

function handleMapSearch(event) {

  const issueId = Number(event.target.value);

  if (!issueId || !cityMap) return;

  const selected = cityMarkers.find(
    item => item.issue.id === issueId
  );

  if (!selected) return;

  const { marker, issue } = selected;

  cityMap.flyTo(
    [issue.lat, issue.lng],
    15,
    {
      duration: 1
    }
  );

  setTimeout(() => {

    marker.openPopup();

  }, 700);

}

// ----------------------------------------
// MAP STATISTICS
// ----------------------------------------

function updateMapStatistics() {

  const totalIssues =
    CITY_MAP_ISSUES.length;

  const activeIssues =
    CITY_MAP_ISSUES.filter(
      issue => issue.status === "Active"
    ).length;

  const criticalIssues =
    CITY_MAP_ISSUES.filter(
      issue => issue.severity === "Critical"
    ).length;

  const trafficMonitoring =
    CITY_MAP_ISSUES.filter(
      issue => issue.type === "Traffic"
    ).length;

  updateElement(
    "mapTotalIssues",
    totalIssues
  );

  updateElement(
    "mapActiveIssues",
    activeIssues
  );

  updateElement(
    "mapCriticalIssues",
    criticalIssues
  );

  updateElement(
    "mapTrafficCount",
    trafficMonitoring
  );

}

// ----------------------------------------
// CRITICAL AREAS
// ----------------------------------------

function renderCriticalAreas() {

  const container =
    document.getElementById(
      "criticalAreasList"
    );

  if (!container) return;

  const criticalAreas =
    [...CITY_MAP_ISSUES]
      .sort(
        (a, b) =>
          SEVERITY_ORDER[b.severity] -
          SEVERITY_ORDER[a.severity]
      )
      .slice(0, 4);

  container.innerHTML =
    criticalAreas.map(issue => {

      const severityClass =
        issue.severity.toLowerCase();

      return `
        <div class="critical-area-item">

          <div class="critical-area-icon severity-${severityClass}">
            ●
          </div>

          <div class="critical-area-info">

            <strong>
              ${issue.location}
            </strong>

            <span>
              ${issue.type} · ${issue.severity}
            </span>

          </div>

        </div>
      `;

    }).join("");

}

// ----------------------------------------
// LAST UPDATED
// ----------------------------------------

function updateMapLastUpdated() {

  const element =
    document.getElementById(
      "mapLastUpdated"
    );

  if (!element) return;

  const now = new Date();

  element.textContent =
    `Updated ${now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    })}`;

}

// ----------------------------------------
// SAFE DOM UPDATE
// ----------------------------------------

function updateElement(id, value) {

  const element =
    document.getElementById(id);

  if (element) {
    element.textContent = value;
  }

}

// ----------------------------------------
// MAP ERROR
// ----------------------------------------

function showMapError() {

  const mapElement =
    document.getElementById("cityMap");

  if (!mapElement) return;

  mapElement.innerHTML = `
    <div class="map-error">
      <div class="map-error-icon">⚠</div>

      <h3>Map data unavailable</h3>

      <p>
        Please try again.
      </p>
    </div>
  `;

}

// ----------------------------------------
// MAP PAGE VISIBILITY REFRESH
// ----------------------------------------

function refreshCityMap() {

  if (!cityMap) return;

  setTimeout(() => {

    cityMap.invalidateSize();

    updateMapLastUpdated();

  }, 150);

}

// ----------------------------------------
// GLOBAL MAP REFRESH HOOK
// ----------------------------------------

window.refreshCityMap = refreshCityMap;
window.initializeCityMap = initializeCityMap;