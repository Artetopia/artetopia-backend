const express = require("express");
const CraftmanCal= require("../useCases/infoCraft.usecase")
const auth = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/:userId", auth, async (request, response) => {
    try {
      const modalCraft = await CraftmanCal.getCraftmanModal(
        request.params.userId
      );
      response.json({
        message: "Modal Craftman",
        data: {
          modalCraft: modalCraft
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

  
  module.exports = router;