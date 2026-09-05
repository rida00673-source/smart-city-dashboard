const mongoose = require("mongoose");
const Road = require("./models/road");

const roads = [
    {
        name: "Srinagar Highway",
        zone: "ISL",
        speed: 34,
        vehicles: 2100,
        congestion: 42
    },
    {
        name: "Kashmir Highway",
        zone: "ISL",
        speed: 28,
        vehicles: 3400,
        congestion: 61
    },
    {
        name: "Murree Road",
        zone: "RWP",
        speed: 18,
        vehicles: 4200,
        congestion: 82
    },
    {
        name: "IJP Road",
        zone: "ISL/RWP",
        speed: 22,
        vehicles: 3900,
        congestion: 71
    },
    {
        name: "GT Road",
        zone: "RWP",
        speed: 25,
        vehicles: 3600,
        congestion: 66
    },
    {
        name: "Faizabad Interchange",
        zone: "ISL/RWP",
        speed: 15,
        vehicles: 4700,
        congestion: 88
    },
    {
        name: "Jinnah Avenue",
        zone: "ISL",
        speed: 38,
        vehicles: 1800,
        congestion: 33
    }
];

async function seedRoads() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/smart_city");

        console.log("MongoDB connected!");

        await Road.deleteMany({});

        const insertedRoads = await Road.insertMany(roads);

        console.log(`${insertedRoads.length} roads inserted successfully!`);

        await mongoose.connection.close();
        console.log("MongoDB connection closed.");

    } catch (error) {
        console.error("Failed to seed roads:", error);
        process.exit(1);
    }
}

seedRoads();