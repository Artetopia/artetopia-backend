const mongoose = require("mongoose");

const User = require("../models/user.model");
const Craftsman = require("../models/craftsman.model");
const Category = require("../models/category.model");

const createError = require("http-error");
const bycrypt = require("../lib/bcrypt");

async function getAllCategories(name, craftsman) {
  const filters = {};
  if (name) {
    filters.name = new RegExp(name, "i");
  }
  if (craftsman && mongoose.isValidObjectId(craftsman)) {
    filters.craftsman = craftsman;
  }
  return await Category.find(filters).populate("craftsman");
}

module.exports = { getAllCategories };
