const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const Zone = require("./models/Zone");
const Road = require("./models/road");
const app = express();

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
    .connect("mongodb://127.0.0.1:27017/smart_city")
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
    });

// Home Route
app.get("/", (req, res) => {
    res.send("Smart City Backend is Running!");
});

// API Status Route
app.get("/api/status", (req, res) => {
    res.json({
        success: true,
        message: "Smart City API is working!",
        city: "Islamabad & Rawalpindi"
    });
});// Get all zones
app.get("/api/zones", async (req, res) => {
    try {
        const zones = await Zone.find();
        res.json({
            success: true,
            count: zones.length,
            data: zones
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch zones"
        });
    }
});

// Add a new zone
app.post("/api/zones", async (req, res) => {
    try {
        const zone = new Zone(req.body);
        const savedZone = await zone.save();

        res.status(201).json({
            success: true,
            data: savedZone
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});
// Get all roads
app.get("/api/roads", async (req, res) => {
    try {
        const roads = await Road.find();

        res.json({
            success: true,
            count: roads.length,
            data: roads
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch roads"
        });
    }
});

// Add a new road
app.post("/api/roads", async (req, res) => {
    try {
        const road = new Road(req.body);
        const savedRoad = await road.save();

        res.status(201).json({
            success: true,
            data: savedRoad
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});
// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});