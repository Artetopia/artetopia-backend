const mongoose = require("mongoose");
const Template = require("../models/template.module"); 
const craftsman = require("../models/craftsman.model");
const createError = require("http-errors");

async function create(templateData) {
    if(!mongoose.isValidObjectId(templateData.craftsman)) {
        throw new createError(400, "Invalid craftsman id")
    }
    const craftsmanAsignacion = await craftsman.findById(templateData.craftsman)
    if(!craftsmanAsignacion) {
        throw new createError(404, "Craftsman not found")
    }
    return Template.create(templateData);
}

module.exports = {
    create,

}