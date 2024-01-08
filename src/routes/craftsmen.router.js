// const express = require("express");

// const users = require("../useCases/user.usercase");

// const router = express.Router();

// router.post("/register", async (request, response) => {
//   try {
//     const { email, password } = request.body;
//     const userCreated = await users.create({
//       email,
//       password,
//     });
//     response.status(201);
//     response.json({
//       message: `El usuario asociado a la dirección de correo "${userCreated.email}" fue creado exitosamente`,
//       data: { user: userCreated },
//     });
//   } catch (error) {
//     const status = error.name === "Error de validación" ? 400 : 500;
//     response.status(status);
//     response.json({
//       message: "Algo salió mal",
//       error: error.message,
//     });
//   }
// });

// module.exports = router;
