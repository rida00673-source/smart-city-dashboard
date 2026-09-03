// =====================================================
// SMART CITY CHAT ASSISTANT — CHUNK 9
// =====================================================

function initializeSmartCityChat() {

  const toggleBtn = document.getElementById("chatToggleBtn");
  const closeBtn = document.getElementById("chatCloseBtn");
  const chatPanel = document.getElementById("chatPanel");
  const chatBody = document.getElementById("chatBody");
  const chatInput = document.getElementById("chatInput");
  const sendBtn = document.getElementById("chatSendBtn");
  const typing = document.getElementById("chatTyping");

  if (
    !toggleBtn ||
    !closeBtn ||
    !chatPanel ||
    !chatBody ||
    !chatInput ||
    !sendBtn
  ) {
    console.warn("⚠️ Chat elements not found.");
    return;
  }

  // ===============================
  // OPEN CHAT
  // ===============================

  toggleBtn.addEventListener("click", () => {
    chatPanel.classList.add("open");
    toggleBtn.classList.add("hidden-while-open");
    chatInput.focus();
  });

  // ===============================
  // CLOSE CHAT
  // ===============================

  closeBtn.addEventListener("click", () => {
    chatPanel.classList.remove("open");
    toggleBtn.classList.remove("hidden-while-open");
  });

  // ===============================
  // ADD MESSAGE
  // ===============================

  function addMessage(text, sender) {

    const message = document.createElement("div");

    message.className =
      sender === "user"
        ? "chat-bubble chat-user"
        : "chat-bubble chat-bot";

    message.textContent = text;

    chatBody.appendChild(message);

    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // ===============================
  // GET CITY DATA
  // ===============================

  function getCityData() {

    const zones =
      typeof ZONES !== "undefined" && Array.isArray(ZONES)
        ? ZONES
        : [];

    const alerts =
      typeof ALERTS !== "undefined" && Array.isArray(ALERTS)
        ? ALERTS
        : [];

    return {
      zones,
      alerts
    };
  }

  // ===============================
  // CHAT RESPONSE
  // ===============================

  function getSmartResponse(question) {

    const text = question.toLowerCase().trim();

    const { zones, alerts } = getCityData();

    // -------------------------------
    // GREETING
    // -------------------------------

    if (
      text === "hi" ||
      text === "hello" ||
      text === "hey" ||
      text.includes("assalam")
    ) {
      return "Hello! 👋 I'm your Smart City Assistant. You can ask me about traffic, AQI, alerts, flood risk, waste, water or city status.";
    }

    // -------------------------------
    // CITY SUMMARY
    // -------------------------------

    if (
      text.includes("city summary") ||
      text.includes("city status") ||
      text.includes("overall")
    ) {

      const avgAQI =
        zones.length
          ? Math.round(
              zones.reduce(
                (sum, zone) => sum + Number(zone.aqi || 0),
                0
              ) / zones.length
            )
          : 0;

      const avgTraffic =
        zones.length
          ? Math.round(
              zones.reduce(
                (sum, zone) =>
                  sum + Number(zone.trafficCongestion || 0),
                0
              ) / zones.length
            )
          : 0;

      return (
        "🏙️ City Summary\n\n" +
        "📍 Monitored Zones: " + zones.length + "\n" +
        "🌫️ Average AQI: " + avgAQI + "\n" +
        "🚗 Traffic Congestion: " + avgTraffic + "%\n" +
        "🚨 Active Alerts: " + alerts.length
      );
    }

    // -------------------------------
    // TRAFFIC
    // -------------------------------

    if (
      text.includes("traffic") ||
      text.includes("congestion") ||
      text.includes("road")
    ) {

      if (!zones.length) {
        return "🚗 Traffic data is currently unavailable.";
      }

      const avgTraffic = Math.round(
        zones.reduce(
          (sum, zone) =>
            sum + Number(zone.trafficCongestion || 0),
          0
        ) / zones.length
      );

      const worstZone = zones.reduce(
        (worst, zone) =>
          Number(zone.trafficCongestion || 0) >
          Number(worst.trafficCongestion || 0)
            ? zone
            : worst,
        zones[0]
      );

      return (
        "🚗 Traffic Status\n\n" +
        "Average congestion: " +
        avgTraffic +
        "%\n\n" +
        "⚠️ Highest congestion: " +
        (worstZone.name || "Unknown Zone") +
        " (" +
        Number(worstZone.trafficCongestion || 0) +
        "%)"
      );
    }

    // -------------------------------
    // AIR QUALITY
    // -------------------------------

    if (
      text.includes("air quality") ||
      text.includes("aqi") ||
      text.includes("pollution")
    ) {

      if (!zones.length) {
        return "🌫️ Air quality data is currently unavailable.";
      }

      const avgAQI = Math.round(
        zones.reduce(
          (sum, zone) =>
            sum + Number(zone.aqi || 0),
          0
        ) / zones.length
      );

      let status = "Good";

      if (avgAQI > 300) {
        status = "Hazardous";
      } else if (avgAQI > 200) {
        status = "Very Unhealthy";
      } else if (avgAQI > 150) {
        status = "Unhealthy";
      } else if (avgAQI > 100) {
        status = "Unhealthy for Sensitive Groups";
      } else if (avgAQI > 50) {
        status = "Moderate";
      }

      return (
        "🌫️ Air Quality\n\n" +
        "Average AQI: " +
        avgAQI +
        "\n" +
        "Status: " +
        status
      );
    }

    // -------------------------------
    // ALERTS
    // -------------------------------

    if (
      text.includes("alert") ||
      text.includes("critical")
    ) {

      if (!alerts.length) {
        return "🚨 There are currently no active alerts.";
      }

      const criticalAlerts = alerts.filter(
        alert =>
          String(alert.severity || "").toLowerCase() ===
          "critical"
      );

      return (
        "🚨 Alert Status\n\n" +
        "Active Alerts: " +
        alerts.length +
        "\n" +
        "Critical Alerts: " +
        criticalAlerts.length
      );
    }

    // -------------------------------
    // FLOOD
    // -------------------------------

    if (
      text.includes("flood") ||
      text.includes("rain") ||
      text.includes("water level")
    ) {

      if (typeof FLOOD_DATA === "undefined") {
        return "🌊 Flood data is currently unavailable.";
      }

      return (
        "🌊 Flood Risk\n\n" +
        "Overall Risk: " +
        (FLOOD_DATA.overallRisk || "Unknown") +
        "\n" +
        "Water Level: " +
        Number(FLOOD_DATA.waterLevel || 0) +
        "\n" +
        "Rainfall: " +
        Number(FLOOD_DATA.rainfall || 0) +
        "\n" +
        "Blocked Drains: " +
        Number(FLOOD_DATA.blockedDrains || 0) +
        "\n" +
        "Critical Zones: " +
        Number(FLOOD_DATA.criticalZones || 0)
      );
    }

    // -------------------------------
    // WASTE
    // -------------------------------

    if (
      text.includes("waste") ||
      text.includes("garbage") ||
      text.includes("bin")
    ) {

      if (typeof WASTE_DATA === "undefined") {
        return "🗑️ Waste data is currently unavailable.";
      }

      return (
        "🗑️ Waste Management\n\n" +
        "Total Waste: " +
        Number(WASTE_DATA.totalWaste || 0) +
        "\n" +
        "Collected: " +
        Number(WASTE_DATA.collected || 0) +
        "\n" +
        "Efficiency: " +
        Number(WASTE_DATA.efficiency || 0) +
        "%\n" +
        "Overflowing Bins: " +
        Number(WASTE_DATA.overflowingBins || 0) +
        "\n" +
        "Pending Pickups: " +
        Number(WASTE_DATA.pendingPickups || 0)
      );
    }

    // -------------------------------
    // WATER
    // -------------------------------

    if (
      text.includes("water") ||
      text.includes("leak") ||
      text.includes("supply")
    ) {

      if (typeof WATER_DATA === "undefined") {
        return "💧 Water data is currently unavailable.";
      }

      return (
        "💧 Water Status\n\n" +
        "Demand: " +
        Number(WATER_DATA.demand || 0) +
        "\n" +
        "Supply: " +
        Number(WATER_DATA.supply || 0) +
        "\n" +
        "Availability: " +
        Number(WATER_DATA.availability || 0) +
        "%\n" +
        "Active Leaks: " +
        Number(WATER_DATA.activeLeaks || 0) +
        "\n" +
        "Low Pressure Areas: " +
        Number(WATER_DATA.lowPressureAreas || 0)
      );
    }

    // -------------------------------
    // HELP
    // -------------------------------

    if (
      text.includes("help") ||
      text.includes("what can you do")
    ) {

      return (
        "🤖 I can help you with:\n\n" +
        "🚗 Traffic Status\n" +
        "🌫️ Air Quality / AQI\n" +
        "🚨 Critical Alerts\n" +
        "🌊 Flood Risk\n" +
        "🗑️ Waste Status\n" +
        "💧 Water Status\n" +
        "🏙️ City Summary"
      );
    }

    // -------------------------------
    // DEFAULT
    // -------------------------------

    return (
      "🤖 I can help with Smart City data. " +
      "Try asking about traffic, AQI, alerts, flood risk, waste, water, or city summary."
    );
  }

  // ===============================
  // SEND MESSAGE
  // ===============================

  function sendMessage() {

    const text = chatInput.value.trim();

    if (!text) {
      return;
    }

    addMessage(text, "user");

    chatInput.value = "";

    if (typing) {
      typing.classList.add("visible");
    }

    setTimeout(() => {

      const response = getSmartResponse(text);

      if (typing) {
        typing.classList.remove("visible");
      }

      addMessage(response, "assistant");

    }, 500);
  }

  // ===============================
  // SEND BUTTON
  // ===============================

  sendBtn.addEventListener("click", sendMessage);

  // ===============================
  // ENTER KEY
  // ===============================

  chatInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {

      event.preventDefault();

      sendMessage();
    }
  });

  // ===============================
  // QUICK SUGGESTIONS
  // ===============================

  const suggestions =
    document.querySelectorAll(".chat-suggestion");

  suggestions.forEach(function(button) {

    button.addEventListener("click", function() {

      chatInput.value =
        button.textContent.trim();

      sendMessage();

    });
  });

  // ===============================
  // WELCOME MESSAGE
  // ===============================

  addMessage(
    "Hello! 👋 I'm your City Assistant. Ask me about traffic, air quality, alerts, flood risk, waste, water or city health.",
    "assistant"
  );

  console.log("✅ Smart City Chat initialized successfully");
}

// =====================================================
// START CHAT
// =====================================================

document.addEventListener(
  "DOMContentLoaded",
  initializeSmartCityChat
);