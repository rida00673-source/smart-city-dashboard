const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Zone = require("./models/Zone");
const Road = require("./models/road");
const Environment = require("./models/Environment");
const Alert = require("./models/Alert");
const Flood = require("./models/Flood");
const Waste = require("./models/Waste");
const Water = require("./models/Water");

const app = express();

const PORT = 5000;

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());

// =====================================================
// MONGODB CONNECTION
// =====================================================

mongoose
    .connect("mongodb://127.0.0.1:27017/smart_city")
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
    });

// =====================================================
// HOME
// =====================================================

app.get("/", (req, res) => {
    res.send("Smart City Backend is Running!");
});

// =====================================================
// API STATUS
// =====================================================

app.get("/api/status", (req, res) => {
    res.json({
        success: true,
        message: "Smart City API is working!",
        city: "Islamabad & Rawalpindi"
    });
});

// =====================================================
// ZONES
// =====================================================

// GET all zones
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
            message: "Failed to fetch zones",
            error: error.message
        });
    }
});

// POST new zone
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

// =====================================================
// ROADS
// =====================================================

// GET all roads
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
            message: "Failed to fetch roads",
            error: error.message
        });
    }
});

// POST new road
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

// =====================================================
// ENVIRONMENT
// =====================================================

// GET all environment data
app.get("/api/environment", async (req, res) => {
    try {
        const environment = await Environment.find();

        res.json({
            success: true,
            count: environment.length,
            data: environment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch environment data",
            error: error.message
        });
    }
});

// POST environment data
app.post("/api/environment", async (req, res) => {
    try {
        const environment = new Environment(req.body);
        const savedEnvironment = await environment.save();

        res.status(201).json({
            success: true,
            data: savedEnvironment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// =====================================================
// ALERTS
// =====================================================

// GET all alerts
app.get("/api/alerts", async (req, res) => {
    try {
        const alerts = await Alert.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            count: alerts.length,
            data: alerts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch alerts",
            error: error.message
        });
    }
});

// GET active alerts only
app.get("/api/alerts/active", async (req, res) => {
    try {
        const alerts = await Alert.find({
            active: true
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: alerts.length,
            data: alerts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch active alerts",
            error: error.message
        });
    }
});

// POST new alert
app.post("/api/alerts", async (req, res) => {
    try {
        const alert = new Alert(req.body);
        const savedAlert = await alert.save();

        res.status(201).json({
            success: true,
            data: savedAlert
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});// =====================================================
// FLOOD
// =====================================================

// GET flood data
app.get("/api/flood", async (req, res) => {
    try {
        const flood = await Flood.findOne().sort({ createdAt: -1 });

        res.json({
            success: true,
            data: flood
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch flood data",
            error: error.message
        });
    }
});

// POST flood data
app.post("/api/flood", async (req, res) => {
    try {
        const flood = new Flood(req.body);
        const savedFlood = await flood.save();

        res.status(201).json({
            success: true,
            data: savedFlood
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});


// =====================================================
// WASTE
// =====================================================

// GET waste data
app.get("/api/waste", async (req, res) => {
    try {
        const waste = await Waste.findOne().sort({ createdAt: -1 });

        res.json({
            success: true,
            data: waste
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch waste data",
            error: error.message
        });
    }
});

// POST waste data
app.post("/api/waste", async (req, res) => {
    try {
        const waste = new Waste(req.body);
        const savedWaste = await waste.save();

        res.status(201).json({
            success: true,
            data: savedWaste
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});


// =====================================================
// WATER
// =====================================================

// GET water data
app.get("/api/water", async (req, res) => {
    try {
        const water = await Water.findOne().sort({ createdAt: -1 });

        res.json({
            success: true,
            data: water
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch water data",
            error: error.message
        });
    }
});

// POST water data
app.post("/api/water", async (req, res) => {
    try {
        const water = new Water(req.body);
        const savedWater = await water.save();

        res.status(201).json({
            success: true,
            data: savedWater
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// =====================================================
// START SERVER
// =====================================================
// =====================================================
// CHUNK 8 ROUTE TEST
// =====================================================

app.get("/test-chunk8", (req, res) => {
    res.json({
        success: true,
        message: "Chunk 8 routes are loaded!"
    });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});