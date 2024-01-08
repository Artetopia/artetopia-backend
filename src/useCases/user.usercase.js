const mongoose = require("mongoose");

const User = require("../models/user.model");
const Craftsman = require("../models/craftsman.model");
const Admin = require("../models/admin.model");

const createError = require("http-errors");
const bycrypt = require("../lib/bcrypt");

async function create(userData) {
  const userExists = await User.findOne({ email: userData.email });
  if (userExists) throw new createError(412, "El usuario ya existe");

  const passwordRegExp = new RegExp(
    "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$"
  );
  if (!passwordRegExp.test(userData.password)) {
    throw new createError(400, "Contraseña débil");
  }
  userData.password = bycrypt.encrypt(userData.password);

  const newUser = await User.create(userData);

  if (userData.userType === "Craftsman") {
    const craftsman = await Craftsman.create({ user: newUser._id });
    if (!craftsman) {
      throw new createError(400, "No se pudo crear el usuario artesano");
    }
  }

  return newUser;
}

module.exports = { create };
