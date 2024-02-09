const express = require("express");
const templateColorsUseCase = require("../useCases/templateColors.usecase");
const router = express.Router();


router.get("/", async (request, response) => {
    try {
        const templateColors = await templateColorsUseCase.getTemplateColors();
        response.json({
            message: "template Colors",
            data: {
                templateColors: templateColors
            }
        });

    } catch(error) {
        response.status(error.status || 500);
        response.json({
            message: "Algo salio mal",
            error: error.message,
        });
    }
});

module.exports = router;