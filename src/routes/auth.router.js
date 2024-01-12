const express = require("express");
const authUseCase = require("../useCases/auth.usecase");
const users = require("../useCases/auth.usecase");
const router = express.Router();

router.post("/login", async (request, response) => {
  try {
    const { email, password } = request.body;
    const token = await authUseCase.login(email, password);

    response.json({
      message: "Logged in",
      data: {
        token,
      },
    });
  } catch (error) {
    response.status(error.status || 500);
    response.json({
      message: "Algo salio mal",
      error: error.message,
    });
  }
});

router.post("/register", async (request, response) => {
  try {
    const { email, password } = request.body;
    console.log(request.body);
    const userCreated = await users.register({
      email,
      password,
    });
    console.log(userCreated);
    response.status(201);
    response.json({
      message: `El usuario ${userCreated.email} fue creado exitosamente`,
      data: { user: userCreated },
    });
  } catch (error) {
    const status = error.email === "Error de validación" ? 400 : 500;
    response.status(status);
    response.json({
      message: "Algo salió mal",
      error: error.message,
    });
  }
});

module.exports = router;
