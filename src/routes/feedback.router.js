const express = require("express");
const FeedbackUseCase = require("../useCases/feedback.usecase");
const auth = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/feedback", auth, async (request, response) => {
    try {
      const feedbackCreated = await FeedbackUseCase.createRating(
        request.ratingObject
      );
      response.json({
        message: "Calificaste al artesano correctamente",
        data: {
          rating: feedbackCreated,
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