const mongoose = require("mongoose");
const Environment = require("./models/Environment");

const environmentData = [
    {
        city: "ISL",
        zone: "F-6",
        aqi: 72,
        temperature: 28,
        humidity: 55
    },
    {
        city: "ISL",
        zone: "F-7 Markaz",
        aqi: 78,
        temperature: 29,
        humidity: 52
    },
    {
        city: "ISL",
        zone: "F-10",
        aqi: 91,
        temperature: 30,
        humidity: 50
    },
    {
        city: "ISL",
        zone: "G-9",
        aqi: 105,
        temperature: 31,
        humidity: 48
    },
    {
        city: "ISL",
        zone: "G-10",
        aqi: 112,
        temperature: 31,
        humidity: 47
    },
    {
        city: "RWP",
        zone: "Saddar",
        aqi: 118,
        temperature: 30,
        humidity: 51
    },
    {
        city: "RWP",
        zone: "Satellite Town",
        aqi: 110,
        temperature: 30,
        humidity: 53
    },
    {
        city: "RWP",
        zone: "Chandni Chowk",
        aqi: 125,
        temperature: 32,
        humidity: 49
    },
    {
        city: "RWP",
        zone: "Peshawar Road",
        aqi: 116,
        temperature: 31,
        humidity: 50
    },
    {
        city: "RWP",
        zone: "6th Road",
        aqi: 108,
        temperature: 30,
        humidity: 52
    }
];

async function seedEnvironment() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/smart_city");

        console.log("MongoDB connected!");

        await Environment.deleteMany({});

        const insertedData = await Environment.insertMany(environmentData);

        console.log(
            `${insertedData.length} environment records inserted successfully!`
        );

        await mongoose.connection.close();

        console.log("MongoDB connection closed.");
    } catch (error) {
        console.error("Failed to seed environment data:", error);
        process.exit(1);
    }
}

seedEnvironment();