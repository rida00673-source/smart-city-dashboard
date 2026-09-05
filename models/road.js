const mongoose = require("mongoose");

const roadSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        zone: {
            type: String,
            required: true
        },

        speed: {
            type: Number,
            default: 0
        },

        vehicles: {
            type: Number,
            default: 0
        },

        congestion: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Road", roadSchema);
