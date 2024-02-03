const express = require("express");

const categories = require("../useCases/category.usecase");

const router = express.Router();

router.get("/", async (request, response) => {
  try {
    const allCategories = await categories.getAll();
    response.json({
      message: "Obtener todas las categorías de la BBDD",
      data: { categories: allCategories },
    });
  } catch (error) {
    response.status(500);
    response.json({
      message: "Algo fue mal",
      error: error.message,
    });
  }
});

module.exports = router;
