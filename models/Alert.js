const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        message: {
            type: String,
            required: true
        },

        type: {
            type: String,
            required: true
        },

        severity: {
            type: String,
            enum: ["low", "medium", "high", "critical"],
            required: true
        },

        city: {
            type: String,
            enum: ["ISL", "RWP"],
            required: true
        },

        zone: {
            type: String
        },

        location: {
            type: String
        },

        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Alert", alertSchema);
