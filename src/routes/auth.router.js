const express = require("express");
const authUseCase = require("../useCases/auth.usecase");

const router = express.Router();

router.post("/login", async (request, response) => {
    try {
        const {email, password} = request.body;
        const token = await authUseCase.login(email, password);

        response.json({
            message: "Logged in",
            data: {
                token
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

// router.post("/register", async (request, response) => {
//     const userCreate = await authUseCase.register(request.body);
//     response.status(201);
//     response.json({
//         message: "Usuario creado",
//         data: {
//             user: userCreate
//         }
//     });
// });

module.exports = router;