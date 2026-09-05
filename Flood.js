const mongoose = require("mongoose");

const floodSchema = new mongoose.Schema(
    {
        overallRisk: {
            type: String,
            default: "LOW"
        },

        waterLevel: {
            type: Number,
            default: 0
        },

        rainfall: {
            type: Number,
            default: 0
        },

        blockedDrains: {
            type: Number,
            default: 0
        },

        criticalZones: {
            type: Number,
            default: 0
        },

        zones: [
            {
                location: String,
                city: String,
                risk: String,
                waterLevel: Number,
                drainage: String
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Flood", floodSchema);