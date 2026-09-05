const mongoose = require("mongoose");

const environmentSchema = new mongoose.Schema(
    {
        city: {
            type: String,
            required: true,
            enum: ["ISL", "RWP"]
        },

        zone: {
            type: String,
            required: true
        },

        aqi: {
            type: Number,
            default: 0
        },

        temperature: {
            type: Number,
            default: 0
        },

        humidity: {
            type: Number,
            default: 0
        },

        pm25: {
            type: Number,
            default: 0
        },

        pm10: {
            type: Number,
            default: 0
        },

        status: {
            type: String,
            default: "green"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Environment", environmentSchema);