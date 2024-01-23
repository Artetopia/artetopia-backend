const express = require('express')
const router = express.Router();
const auth = require("../middleware/auth")
const aditionalInfo = require("../useCases/aditionalInfo.usecase");

router.post("/", async (request, response) => {
    try {
      const videoAndSectionsInfo = request.body;
      console.log("req body", videoAndSectionsInfo)
      const aditionalInfoTemplateB = await aditionalInfo.asignAditionalInfo(videoAndSectionsInfo);
      response.status(200);
      response.json({
        message: "Video and sections updated",
        data: {
          tvideoAndSections: aditionalInfoTemplateB,
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