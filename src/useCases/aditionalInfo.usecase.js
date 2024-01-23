const mongoose = require("mongoose");
const aditionalInfo = require("../models/aditionalInfo.module"); 
const craftsman = require("../models/craftsman.model");
const createError = require("http-errors");

async function asignAditionalInfo(videoAndSectionsData) {
    if(!mongoose.isValidObjectId(videoAndSectionsData.craftsman)) {
        throw new createError(400, "Invalid craftsman id")
    }
    const craftsmanAsignacion = await craftsman.findById(videoAndSectionsData.craftsman)
    if(!craftsmanAsignacion) {
        throw new createError(404, "Craftsman not found")
    }
    return aditionalInfo.create(videoAndSectionsData);
}

module.exports = {
    asignAditionalInfo,

}