const mongoose = require("mongoose");

const waterSchema = new mongoose.Schema(
    {
        demand: {
            type: Number,
            default: 0
        },

        supply: {
            type: Number,
            default: 0
        },

        availability: {
            type: Number,
            default: 0
        },

        activeLeaks: {
            type: Number,
            default: 0
        },

        reported: {
            type: Number,
            default: 0
        },

        resolved: {
            type: Number,
            default: 0
        },

        lowPressureAreas: {
            type: Number,
            default: 0
        },

        citySupply: {
            Islamabad: {
                supply: Number,
                pressure: String,
                status: String
            },

            Rawalpindi: {
                supply: Number,
                pressure: String,
                status: String
            }
        },

        leaks: [
            {
                location: String,
                city: String,
                severity: String,
                loss: String,
                status: String,
                reported: String
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Water", waterSchema);