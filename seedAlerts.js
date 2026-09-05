const mongoose = require("mongoose");
const Alert = require("./models/Alert");

const alerts = [
    {
        title: "High AQI Detected",
        message: "Air quality is unhealthy in G-10 Islamabad.",
        type: "air",
        severity: "critical",
        location: "G-10",
        city: "ISL",
        active: true
    },
    {
        title: "Heavy Traffic Congestion",
        message: "Severe traffic congestion detected on Murree Road.",
        type: "traffic",
        severity: "high",
        location: "Murree Road",
        city: "RWP",
        active: true
    },
    {
        title: "Poor Air Quality",
        message: "AQI levels have increased in Saddar Rawalpindi.",
        type: "air",
        severity: "medium",
        location: "Saddar",
        city: "RWP",
        active: true
    },
    {
        title: "Road Congestion",
        message: "Traffic congestion is high around Blue Area.",
        type: "traffic",
        severity: "low",
        location: "Blue Area",
        city: "ISL",
        active: true
    },
    {
        title: "Flood Risk Warning",
        message: "Potential water accumulation reported in low-lying areas.",
        type: "flood",
        severity: "critical",
        location: "IJP Road",
        city: "RWP",
        active: true
    },
    {
        title: "Road Maintenance Required",
        message: "Road damage detected on Peshawar Road.",
        type: "road",
        severity: "low",
        location: "Peshawar Road",
        city: "RWP",
        active: false
    }
];

async function seedAlerts() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/smart_city");

        console.log("MongoDB connected!");

        await Alert.deleteMany({});

        const insertedAlerts = await Alert.insertMany(alerts);

        console.log(`${insertedAlerts.length} alerts inserted successfully!`);

        await mongoose.connection.close();

        console.log("MongoDB connection closed.");
    } catch (error) {
        console.error("Failed to seed alerts:", error);
        process.exit(1);
    }
}

seedAlerts();