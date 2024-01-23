const express = require('express')
const router = express.Router();
const auth = require("../middleware/auth")
const selectTemplate = require("../useCases/selectTemplate.usecase");

router.post("/", async (request, response) => {
    try {
      const templateSelected = request.body;
      const templateAndColors = await selectTemplate.asignTemplate(templateSelected);
      response.status(200);
      response.json({
        message: "Template and colors selected",
        data: {
          templateCustom: templateAndColors,
        },
      });
    } catch (error) {       
      const status = error.name === "ValidationError" ? 400 : 500;
      response.status(error.status || status);
      response.json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  });

  module.exports = router