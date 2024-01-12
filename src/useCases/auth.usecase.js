const User = require("../models/user.model");
const Craftman = require("../models/craftsman.model");
const Admin = require("../models/admin.model");
const createError = require("http-errors");
const bcrypt = require("../lib/bcrypt");
const jwt = require("../lib/jwt");

async function login (email, password) {

    let roles = [];

    const user = await User.findOne({email: email});

    if(!user) {
        throw new createError(401, "El correo o la contraseña son incorrectas 2");
    }

    roles.push("User");

    const passwordValidate = bcrypt.verify(user.password, password);

    if(!passwordValidate) {
        throw new createError(401, "El correo o la contraseña son incorrectas 1");
    }

    const craftman = await Craftman.findOne({user: user._id});
     if(craftman) {
        roles.push("Craftman");
     }

     const admin = await Admin.findOne({user: user._id});
     if (admin) {
        roles.push("Admin");
     }

     return jwt.sign({user: user._id, roles});
}

async function register (userObject) {
    const user = await User.findOne({email: userObject.email});

    if(user) {
        throw new createError(401, "El correo o la contraseña son incorrectas 2");
    }

    const passwordHash = bcrypt.encrypt(userObject.password);
    userObject.password = passwordHash;

    const newUser = await User.create(userObject);
    if(userObject.userType === "Craftman") {
        const craftman = Craftman.create({user: newUser._id});
        if(!craftman) {
            throw new CreateError(400, "No se pudo crear el artesano")
        }
    }
    return newUser;

}

module.exports = {
    login,
    register
} 