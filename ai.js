// =====================================================
// SMART CITY — AI LAYER
// CHUNK 7 — AI INSIGHTS & PREDICTIONS
// Rule-based AI insights, forecasting, risk analysis,
// recommendations, city health score & AI assistant
// Islamabad & Rawalpindi
// =====================================================


// =====================================================
// SAFE HELPERS
// =====================================================

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function getAlertsSafe() {
  if (typeof ALERTS !== "undefined" && Array.isArray(ALERTS)) {
    return ALERTS;
  }

  return [];
}


// =====================================================
// CITY HEALTH SCORE
// =====================================================

function computeHealthScore() {

  const zones = safeArray(
    typeof ZONES !== "undefined" ? ZONES : []
  );

  const roads = safeArray(
    typeof ROADS !== "undefined" ? ROADS : []
  );

  const allAlerts =
    typeof getAllAlerts === "function"
      ? getAllAlerts()
      : getAlertsSafe();

  const avgAqi = zones.length
    ? Math.round(
        zones.reduce(
          (total, zone) =>
            total + Number(zone.aqi || 0),
          0
        ) / zones.length
      )
    : 0;

  const avgCongestion = roads.length
    ? Math.round(
        roads.reduce(
          (total, road) =>
            total + Number(road.congestion || 0),
          0
        ) / roads.length
      )
    : 0;

  const highAlerts = allAlerts.filter(
    alert => alert.priority === "high"
  ).length;

  const medAlerts = allAlerts.filter(
    alert => alert.priority === "medium"
  ).length;

  const lowAlerts = allAlerts.filter(
    alert => alert.priority === "low"
  ).length;


  // ---------------------------------------------------
  // COMPONENT SCORES
  // ---------------------------------------------------

  const airScore = clamp(
    Math.round(100 - avgAqi / 2)
  );

  const trafficScore = clamp(
    Math.round(100 - avgCongestion)
  );

  const alertScore = clamp(
    Math.round(
      100 -
      (
        highAlerts * 15 +
        medAlerts * 7 +
        lowAlerts * 3
      )
    )
  );


  // ---------------------------------------------------
  // OVERALL SCORE
  // ---------------------------------------------------

  const overall = Math.round(
    airScore * 0.4 +
    trafficScore * 0.35 +
    alertScore * 0.25
  );


  let label = "Excellent";
  let color = "var(--green)";

  if (overall < 40) {
    label = "Critical";
    color = "var(--red)";
  } else if (overall < 60) {
    label = "Poor";
    color = "var(--red)";
  } else if (overall < 75) {
    label = "Fair";
    color = "var(--amber)";
  } else if (overall < 90) {
    label = "Good";
    color = "var(--green)";
  }


  return {
    overall,
    label,
    color,
    airScore,
    trafficScore,
    alertScore,
    avgAqi,
    avgCongestion,
    highAlerts,
    medAlerts,
    lowAlerts
  };
}


// =====================================================
// RENDER CITY HEALTH SCORE
// =====================================================

function renderHealthScore() {

  const health = computeHealthScore();

  const circle =
    document.getElementById("healthScoreCircle");

  const valueEl =
    document.getElementById("healthScoreValue");

  const labelEl =
    document.getElementById("healthScoreLabel");


  if (circle) {

    const radius = 54;

    const circumference =
      2 * Math.PI * radius;

    const offset =
      circumference -
      (health.overall / 100) *
      circumference;

    circle.style.strokeDasharray =
      circumference;

    circle.style.strokeDashoffset =
      offset;

    circle.style.stroke =
      health.color;
  }


  if (valueEl) {
    valueEl.textContent =
      health.overall;
  }


  if (labelEl) {

    labelEl.textContent =
      health.label;

    labelEl.style.color =
      health.color;
  }


  const airBar =
    document.getElementById("healthAirBar");

  const trafficBar =
    document.getElementById("healthTrafficBar");

  const alertBar =
    document.getElementById("healthAlertBar");


  if (airBar) {
    airBar.style.width =
      `${health.airScore}%`;
  }

  if (trafficBar) {
    trafficBar.style.width =
      `${health.trafficScore}%`;
  }

  if (alertBar) {
    alertBar.style.width =
      `${health.alertScore}%`;
  }


  const airVal =
    document.getElementById("healthAirVal");

  const trafficVal =
    document.getElementById("healthTrafficVal");

  const alertVal =
    document.getElementById("healthAlertVal");


  if (airVal) {
    airVal.textContent =
      health.airScore;
  }

  if (trafficVal) {
    trafficVal.textContent =
      health.trafficScore;
  }

  if (alertVal) {
    alertVal.textContent =
      health.alertScore;
  }
}


// =====================================================
// AI INSIGHTS
// =====================================================

function generateInsights() {

  const insights = [];

  const zones = safeArray(
    typeof ZONES !== "undefined"
      ? ZONES
      : []
  );

  const roads = safeArray(
    typeof ROADS !== "undefined"
      ? ROADS
      : []
  );


  // ===================================================
  // AIR QUALITY
  // ===================================================

  if (zones.length) {

    const worstZone =
      [...zones].sort(
        (a, b) =>
          Number(b.aqi || 0) -
          Number(a.aqi || 0)
      )[0];

    const bestZone =
      [...zones].sort(
        (a, b) =>
          Number(a.aqi || 0) -
          Number(b.aqi || 0)
      )[0];


    insights.push({

      icon: "🌫️",

      tag:
        worstZone.aqi >= 150
          ? "danger"
          : "warning",

      title:
        "Air quality hotspot",

      text:
        `${worstZone.name} (${worstZone.city}) currently has the highest AQI at ${worstZone.aqi}. Outdoor activity should be limited in this sector.`,

      confidence: 94,

      recommendation:
        "Increase air-quality monitoring and consider public health notifications."
    });


    insights.push({

      icon: "🌿",

      tag: "success",

      title:
        "Cleanest zone right now",

      text:
        `${bestZone.name} (${bestZone.city}) has the best air quality at AQI ${bestZone.aqi}.`,

      confidence: 91,

      recommendation:
        "Use this area as a reference point for current air-quality conditions."
    });


    // CITY COMPARISON

    const islZones =
      zones.filter(
        zone => zone.city === "ISL"
      );

    const rwpZones =
      zones.filter(
        zone => zone.city === "RWP"
      );


    const islAvg =
      islZones.length
        ? Math.round(
            islZones.reduce(
              (total, zone) =>
                total +
                Number(zone.aqi || 0),
              0
            ) / islZones.length
          )
        : 0;


    const rwpAvg =
      rwpZones.length
        ? Math.round(
            rwpZones.reduce(
              (total, zone) =>
                total +
                Number(zone.aqi || 0),
              0
            ) / rwpZones.length
          )
        : 0;


    insights.push({

      icon: "📊",

      tag: "info",

      title:
        "City air-quality comparison",

      text:
        islAvg === rwpAvg
          ? `Islamabad and Rawalpindi currently have the same average AQI of ${islAvg}.`
          : rwpAvg > islAvg
            ? `Rawalpindi's average AQI (${rwpAvg}) is currently higher than Islamabad's (${islAvg}).`
            : `Islamabad's average AQI (${islAvg}) is currently higher than Rawalpindi's (${rwpAvg}).`,

      confidence: 89,

      recommendation:
        "Prioritize interventions in the city with the higher average AQI."
    });
  }


  // ===================================================
  // TRAFFIC
  // ===================================================

  if (roads.length) {

    const worstRoad =
      [...roads].sort(
        (a, b) =>
          Number(b.congestion || 0) -
          Number(a.congestion || 0)
      )[0];


    const avgTraffic =
      Math.round(
        roads.reduce(
          (total, road) =>
            total +
            Number(road.congestion || 0),
          0
        ) / roads.length
      );


    insights.push({

      icon: "🚦",

      tag:
        worstRoad.congestion >= 85
          ? "danger"
          : "warning",

      title:
        "Heaviest congestion",

      text:
        `${worstRoad.name} is running at ${worstRoad.congestion}% congestion with an average speed of ${worstRoad.speed} km/h.`,

      confidence: 96,

      recommendation:
        "Consider alternate routing and deploy traffic management resources."
    });


    // TRAFFIC CITY STATUS

    insights.push({

      icon: "🚗",

      tag:
        avgTraffic >= 70
          ? "warning"
          : "success",

      title:
        "City-wide traffic status",

      text:
        `Average city-wide congestion is currently ${avgTraffic}%.`,

      confidence: 93,

      recommendation:
        avgTraffic >= 70
          ? "Traffic operators should monitor major corridors and optimize signal timing."
          : "Traffic conditions are currently manageable."
    });
  }


  // ===================================================
  // TRAFFIC TREND
  // ===================================================

  const trafficData =
    typeof TRAFFIC_TREND_DATA !== "undefined" &&
    Array.isArray(TRAFFIC_TREND_DATA)
      ? TRAFFIC_TREND_DATA
      : [];


  if (trafficData.length) {

    const start =
      Number(trafficData[0] || 0);

    const current =
      Number(
        trafficData[
          trafficData.length - 1
        ] || 0
      );

    const peak =
      Math.max(...trafficData);


    let tag = "success";
    let message = "";


    if (current >= 70) {

      tag = "warning";

      message =
        `Traffic is currently heavy at ${current}%. The observed peak reached ${peak}%.`;

    } else if (current > start) {

      tag = "warning";

      message =
        `Traffic is trending upward and is currently at ${current}%.`;

    } else {

      tag = "success";

      message =
        `Traffic has eased to ${current}% compared with earlier levels.`;
    }


    insights.push({

      icon: "📈",

      tag,

      title:
        "Traffic trend analysis",

      text: message,

      confidence: 87,

      recommendation:
        current >= 70
          ? "Prepare traffic-control measures before congestion increases further."
          : "Continue monitoring the trend for sudden increases."
    });
  }


  // ===================================================
  // ALERTS
  // ===================================================

  const allAlerts =
    typeof getAllAlerts === "function"
      ? getAllAlerts()
      : getAlertsSafe();


  const highAlerts =
    allAlerts.filter(
      alert =>
        alert.priority === "high"
    );


  if (highAlerts.length) {

    insights.push({

      icon: "⚠️",

      tag: "danger",

      title:
        "Priority attention needed",

      text:
        `${highAlerts.length} high-priority alert(s) are currently active.`,

      confidence: 98,

      recommendation:
        `Review the highest-priority issue: "${highAlerts[0].text}".`
    });
  }


  // ===================================================
  // CRITICAL ZONES
  // ===================================================

  const redZones =
    zones.filter(
      zone =>
        zone.status === "red"
    );


  if (redZones.length) {

    insights.push({

      icon: "🔴",

      tag: "danger",

      title:
        "Critical zones detected",

      text:
        `${redZones.length} zone(s) are currently in critical status: ${redZones.map(zone => zone.name).join(", ")}.`,

      confidence: 95,

      recommendation:
        "Prioritize these zones for immediate monitoring and intervention."
    });
  }


  return insights;
}


// =====================================================
// RENDER AI INSIGHTS
// =====================================================

function renderInsights() {

  const container =
    document.getElementById(
      "insightsList"
    );


  if (!container) {
    return;
  }


  const insights =
    generateInsights();


  container.innerHTML =
    insights
      .map(
        insight => `
          <li class="insight-item insight-${insight.tag}">

            <span class="insight-icon">
              ${insight.icon}
            </span>

            <div class="insight-body">

              <div class="insight-heading">

                <strong>
                  ${insight.title}
                </strong>

                ${
                  insight.confidence
                    ? `
                      <span class="ai-confidence">
                        AI ${insight.confidence}%
                      </span>
                    `
                    : ""
                }

              </div>

              <p>
                ${insight.text}
              </p>

              ${
                insight.recommendation
                  ? `
                    <small class="ai-recommendation">
                      💡 ${insight.recommendation}
                    </small>
                  `
                  : ""
              }

            </div>

          </li>
        `
      )
      .join("");
}


// =====================================================
// TRAFFIC PREDICTION ENGINE
// =====================================================

function predictNextValues(
  series,
  steps = 4
) {

  if (
    !Array.isArray(series) ||
    !series.length
  ) {
    return new Array(steps).fill(0);
  }


  const cleanSeries =
    series.map(
      value =>
        Number(value) || 0
    );


  const recent =
    cleanSeries.slice(
      Math.max(
        0,
        cleanSeries.length - 5
      )
    );


  if (recent.length === 1) {
    return new Array(steps)
      .fill(
        clamp(
          recent[0]
        )
      );
  }


  let trend = 0;


  for (
    let i = 1;
    i < recent.length;
    i++
  ) {

    trend +=
      recent[i] -
      recent[i - 1];
  }


  trend /=
    Math.max(
      1,
      recent.length - 1
    );


  const predictions = [];

  let last =
    cleanSeries[
      cleanSeries.length - 1
    ];


  for (
    let i = 1;
    i <= steps;
    i++
  ) {

    const damping =
      1 - i * 0.08;


    let next =
      last +
      trend * damping;


    next =
      clamp(
        Math.round(next),
        5,
        98
      );


    predictions.push(next);

    last = next;
  }


  return predictions;
}


// =====================================================
// TRAFFIC FORECAST SUMMARY
// =====================================================

function getTrafficForecastSummary() {

  const data =
    typeof TRAFFIC_TREND_DATA !== "undefined" &&
    Array.isArray(TRAFFIC_TREND_DATA)
      ? TRAFFIC_TREND_DATA
      : [];


  if (!data.length) {

    return {
      current: 0,
      nextHour: 0,
      fourHour: 0,
      trend: "unknown",
      level: "Unknown"
    };
  }


  const predictions =
    predictNextValues(
      data,
      4
    );


  const current =
    Number(
      data[data.length - 1]
    );


  const nextHour =
    predictions[0];


  const fourHour =
    predictions[3];


  let trend = "stable";


  if (nextHour > current) {
    trend = "increasing";
  } else if (nextHour < current) {
    trend = "decreasing";
  }


  const level =
    fourHour >= 70
      ? "Heavy"
      : fourHour >= 45
        ? "Moderate"
        : "Light";


  return {
    current,
    nextHour,
    fourHour,
    trend,
    level
  };
}


// =====================================================
// RENDER TRAFFIC PREDICTIONS
// =====================================================

function renderPredictions() {

  const predCanvas =
    document.getElementById("predictionChart");


  const data =
    typeof TRAFFIC_TREND_DATA !== "undefined" &&
    Array.isArray(TRAFFIC_TREND_DATA)
      ? TRAFFIC_TREND_DATA
      : [];


  // =====================================================
  // CREATE PREDICTION DATA
  // =====================================================

  let predicted = [];

  if (data.length) {

    predicted =
      predictNextValues(
        data,
        4
      );

  }


  // =====================================================
  // RENDER CHART
  // =====================================================

  const canRenderChart =
    predCanvas &&
    typeof Chart !== "undefined" &&
    data.length > 0;


  if (canRenderChart) {

    const futureLabels = [
      "+1h",
      "+2h",
      "+3h",
      "+4h"
    ];


    const trendLabels =
      typeof TRAFFIC_TREND_LABELS !== "undefined" &&
      Array.isArray(TRAFFIC_TREND_LABELS)
        ? TRAFFIC_TREND_LABELS
        : data.map(
            (_, index) =>
              `T${index + 1}`
          );


    const allLabels = [
      ...trendLabels,
      ...futureLabels
    ];


    const actualData = [
      ...data,
      null,
      null,
      null,
      null
    ];


    const predictedData =
      new Array(
        Math.max(
          0,
          data.length - 1
        )
      ).fill(null);


    predictedData.push(
      data[data.length - 1],
      ...predicted
    );


    // Destroy old chart
    if (window.predictionChartInstance) {

      window.predictionChartInstance.destroy();

    }


    try {

      window.predictionChartInstance =
        new Chart(
          predCanvas,
          {

            type: "line",

            data: {

              labels: allLabels,

              datasets: [

                {
                  label:
                    "Actual congestion %",

                  data:
                    actualData,

                  borderColor:
                    "#00e5ff",

                  backgroundColor:
                    "rgba(0,229,255,0.12)",

                  fill: true,

                  tension: 0.4,

                  pointRadius: 3,

                  spanGaps: false
                },


                {
                  label:
                    "AI forecast",

                  data:
                    predictedData,

                  borderColor:
                    "#a855f7",

                  backgroundColor:
                    "transparent",

                  borderDash:
                    [6, 4],

                  tension: 0.4,

                  pointRadius: 3,

                  spanGaps: true
                }

              ]

            },


            options: {

              responsive: true,

              maintainAspectRatio:
                false,


              plugins: {

                legend: {

                  display: true,

                  labels: {

                    color:
                      "#7c8aa0",

                    font: {
                      size: 11
                    }

                  }

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

    } catch (error) {

      console.error(
        "Prediction chart error:",
        error
      );

    }

  } else {

    console.warn(
      "Prediction chart cannot render.",
      {
        canvas: !!predCanvas,
        chartLoaded:
          typeof Chart !== "undefined",
        dataLength:
          data.length
      }
    );

  }


  // =====================================================
  // RENDER FORECAST TILES
  // =====================================================

  const forecastGrid =
    document.getElementById(
      "forecastGrid"
    );


  if (forecastGrid) {

    if (predicted.length) {

      const futureLabels = [
        "+1h",
        "+2h",
        "+3h",
        "+4h"
      ];


      forecastGrid.innerHTML =
        futureLabels
          .map(
            (label, index) => {

              const value =
                predicted[index] ?? 0;


              let level =
                "Light";

              let priorityClass =
                "priority-low";


              if (value >= 70) {

                level =
                  "Heavy";

                priorityClass =
                  "priority-high";

              } else if (value >= 45) {

                level =
                  "Moderate";

                priorityClass =
                  "priority-medium";

              }


              return `
                <div class="forecast-tile">

                  <span class="muted">
                    ${label}
                  </span>

                  <strong>
                    ${value}%
                  </strong>

                  <span class="badge ${priorityClass}">
                    ${level}
                  </span>

                </div>
              `;

            }
          )
          .join("");

    } else {

      forecastGrid.innerHTML =
        `<div class="alert-empty">
          Forecast data unavailable.
        </div>`;

    }

  }


  // =====================================================
  // RENDER AQI FORECAST
  // =====================================================

  const aqiForecastList =
    document.getElementById(
      "aqiForecastList"
    );


  const zones =
    typeof ZONES !== "undefined" &&
    Array.isArray(ZONES)
      ? ZONES
      : [];


  if (aqiForecastList) {

    if (zones.length) {

      const worstThree =
        [...zones]
          .sort(
            (a, b) =>
              Number(b.aqi || 0) -
              Number(a.aqi || 0)
          )
          .slice(0, 3);


      aqiForecastList.innerHTML =
        worstThree
          .map(
            zone => {

              const currentAqi =
                Number(zone.aqi || 0);


              const projected =
                Math.min(
                  200,
                  Math.round(
                    currentAqi * 1.08
                  )
                );


              const change =
                projected -
                currentAqi;


              return `
                <li>

                  <span>
                    ${zone.name}
                  </span>

                  <span class="muted">

                    ${currentAqi}

                    →

                    <strong>
                      ${projected}
                    </strong>

                    <small>
                      (+${change})
                    </small>

                    by evening

                  </span>

                </li>
              `;

            }
          )
          .join("");

    } else {

      aqiForecastList.innerHTML =
        `<li class="alert-empty">
          AQI forecast data unavailable.
        </li>`;

    }

  }

}
// =====================================================
// SMART DYNAMIC ALERTS
// =====================================================

function generateDynamicAlerts() {

  const dynamic = [];


  const zones =
    safeArray(
      typeof ZONES !== "undefined"
        ? ZONES
        : []
    );


  const roads =
    safeArray(
      typeof ROADS !== "undefined"
        ? ROADS
        : []
    );


  // ---------------------------------------------------
  // AIR QUALITY
  // ---------------------------------------------------

  zones.forEach(zone => {

    const aqi =
      Number(zone.aqi || 0);


    if (aqi >= 150) {

      dynamic.push({

        text:
          `Hazardous air quality (AQI ${aqi}) detected in ${zone.name}`,

        priority:
          "high",

        time:
          "just now",

        source:
          "ai"
      });

    } else if (aqi >= 130) {

      dynamic.push({

        text:
          `Poor air quality (AQI ${aqi}) detected in ${zone.name}`,

        priority:
          "medium",

        time:
          "just now",

        source:
          "ai"
      });
    }
  });


  // ---------------------------------------------------
  // TRAFFIC
  // ---------------------------------------------------

  roads.forEach(road => {

    const congestion =
      Number(
        road.congestion || 0
      );


    if (congestion >= 85) {

      dynamic.push({

        text:
          `Severe congestion on ${road.name} (${congestion}%) — consider alternate routing`,

        priority:
          "high",

        time:
          "just now",

        source:
          "ai"
      });

    } else if (congestion >= 70) {

      dynamic.push({

        text:
          `Heavy congestion detected on ${road.name} (${congestion}%)`,

        priority:
          "medium",

        time:
          "just now",

        source:
          "ai"
      });
    }
  });


  return dynamic;
}


// =====================================================
// ALL ALERTS
// =====================================================

function getAllAlerts() {

  const staticAlerts =
    getAlertsSafe()
      .map(
        alert => ({
          ...alert,
          source:
            "system"
        })
      );


  const dynamicAlerts =
    generateDynamicAlerts();


  return [
    ...dynamicAlerts,
    ...staticAlerts
  ];
}


// =====================================================
// FLOOD PREDICTION
// =====================================================

function computeFloodRisk(zone) {

  const rainfallRisk =
    Number(
      zone.rainfallRisk || 0
    );

  const drainageCapacity =
    Number(
      zone.drainageCapacity || 0
    );


  const score =
    Math.round(
      rainfallRisk * 0.6 +
      (100 - drainageCapacity) * 0.4
    );


  return clamp(score);
}


// =====================================================
// WASTE OVERFLOW RISK
// =====================================================

function computeWasteRisk(point) {

  const fillLevel =
    Number(
      point.fillLevel || 0
    );

  const days =
    Number(
      point.daysSinceCollection || 0
    );


  const score =
    Math.round(
      fillLevel * 0.75 +
      days * 6
    );


  return clamp(score);
}


// =====================================================
// WATER LEAK RISK
// =====================================================

function computeWaterLeakRisk(pipe) {

  const age =
    Number(
      pipe.pipeAgeYears || 0
    );

  const leaks =
    Number(
      pipe.pastLeaksCount || 0
    );

  const pressure =
    Number(
      pipe.pressure || 0
    );


  const ageFactor =
    Math.min(
      40,
      age
    );


  const leakFactor =
    leaks * 8;


  const pressureFactor =
    Math.max(
      0,
      (70 - pressure) * 0.6
    );


  const score =
    Math.round(
      ageFactor +
      leakFactor +
      pressureFactor
    );


  return clamp(score);
}


// =====================================================
// RISK LEVEL
// =====================================================

function riskLevel(score) {

  if (score >= 70) {

    return {
      label: "High",
      cls: "priority-high"
    };
  }


  if (score >= 40) {

    return {
      label: "Medium",
      cls: "priority-medium"
    };
  }


  return {
    label: "Low",
    cls: "priority-low"
  };
}


// =====================================================
// FLOOD PREDICTIONS
// =====================================================

function renderFloodPredictions() {

  const container =
    document.getElementById(
      "floodList"
    );


  const zones =
    safeArray(
      typeof FLOOD_ZONES !== "undefined"
        ? FLOOD_ZONES
        : []
    );


  if (
    !container ||
    !zones.length
  ) {
    return;
  }


  const ranked =
    zones
      .map(
        zone => ({
          ...zone,
          risk:
            computeFloodRisk(zone)
        })
      )
      .sort(
        (a, b) =>
          b.risk -
          a.risk
      );


  container.innerHTML =
    ranked
      .map(
        zone => {

          const level =
            riskLevel(
              zone.risk
            );


          const fillColor =
            zone.risk >= 70
              ? "var(--red)"
              : zone.risk >= 40
                ? "var(--amber)"
                : "var(--green)";


          return `
            <li>

              <div class="risk-info">

                <strong>
                  ${zone.name}
                </strong>

                <span class="muted">
                  ${zone.city}
                  · drainage
                  ${zone.drainageCapacity}%
                  · rain risk
                  ${zone.rainfallRisk}%
                </span>

              </div>


              <div class="risk-meter">

                <div class="risk-bar-bg">

                  <div
                    class="risk-bar-fill"
                    style="
                      width:${zone.risk}%;
                      background:${fillColor}
                    "
                  ></div>

                </div>


                <span class="badge ${level.cls}">
                  ${level.label}
                  (${zone.risk})
                </span>

              </div>

            </li>
          `;
        }
      )
      .join("");
}


// =====================================================
// WASTE PREDICTIONS
// =====================================================

function renderWastePredictions() {

  const container =
    document.getElementById(
      "wasteList"
    );


  const points =
    safeArray(
      typeof WASTE_POINTS !== "undefined"
        ? WASTE_POINTS
        : []
    );


  if (
    !container ||
    !points.length
  ) {
    return;
  }


  const ranked =
    points
      .map(
        point => ({
          ...point,
          risk:
            computeWasteRisk(point)
        })
      )
      .sort(
        (a, b) =>
          b.risk -
          a.risk
      );


  container.innerHTML =
    ranked
      .map(
        point => {

          const level =
            riskLevel(
              point.risk
            );


          const fillColor =
            point.risk >= 70
              ? "var(--red)"
              : point.risk >= 40
                ? "var(--amber)"
                : "var(--green)";


          const hoursToOverflow =
            point.risk >= 90
              ? "already overdue"
              : `~${Math.max(
                  2,
                  Math.round(
                    (100 - point.risk) / 4
                  )
                )}h until full`;


          return `
            <li>

              <div class="risk-info">

                <strong>
                  ${point.location}
                </strong>

                <span class="muted">
                  ${point.city}
                  · ${point.fillLevel}% full
                  · last collected
                  ${point.daysSinceCollection}d ago
                  · ${hoursToOverflow}
                </span>

              </div>


              <div class="risk-meter">

                <div class="risk-bar-bg">

                  <div
                    class="risk-bar-fill"
                    style="
                      width:${point.risk}%;
                      background:${fillColor}
                    "
                  ></div>

                </div>


                <span class="badge ${level.cls}">
                  ${level.label}
                  (${point.risk})
                </span>

              </div>

            </li>
          `;
        }
      )
      .join("");
}


// =====================================================
// WATER LEAK PREDICTIONS
// =====================================================

function renderWaterLeakPredictions() {

  const container =
    document.getElementById(
      "waterLeakList"
    );


  const pipes =
    safeArray(
      typeof WATER_PIPES !== "undefined"
        ? WATER_PIPES
        : []
    );


  if (
    !container ||
    !pipes.length
  ) {
    return;
  }


  const ranked =
    pipes
      .map(
        pipe => ({
          ...pipe,
          risk:
            computeWaterLeakRisk(pipe)
        })
      )
      .sort(
        (a, b) =>
          b.risk -
          a.risk
      );


  container.innerHTML =
    ranked
      .map(
        pipe => {

          const level =
            riskLevel(
              pipe.risk
            );


          const fillColor =
            pipe.risk >= 70
              ? "var(--red)"
              : pipe.risk >= 40
                ? "var(--amber)"
                : "var(--green)";


          return `
            <li>

              <div class="risk-info">

                <strong>
                  ${pipe.sector}
                </strong>

                <span class="muted">
                  ${pipe.city}
                  · pipe age
                  ${pipe.pipeAgeYears}y
                  · ${pipe.pastLeaksCount}
                  leaks (12mo)
                  · pressure
                  ${pipe.pressure} psi
                </span>

              </div>


              <div class="risk-meter">

                <div class="risk-bar-bg">

                  <div
                    class="risk-bar-fill"
                    style="
                      width:${pipe.risk}%;
                      background:${fillColor}
                    "
                  ></div>

                </div>


                <span class="badge ${level.cls}">
                  ${level.label}
                  (${pipe.risk})
                </span>

              </div>

            </li>
          `;
        }
      )
      .join("");
}


// =====================================================
// AI RECOMMENDATIONS
// =====================================================

function generateRecommendations() {

  const recommendations = [];

  const health =
    computeHealthScore();


  // AIR

  if (health.airScore < 60) {

    recommendations.push({

      icon: "🌫️",

      priority: "high",

      title:
        "Improve air-quality monitoring",

      text:
        "Deploy additional monitoring resources in high-AQI zones and issue public health guidance."
    });
  }


  // TRAFFIC

  if (health.trafficScore < 60) {

    recommendations.push({

      icon: "🚦",

      priority: "high",

      title:
        "Optimize traffic flow",

      text:
        "Monitor congested corridors, adjust signal timing and encourage alternate routes."
    });
  }


  // ALERTS

  if (health.highAlerts > 0) {

    recommendations.push({

      icon: "🚨",

      priority: "high",

      title:
        "Resolve high-priority alerts",

      text:
        `${health.highAlerts} high-priority issue(s) require immediate attention.`
    });
  }


  // FLOOD

  const floodZones =
    safeArray(
      typeof FLOOD_ZONES !== "undefined"
        ? FLOOD_ZONES
        : []
    );


  if (floodZones.length) {

    const highest =
      Math.max(
        ...floodZones.map(
          computeFloodRisk
        )
      );


    if (highest >= 70) {

      recommendations.push({

        icon: "🌧️",

        priority: "high",

        title:
          "Prepare flood response",

        text:
          "High flood-risk areas should be monitored closely and drainage response teams kept ready."
      });
    }
  }


  // WASTE

  const wastePoints =
    safeArray(
      typeof WASTE_POINTS !== "undefined"
        ? WASTE_POINTS
        : []
    );


  if (wastePoints.length) {

    const highest =
      Math.max(
        ...wastePoints.map(
          computeWasteRisk
        )
      );


    if (highest >= 70) {

      recommendations.push({

        icon: "🗑️",

        priority: "medium",

        title:
          "Schedule waste collection",

        text:
          "High-risk waste points should be prioritized for collection before overflow occurs."
      });
    }
  }


  // WATER

  const pipes =
    safeArray(
      typeof WATER_PIPES !== "undefined"
        ? WATER_PIPES
        : []
    );


  if (pipes.length) {

    const highest =
      Math.max(
        ...pipes.map(
          computeWaterLeakRisk
        )
      );


    if (highest >= 70) {

      recommendations.push({

        icon: "💧",

        priority: "high",

        title:
          "Inspect vulnerable water pipes",

        text:
          "High-risk pipe sectors should receive preventive inspection and maintenance."
      });
    }
  }


  if (!recommendations.length) {

    recommendations.push({

      icon: "✅",

      priority: "low",

      title:
        "City conditions are stable",

      text:
        "No major intervention is currently recommended. Continue monitoring city indicators."
    });
  }


  return recommendations;
}


// =====================================================
// AI SUMMARY
// =====================================================

function generateAISummary() {

  const health =
    computeHealthScore();


  const forecast =
    getTrafficForecastSummary();


  if (health.overall < 40) {

    return {
      status: "Critical",
      icon: "🔴",
      text:
        `City health requires immediate attention. Current score is ${health.overall}/100 with significant pressure from traffic, air quality or active alerts.`
    };
  }


  if (health.overall < 60) {

    return {
      status: "Needs Attention",
      icon: "🟠",
      text:
        `The city is showing several stress indicators. Current health score is ${health.overall}/100.`
    };
  }


  if (
    forecast.trend === "increasing" &&
    forecast.fourHour >= 70
  ) {

    return {
      status: "Traffic Risk Increasing",
      icon: "⚠️",
      text:
        `Traffic is expected to increase toward ${forecast.fourHour}% over the next four hours.`
    };
  }


  return {
    status: "Stable",
    icon: "🟢",
    text:
      `City conditions are currently stable with an overall health score of ${health.overall}/100.`
  };
}


// =====================================================
// AI CHAT ASSISTANT — CHUNK 9 SMART CHAT INTEGRATION
// =====================================================

// Lightweight conversation memory (last resolved intent only)
let lastChatIntent = null;


// ---------------------------------------------------
// INTENT DETECTION
// ---------------------------------------------------

function detectChatIntent(text) {

  if (
    text.includes("hello") ||
    text.includes("hi") ||
    text.includes("hey") ||
    text.includes("salam") ||
    text.includes("assalam")
  ) {
    return "GREETING";
  }

  if (
    text.includes("help") ||
    text.includes("what can you")
  ) {
    return "HELP";
  }

  if (
    text.includes("summary") ||
    text.includes("overall") ||
    text.includes("city status") ||
    text.includes("city condition") ||
    (text.includes("city") && text.includes("health"))
  ) {
    return "CITY_SUMMARY";
  }

  if (
    text.includes("insight") ||
    text.includes("main risk") ||
    text.includes("top risk") ||
    text.includes("recommend") ||
    text.includes("suggestion") ||
    text.includes("advice")
  ) {
    return "AI_INSIGHTS";
  }

  if (
    text.includes("flood") ||
    text.includes("rain") ||
    text.includes("drainage") ||
    text.includes("drain")
  ) {
    return "FLOOD";
  }

  if (
    text.includes("waste") ||
    text.includes("garbage") ||
    text.includes("trash") ||
    text.includes("bin") ||
    text.includes("collection")
  ) {
    return "WASTE";
  }

  if (
    text.includes("water") ||
    text.includes("leak") ||
    text.includes("pipe") ||
    text.includes("pressure") ||
    text.includes("supply")
  ) {
    return "WATER";
  }

  if (
    text.includes("map") ||
    text.includes("location") ||
    text.includes("where can i see")
  ) {
    return "MAP";
  }

  if (
    text.includes("alert") ||
    text.includes("warning") ||
    text.includes("critical") ||
    text.includes("worry") ||
    text.includes("notification")
  ) {
    return "ALERTS";
  }

  if (
    text.includes("traffic") ||
    text.includes("congestion") ||
    text.includes("road") ||
    text.includes("jam")
  ) {
    return "TRAFFIC";
  }

  if (
    text.includes("aqi") ||
    text.includes("air") ||
    text.includes("pollution") ||
    text.includes("smog") ||
    text.includes("pm2.5") ||
    text.includes("pm10")
  ) {
    return "AIR_QUALITY";
  }

  if (
    text.includes("forecast") ||
    text.includes("predict") ||
    text.includes("next hour") ||
    text.includes("tomorrow")
  ) {
    return "AI_INSIGHTS";
  }

  return "UNKNOWN";
}


// ---------------------------------------------------
// INTENT RESPONSE BUILDERS
// ---------------------------------------------------

function respondTraffic() {

  const roads =
    safeArray(typeof ROADS !== "undefined" ? ROADS : []);

  if (!roads.length) {
    return "Traffic data is currently available only for the simulated dashboard dataset.";
  }

  const worst =
    [...roads].sort(
      (a, b) => Number(b.congestion || 0) - Number(a.congestion || 0)
    )[0];

  const avg =
    Math.round(
      roads.reduce((t, r) => t + Number(r.congestion || 0), 0) / roads.length
    );

  return (
    `Based on the current simulated dashboard data, average city-wide congestion is ${avg}%. ` +
    `The worst affected road is ${worst.name} at ${worst.congestion}% congestion, ` +
    `with an average speed of ${worst.speed} km/h.`
  );
}


function respondAirQuality() {

  const zones =
    safeArray(typeof ZONES !== "undefined" ? ZONES : []);

  if (!zones.length) {
    return "Air quality data is currently unavailable in the simulated dataset.";
  }

  const worst =
    [...zones].sort((a, b) => Number(b.aqi || 0) - Number(a.aqi || 0))[0];

  const best =
    [...zones].sort((a, b) => Number(a.aqi || 0) - Number(b.aqi || 0))[0];

  const avg =
    Math.round(zones.reduce((t, z) => t + Number(z.aqi || 0), 0) / zones.length);

  return (
    `Based on the current simulated dashboard data, city-wide average AQI is ${avg}. ` +
    `${worst.name} (${worst.city}) has the worst air quality at AQI ${worst.aqi}, ` +
    `while ${best.name} (${best.city}) has the cleanest air at AQI ${best.aqi}.`
  );
}


function respondAlerts() {

  const all =
    typeof getAllAlerts === "function" ? getAllAlerts() : getAlertsSafe();

  if (!all.length) {
    return "There are currently no active alerts in the simulated dashboard data.";
  }

  const high =
    all.filter(a => a.priority === "high");

  if (!high.length) {
    return `There are ${all.length} active simulated alert(s), none currently marked high-priority.`;
  }

  const topTexts =
    high.slice(0, 2).map(a => a.text).join("; ");

  return (
    `There are currently ${high.length} high-priority simulated alert(s), including: ${topTexts}.`
  );
}


function respondFlood() {

  const zones =
    safeArray(typeof FLOOD_DATA !== "undefined" ? FLOOD_DATA.zones : []);

  if (!zones.length) {
    return "Flood risk data is currently unavailable in the simulated dataset.";
  }

  const critical =
    zones.filter(z => z.risk === "CRITICAL" || z.risk === "HIGH");

  if (!critical.length) {
    return "Based on the current simulated dashboard data, no areas currently show high or critical flood risk.";
  }

  const list =
    critical
      .slice(0, 3)
      .map(z => `${z.location} (${z.city}) — ${z.risk}, water level ${z.waterLevel}%, drainage ${z.drainage.toLowerCase()}`)
      .join("; ");

  return (
    `Based on the current simulated dashboard data, the highest flood risk areas are: ${list}. ` +
    `You can view exact locations on the City Intelligence Map.`
  );
}


function respondWaste() {

  if (typeof WASTE_DATA === "undefined") {
    return "Waste management data is currently unavailable in the simulated dataset.";
  }

  const overflow =
    WASTE_DATA.zones.filter(z => z.status === "Overflowing" || z.priority === "CRITICAL");

  let text =
    `Simulated collection efficiency is ${WASTE_DATA.efficiency}%. ` +
    `There are ${WASTE_DATA.overflowingBins} overflowing bins and ${WASTE_DATA.pendingPickups} pending pickups.`;

  if (overflow.length) {
    const worst = overflow[0];
    text += ` ${worst.area}, ${worst.city} currently has a critical waste condition with ${worst.level}% fill level and ${worst.status.toLowerCase()} status.`;
  }

  return text;
}


function respondWater() {

  if (typeof WATER_DATA === "undefined") {
    return "Water supply data is currently unavailable in the simulated dataset.";
  }

  const criticalLeak =
    [...WATER_DATA.leaks].sort((a, b) => {
      const order = { CRITICAL: 3, HIGH: 2, MEDIUM: 1, LOW: 0 };
      return (order[b.severity] || 0) - (order[a.severity] || 0);
    })[0];

  let text =
    `Current simulated water availability is ${WATER_DATA.availability}%. ` +
    `There are ${WATER_DATA.activeLeaks} active leaks and ${WATER_DATA.lowPressureAreas} low-pressure areas.`;

  if (criticalLeak) {
    text += ` The most severe leak is in ${criticalLeak.location}, ${criticalLeak.city} (${criticalLeak.severity}), with an estimated loss of ${criticalLeak.loss}.`;
  }

  return text;
}


function respondCitySummary() {

  const roads =
    safeArray(typeof ROADS !== "undefined" ? ROADS : []);

  const zones =
    safeArray(typeof ZONES !== "undefined" ? ZONES : []);

  const avgCongestion =
    roads.length
      ? Math.round(roads.reduce((t, r) => t + Number(r.congestion || 0), 0) / roads.length)
      : 0;

  const avgAqi =
    zones.length
      ? Math.round(zones.reduce((t, z) => t + Number(z.aqi || 0), 0) / zones.length)
      : 0;

  const trafficLabel =
    typeof congestionLabel === "function" ? congestionLabel(avgCongestion) : `${avgCongestion}%`;

  const aqiLabel =
    typeof envAqiCategory === "function" ? envAqiCategory(avgAqi) : `AQI ${avgAqi}`;

  const all =
    typeof getAllAlerts === "function" ? getAllAlerts() : getAlertsSafe();

  const highAlerts =
    all.filter(a => a.priority === "high").length;

  const floodLabel =
    typeof FLOOD_DATA !== "undefined" ? FLOOD_DATA.overallRisk : "N/A";

  const wasteLabel =
    typeof WASTE_DATA !== "undefined"
      ? (WASTE_DATA.efficiency >= 85 ? "Stable" : WASTE_DATA.efficiency >= 70 ? "Warning" : "Critical")
      : "N/A";

  const waterLabel =
    typeof WATER_DATA !== "undefined"
      ? (WATER_DATA.availability >= 90 ? "Stable" : WATER_DATA.availability >= 75 ? "Warning" : "Critical")
      : "N/A";

  return (
    `CITY STATUS (based on simulated dashboard data) — ` +
    `Traffic: ${trafficLabel}. Air Quality: ${aqiLabel}. Flood Risk: ${floodLabel}. ` +
    `Waste: ${wasteLabel}. Water: ${waterLabel}. Critical Alerts: ${highAlerts}.`
  );
}


function respondAIInsights() {

  if (typeof generateInsights !== "function") {
    return "AI insights are currently unavailable.";
  }

  const insights = generateInsights();

  const priorityInsights =
    insights.filter(i => i.tag === "danger" || i.tag === "warning");

  if (!priorityInsights.length) {
    return "Based on the current simulated dashboard data, there are no major risks flagged right now.";
  }

  const summary =
    priorityInsights
      .slice(0, 2)
      .map(i => i.text)
      .join(" ");

  return `Here are the top simulated risks right now: ${summary}`;
}


function respondMap() {
  return (
    "You can view live locations for traffic, flood, waste and water issues on the City Intelligence Map page, " +
    "using the type and city filters there."
  );
}


function respondHelp() {
  return (
    "I can help with traffic, air quality, alerts, flood risk, waste management, water supply, " +
    "AI insights, and overall city status — all based on the current simulated dashboard data."
  );
}


function respondGreeting() {
  return (
    "Hello! I'm the City Assistant. Ask me about traffic, air quality, flood risk, " +
    "waste collection, water leakage, alerts, predictions, or a full city summary."
  );
}


// ---------------------------------------------------
// MAIN CHAT RESPONSE FUNCTION
// ---------------------------------------------------

function getChatResponse(rawText) {

  const text =
    String(rawText || "").toLowerCase().trim();

  if (!text) {
    return respondHelp();
  }

  let intent = detectChatIntent(text);

  // Lightweight follow-up handling: short ambiguous messages
  // reuse the last resolved intent (e.g. "what about water?")
  if (
    intent === "UNKNOWN" &&
    lastChatIntent &&
    text.split(" ").length <= 5
  ) {
    intent = lastChatIntent;
  }

  lastChatIntent = intent !== "UNKNOWN" ? intent : lastChatIntent;

  switch (intent) {

    case "GREETING":
      return respondGreeting();

    case "HELP":
      return respondHelp();

    case "CITY_SUMMARY":
      return respondCitySummary();

    case "AI_INSIGHTS":
      return respondAIInsights();

    case "TRAFFIC":
      return respondTraffic();

    case "AIR_QUALITY":
      return respondAirQuality();

    case "ALERTS":
      return respondAlerts();

    case "FLOOD":
      return respondFlood();

    case "WASTE":
      return respondWaste();

    case "WATER":
      return respondWater();

    case "MAP":
      return respondMap();

    default:
      return (
        "I'm not sure about that yet. I can help with traffic, air quality, flood risk, " +
        "waste overflow, water leakage, alerts, AI insights, or the overall city summary — " +
        "all based on the current simulated dashboard data."
      );
  }
}


// =====================================================
// AI DASHBOARD INITIALIZATION
// =====================================================

function initializeAIInsights() {

  try {

    renderHealthScore();

    renderInsights();

    renderPredictions();

    renderFloodPredictions();

    renderWastePredictions();

    renderWaterLeakPredictions();

  } catch (error) {

    console.error(
      "AI Dashboard initialization error:",
      error
    );
  }
}


// =====================================================
// AUTO INITIALIZATION
// =====================================================

function startAIInsights() {

  initializeAIInsights();

  initDecisionCenter(); 

  // Refresh AI calculations periodically
  // without reloading the page.

  if (
    !window.aiRefreshInterval
  ) {

    window.aiRefreshInterval =
      setInterval(
        initializeAIInsights,
        60000
      );
  }
}


// =====================================================
// DOM READY
// =====================================================

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    startAIInsights
  );

} else {

  startAIInsights();
}// =====================================================
// AI DECISION CENTER — FLOATING MODAL
// =====================================================

function decisionPriorityWeight(p) {
  const map = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
  return map[String(p || "").toUpperCase()] || 0;
}

function decisionPriorityClass(p) {
  const key = String(p || "").toUpperCase();
  if (key === "CRITICAL" || key === "HIGH") return "priority-high";
  if (key === "MEDIUM") return "priority-medium";
  return "priority-low";
}

function buildDecisionCenterData() {

  const issues = [];
  const actions = [];

  // ---- TRAFFIC ----
  const trafficStats =
    typeof computeTrafficStats === "function" ? computeTrafficStats() : null;

  let trafficStatusLabel = "STABLE";

  if (trafficStats && trafficStats.mostCongested) {

    const c = trafficStats.mostCongested.congestion;

    trafficStatusLabel = c >= 70 ? "HIGH" : c >= 45 ? "WARNING" : "STABLE";

    if (c >= 45) {

      const priority = c >= 85 ? "CRITICAL" : c >= 70 ? "HIGH" : "MEDIUM";

      issues.push({
        title: `${trafficStats.mostCongested.name} — Severe Traffic Congestion`,
        priority
      });

      actions.push({
        icon: "🚦",
        title: "Traffic",
        priority,
        text: `Consider alternate routing and traffic management near ${trafficStats.mostCongested.name}.`
      });
    }
  }

  // ---- AIR QUALITY ----
  const envStats =
    typeof computeEnvStats === "function" ? computeEnvStats() : null;

  let aqiStatusLabel = "STABLE";

  if (envStats && envStats.worstZone) {

    const aqi = envStats.worstZone.aqi;

    aqiStatusLabel = aqi >= 120 ? "HIGH" : aqi >= 80 ? "WARNING" : "STABLE";

    if (aqi >= 120) {

      const priority = aqi >= 150 ? "CRITICAL" : "HIGH";

      issues.push({
        title: `${envStats.worstZone.name} — Hazardous Air Quality`,
        priority
      });

      actions.push({
        icon: "🌫️",
        title: "Air Quality",
        priority,
        text: `Increase monitoring and issue a public health advisory for ${envStats.worstZone.name} and nearby zones.`
      });
    }
  }

  // ---- FLOOD ----
  let floodStatusLabel = "STABLE";

  if (typeof FLOOD_DATA !== "undefined") {

    floodStatusLabel = FLOOD_DATA.overallRisk;

    const worstFlood =
      [...FLOOD_DATA.zones].sort(
        (a, b) => decisionPriorityWeight(b.risk) - decisionPriorityWeight(a.risk)
      )[0];

    if (worstFlood && decisionPriorityWeight(worstFlood.risk) >= 3) {

      issues.push({
        title: `${worstFlood.location} — Critical Flood Risk`,
        priority: worstFlood.risk
      });

      actions.push({
        icon: "🌊",
        title: "Flood",
        priority: worstFlood.risk,
        text: `Inspect drainage and monitor water levels closely in ${worstFlood.location}.`
      });
    }
  }

  // ---- WASTE ----
  let wasteStatusLabel = "STABLE";

  if (typeof WASTE_DATA !== "undefined") {

    wasteStatusLabel =
      WASTE_DATA.efficiency >= 85 ? "STABLE" :
      WASTE_DATA.efficiency >= 70 ? "WARNING" : "CRITICAL";

    const worstWaste =
      [...WASTE_DATA.zones].sort((a, b) => {
        const pa = typeof computeWastePriority === "function" ? computeWastePriority(a) : "LOW";
        const pb = typeof computeWastePriority === "function" ? computeWastePriority(b) : "LOW";
        return decisionPriorityWeight(pb) - decisionPriorityWeight(pa);
      })[0];

    if (worstWaste) {

      const priority =
        typeof computeWastePriority === "function"
          ? computeWastePriority(worstWaste)
          : "MEDIUM";

      if (decisionPriorityWeight(priority) >= 3) {

        issues.push({
          title: `${worstWaste.area} — Waste Overflow`,
          priority
        });

        actions.push({
          icon: "🗑️",
          title: "Waste",
          priority,
          text: `Dispatch a collection vehicle to the overflowing waste zone in ${worstWaste.area}.`
        });
      }
    }
  }

  // ---- WATER ----
  let waterStatusLabel = "STABLE";

  if (typeof WATER_DATA !== "undefined") {

    waterStatusLabel =
      WATER_DATA.availability >= 90 ? "STABLE" :
      WATER_DATA.availability >= 75 ? "WARNING" : "CRITICAL";

    const worstLeak =
      [...WATER_DATA.leaks].sort(
        (a, b) => decisionPriorityWeight(b.severity) - decisionPriorityWeight(a.severity)
      )[0];

    if (worstLeak && decisionPriorityWeight(worstLeak.severity) >= 3) {

      issues.push({
        title: `${worstLeak.location} — Critical Water Leakage`,
        priority: worstLeak.severity
      });

      actions.push({
        icon: "💧",
        title: "Water",
        priority: worstLeak.severity,
        text: `Prioritize inspection and repair of the critical leak in ${worstLeak.location}.`
      });
    }
  }

  // ---- ALERTS ----
  const allAlerts =
    typeof getAllAlerts === "function" ? getAllAlerts() : [];

  const topAlert = allAlerts.find(a => a.priority === "high");

  if (topAlert) {
    issues.push({ title: topAlert.text, priority: "HIGH" });
  }

  issues.sort((a, b) => decisionPriorityWeight(b.priority) - decisionPriorityWeight(a.priority));
  actions.sort((a, b) => decisionPriorityWeight(b.priority) - decisionPriorityWeight(a.priority));

  let overallRisk = "LOW";

  if (issues.some(i => decisionPriorityWeight(i.priority) === 4)) {
    overallRisk = "CRITICAL";
  } else if (issues.some(i => decisionPriorityWeight(i.priority) === 3)) {
    overallRisk = "HIGH";
  } else if (issues.length) {
    overallRisk = "MEDIUM";
  }

  return {
    overallRisk,
    status: {
      Traffic: trafficStatusLabel,
      "Air Quality": aqiStatusLabel,
      "Flood Risk": floodStatusLabel,
      Waste: wasteStatusLabel,
      Water: waterStatusLabel
    },
    issues: issues.slice(0, 6),
    actions: actions.slice(0, 6)
  };
}

function renderDecisionCenter() {

  const data = buildDecisionCenterData();

  const riskEl = document.getElementById("decisionCityRisk");
  const countEl = document.getElementById("decisionActionCount");
  const statusGrid = document.getElementById("decisionStatusGrid");
  const issuesList = document.getElementById("decisionIssuesList");
  const actionsList = document.getElementById("decisionActionsList");

  if (riskEl) {
    riskEl.textContent = data.overallRisk;
    riskEl.className = "decision-risk-badge " + decisionPriorityClass(data.overallRisk);
  }

  if (countEl) {
    countEl.textContent = `${data.actions.length} priority action(s) recommended`;
  }

  if (statusGrid) {

    statusGrid.innerHTML =
      Object.entries(data.status).map(([label, value]) => {

        const normalized =
          value === "STABLE" ? "LOW" : value === "WARNING" ? "MEDIUM" : value;

        return `
          <div class="decision-status-item">
            <span>${label}</span>
            <span class="badge ${decisionPriorityClass(normalized)}">${value}</span>
          </div>
        `;
      }).join("");
  }

  if (issuesList) {

    issuesList.innerHTML =
      data.issues.length
        ? data.issues.map(issue => `<li>${issue.title}</li>`).join("")
        : `<li class="alert-empty">No major priority issues detected right now.</li>`;
  }

  if (actionsList) {

    actionsList.innerHTML =
      data.actions.length
        ? data.actions.map(action => `
            <div class="decision-action-item ${decisionPriorityClass(action.priority)}">
              <div class="decision-action-head">
                <strong>${action.icon} ${action.title}</strong>
                <span class="badge ${decisionPriorityClass(action.priority)}">${action.priority}</span>
              </div>
              <p>${action.text}</p>
            </div>
          `).join("")
        : `<div class="alert-empty">City conditions are currently stable. No urgent actions required.</div>`;
  }
}

function openDecisionCenter() {

  renderDecisionCenter();

  const overlay = document.getElementById("decisionCenterOverlay");
  const modal = document.getElementById("decisionCenterModal");

  if (overlay) overlay.classList.add("open");
  if (modal) modal.classList.add("open");

  document.body.style.overflow = "hidden";
}

function closeDecisionCenter() {

  const overlay = document.getElementById("decisionCenterOverlay");
  const modal = document.getElementById("decisionCenterModal");

  if (overlay) overlay.classList.remove("open");
  if (modal) modal.classList.remove("open");

  document.body.style.overflow = "";
}

function initDecisionCenter() {

  const fab = document.getElementById("decisionCenterBtn");
  const closeBtn = document.getElementById("decisionCenterCloseBtn");
  const overlay = document.getElementById("decisionCenterOverlay");
  const modal = document.getElementById("decisionCenterModal");

  if (fab) fab.addEventListener("click", openDecisionCenter);
  if (closeBtn) closeBtn.addEventListener("click", closeDecisionCenter);
  if (overlay) overlay.addEventListener("click", closeDecisionCenter);

  document.addEventListener("keydown", (event) => {

    if (event.key === "Escape" && modal && modal.classList.contains("open")) {
      closeDecisionCenter();
    }
  });

  document.querySelectorAll("[data-decision-goto]").forEach(btn => {

    btn.addEventListener("click", () => {

      const target = btn.dataset.decisionGoto;

      const navBtn = document.querySelector(`.nav-item[data-page="${target}"]`);

      if (navBtn) navBtn.click();

      closeDecisionCenter();
    });
  });
}