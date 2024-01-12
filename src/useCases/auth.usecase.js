const User = require("../models/user.model");
const Craftsman = require("../models/craftsman.model");
const Admin = require("../models/admin.model");
const createError = require("http-errors");
const bcrypt = require("../lib/bcrypt");
const jwt = require("../lib/jwt");

async function login(email, password) {
  let roles = [];

  const user = await User.findOne({ email: email });

  if (!user) {
    console.log("email no encontrado: ", email);
    throw new createError(401, "El correo o la contraseña son incorrectas 2");
  }

  roles.push("User");

  const passwordValidate = bcrypt.verify(user.password, password);

  if (!passwordValidate) {
    throw new createError(401, "El correo o la contraseña son incorrectas 1");
  }

  const craftsman = await Craftsman.findOne({ user: user._id });
  if (craftsman) {
    roles.push("Craftsman");
  }

  const admin = await Admin.findOne({ user: user._id });
  if (admin) {
    roles.push("Admin");
  }

  return jwt.sign({ user: user._id, roles });
}

async function register(userData) {
  const userExists = await User.findOne({ email: userData.email });
  if (userExists) throw new createError(412, "El usuario ya existe");

  const passwordRegExp = new RegExp(
    "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$"
  );
  if (!passwordRegExp.test(userData.password)) {
    throw new createError(400, "Contraseña débil");
  }
  userData.password = bcrypt.encrypt(userData.password);

  const newUser = await User.create(userData);

  if (userData.userType === "Craftsman") {
    const craftsman = await Craftsman.create({ user: newUser._id });
    if (!craftsman) {
      throw new createError(400, "No se pudo crear el usuario artesano");
    }
  }

  return newUser;
}

module.exports = {
  login,
  register,
};
