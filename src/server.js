const express = require("express");
const cors = require("cors");
const AuthRouter = require("../src/routes/auth.router");
const CraftmanRouter = require("../src/routes/craftsmen.router");
const CategoriesRouter = require("../src/routes/category.router");
const templateColorsRouter = require("./routes/templateColors.router");

const app = express();

app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use("/auth", AuthRouter);
app.use("/craftman", CraftmanRouter);
app.use("/categories", CategoriesRouter);
app.use("/templateColors", templateColorsRouter);

app.get("/", (request, response) => {
  response.json({
    message: "Artetopia API",
  });
});

module.exports = app;
