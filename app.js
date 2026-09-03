// =========================================================
// BACKEND API DATA LOADER
// =========================================================

const API_BASE_URL = "http://localhost:5000/api";

async function loadBackendData() {
  try {

    console.log("🔄 Loading data from backend...");

    const [
      zonesResponse,
      roadsResponse,
      environmentResponse,
      alertsResponse
    ] = await Promise.all([

      fetch(`${API_BASE_URL}/zones`),
      fetch(`${API_BASE_URL}/roads`),
      fetch(`${API_BASE_URL}/environment`),
      fetch(`${API_BASE_URL}/alerts`)

    ]);

    // =====================================================
    // CHECK API RESPONSES
    // =====================================================

    if (!zonesResponse.ok) {
      throw new Error("Failed to load zones");
    }

    if (!roadsResponse.ok) {
      throw new Error("Failed to load roads");
    }

    if (!environmentResponse.ok) {
      throw new Error("Failed to load environment");
    }

    if (!alertsResponse.ok) {
      throw new Error("Failed to load alerts");
    }

    // =====================================================
    // CONVERT TO JSON
    // =====================================================

    const zonesResult =
      await zonesResponse.json();

    const roadsResult =
      await roadsResponse.json();

    const environmentResult =
      await environmentResponse.json();

    const alertsResult =
      await alertsResponse.json();

    // =====================================================
    // ZONES
    // BACKEND: trafficCongestion
    // FRONTEND: congestion
    // =====================================================

    if (
      Array.isArray(zonesResult.data) &&
      typeof ZONES !== "undefined" &&
      Array.isArray(ZONES)
    ) {

      const backendZones =
        zonesResult.data.map((zone) => ({

          ...zone,

          // Convert backend field to frontend field
          congestion:
            Number(
              zone.trafficCongestion ??
              zone.congestion ??
              0
            )

        }));

      ZONES.length = 0;
      ZONES.push(...backendZones);
    }

    // =====================================================
    // ROADS
    // =====================================================

    if (
      Array.isArray(roadsResult.data) &&
      typeof ROADS !== "undefined" &&
      Array.isArray(ROADS)
    ) {

      const backendRoads =
        roadsResult.data.map((road) => ({

          ...road,

          speed:
            Number(road.speed || 0),

          vehicles:
            Number(road.vehicles || 0),

          congestion:
            Number(road.congestion || 0)

        }));

      ROADS.length = 0;
      ROADS.push(...backendRoads);
    }

    // =====================================================
    // ENVIRONMENT
    // Backend has multiple environment records.
    // We calculate average temperature/humidity/AQI.
    // =====================================================

    if (
      Array.isArray(environmentResult.data) &&
      environmentResult.data.length > 0 &&
      typeof WEATHER !== "undefined" &&
      WEATHER
    ) {

      const environmentData =
        environmentResult.data;

      const average = (field) => {

        const values =
          environmentData
            .map(item => Number(item[field]))
            .filter(value => !Number.isNaN(value));

        if (!values.length) {
          return 0;
        }

        return Math.round(
          values.reduce(
            (sum, value) => sum + value,
            0
          ) / values.length
        );
      };

      WEATHER.temp =
        average("temperature");

      WEATHER.humidity =
        average("humidity");

      // Keep existing frontend values
      // if backend does not provide them.
      if (
        WEATHER.wind === undefined ||
        WEATHER.wind === null
      ) {
        WEATHER.wind = 0;
      }

      if (
        WEATHER.condition === undefined ||
        WEATHER.condition === null
      ) {
        WEATHER.condition = "Monitoring";
      }

      console.log(
        "🌤️ Environment data updated:",
        WEATHER
      );
    }

    // =====================================================
    // ALERTS
    // Convert backend alert structure into
    // frontend alert structure.
    // =====================================================

    if (
      Array.isArray(alertsResult.data) &&
      typeof ALERTS !== "undefined" &&
      Array.isArray(ALERTS)
    ) {

      const backendAlerts =
        alertsResult.data.map((alert) => ({

          ...alert,

          text:
            alert.text ||
            alert.message ||
            alert.title ||
            "Smart City Alert",

          priority:
            String(
              alert.priority ||
              alert.type ||
              "low"
            ).toLowerCase(),

          time:
            alert.time ||
            (
              alert.createdAt
                ? new Date(
                    alert.createdAt
                  ).toLocaleTimeString(
                    "en-PK",
                    {
                      hour: "2-digit",
                      minute: "2-digit"
                    }
                  )
                : "Just now"
            ),

          source: "system"

        }));

      ALERTS.length = 0;
      ALERTS.push(...backendAlerts);
    }

    // =====================================================
    // SUCCESS LOGS
    // =====================================================

    console.log(
      "✅ Backend data loaded successfully"
    );

    console.log(
      "Zones:",
      typeof ZONES !== "undefined"
        ? ZONES.length
        : 0
    );

    console.log(
      "Roads:",
      typeof ROADS !== "undefined"
        ? ROADS.length
        : 0
    );

    console.log(
      "Environment:",
      typeof WEATHER !== "undefined"
        ? WEATHER
        : {}
    );

    console.log(
      "Alerts:",
      typeof ALERTS !== "undefined"
        ? ALERTS.length
        : 0
    );

    return true;

  } catch (error) {

    console.error(
      "❌ Backend API connection failed:",
      error
    );

    return false;
  }
}

/* =========================================================
   PAGE NAVIGATION
========================================================= */

document.querySelectorAll(".nav-item").forEach((btn) => {
  btn.addEventListener("click", () => {

    document.querySelectorAll(".nav-item").forEach((b) => {
      b.classList.remove("active");
    });

    btn.classList.add("active");

    const target = btn.dataset.page;

    document.querySelectorAll(".page").forEach((page) => {
      page.classList.remove("active");
    });

    const targetPage = document.getElementById(`page-${target}`);

    if (targetPage) {
      targetPage.classList.add("active");
    }

   const pageTitle = document.getElementById("pageTitle");
const pageSub = document.getElementById("pageSub");

const pageTitles = {
  overview: [
    "City Overview",
    "Islamabad & Rawalpindi · unified sensor grid"
  ],
  traffic: [
    "Traffic Intelligence",
    "Real-time traffic flow & congestion monitoring"
  ],
  environment: [
    "Environment & Air Quality",
    "Air quality, weather & environmental monitoring"
  ],
  map: [
    "City Intelligence Map",
    "Live city infrastructure & incident monitoring"
  ],
  insights: [
    "AI Insights",
    "AI-powered predictions, risks & recommendations"
  ],
  alerts: [
    "Smart Alerts",
    "Critical city events & intelligent notifications"
  ],
  cityops: [
    "City Operations",
    "Flood, waste & water infrastructure monitoring"
  ]
};

const currentPageTitle = pageTitles[target];

if (currentPageTitle) {
  if (pageTitle) {
    pageTitle.textContent = currentPageTitle[0];
  }

  if (pageSub) {
    pageSub.textContent = currentPageTitle[1];
  }
}

    /* =========================
       MAP
    ========================== */

    if (
      target === "map" &&
      typeof initializeCityMap === "function"
    ) {
      setTimeout(() => {
        initializeCityMap();
      }, 50);
    }


    /* =========================
       INSIGHTS
    ========================== */

    if (target === "insights") {

      if (typeof renderInsights === "function") {
        renderInsights();
      }

      if (typeof renderPredictions === "function") {
        renderPredictions();
      }

      if (
        typeof renderFloodPredictions ===
        "function"
      ) {
        renderFloodPredictions();
      }

      if (
        typeof renderWastePredictions ===
        "function"
      ) {
        renderWastePredictions();
      }

      if (
        typeof renderWaterLeakPredictions ===
        "function"
      ) {
        renderWaterLeakPredictions();
      }
    }


    /* =========================
       ALERTS
    ========================== */

    if (target === "alerts") {

      if (typeof renderAlerts === "function") {
        renderAlerts();
      }
    }


    /* =========================
       CITY OPS — CHUNK 8
    ========================== */

    if (target === "cityops") {

      if (typeof renderCityOps === "function") {
        renderCityOps();
      }
    }
  });
});


/* =========================================================
   PAKISTAN CLOCK
========================================================= */

function updateClock() {

  const now = new Date();

  const pakistanTime =
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Karachi",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(now);

  const clock =
    document.getElementById("clock");

  if (clock) {
    clock.textContent =
      `${pakistanTime} PKT`;
  }
}

setInterval(updateClock, 1000);

updateClock();


/* =========================================================
   THEME TOGGLE
========================================================= */

const themeToggle =
  document.getElementById("themeToggle");

if (themeToggle) {

  themeToggle.addEventListener(
    "click",
    () => {

      const html =
        document.documentElement;

      const currentTheme =
        html.getAttribute("data-theme");

      const newTheme =
        currentTheme === "light"
          ? "dark"
          : "light";

      html.setAttribute(
        "data-theme",
        newTheme
      );

      localStorage.setItem(
        "smartCityTheme",
        newTheme
      );
    }
  );
}


const savedTheme =
  localStorage.getItem(
    "smartCityTheme"
  );

if (savedTheme) {

  document.documentElement.setAttribute(
    "data-theme",
    savedTheme
  );
}


/* =========================================================
   COMMON HELPERS
========================================================= */

function statusClass(status) {

  if (status === "red") {
    return "status-red";
  }

  if (status === "yellow") {
    return "status-yellow";
  }

  return "status-green";
}


function congestionColor(pct) {

  if (pct >= 70) {
    return "var(--red)";
  }

  if (pct >= 45) {
    return "var(--amber)";
  }

  return "var(--green)";
}


function congestionBadgeClass(pct) {

  if (pct >= 70) {
    return "priority-high";
  }

  if (pct >= 45) {
    return "priority-medium";
  }

  return "priority-low";
}


function congestionLabel(pct) {

  if (pct >= 70) {
    return "Heavy";
  }

  if (pct >= 45) {
    return "Moderate";
  }

  return "Light";
}


/* =========================================================
   OVERVIEW UPGRADE
========================================================= */

let prevTrafficAvgForTrend = null;
let prevAlertsTotalForTrend = null;


function aqiStatusLabel(aqi) {

  if (aqi >= 150) {
    return "Unhealthy";
  }

  if (aqi >= 100) {
    return "Poor";
  }

  if (aqi >= 80) {
    return "Moderate";
  }

  return "Good";
}


function overallCityStatusLabel(
  aqi,
  congestion,
  alertsCount
) {

  if (
    aqi >= 130 ||
    congestion >= 75 ||
    alertsCount >= 4
  ) {
    return "Attention";
  }

  if (
    aqi >= 90 ||
    congestion >= 50 ||
    alertsCount >= 2
  ) {
    return "Moderate";
  }

  return "Good";
}


/* =========================================================
   INFRASTRUCTURE SCORE
========================================================= */

function computeInfrastructureScore() {

  if (
    typeof ROADS === "undefined" ||
    typeof INCIDENTS === "undefined"
  ) {
    return 0;
  }

  if (!ROADS.length) {
    return 0;
  }

  const avgSpeed =
    ROADS.reduce(
      (total, road) =>
        total + Number(road.speed || 0),
      0
    ) / ROADS.length;


  const speedScore =
    Math.max(
      0,
      Math.min(
        100,
        Math.round(
          (avgSpeed / 40) * 100
        )
      )
    );


  const incidentPenalty =
    INCIDENTS.length * 6;


  return Math.max(
    0,
    Math.min(
      100,
      speedScore - incidentPenalty
    )
  );
}


function cityZones(cityCode) {

  return typeof ZONES !== "undefined"
    ? ZONES.filter(
        (zone) => zone.city === cityCode
      )
    : [];
}


function cityRoads(cityCode) {

  return typeof ROADS !== "undefined"
    ? ROADS.filter(
        (road) =>
          road.zone === cityCode ||
          String(road.zone || "")
            .includes(cityCode)
      )
    : [];
}


/* =========================================================
   CITY ALERT COUNT
========================================================= */

function cityAlertCount(cityCode) {

  const zones =
    cityZones(cityCode);

  const names =
    zones.map((zone) =>
      String(zone.name || "")
        .toLowerCase()
    );


  /* Backend alerts are now the single source */
  const allAlerts =
    Array.isArray(ALERTS)
      ? ALERTS
      : [];


  if (!names.length) {
    return 0;
  }


  return allAlerts.filter((alert) => {

    const text =
      String(
        alert.text ||
        alert.message ||
        alert.title ||
        ""
      ).toLowerCase();


    return names.some((name) => {

      const firstWord =
        name.split(" ")[0];

      return (
        firstWord &&
        text.includes(firstWord)
      );
    });

  }).length;
}


/* =========================================================
   SYSTEM STATUS
========================================================= */

function renderSystemStatus() {

  const dot =
    document.getElementById(
      "systemStatusDot"
    );

  const text =
    document.getElementById(
      "systemStatusText"
    );

  const time =
    document.getElementById(
      "lastUpdatedTime"
    );


  if (text) {
    text.textContent =
      "All Systems Operational";
  }


  if (dot) {

    dot.classList.remove(
      "status-offline"
    );

    dot.style.background =
      "var(--green)";

    dot.style.boxShadow =
      "0 0 10px var(--green)";
  }


 if (time) time.textContent = "Just now";
}


/* =========================================================
   INFRASTRUCTURE HEALTH
========================================================= */

function renderInfrastructureScore() {

  const infraBar =
    document.getElementById(
      "healthInfraBar"
    );

  const infraVal =
    document.getElementById(
      "healthInfraVal"
    );


  if (!infraBar && !infraVal) {
    return;
  }


  const score =
    computeInfrastructureScore();


  if (infraBar) {
    infraBar.style.width =
      score + "%";
  }


  if (infraVal) {
    infraVal.textContent =
      score;
  }
}


/* =========================================================
   CITY-WISE STATUS
========================================================= */

function renderCityStatusPanels() {

  if (
    typeof ZONES === "undefined" ||
    typeof ROADS === "undefined"
  ) {
    return;
  }


  const cityConfig = {

    RWP: {
      prefix: "rwp",
      name: "Rawalpindi"
    },

    ISL: {
      prefix: "isl",
      name: "Islamabad"
    },

    LHR: {
      prefix: "lhr",
      name: "Lahore"
    },

    KHI: {
      prefix: "khi",
      name: "Karachi"
    }

  };


  Object.keys(cityConfig)
    .forEach((code) => {

      const config =
        cityConfig[code];


      const zones =
        cityZones(code);

      const roads =
        cityRoads(code);


      let avgAqi = 0;
      let avgCongestion = 0;
      let alertsCount = 0;


      /* =========================
         AQI
      ========================== */

      if (zones.length) {

        avgAqi =
          Math.round(
            zones.reduce(
              (total, zone) =>
                total +
                Number(zone.aqi || 0),
              0
            ) / zones.length
          );
      }


      /* =========================
         TRAFFIC
      ========================== */

      if (roads.length) {

        avgCongestion =
          Math.round(
            roads.reduce(
              (total, road) =>
                total +
                Number(
                  road.congestion || 0
                ),
              0
            ) / roads.length
          );
      }


      alertsCount =
        cityAlertCount(code);


      /* =========================
         DEMO FALLBACK DATA
      ========================== */

      const demoValues = {

        LHR: {
          aqi: 142,
          traffic: 68,
          alerts: 3
        },

        KHI: {
          aqi: 96,
          traffic: 54,
          alerts: 2
        }

      };


      if (
        !zones.length &&
        demoValues[code]
      ) {
        avgAqi =
          demoValues[code].aqi;
      }


      if (
        !roads.length &&
        demoValues[code]
      ) {
        avgCongestion =
          demoValues[code].traffic;
      }


      if (
        !alertsCount &&
        demoValues[code]
      ) {
        alertsCount =
          demoValues[code].alerts;
      }


      const status =
        overallCityStatusLabel(
          avgAqi,
          avgCongestion,
          alertsCount
        );


      const prefix =
        config.prefix;


      const aqiEl =
        document.getElementById(
          `${prefix}Aqi`
        );


      const trafficEl =
        document.getElementById(
          `${prefix}Traffic`
        );


      const alertsEl =
        document.getElementById(
          `${prefix}Alerts`
        );


      const statusEl =
        document.getElementById(
          `${prefix}OverallStatus`
        );


      if (aqiEl) {
        aqiEl.textContent =
          avgAqi;
      }


      if (trafficEl) {
        trafficEl.textContent =
          avgCongestion + "%";
      }


      if (alertsEl) {
        alertsEl.textContent =
          alertsCount;
      }


      if (statusEl) {

        statusEl.textContent =
          status.toUpperCase();


        statusEl.className =
          "zone-status " +
          (
            status === "Attention"
              ? "status-red"
              : status === "Moderate"
                ? "status-yellow"
                : "status-green"
          );
      }

    });
}


/* =========================================================
   AI CITY SUMMARY
========================================================= */

function renderCitySummary() {

  const el =
    document.getElementById(
      "citySummaryText"
    );


  if (!el) {
    return;
  }


  if (
    typeof ZONES === "undefined" ||
    typeof ROADS === "undefined"
  ) {
    return;
  }


  if (
    !ZONES.length ||
    !ROADS.length
  ) {
    return;
  }


  const avgAqi =
    Math.round(
      ZONES.reduce(
        (total, zone) =>
          total + Number(zone.aqi || 0),
        0
      ) / ZONES.length
    );


  const avgCongestion =
    Math.round(
      ROADS.reduce(
        (total, road) =>
          total +
          Number(
            road.congestion || 0
          ),
        0
      ) / ROADS.length
    );


 const allAlerts =
  typeof ALERTS !== "undefined"
    ? ALERTS
    : [];


  const activeIncidents =
    typeof INCIDENTS !== "undefined"
      ? INCIDENTS.length
      : 0;


  const infrastructureScore =
    computeInfrastructureScore();


  const highAlerts =
    allAlerts.filter(
      (alert) =>
        alert.priority === "high"
    ).length;


  const trafficStatus =
    congestionLabel(
      avgCongestion
    ).toLowerCase();


  const airStatus =
    aqiStatusLabel(
      avgAqi
    ).toLowerCase();


  let priority =
    "maintain normal monitoring";


  if (highAlerts > 0) {

    priority =
      "address high-priority alerts and related incidents";

  } else if (avgCongestion >= 70) {

    priority =
      "optimize traffic flow on heavily congested roads";

  } else if (avgAqi >= 120) {

    priority =
      "monitor air-quality hotspots and pollution levels";

  } else if (infrastructureScore < 60) {

    priority =
      "prioritize infrastructure maintenance";
  }


  const summary =
    `Overall city conditions are currently stable with ${trafficStatus} traffic ` +
    `and ${airStatus} air quality. Average congestion is ${avgCongestion}% ` +
    `and city-wide AQI is ${avgAqi}. ` +
    `${activeIncidents} active incident(s) are being monitored, while ` +
    `infrastructure health is currently rated ${infrastructureScore}/100. ` +
    `AI recommendation: ${priority}.`;


  el.textContent =
    summary;
}


/* =========================================================
   PRIORITY ALERTS
========================================================= */

function renderPriorityAlerts() {

  const list =
    document.getElementById(
      "priorityAlertsList"
    );


  if (!list) {
    return;
  }


  const priorityOrder = {
    high: 1,
    medium: 2,
    low: 3
  };


  /* Backend alerts are now the single source */
  const allAlerts =
    Array.isArray(ALERTS)
      ? ALERTS
      : [];


  const top =
    [...allAlerts]
      .sort(
        (a, b) =>
          priorityOrder[a.priority] -
          priorityOrder[b.priority]
      )
      .slice(0, 4);


  if (top.length === 0) {

    list.innerHTML =
      `<li class="alert-empty">
        No active alerts.
      </li>`;

    return;
  }


  list.innerHTML =
    top.map(
      (alert) => `
        <li>

          <span>
            ${
              alert.source === "ai"
                ? '<span class="ai-tag">AI</span> '
                : ""
            }

            ${alert.text || alert.message || alert.title || "Alert"}
          </span>

          <span class="priority-tag priority-${alert.priority}">
           ${String(alert.priority || "low").toUpperCase()}
          </span>

          <span class="time">
            ${alert.time || "Just now"}
          </span>

        </li>
      `
    ).join("");
}

/* =========================================================
   KPI EXTRA STATUS
========================================================= */

function updateKpiExtras(
  avgAqi,
  avgCongestion,
  totalAlerts
) {

  const aqiStatusEl =
    document.getElementById(
      "kpiAqiStatus"
    );


  if (aqiStatusEl) {

    aqiStatusEl.textContent =
      aqiStatusLabel(avgAqi);
  }


  const trafficStatusEl =
    document.getElementById(
      "kpiTrafficStatus"
    );


  if (trafficStatusEl) {

    trafficStatusEl.textContent =
      congestionLabel(
        avgCongestion
      );
  }


  /* Backend alerts are now the single source */
  const allAlerts =
    Array.isArray(ALERTS)
      ? ALERTS
      : [];


  const criticalCount =
    allAlerts.filter(
      (alert) =>
        alert.priority === "high"
    ).length;


  const alertsStatusEl =
    document.getElementById(
      "kpiAlertsStatus"
    );


  if (alertsStatusEl) {

    alertsStatusEl.textContent =
      criticalCount + " Critical";
  }


  const aqiTrendEl =
    document.getElementById(
      "kpiAqiTrend"
    );


  if (aqiTrendEl) {

    aqiTrendEl.textContent =
      "Live monitoring";
  }


  const trafficTrendEl =
    document.getElementById(
      "kpiTrafficTrend"
    );


  if (trafficTrendEl) {

    if (
      prevTrafficAvgForTrend === null
    ) {

      trafficTrendEl.textContent =
        "Live monitoring";

      trafficTrendEl.className =
        "kpi-trend";

    } else {

      const delta =
        avgCongestion -
        prevTrafficAvgForTrend;


      if (delta > 0) {

        trafficTrendEl.textContent =
          `▲ ${delta}% vs last update`;

        trafficTrendEl.className =
          "kpi-trend down";

      } else if (delta < 0) {

        trafficTrendEl.textContent =
          `▼ ${Math.abs(
            delta
          )}% vs last update`;

        trafficTrendEl.className =
          "kpi-trend up";

      } else {

        trafficTrendEl.textContent =
          "Steady vs last update";

        trafficTrendEl.className =
          "kpi-trend";
      }
    }
  }


  prevTrafficAvgForTrend =
    avgCongestion;


  const alertsTrendEl =
    document.getElementById(
      "kpiAlertsTrend"
    );


  if (alertsTrendEl) {

    if (
      prevAlertsTotalForTrend === null
    ) {

      alertsTrendEl.textContent =
        "Live monitoring";

      alertsTrendEl.className =
        "kpi-trend";

    } else {

      const delta =
        totalAlerts -
        prevAlertsTotalForTrend;


      if (delta > 0) {

        alertsTrendEl.textContent =
          `▲ ${delta} new`;

        alertsTrendEl.className =
          "kpi-trend down";

      } else if (delta < 0) {

        alertsTrendEl.textContent =
          `▼ ${Math.abs(
            delta
          )} resolved`;

        alertsTrendEl.className =
          "kpi-trend up";

      } else {

        alertsTrendEl.textContent =
          "Steady vs last update";

        alertsTrendEl.className =
          "kpi-trend";
      }
    }
  }


  prevAlertsTotalForTrend =
    totalAlerts;
}

/* =========================================================
   QUICK ACTIONS
   Uses EXISTING navigation
========================================================= */

function initQuickActions() {

  document
    .querySelectorAll(
      ".quick-action-btn[data-page], .quick-action-btn[data-goto]"
    )
    .forEach((btn) => {

      btn.addEventListener(
        "click",
        () => {

          const target =
            btn.dataset.page ||
            btn.dataset.goto;


          if (!target) {
            return;
          }


          const navBtn =
            document.querySelector(
              `.nav-item[data-page="${target}"]`
            );


          if (navBtn) {
            navBtn.click();
          }

        }
      );

    });


  const viewAllBtn =
    document.getElementById(
      "viewAllAlertsBtn"
    );


  if (viewAllBtn) {

    viewAllBtn.addEventListener(
      "click",
      () => {

        const navBtn =
          document.querySelector(
            '.nav-item[data-page="alerts"]'
          );


        if (navBtn) {
          navBtn.click();
        }

      }
    );
  }
}


/* =========================================================
   TRAFFIC UPGRADE
========================================================= */

let trafficCongestionFilter =
  "all";

let trafficRoadSearch =
  "";


function congestionFilterMatches(
  pct,
  filter
) {

  if (filter === "all") {
    return true;
  }

  if (filter === "light") {
    return pct < 45;
  }

  if (filter === "moderate") {
    return (
      pct >= 45 &&
      pct < 70
    );
  }

  if (filter === "heavy") {
    return pct >= 70;
  }

  return true;
}


function getFilteredRoads() {

  if (typeof ROADS === "undefined") {
    return [];
  }


  let filtered =
    ROADS.filter(
      (road) =>
        congestionFilterMatches(
          road.congestion,
          trafficCongestionFilter
        )
    );


  if (
    trafficRoadSearch.trim() !== ""
  ) {

    const query =
      trafficRoadSearch.toLowerCase();


    filtered =
      filtered.filter(
        (road) =>
          String(road.name || "")
            .toLowerCase()
            .includes(query) ||

          String(road.zone || "")
            .toLowerCase()
            .includes(query)
      );
  }


  return filtered;
}


/* =========================================================
   TRAFFIC STATS
========================================================= */

function computeTrafficStats() {

  if (
    typeof ROADS === "undefined" ||
    ROADS.length === 0
  ) {
    return null;
  }


  const avgCongestion =
    Math.round(
      ROADS.reduce(
        (total, road) =>
          total +
          Number(
            road.congestion || 0
          ),
        0
      ) / ROADS.length
    );


  const avgSpeed =
    Math.round(
      ROADS.reduce(
        (total, road) =>
          total +
          Number(
            road.speed || 0
          ),
        0
      ) / ROADS.length
    );


  const totalVehicles =
    ROADS.reduce(
      (total, road) =>
        total +
        Number(
          road.vehicles || 0
        ),
      0
    );


  const activeIncidents =
    typeof INCIDENTS !== "undefined"
      ? INCIDENTS.length
      : 0;


  const mostCongested =
    [...ROADS].sort(
      (a, b) =>
        b.congestion -
        a.congestion
    )[0];


  const leastCongested =
    [...ROADS].sort(
      (a, b) =>
        a.congestion -
        b.congestion
    )[0];


  return {

    avgCongestion,

    avgSpeed,

    totalVehicles,

    activeIncidents,

    mostCongested,

    leastCongested
  };
}


function trafficStatusFromAvg(avg) {

  if (avg >= 85) {
    return "Critical";
  }

  if (avg >= 70) {
    return "Heavy";
  }

  if (avg >= 45) {
    return "Moderate";
  }

  return "Light";
}


/* =========================================================
   TRAFFIC KPI
========================================================= */

function renderTrafficKPIs() {

  const stats =
    computeTrafficStats();


  if (!stats) {
    return;
  }


  const avgCongestionEl =
    document.getElementById(
      "trafficKpiAvgCongestion"
    );


  const avgCongestionStatusEl =
    document.getElementById(
      "trafficKpiAvgCongestionStatus"
    );


  const avgSpeedEl =
    document.getElementById(
      "trafficKpiAvgSpeed"
    );


  const vehiclesEl =
    document.getElementById(
      "trafficKpiVehicles"
    );


  const incidentsEl =
    document.getElementById(
      "trafficKpiIncidents"
    );


  if (avgCongestionEl) {

    avgCongestionEl.textContent =
      stats.avgCongestion + "%";
  }


  if (avgCongestionStatusEl) {

    avgCongestionStatusEl.textContent =
      congestionLabel(
        stats.avgCongestion
      );
  }


  if (avgSpeedEl) {

    avgSpeedEl.textContent =
      stats.avgSpeed + " km/h";
  }


  if (vehiclesEl) {

    vehiclesEl.textContent =
      stats.totalVehicles.toLocaleString();
  }


  if (incidentsEl) {

    incidentsEl.textContent =
      stats.activeIncidents;
  }
}


/* =========================================================
   EXISTING MOST CONGESTED ROAD SECTION
========================================================= */

function renderMostCongestedRoad() {

  const stats =
    computeTrafficStats();


  if (
    !stats ||
    !stats.mostCongested
  ) {
    return;
  }


  const nameEl =
    document.getElementById(
      "mostCongestedRoadName"
    );


  const pctEl =
    document.getElementById(
      "mostCongestedRoadPct"
    );


  const badgeEl =
    document.getElementById(
      "mostCongestedRoadBadge"
    );


  if (nameEl) {

    nameEl.textContent =
      stats.mostCongested.name;
  }


  if (pctEl) {

    pctEl.textContent =
      stats.mostCongested.congestion +
      "%";
  }


  if (badgeEl) {

    badgeEl.textContent =
      congestionLabel(
        stats.mostCongested.congestion
      );


    badgeEl.className =
      "badge " +
      congestionBadgeClass(
        stats.mostCongested.congestion
      );
  }
}


/* =========================================================
   CHUNK 5 MOST CONGESTED ROAD CARD
========================================================= */

function renderMostCongestedRoadCard() {

  const stats =
    computeTrafficStats();


  if (
    !stats ||
    !stats.mostCongested
  ) {
    return;
  }


  const road =
    stats.mostCongested;


  const nameEl =
    document.getElementById(
      "mostCongestedRoadName"
    );


  const congestionEl =
    document.getElementById(
      "mostCongestedRoadPct"
    );


  const speedEl =
    document.getElementById(
      "mostCongestedRoadSpeed"
    );


  const statusEl =
    document.getElementById(
      "mostCongestedRoadStatus"
    );


  if (nameEl) {

    nameEl.textContent =
      road.name;
  }


  if (congestionEl) {

    congestionEl.textContent =
      road.congestion + "%";
  }


  if (speedEl) {

    speedEl.textContent =
      road.speed + " km/h";
  }


  if (statusEl) {

    statusEl.textContent =
      congestionLabel(
        road.congestion
      ) + " Traffic";


    statusEl.className =
      "badge " +
      congestionBadgeClass(
        road.congestion
      );
  }
}


/* =========================================================
   TRAFFIC STATUS
========================================================= */

function renderTrafficStatus() {

  const stats =
    computeTrafficStats();


  if (!stats) {
    return;
  }


  const status =
    trafficStatusFromAvg(
      stats.avgCongestion
    );


  const textEl =
    document.getElementById(
      "trafficStatusText"
    );


  const dotEl =
    document.getElementById(
      "trafficStatusDot"
    );


  const mostEl =
    document.getElementById(
      "trafficStatusMostCongested"
    );


  if (textEl) {

    textEl.textContent =
      status.toUpperCase() +
      " TRAFFIC";
  }


  if (dotEl) {

    dotEl.classList.remove(
      "status-offline"
    );


    if (
      status === "Critical" ||
      status === "Heavy"
    ) {

      dotEl.style.background =
        "var(--red)";

      dotEl.style.boxShadow =
        "0 0 10px var(--red)";

    } else if (
      status === "Moderate"
    ) {

      dotEl.style.background =
        "var(--amber)";

      dotEl.style.boxShadow =
        "0 0 10px var(--amber)";

    } else {

      dotEl.style.background =
        "var(--green)";

      dotEl.style.boxShadow =
        "0 0 10px var(--green)";
    }
  }


  if (
    mostEl &&
    stats.mostCongested
  ) {

    mostEl.textContent =
      stats.mostCongested.name +
      " (" +
      stats.mostCongested.congestion +
      "%)";
  }
}


/* =========================================================
   TRAFFIC INSIGHT
========================================================= */

function renderTrafficInsight() {

  const el =
    document.getElementById(
      "trafficInsightText"
    );


  const stats =
    computeTrafficStats();


  if (
    !el ||
    !stats ||
    !stats.mostCongested ||
    !stats.leastCongested
  ) {
    return;
  }


  const overall =
    trafficStatusFromAvg(
      stats.avgCongestion
    ).toLowerCase();


  let text =
    `Traffic is currently ${congestionLabel(
      stats.mostCongested.congestion
    ).toLowerCase()} on ${stats.mostCongested.name} (${
      stats.mostCongested.congestion
    }%), `;


  text +=
    `while ${stats.leastCongested.name} has the smoothest flow at ${stats.leastCongested.congestion}%. `;


  text +=
    `Overall city-wide traffic condition is ${overall}, averaging ${stats.avgCongestion}% congestion across ${ROADS.length} major roads.`;


  el.textContent =
    text;
}


/* =========================================================
   TRAFFIC CONTROLS
========================================================= */

let trafficControlsInitialized =
  false;


function initTrafficControls() {

  if (trafficControlsInitialized) {
    return;
  }


  trafficControlsInitialized =
    true;


  const searchInput =
    document.getElementById(
      "trafficSearchInput"
    );


  if (searchInput) {

    searchInput.addEventListener(
      "input",
      (event) => {

        trafficRoadSearch =
          event.target.value;

        renderTraffic();
      }
    );
  }


  document
    .querySelectorAll(
      "#trafficFilters .alert-filter-btn"
    )
    .forEach((btn) => {

      btn.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              "#trafficFilters .alert-filter-btn"
            )
            .forEach((b) => {

              b.classList.remove(
                "active"
              );
            });


          btn.classList.add(
            "active"
          );


          trafficCongestionFilter =
            btn.dataset.congestionFilter;


          renderTraffic();
        }
      );

    });
}


/* =========================================================
   ENVIRONMENT UPGRADE
========================================================= */

let envZoneSearch = "";
let envZoneFilter = "all";


/* =========================================================
   AQI CATEGORY
========================================================= */

function envAqiCategory(aqi) {

  if (aqi >= 150) {
    return "Unhealthy";
  }

  if (aqi >= 100) {
    return "Poor";
  }

  if (aqi >= 80) {
    return "Moderate";
  }

  return "Good";
}


/* =========================================================
   AQI CATEGORY COLOR
========================================================= */

function envAqiCategoryColor(aqi) {

  if (aqi >= 150) {
    return "red";
  }

  if (aqi >= 80) {
    return "yellow";
  }

  return "green";
}


/* =========================================================
   ENVIRONMENT FILTER KEY
========================================================= */

function envFilterKey(aqi) {

  const category =
    envAqiCategory(aqi)
      .toLowerCase();


  return category;
}


/* =========================================================
   ENVIRONMENT FILTER MATCH
========================================================= */

function envFilterMatches(
  aqi,
  filter
) {

  if (filter === "all") {
    return true;
  }

  return (
    envFilterKey(aqi) ===
    filter
  );
}


/* =========================================================
   GET FILTERED ENVIRONMENT ZONES
========================================================= */

function getFilteredZones() {

  if (typeof ZONES === "undefined") {
    return [];
  }


  let filtered =
    ZONES.filter(
      (zone) =>
        envFilterMatches(
          zone.aqi,
          envZoneFilter
        )
    );


  if (
    envZoneSearch.trim() !== ""
  ) {

    const query =
      envZoneSearch
        .toLowerCase()
        .trim();


    filtered =
      filtered.filter(
        (zone) =>
          String(zone.name || "")
            .toLowerCase()
            .includes(query) ||

          String(zone.city || "")
            .toLowerCase()
            .includes(query)
      );
  }


  return filtered;
}
/* =========================================================
   ENVIRONMENT STATS
========================================================= */

function computeEnvStats() {

  if (
    typeof ZONES === "undefined" ||
    ZONES.length === 0
  ) {
    return null;
  }


  const avgAqi =
    Math.round(
      ZONES.reduce(
        (total, zone) =>
          total +
          Number(zone.aqi || 0),
        0
      ) / ZONES.length
    );


  const worstZone =
    [...ZONES].sort(
      (a, b) =>
        b.aqi - a.aqi
    )[0];


  const bestZone =
    [...ZONES].sort(
      (a, b) =>
        a.aqi - b.aqi
    )[0];


  return {

    avgAqi,

    zoneCount:
      ZONES.length,

    worstZone,

    bestZone
  };
}


/* =========================================================
   ENVIRONMENT KPI
========================================================= */

function renderEnvironmentKPIs() {

  const stats =
    computeEnvStats();


  if (
    !stats ||
    typeof WEATHER === "undefined"
  ) {
    return;
  }


  const avgAqiEl =
    document.getElementById(
      "envKpiAvgAqi"
    );


  const avgAqiStatusEl =
    document.getElementById(
      "envKpiAvgAqiStatus"
    );


  const tempEl =
    document.getElementById(
      "envKpiTemp"
    );


  const humidityEl =
    document.getElementById(
      "envKpiHumidity"
    );


  const windEl =
    document.getElementById(
      "envKpiWind"
    );


  const zoneCountEl =
    document.getElementById(
      "envKpiZoneCount"
    );


  const monitoredZonesEl =
    document.getElementById(
      "envMonitoredZonesCount"
    );


  if (avgAqiEl) {

    avgAqiEl.textContent =
      stats.avgAqi;
  }


  if (avgAqiStatusEl) {

    avgAqiStatusEl.textContent =
      envAqiCategory(
        stats.avgAqi
      );
  }


  if (tempEl) {

    tempEl.textContent =
      WEATHER.temp + "°C";
  }


  if (humidityEl) {

    humidityEl.textContent =
      WEATHER.humidity + "%";
  }


  if (windEl) {

    windEl.textContent =
      "Wind " +
      WEATHER.wind +
      " km/h";
  }


  if (zoneCountEl) {

    zoneCountEl.textContent =
      stats.zoneCount;
  }


  if (monitoredZonesEl) {

    monitoredZonesEl.textContent =
      stats.zoneCount;
  }
}


/* =========================================================
   ENVIRONMENT STATUS
========================================================= */

function renderEnvStatus() {

  const stats =
    computeEnvStats();


  if (!stats) {
    return;
  }


  const category =
    envAqiCategory(
      stats.avgAqi
    );


  const color =
    envAqiCategoryColor(
      stats.avgAqi
    );


  const textEl =
    document.getElementById(
      "envStatusText"
    );


  const dotEl =
    document.getElementById(
      "envStatusDot"
    );


  if (textEl) {

    textEl.textContent =
      category.toUpperCase() +
      " AIR QUALITY";
  }


  if (dotEl) {

    dotEl.classList.remove(
      "status-offline"
    );


    if (color === "red") {

      dotEl.style.background =
        "var(--red)";

      dotEl.style.boxShadow =
        "0 0 10px var(--red)";

    } else if (
      color === "yellow"
    ) {

      dotEl.style.background =
        "var(--amber)";

      dotEl.style.boxShadow =
        "0 0 10px var(--amber)";

    } else {

      dotEl.style.background =
        "var(--green)";

      dotEl.style.boxShadow =
        "0 0 10px var(--green)";
    }
  }
}


/* =========================================================
   WORST / BEST AQI
========================================================= */

function renderWorstBestAqiZone() {

  const stats =
    computeEnvStats();


  if (
    !stats ||
    !stats.worstZone ||
    !stats.bestZone
  ) {
    return;
  }


  const worstNameEl =
    document.getElementById(
      "worstAqiZoneName"
    );


  const worstValEl =
    document.getElementById(
      "worstAqiZoneValue"
    );


  const worstBadgeEl =
    document.getElementById(
      "worstAqiZoneBadge"
    );


  if (worstNameEl) {

    worstNameEl.textContent =
      stats.worstZone.name +
      " (" +
      stats.worstZone.city +
      ")";
  }


  if (worstValEl) {

    worstValEl.textContent =
      stats.worstZone.aqi;
  }


  if (worstBadgeEl) {

    worstBadgeEl.textContent =
      envAqiCategory(
        stats.worstZone.aqi
      );


    worstBadgeEl.className =
      "badge " +
      congestionBadgeClass(
        envAqiCategoryColor(
          stats.worstZone.aqi
        ) === "red"
          ? 80
          : envAqiCategoryColor(
              stats.worstZone.aqi
            ) === "yellow"
            ? 50
            : 0
      );
  }


  const bestNameEl =
    document.getElementById(
      "bestAqiZoneName"
    );


  const bestValEl =
    document.getElementById(
      "bestAqiZoneValue"
    );


  const bestBadgeEl =
    document.getElementById(
      "bestAqiZoneBadge"
    );


  if (bestNameEl) {

    bestNameEl.textContent =
      stats.bestZone.name +
      " (" +
      stats.bestZone.city +
      ")";
  }


  if (bestValEl) {

    bestValEl.textContent =
      stats.bestZone.aqi;
  }


  if (bestBadgeEl) {

    bestBadgeEl.textContent =
      envAqiCategory(
        stats.bestZone.aqi
      );


    bestBadgeEl.className =
      "badge " +
      congestionBadgeClass(
        envAqiCategoryColor(
          stats.bestZone.aqi
        ) === "red"
          ? 80
          : envAqiCategoryColor(
              stats.bestZone.aqi
            ) === "yellow"
            ? 50
            : 0
      );
  }
}


/* =========================================================
   ENVIRONMENT INSIGHT
========================================================= */

function renderEnvInsight() {

  const el =
    document.getElementById(
      "envInsightText"
    );


  const stats =
    computeEnvStats();


  if (!el || !stats) {
    return;
  }


  const overallCategory =
    envAqiCategory(
      stats.avgAqi
    ).toLowerCase();


  let text =
    `Air quality is currently ${overallCategory} overall, averaging AQI ${stats.avgAqi} across ${stats.zoneCount} monitored zones. `;


  text +=
    `${stats.worstZone.name} (${stats.worstZone.city}) has the highest AQI at ${stats.worstZone.aqi}, `;


  text +=
    `while ${stats.bestZone.name} (${stats.bestZone.city}) has the cleanest air at AQI ${stats.bestZone.aqi}.`;


  el.textContent =
    text;
}


/* =========================================================
   ENVIRONMENT ALERTS
========================================================= */

function renderEnvironmentAlerts() {

  const list =
    document.getElementById(
      "envAlertsList"
    );


  if (!list) {
    return;
  }


  const priorityOrder = {
    high: 1,
    medium: 2,
    low: 3
  };


  /* Backend alerts are now the single source */
  const allAlerts =
    Array.isArray(ALERTS)
      ? ALERTS
      : [];


  const envKeywords = [

    "air quality",

    "aqi",

    "pollution",

    "smog",

    "weather",

    "rain",

    "flood"

  ];


  const envAlerts =
    allAlerts
      .filter((alert) => {

        const text =
          String(
            alert.text ||
            alert.message ||
            alert.title ||
            ""
          ).toLowerCase();


        return envKeywords.some(
          (keyword) =>
            text.includes(keyword)
        );

      })
      .sort(
        (a, b) =>
          priorityOrder[a.priority] -
          priorityOrder[b.priority]
      );


  if (envAlerts.length === 0) {

    list.innerHTML =
      `<li class="alert-empty">
        No environment-related alerts.
      </li>`;

    return;
  }


  list.innerHTML =
    envAlerts.map(
      (alert) => `
        <li>

          <span>
            ${
              alert.source === "ai"
                ? '<span class="ai-tag">AI</span> '
                : ""
            }

            ${
              alert.text ||
              alert.message ||
              alert.title ||
              "Environment Alert"
            }
          </span>

          <span class="priority-tag priority-${alert.priority}">
            ${String(alert.priority || "low").toUpperCase()}
          </span>

          <span class="time">
            ${alert.time || "Just now"}
          </span>

        </li>
      `
    ).join("");
}
/* =========================================================
   AQI GRID
========================================================= */

function renderZoneAqiGrid() {

  const aqiGrid =
    document.getElementById(
      "aqiGrid"
    );


  if (
    !aqiGrid ||
    typeof ZONES === "undefined"
  ) {
    return;
  }


  const filteredZones =
    getFilteredZones();


  const countEl =
    document.getElementById(
      "envZoneResultCount"
    );


  if (countEl) {

    countEl.textContent =
      `${filteredZones.length} zone(s)`;
  }


  if (
    filteredZones.length === 0
  ) {

    aqiGrid.innerHTML =
      `<div class="alert-empty">
        No zones match this search/filter.
      </div>`;

    return;
  }


  aqiGrid.innerHTML =
    filteredZones.map(
      (zone) => {

        let color =
          "var(--green)";


        if (
          zone.status === "red"
        ) {

          color =
            "var(--red)";
        }


        if (
          zone.status === "yellow"
        ) {

          color =
            "var(--amber)";
        }


        return `

          <div class="aqi-tile">

            <strong>
              ${zone.name}
            </strong>

            <span class="muted">
              ${zone.city}
            </span>

            <span
              class="aqi-num"
              style="color:${color}"
            >
              ${zone.aqi}
            </span>

            <span
              class="zone-status ${statusClass(
                zone.status
              )}"
            >
              ${envAqiCategory(
                zone.aqi
              ).toUpperCase()}
            </span>

          </div>

        `;
      }
    ).join("");
}


/* =========================================================
   ENVIRONMENT CONTROLS
========================================================= */

let envControlsInitialized =
  false;


function initEnvironmentControls() {

  if (envControlsInitialized) {
    return;
  }


  envControlsInitialized =
    true;


  const searchInput =
    document.getElementById(
      "envSearchInput"
    );


  if (searchInput) {

    searchInput.addEventListener(
      "input",
      (event) => {

        envZoneSearch =
          event.target.value;

        renderZoneAqiGrid();
      }
    );
  }


  document
    .querySelectorAll(
      "#envFilters .alert-filter-btn"
    )
    .forEach((btn) => {

      btn.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              "#envFilters .alert-filter-btn"
            )
            .forEach((b) => {

              b.classList.remove(
                "active"
              );
            });


          btn.classList.add(
            "active"
          );


          envZoneFilter =
            btn.dataset.aqiFilter;


          renderZoneAqiGrid();
        }
      );

    });
}


/* =========================================================
   OVERVIEW PAGE
========================================================= */

function renderOverview() {

  if (
    typeof ZONES === "undefined" ||
    typeof ROADS === "undefined" ||
    typeof ALERTS === "undefined" ||
    typeof WEATHER === "undefined"
  ) {

    console.error(
      "Dashboard data not loaded."
    );

    return;
  }


  const avgAqi =
    Math.round(
      ZONES.reduce(
        (total, zone) =>
          total +
          Number(zone.aqi || 0),
        0
      ) / ZONES.length
    );


  const avgCongestion =
    Math.round(
      ROADS.reduce(
        (total, road) =>
          total +
          Number(
            road.congestion || 0
          ),
        0
      ) / ROADS.length
    );


  const kpiAqi =
    document.getElementById(
      "kpiAqi"
    );


  if (kpiAqi) {

    kpiAqi.textContent =
      avgAqi;
  }


  const kpiTraffic =
    document.getElementById(
      "kpiTraffic"
    );


  if (kpiTraffic) {

    kpiTraffic.textContent =
      avgCongestion + "%";
  }


  const totalAlerts =
  Array.isArray(ALERTS)
    ? ALERTS.length
    : 0;


  const kpiAlerts =
    document.getElementById(
      "kpiAlerts"
    );


  if (kpiAlerts) {

    kpiAlerts.textContent =
      totalAlerts;
  }


  const kpiTemp =
    document.getElementById(
      "kpiTemp"
    );


  if (kpiTemp) {

    kpiTemp.textContent =
      WEATHER.temp + "°C";
  }


  const kpiHumidity =
    document.getElementById(
      "kpiHumidity"
    );


  if (kpiHumidity) {

    kpiHumidity.textContent =
      "Humidity " +
      WEATHER.humidity +
      "%";
  }


  const alertCount =
    document.getElementById(
      "alertCount"
    );


  if (alertCount) {

    alertCount.textContent =
      totalAlerts;
  }


  /* Existing Health Score */

  if (
    typeof renderHealthScore ===
    "function"
  ) {

    renderHealthScore();
  }


  /* =====================================================
     CHUNK 5 OVERVIEW UPGRADES
  ====================================================== */

  renderInfrastructureScore();

  updateKpiExtras(
    avgAqi,
    avgCongestion,
    totalAlerts
  );

  renderSystemStatus();

  renderCityStatusPanels();

  renderCitySummary();

  renderPriorityAlerts();


  /* =====================================================
     EXISTING ZONE GRID
  ====================================================== */

  const zoneGrid =
    document.getElementById(
      "zoneGrid"
    );


  if (!zoneGrid) {
    return;
  }


  zoneGrid.innerHTML =
    ZONES.map(
      (zone) => `

        <div class="zone-tile">

          <strong>
            ${zone.name}
          </strong>

          <span class="muted">
            ${zone.city} · AQI ${zone.aqi}
          </span>

          <span
            class="zone-status ${statusClass(
              zone.status
            )}"
          >
            ${zone.status.toUpperCase()}
          </span>

        </div>

      `
    ).join("");
}


/* =========================================================
   TRAFFIC PAGE
========================================================= */

function renderTraffic() {

  const tbody =
    document.querySelector(
      "#trafficTable tbody"
    );


  if (tbody) {

    const filteredRoads =
      getFilteredRoads();


    tbody.innerHTML =
      filteredRoads.length

        ? filteredRoads
            .map(
              (road) => `

                <tr>

                  <td>
                    ${road.name}
                  </td>

                  <td>
                    ${road.zone}
                  </td>

                  <td>
                    ${road.speed} km/h
                  </td>

                  <td>
                    ${Number(
                      road.vehicles || 0
                    ).toLocaleString()}
                  </td>

                  <td>
                    ${road.congestion}%
                  </td>

                  <td>

                    <span
                      class="badge ${congestionBadgeClass(
                        road.congestion
                      )}"
                    >
                      ${congestionLabel(
                        road.congestion
                      )}
                    </span>

                  </td>

                </tr>

              `
            )
            .join("")

        : `

            <tr>

              <td
                colspan="6"
                class="alert-empty"
              >
                No roads match this search/filter.
              </td>

            </tr>

          `;
  }


  /* =====================================================
     TRAFFIC HEATMAP
  ====================================================== */

  const heatmap =
    document.getElementById(
      "heatmap"
    );


  if (
    heatmap &&
    typeof ROADS !== "undefined"
  ) {

    heatmap.innerHTML =
      ROADS.map(
        (road) => `

          <div class="heat-row">

            <span>
              ${road.name}
            </span>

            <div class="heat-bar-bg">

              <div
                class="heat-bar-fill"
                style="
                  width:${road.congestion}%;
                  background:${congestionColor(
                    road.congestion
                  )}
                "
              ></div>

            </div>

            <span
              style="
                width:36px;
                text-align:right;
                color:var(--text)
              "
            >
              ${road.congestion}%
            </span>

          </div>

        `
      ).join("");
  }


  /* =====================================================
     INCIDENTS
  ====================================================== */

  const incidentList =
    document.getElementById(
      "incidentList"
    );


  if (
    incidentList &&
    typeof INCIDENTS !== "undefined"
  ) {

    incidentList.innerHTML =
      INCIDENTS.map(
        (incident) => `

          <li>

            <span>
              ${incident.text}
            </span>

            <span
              class="priority-tag priority-${incident.priority}"
            >
              ${incident.priority.toUpperCase()}
            </span>

            <span class="time">
              ${incident.time}
            </span>

          </li>

        `
      ).join("");
  }


  /* =====================================================
     TRAFFIC UPGRADE
  ====================================================== */

  renderTrafficKPIs();

  renderMostCongestedRoad();

  renderMostCongestedRoadCard();

  renderTrafficStatus();

  renderTrafficInsight();
}


/* =========================================================
   ENVIRONMENT PAGE
========================================================= */

function renderEnvironment() {

  const weatherTemp =
    document.getElementById(
      "weatherTemp"
    );


  if (
    weatherTemp &&
    typeof WEATHER !== "undefined"
  ) {

    weatherTemp.textContent =
      WEATHER.temp + "°C";
  }


  const weatherHumidity =
    document.getElementById(
      "weatherHumidity"
    );


  if (
    weatherHumidity &&
    typeof WEATHER !== "undefined"
  ) {

    weatherHumidity.textContent =
      WEATHER.humidity + "%";
  }


  const weatherWind =
    document.getElementById(
      "weatherWind"
    );


  if (
    weatherWind &&
    typeof WEATHER !== "undefined"
  ) {

    weatherWind.textContent =
      WEATHER.wind + " km/h";
  }


  const weatherCond =
    document.getElementById(
      "weatherCond"
    );


  if (
    weatherCond &&
    typeof WEATHER !== "undefined"
  ) {

    weatherCond.textContent =
      WEATHER.condition;
  }


  /* =====================================================
     ENVIRONMENT UPGRADE
  ====================================================== */

  renderEnvironmentKPIs();

  renderEnvStatus();

  renderWorstBestAqiZone();

  renderEnvInsight();

  renderEnvironmentAlerts();

  renderZoneAqiGrid();
}


/* =========================================================
   ALERTS
========================================================= */

let alertFilter = "all";
let alertSearch = "";


/* =========================================================
   RENDER ALERTS
========================================================= */

function renderAlerts() {

  const alertList =
    document.getElementById(
      "alertList"
    );

  if (!alertList) {
    return;
  }


  /* =========================
     ALERT SOURCE
  ========================= */

  const source =
    Array.isArray(ALERTS)
      ? ALERTS
      : [];


  /* =========================
     FILTER BY SEVERITY
  ========================= */

  let filtered =
    source.filter(
      (alert) => {

        const severity =
          String(
            alert.severity ||
            alert.priority ||
            "low"
          ).toLowerCase();

        return (
          alertFilter === "all" ||
          severity ===
            alertFilter.toLowerCase()
        );
      }
    );


  /* =========================
     SEARCH
  ========================= */

  if (
    alertSearch.trim() !== ""
  ) {

    const query =
      alertSearch.toLowerCase();

    filtered =
      filtered.filter(
        (alert) =>
          String(
            alert.text ||
            alert.message ||
            alert.title ||
            ""
          )
            .toLowerCase()
            .includes(query)
      );
  }


  /* =========================
     SORT
  ========================= */

  const priorityOrder = {

    critical: 1,
    high: 2,
    medium: 3,
    low: 4

  };


  const sortedAlerts =
    [...filtered].sort(
      (a, b) => {

        const priorityA =
          String(
            a.severity ||
            a.priority ||
            "low"
          ).toLowerCase();

        const priorityB =
          String(
            b.severity ||
            b.priority ||
            "low"
          ).toLowerCase();

        return (
          (priorityOrder[priorityA] || 99) -
          (priorityOrder[priorityB] || 99)
        );
      }
    );


  /* =========================
     RESULT COUNT
  ========================= */

  const countEl =
    document.getElementById(
      "alertResultCount"
    );

  if (countEl) {

    countEl.textContent =
      `${sortedAlerts.length} alert(s)`;
  }


  /* =========================
     NO RESULTS
  ========================= */

  if (
    sortedAlerts.length === 0
  ) {

    alertList.innerHTML =
      `<li class="alert-empty">
        No alerts match this filter.
      </li>`;

    return;
  }


  /* =========================
     RENDER
  ========================= */

  alertList.innerHTML =
    sortedAlerts
      .map(
        (alert) => {

          const severity =
            String(
              alert.severity ||
              alert.priority ||
              "low"
            ).toLowerCase();

          return `

            <li>

              <span>

                ${
                  alert.source === "ai"
                    ? '<span class="ai-tag">AI</span> '
                    : ""
                }

                ${
                  alert.text ||
                  alert.message ||
                  alert.title ||
                  "Smart City Alert"
                }

              </span>


              <span
                class="priority-tag priority-${severity}"
              >
                ${severity.toUpperCase()}
              </span>


              <span class="time">

                ${
                  alert.time ||
                  "Just now"
                }

              </span>

            </li>

          `;
        }
      )
      .join("");
}


/* =========================================================
   ALERT FILTER EVENTS
========================================================= */

document.addEventListener(
  "click",
  (event) => {

    const filterBtn =
      event.target.closest(
        ".alert-filter-btn"
      );

    if (!filterBtn) {
      return;
    }


    /* Traffic filters ko ignore karo */

    if (
      filterBtn.closest(
        "#trafficFilters"
      )
    ) {
      return;
    }


    /* Environment filters ko ignore karo */

    if (
      filterBtn.closest(
        "#envFilters"
      )
    ) {
      return;
    }


    /* Active button */

    document
      .querySelectorAll(
        ".alert-filter-btn"
      )
      .forEach(
        (btn) => {

          if (
            !btn.closest(
              "#trafficFilters"
            ) &&
            !btn.closest(
              "#envFilters"
            )
          ) {

            btn.classList.remove(
              "active"
            );
          }
        }
      );


    filterBtn.classList.add(
      "active"
    );


    /* Filter value */

    alertFilter =
      filterBtn.dataset.filter ||
      "all";


    renderAlerts();
  }
);


/* =========================================================
   ALERT SEARCH
========================================================= */

document.addEventListener(
  "input",
  (event) => {

    if (
      event.target &&
      event.target.id ===
        "alertSearchInput"
    ) {

      alertSearch =
        event.target.value;

      renderAlerts();
    }
  }
);

/* =========================================================
   CHARTS
========================================================= */

let trafficChart = null;
let aqiChart = null;
let pollutantChart = null;


function renderCharts() {

  if (
    typeof Chart === "undefined"
  ) {

    console.error(
      "Chart.js is not loaded."
    );

    return;
  }


  /* =====================================================
     TRAFFIC TREND CHART
  ====================================================== */

  const trafficCanvas =
    document.getElementById(
      "trafficTrendChart"
    );


  if (trafficCanvas) {

    if (trafficChart) {
      trafficChart.destroy();
    }


    trafficChart =
      new Chart(
        trafficCanvas,
        {

          type: "line",

          data: {

            labels:
              TRAFFIC_TREND_LABELS,

            datasets: [

              {

                label:
                  "Congestion %",

                data:
                  TRAFFIC_TREND_DATA,

                borderColor:
                  "#00e5ff",

                backgroundColor:
                  "rgba(0,229,255,0.12)",

                fill: true,

                tension: 0.4,

                pointRadius: 3

              }

            ]
          },


          options: {

            responsive: true,

            maintainAspectRatio:
              false,


            plugins: {

              legend: {

                display: false
              }
            },


            scales: {

              x: {

                grid: {

                  color:
                    "rgba(255,255,255,0.05)"
                }
              },


              y: {

                beginAtZero: true,

                max: 100,


                grid: {

                  color:
                    "rgba(255,255,255,0.05)"
                }
              }

            }

          }

        }
      );
  }


  /* =====================================================
     AQI CHART
  ====================================================== */

  const aqiCanvas =
    document.getElementById(
      "aqiSectorChart"
    );


  if (aqiCanvas) {

    if (aqiChart) {
      aqiChart.destroy();
    }


    const chartZones =
      typeof ZONES !== "undefined" &&
      ZONES.length

        ? [
            ...ZONES
          ]
            .sort(
              (a, b) =>
                b.aqi - a.aqi
            )
            .slice(0, 6)

        : [];


    aqiChart =
      new Chart(
        aqiCanvas,
        {

          type: "bar",

          data: {

            labels:
              chartZones.length

                ? chartZones.map(
                    (zone) =>
                      zone.name
                  )

                : [
                    "F-6",
                    "F-7",
                    "G-9",
                    "Saddar",
                    "Bahria Town"
                  ],


            datasets: [

              {

                label: "AQI",


                data:
                  chartZones.length

                    ? chartZones.map(
                        (zone) =>
                          zone.aqi
                      )

                    : [
                        92,
                        78,
                        140,
                        158,
                        65
                      ],


                backgroundColor:
                  chartZones.length

                    ? chartZones.map(
                        (zone) =>
                          zone.status ===
                          "red"

                            ? "#ff4d5e"

                            : zone.status ===
                              "yellow"

                              ? "#ffb020"

                              : "#00ffa3"
                      )

                    : [
                        "#ffb020",
                        "#00ffa3",
                        "#ff4d5e",
                        "#ff4d5e",
                        "#00ffa3"
                      ],


                borderRadius: 6

              }

            ]

          },


          options: {

            responsive: true,

            maintainAspectRatio:
              false,


            plugins: {

              legend: {

                display: false
              }

            },


            scales: {

              x: {

                grid: {

                  display: false
                }
              },


              y: {

                beginAtZero: true,


                grid: {

                  color:
                    "rgba(255,255,255,0.05)"
                }
              }

            }

          }

        }
      );
  }


  /* =====================================================
     POLLUTANT CHART
  ====================================================== */

  const pollutantCanvas =
    document.getElementById(
      "pollutantChart"
    );


  if (pollutantCanvas) {

    if (pollutantChart) {
      pollutantChart.destroy();
    }


    pollutantChart =
      new Chart(
        pollutantCanvas,
        {

          type: "bar",

          data: {

            labels:
              POLLUTANTS.labels,


            datasets: [

              {

                label:
                  "µg/m³",

                data:
                  POLLUTANTS.values,

                backgroundColor:
                  "#00e5ff",

                borderRadius: 6

              }

            ]

          },


          options: {

            responsive: true,

            maintainAspectRatio:
              false,

            indexAxis: "y",


            plugins: {

              legend: {

                display: false
              }

            },


            scales: {

              x: {

                beginAtZero: true,


                grid: {

                  color:
                    "rgba(255,255,255,0.05)"
                }

              },


              y: {

                grid: {

                  display: false
                }

              }

            }

          }

        }
      );
  }
}


/* =========================================================
   CHUNK 8 — FLOOD + WASTE + WATER
========================================================= */

function severityBadgeClass(level) {

  const l =
    String(level || "").toUpperCase();

  if (l === "CRITICAL") return "priority-high";
  if (l === "HIGH") return "priority-high";
  if (l === "MEDIUM") return "priority-medium";

  return "priority-low";
}


function computeFloodPriority(zone) {

  const score =
    (zone.risk === "CRITICAL" ? 40 : zone.risk === "HIGH" ? 25 : 10) +
    (zone.waterLevel / 2) +
    (zone.drainage === "Blocked" ? 20 : zone.drainage === "Partial" ? 10 : 0);

  if (score >= 70) return "CRITICAL";
  if (score >= 50) return "HIGH";
  if (score >= 30) return "MEDIUM";

  return "LOW";
}


function computeWastePriority(zone) {

  if (zone.status === "Overflowing" || zone.level >= 90) return "CRITICAL";
  if (zone.level >= 75) return "HIGH";
  if (zone.level >= 50) return "MEDIUM";

  return "LOW";
}


function renderFloodSection() {

  if (typeof FLOOD_DATA === "undefined") return;

  const dot =
    document.getElementById("floodStatusDot");

  const text =
    document.getElementById("floodStatusText");


  if (text) {
    text.textContent =
      FLOOD_DATA.overallRisk + " FLOOD RISK";
  }


  if (dot) {

    const critical =
      FLOOD_DATA.overallRisk === "CRITICAL" ||
      FLOOD_DATA.overallRisk === "HIGH";

    dot.style.background =
      critical ? "var(--red)" : "var(--amber)";

    dot.style.boxShadow =
      "0 0 10px " + dot.style.background;
  }


  const set = (id, val) => {

    const el =
      document.getElementById(id);

    if (el) el.textContent = val;
  };


  set("floodKpiWaterLevel", FLOOD_DATA.waterLevel + "%");
  set("floodKpiRainfall", FLOOD_DATA.rainfall + " mm");
  set("floodKpiBlocked", FLOOD_DATA.blockedDrains);
  set("floodKpiCritical", FLOOD_DATA.criticalZones);


  const countEl =
    document.getElementById("floodResultCount");

  if (countEl) {
    countEl.textContent =
      FLOOD_DATA.zones.length + " area(s)";
  }


  const tbody =
    document.querySelector("#floodTable tbody");

  if (tbody) {

    tbody.innerHTML =
      FLOOD_DATA.zones.map(
        (z) => `
          <tr>
            <td>${z.location}</td>
            <td>${z.city}</td>
            <td><span class="badge ${severityBadgeClass(z.risk)}">${z.risk}</span></td>
            <td>${z.waterLevel}%</td>
            <td>${z.drainage}</td>
            <td><span class="badge ${severityBadgeClass(computeFloodPriority(z))}">${computeFloodPriority(z)}</span></td>
          </tr>
        `
      ).join("");
  }
}


function renderWasteSection() {

  if (typeof WASTE_DATA === "undefined") return;

  const set = (id, val) => {

    const el =
      document.getElementById(id);

    if (el) el.textContent = val;
  };


  set("wasteKpiTotal", WASTE_DATA.totalWaste + " t/day");
  set("wasteKpiCollected", WASTE_DATA.collected + " t/day");
  set("wasteKpiEfficiency", WASTE_DATA.efficiency + "% efficiency");
  set("wasteKpiOverflow", WASTE_DATA.overflowingBins);
  set("wasteKpiPending", WASTE_DATA.pendingPickups);
  set("wasteActiveTrucks", WASTE_DATA.activeVehicles);


  const text =
    document.getElementById("wasteStatusText");

  if (text) {
    text.textContent =
      WASTE_DATA.efficiency + "% COLLECTION EFFICIENCY";
  }


  const bar =
    document.getElementById("wasteProgressBar");

  const label =
    document.getElementById("wasteProgressLabel");

  if (bar) bar.style.width = WASTE_DATA.efficiency + "%";
  if (label) label.textContent = WASTE_DATA.efficiency + "%";


  const countEl =
    document.getElementById("wasteResultCount");

  if (countEl) {
    countEl.textContent =
      WASTE_DATA.zones.length + " zone(s)";
  }


  const tbody =
    document.querySelector("#wasteTable tbody");

  if (tbody) {

    tbody.innerHTML =
      WASTE_DATA.zones.map(
        (z) => `
          <tr>
            <td>${z.area}</td>
            <td>${z.city}</td>
            <td>${z.level}%</td>
            <td>${z.status}</td>
            <td><span class="badge ${severityBadgeClass(computeWastePriority(z))}">${computeWastePriority(z)}</span></td>
            <td>${z.lastCollection}</td>
          </tr>
        `
      ).join("");
  }
}


function renderWaterSection() {

  if (typeof WATER_DATA === "undefined") return;

  const set = (id, val) => {

    const el =
      document.getElementById(id);

    if (el) el.textContent = val;
  };


  set("waterKpiDemand", WATER_DATA.demand + " ML");
  set("waterKpiSupply", WATER_DATA.supply + " ML");
  set("waterKpiAvailability", WATER_DATA.availability + "% availability");
  set("waterKpiReported", WATER_DATA.reported);
  set("waterKpiResolved", WATER_DATA.resolved);
  set("waterActiveLeaks", WATER_DATA.activeLeaks);


  const text =
    document.getElementById("waterStatusText");

  if (text) {
    text.textContent =
      WATER_DATA.availability + "% WATER AVAILABILITY";
  }


  const isl =
    WATER_DATA.citySupply.Islamabad;

  const rwp =
    WATER_DATA.citySupply.Rawalpindi;


  set("waterIslPct", isl.supply + "%");
  set("waterRwpPct", rwp.supply + "%");


  const islBadge =
    document.getElementById("waterIslBadge");

  const rwpBadge =
    document.getElementById("waterRwpBadge");


  if (islBadge) {
    islBadge.textContent = isl.status;
    islBadge.className = "badge priority-low";
  }

  if (rwpBadge) {
    rwpBadge.textContent = rwp.status;
    rwpBadge.className = "badge priority-medium";
  }


  const countEl =
    document.getElementById("waterResultCount");

  if (countEl) {
    countEl.textContent =
      WATER_DATA.leaks.length + " leak(s)";
  }


  const tbody =
    document.querySelector("#waterTable tbody");

  if (tbody) {

    tbody.innerHTML =
      WATER_DATA.leaks.map(
        (l) => `
          <tr>
            <td>${l.location}</td>
            <td>${l.city}</td>
            <td><span class="badge ${severityBadgeClass(l.severity)}">${l.severity}</span></td>
            <td>${l.loss}</td>
            <td>${l.status}</td>
            <td>${l.reported}</td>
          </tr>
        `
      ).join("");
  }
}


function renderOpsHealthSummary() {

  const grid =
    document.getElementById("opsHealthGrid");

  if (
    !grid ||
    typeof FLOOD_DATA === "undefined" ||
    typeof WASTE_DATA === "undefined" ||
    typeof WATER_DATA === "undefined"
  ) {
    return;
  }


  const wasteHealth =
    WASTE_DATA.efficiency >= 85
      ? "STABLE"
      : WASTE_DATA.efficiency >= 70
        ? "WARNING"
        : "CRITICAL";

  const waterHealth =
    WATER_DATA.availability >= 90
      ? "STABLE"
      : WATER_DATA.availability >= 75
        ? "WARNING"
        : "CRITICAL";


  const toSeverity = (label) =>
    label === "STABLE"
      ? "LOW"
      : label === "WARNING"
        ? "MEDIUM"
        : "CRITICAL";


  grid.innerHTML = `
    <div class="ops-health-item">
      <span>🌊 Flood Risk</span>
      <span class="badge ${severityBadgeClass(FLOOD_DATA.overallRisk)}">${FLOOD_DATA.overallRisk}</span>
    </div>
    <div class="ops-health-item">
      <span>🗑️ Waste Health</span>
      <span class="badge ${severityBadgeClass(toSeverity(wasteHealth))}">${wasteHealth}</span>
    </div>
    <div class="ops-health-item">
      <span>💧 Water Health</span>
      <span class="badge ${severityBadgeClass(toSeverity(waterHealth))}">${waterHealth}</span>
    </div>
  `;
}


function renderCityOps() {

  renderFloodSection();

  renderWasteSection();

  renderWaterSection();

  renderOpsHealthSummary();
}


/* =========================================================
   LIVE DATA SIMULATION
========================================================= */

function simulateLiveUpdates() {

  setInterval(
    () => {

      if (
        typeof ROADS ===
        "undefined"
      ) {
        return;
      }


      /* =================================================
         UPDATE TRAFFIC
      ================================================== */

      ROADS.forEach(
        (road) => {

          const change =
            Math.floor(
              Math.random() * 11
            ) - 5;


          road.congestion =
            Math.max(
              10,
              Math.min(
                95,
                road.congestion +
                  change
              )
            );
        }
      );


      /* =================================================
         REFRESH TRAFFIC
      ================================================== */

      renderTraffic();


      const avgCongestion =
        Math.round(
          ROADS.reduce(
            (total, road) =>
              total +
              Number(
                road.congestion || 0
              ),
            0
          ) / ROADS.length
        );


      const kpiTraffic =
        document.getElementById(
          "kpiTraffic"
        );


      if (kpiTraffic) {

        kpiTraffic.textContent =
          avgCongestion + "%";
      }


      const trafficUpdated =
        document.getElementById(
          "trafficUpdated"
        );


      if (trafficUpdated) {

        trafficUpdated.textContent =
          "updated just now";
      }


      /* =================================================
         ALERTS
      ================================================== */

      renderAlerts();


      if (
        typeof renderHealthScore ===
        "function"
      ) {

        renderHealthScore();
      }

const totalAlerts =
  Array.isArray(ALERTS)
    ? ALERTS.length
    : 0;

const kpiAlerts = document.getElementById("kpiAlerts");
if (kpiAlerts) {
  kpiAlerts.textContent = totalAlerts;
}

const alertCount = document.getElementById("alertCount");
if (alertCount) {
  alertCount.textContent = totalAlerts;
}

      /* =================================================
         OVERVIEW LIVE UPDATE
      ================================================== */

      const avgAqiNow =
        typeof ZONES !==
          "undefined" &&
        ZONES.length

          ? Math.round(
              ZONES.reduce(
                (total, zone) =>
                  total +
                  Number(
                    zone.aqi || 0
                  ),
                0
              ) / ZONES.length
            )

          : 0;


      renderInfrastructureScore();


      updateKpiExtras(
        avgAqiNow,
        avgCongestion,
        totalAlerts
      );


      renderSystemStatus();

      renderCityStatusPanels();

      renderCitySummary();

      renderPriorityAlerts();


      /* =================================================
         ENVIRONMENT LIVE UPDATE
      ================================================== */

      const environmentPage =
        document.getElementById(
          "page-environment"
        );


      if (
        environmentPage &&
        environmentPage.classList.contains(
          "active"
        )
      ) {

        renderEnvironmentKPIs();

        renderEnvStatus();

        renderWorstBestAqiZone();

        renderEnvInsight();

        renderEnvironmentAlerts();

        renderZoneAqiGrid();
      }


      /* =================================================
         INSIGHTS LIVE UPDATE
      ================================================== */

      const insightsPage =
        document.getElementById(
          "page-insights"
        );


      if (
        insightsPage &&
        insightsPage.classList.contains(
          "active"
        )
      ) {

        if (
          typeof renderInsights ===
          "function"
        ) {

          renderInsights();
        }


        if (
          typeof renderPredictions ===
          "function"
        ) {

          renderPredictions();
        }


        if (
          typeof renderFloodPredictions ===
          "function"
        ) {

          renderFloodPredictions();
        }


        if (
          typeof renderWastePredictions ===
          "function"
        ) {

          renderWastePredictions();
        }


        if (
          typeof renderWaterLeakPredictions ===
          "function"
        ) {

          renderWaterLeakPredictions();
        }
      }


      /* =================================================
         CITY OPS LIVE UPDATE — CHUNK 8
      ================================================== */

      const cityOpsPage =
        document.getElementById(
          "page-cityops"
        );


      if (
        cityOpsPage &&
        cityOpsPage.classList.contains(
          "active"
        ) &&
        typeof renderCityOps ===
        "function"
      ) {

        renderCityOps();
      }

    },
    5000
  );
}
// =========================================================
// DYNAMIC AI RECOMMENDED ACTIONS
// =========================================================

function renderAIRecommendedActions() {

  const grid =
    document.getElementById(
      "aiRecommendationGrid"
    );

  if (!grid) {
    return;
  }


  const actions = [];


  // =====================================================
  // TRAFFIC ANALYSIS
  // =====================================================

  const trafficData =
    typeof TRAFFIC_TREND_DATA !== "undefined" &&
    Array.isArray(TRAFFIC_TREND_DATA)
      ? TRAFFIC_TREND_DATA
      : [];


  if (trafficData.length) {

    const latestTraffic =
      Number(
        trafficData[
          trafficData.length - 1
        ]
      );


    if (latestTraffic >= 70) {

      actions.push({

        icon: "🚗",

        priority: "HIGH PRIORITY",

        title:
          "Activate Traffic Management Plan",

        description:
          `Current traffic congestion is ${latestTraffic}%. Deploy traffic officers and consider alternate routes for congested areas.`

      });

    } else if (latestTraffic >= 45) {

      actions.push({

        icon: "🚗",

        priority: "MEDIUM PRIORITY",

        title:
          "Monitor Traffic Conditions",

        description:
          `Traffic congestion is currently ${latestTraffic}%. Monitor major roads and prepare traffic management measures.`

      });

    }

  }


  // =====================================================
  // AQI ANALYSIS
  // =====================================================

  const zones =
    typeof ZONES !== "undefined" &&
    Array.isArray(ZONES)
      ? ZONES
      : [];


  if (zones.length) {

    const worstZone =
      [...zones].sort(
        (a, b) =>
          Number(b.aqi || 0) -
          Number(a.aqi || 0)
      )[0];


    if (
      worstZone &&
      Number(worstZone.aqi) >= 100
    ) {

      actions.push({

        icon: "🌫️",

        priority: "HIGH PRIORITY",

        title:
          "Respond to Poor Air Quality",

        description:
          `${worstZone.name} has an AQI of ${worstZone.aqi}. Increase air-quality monitoring and investigate possible pollution sources.`

      });

    }

  }


  // =====================================================
  // FLOOD RISK ANALYSIS
  // =====================================================

  if (
    typeof getFloodRisk === "function"
  ) {

    const flood =
      getFloodRisk();


    if (
      flood &&
      flood.risk === "High"
    ) {

      actions.push({

        icon: "🌊",

        priority: "URGENT",

        title:
          "Inspect High-Risk Drainage Areas",

        description:
          "Flood risk is currently high. Inspect drainage channels and prepare emergency response teams."

      });

    }

  }


  // =====================================================
  // WASTE ANALYSIS
  // =====================================================

  if (
    typeof getWasteOverflowPrediction ===
    "function"
  ) {

    const waste =
      getWasteOverflowPrediction();


    if (
      waste &&
      waste.risk === "High"
    ) {

      actions.push({

        icon: "🗑️",

        priority: "HIGH PRIORITY",

        title:
          "Dispatch Waste Collection Teams",

        description:
          "Waste overflow risk is high. Prioritize collection in affected areas."

      });

    }

  }


  // =====================================================
  // DEFAULT ACTION
  // =====================================================

  if (!actions.length) {

    actions.push({

      icon: "✅",

      priority: "NORMAL",

      title:
        "Continue City Monitoring",

      description:
        "Current city conditions are stable. Continue monitoring sensors and update recommendations when conditions change."

    });

  }


  // =====================================================
  // DISPLAY ACTIONS
  // =====================================================

  grid.innerHTML =
    actions
      .map(
        (action) => `

          <div class="ai-action-item">

            <div class="ai-action-icon">

              ${action.icon}

            </div>


            <div class="ai-action-content">

              <span class="ai-action-priority">

                ${action.priority}

              </span>


              <h4>

                ${action.title}

              </h4>


              <p>

                ${action.description}

              </p>

            </div>

          </div>

        `
      )
      .join("");

}
// =========================================================
// AI DECISION CENTER
// =========================================================

function renderAIDecisionCenter() {

  const decisionList =
    document.getElementById(
      "decisionList"
    );


  if (!decisionList) {
    return;
  }


  const decisions = [];


  // =====================================================
// WATER LEAKAGE
// =====================================================

const waterData =
  typeof WATER_DATA !== "undefined" &&
  WATER_DATA &&
  Array.isArray(WATER_DATA.leaks)
    ? WATER_DATA.leaks
    : [];

if (waterData.length) {

  const severityRank = {
    CRITICAL: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1
  };

  const highestRisk =
    [...waterData].sort(
      (a, b) =>
        (severityRank[String(b.severity || "").toUpperCase()] || 0) -
        (severityRank[String(a.severity || "").toUpperCase()] || 0)
    )[0];

  const severity =
    String(
      highestRisk?.severity || ""
    ).toUpperCase();

  if (
    highestRisk &&
    (severity === "CRITICAL" ||
      severity === "HIGH")
  ) {

    decisions.push({

      level:
        severity === "CRITICAL"
          ? "URGENT"
          : "HIGH",

      icon:
        severity === "CRITICAL"
          ? "🔴"
          : "🟠",

      title:
        `Inspect ${highestRisk.location} Water Pipeline`,

      description:
        `${severity} water leakage detected in ${highestRisk.city}.`,

      action:
        "Deploy water inspection and maintenance team."
    });
  }
}

  // =====================================================
  // TRAFFIC
  // =====================================================

  const trafficData =
    typeof TRAFFIC_TREND_DATA !==
      "undefined" &&
    Array.isArray(
      TRAFFIC_TREND_DATA
    )
      ? TRAFFIC_TREND_DATA
      : [];


  if (trafficData.length) {

    const latestTraffic =
      Number(
        trafficData[
          trafficData.length - 1
        ]
      );


    if (latestTraffic >= 70) {

      decisions.push({

        level: "HIGH",

        icon: "🟠",

        title:
          "Deploy Traffic Management Team",

        description:
          `Severe congestion detected (${latestTraffic}%).`,

        action:
          "Deploy traffic officers and activate alternate routes."

      });

    }

  }


  // =====================================================
  // AIR QUALITY
  // =====================================================

  const zones =
    typeof ZONES !== "undefined" &&
    Array.isArray(ZONES)
      ? ZONES
      : [];


  if (zones.length) {

    const worstZone =
      [...zones].sort(
        (a, b) =>
          Number(b.aqi || 0) -
          Number(a.aqi || 0)
      )[0];


    if (
      worstZone &&
      Number(worstZone.aqi) >= 100
    ) {

      decisions.push({

        level: "MEDIUM",

        icon: "🟡",

        title:
          "Increase Air-Quality Monitoring",

        description:
          `${worstZone.name} AQI is ${worstZone.aqi}.`,

        action:
          "Increase monitoring and investigate pollution sources."

      });

    }

  }


  // =====================================================
  // DEFAULT DECISION
  // =====================================================

  if (!decisions.length) {

    decisions.push({

      level: "NORMAL",

      icon: "🟢",

      title:
        "Continue City Monitoring",

      description:
        "No critical city conditions detected.",

      action:
        "Continue monitoring live sensor data."

    });

  }


  // =====================================================
  // DISPLAY DECISIONS
  // =====================================================

  decisionList.innerHTML =
    decisions
      .map(
        (decision) => `

          <div class="decision-item">

            <div class="decision-level">

              ${decision.icon}

              <span>

                ${decision.level}

              </span>

            </div>


            <div class="decision-content">

              <h4>

                ${decision.title}

              </h4>


              <p>

                ${decision.description}

              </p>


              <small>

                💡 ${decision.action}

              </small>

            </div>

          </div>

        `
      )
      .join("");

}
/* =========================================================
   INITIALIZE DASHBOARD
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    // ==========================================
    // LOAD BACKEND DATA FIRST
    // ==========================================

    const backendLoaded =
      await loadBackendData();


    if (!backendLoaded) {

      console.warn(
        "⚠️ Backend data load failed. Using existing frontend data."
      );

    }


    // ==========================================
    // RENDER DASHBOARD
    // ==========================================

    renderOverview();

    renderAIRecommendedActions();

    renderAIDecisionCenter();

    renderTraffic();

    renderEnvironment();

    renderAlerts();

    renderCharts();

    initQuickActions();

    initTrafficControls();

    initEnvironmentControls();


    // ==========================================
    // CITY OPS
    // ==========================================

    if (
      typeof renderCityOps ===
      "function"
    ) {

      renderCityOps();

    }


    // ==========================================
    // LIVE UPDATES
    // ==========================================

    simulateLiveUpdates();

  }
);