const createError = require("http-errors");
const mongoose = require("mongoose");

const TemplateColors = require("../models/templateColors.model");

async function getTemplateColors() {
    const findTemplateColors = await TemplateColors.find();
    return findTemplateColors;
}

module.exports = {
    getTemplateColors
}