const mongoose = require("mongoose");

const wasteSchema = new mongoose.Schema(
    {
        totalWaste: {
            type: Number,
            default: 0
        },

        collected: {
            type: Number,
            default: 0
        },

        efficiency: {
            type: Number,
            default: 0
        },

        overflowingBins: {
            type: Number,
            default: 0
        },

        activeVehicles: {
            type: Number,
            default: 0
        },

        pendingPickups: {
            type: Number,
            default: 0
        },

        zones: [
            {
                area: String,
                city: String,
                level: Number,
                status: String,
                priority: String,
                lastCollection: String
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Waste", wasteSchema);
