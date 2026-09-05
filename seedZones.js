const mongoose = require("mongoose");
const Zone = require("./models/Zone");

const zones = [
    {
        name: "F-6",
        city: "ISL",
        aqi: 72,
        trafficCongestion: 38,
        status: "green"
    },
    {
        name: "F-7 Markaz",
        city: "ISL",
        aqi: 78,
        trafficCongestion: 45,
        status: "green"
    },
    {
        name: "F-8",
        city: "ISL",
        aqi: 84,
        trafficCongestion: 52,
        status: "yellow"
    },
    {
        name: "F-10",
        city: "ISL",
        aqi: 91,
        trafficCongestion: 61,
        status: "yellow"
    },
    {
        name: "G-9",
        city: "ISL",
        aqi: 105,
        trafficCongestion: 68,
        status: "yellow"
    },
    {
        name: "G-10",
        city: "ISL",
        aqi: 112,
        trafficCongestion: 72,
        status: "red"
    },
    {
        name: "I-8",
        city: "ISL",
        aqi: 96,
        trafficCongestion: 57,
        status: "yellow"
    },
    {
        name: "Blue Area",
        city: "ISL",
        aqi: 88,
        trafficCongestion: 76,
        status: "yellow"
    },
    {
        name: "Saddar",
        city: "RWP",
        aqi: 118,
        trafficCongestion: 81,
        status: "red"
    },
    {
        name: "Satellite Town",
        city: "RWP",
        aqi: 110,
        trafficCongestion: 74,
        status: "red"
    },
    {
        name: "Chandni Chowk",
        city: "RWP",
        aqi: 125,
        trafficCongestion: 86,
        status: "red"
    },
    {
        name: "Peshawar Road",
        city: "RWP",
        aqi: 116,
        trafficCongestion: 79,
        status: "red"
    },
    {
        name: "6th Road",
        city: "RWP",
        aqi: 108,
        trafficCongestion: 73,
        status: "red"
    },
    {
        name: "Bahria Town",
        city: "RWP",
        aqi: 69,
        trafficCongestion: 34,
        status: "green"
    },
    {
        name: "DHA Phase 2",
        city: "RWP",
        aqi: 75,
        trafficCongestion: 41,
        status: "green"
    }
];

async function seedZones() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/smart_city");

        console.log("MongoDB connected!");

        await Zone.deleteMany({});

        const insertedZones = await Zone.insertMany(zones);

        console.log(`${insertedZones.length} zones inserted successfully!`);

        await mongoose.connection.close();

        console.log("MongoDB connection closed.");
    } catch (error) {
        console.error("Failed to seed zones:", error);
        process.exit(1);
    }
}

seedZones();