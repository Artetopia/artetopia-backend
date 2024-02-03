const jwt = require("../lib/jwt");
const createError = require("http-errors");

function auth(request, response, next) {
    try {
        const { authorization } = request.headers;

        if(!authorization) {
            throw new createError(401, "token requerido")
        }
        const token = authorization.replace('Bearer ', '');
        const payload = jwt.verify(token);
        if(!payload) {
            throw new createError(401, "No se puede verificar el token");
        }

        request.user = payload.user;

        next();
    } catch(error) {
        response.status(401);
        response.json({
            message: "No autorizado",
            error: error.message,
        });
    }
}

module.exports = auth;