const express = require("express");

const users = require("../useCases/user.usercase");

const router = express.Router();

router.post("/register", async (request, response) => {
  try {
    const { email, password } = request.body;
    console.log(request.body);
    const userCreated = await users.create({
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
