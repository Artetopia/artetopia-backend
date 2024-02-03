const mongoose = require("mongoose");

const Category = require("../models/category.model");
const createError = require("http-errors");

async function getAll() {
  return await Category.find();
}

module.exports = { getAll };
