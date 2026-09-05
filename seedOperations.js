const mongoose = require("mongoose");

const Flood = require("./models/Flood");
const Waste = require("./models/Waste");
const Water = require("./models/Water");

const FLOOD_DATA = {
    overallRisk: "HIGH",
    waterLevel: 72,
    rainfall: 38,
    blockedDrains: 14,
    criticalZones: 5,
    zones: [
        {
            location: "Nullah Lai",
            city: "Rawalpindi",
            risk: "CRITICAL",
            waterLevel: 89,
            drainage: "Blocked"
        },
        {
            location: "I-8",
            city: "Islamabad",
            risk: "HIGH",
            waterLevel: 71,
            drainage: "Partial"
        },
        {
            location: "Committee Chowk",
            city: "Rawalpindi",
            risk: "HIGH",
            waterLevel: 66,
            drainage: "Partial"
        },
        {
            location: "E-11",
            city: "Islamabad",
            risk: "MEDIUM",
            waterLevel: 48,
            drainage: "Normal"
        },
        {
            location: "Raja Bazaar",
            city: "Rawalpindi",
            risk: "HIGH",
            waterLevel: 74,
            drainage: "Blocked"
        },
        {
            location: "H-8",
            city: "Islamabad",
            risk: "MEDIUM",
            waterLevel: 44,
            drainage: "Normal"
        },
        {
            location: "Saddar",
            city: "Rawalpindi",
            risk: "MEDIUM",
            waterLevel: 51,
            drainage: "Partial"
        }
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
        {
            area: "F-6",
            city: "Islamabad",
            level: 78,
            status: "Collected",
            priority: "MEDIUM",
            lastCollection: "Today 09:20"
        },
        {
            area: "G-9",
            city: "Islamabad",
            level: 91,
            status: "Pending",
            priority: "HIGH",
            lastCollection: "Yesterday 18:40"
        },
        {
            area: "Saddar",
            city: "Rawalpindi",
            level: 96,
            status: "Overflowing",
            priority: "CRITICAL",
            lastCollection: "Yesterday 15:10"
        },
        {
            area: "Raja Bazaar",
            city: "Rawalpindi",
            level: 88,
            status: "Pending",
            priority: "HIGH",
            lastCollection: "Today 07:50"
        },
        {
            area: "I-8",
            city: "Islamabad",
            level: 52,
            status: "Collected",
            priority: "LOW",
            lastCollection: "Today 10:05"
        },
        {
            area: "Committee Chowk",
            city: "Rawalpindi",
            level: 83,
            status: "Pending",
            priority: "HIGH",
            lastCollection: "Yesterday 20:15"
        }
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
        Islamabad: {
            supply: 94,
            pressure: "Normal",
            status: "Stable"
        },

        Rawalpindi: {
            supply: 86,
            pressure: "Low",
            status: "Warning"
        }
    },

    leaks: [
        {
            location: "G-10",
            city: "Islamabad",
            severity: "HIGH",
            loss: "18,000 L/day",
            status: "Investigating",
            reported: "Today 08:20"
        },
        {
            location: "Saddar",
            city: "Rawalpindi",
            severity: "CRITICAL",
            loss: "31,000 L/day",
            status: "Repair Required",
            reported: "Today 06:45"
        },
        {
            location: "I-8",
            city: "Islamabad",
            severity: "MEDIUM",
            loss: "9,000 L/day",
            status: "Monitoring",
            reported: "Yesterday"
        },
        {
            location: "Raja Bazaar",
            city: "Rawalpindi",
            severity: "HIGH",
            loss: "15,500 L/day",
            status: "Investigating",
            reported: "Today 07:10"
        },
        {
            location: "F-10",
            city: "Islamabad",
            severity: "LOW",
            loss: "3,200 L/day",
            status: "Monitoring",
            reported: "2 days ago"
        }
    ]
};


async function seedOperations() {

    try {

        await mongoose.connect(
            "mongodb://127.0.0.1:27017/smart_city"
        );

        console.log("MongoDB connected!");

        // Remove previous operation records
        await Flood.deleteMany({});
        await Waste.deleteMany({});
        await Water.deleteMany({});

        // Insert fresh data
        await Flood.create(FLOOD_DATA);
        await Waste.create(WASTE_DATA);
        await Water.create(WATER_DATA);

        console.log("✅ Flood data inserted");
        console.log("✅ Waste data inserted");
        console.log("✅ Water data inserted");

        console.log("🎉 Operations data seeded successfully!");

    } catch (error) {

        console.error(
            "❌ Seed failed:",
            error.message
        );

    } finally {

        await mongoose.connection.close();

        console.log("MongoDB connection closed.");

    }
}


seedOperations();