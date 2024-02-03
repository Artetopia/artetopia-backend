const express = require("express");
const cors = require("cors");
const AuthRouter = require("./routes/auth.router");
const CraftmanRouter = require("./routes/craftsmen.router");
const TemplateColorsRouter = require("./routes/templateColors.router");
const CategoryRouter = require("./routes/category.router");

const app = express();

app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use("/auth", AuthRouter);
app.use("/craftman", CraftmanRouter);
app.use("/templateColors", TemplateColorsRouter);
app.use("/categories", CategoryRouter);

app.get("/", (request, response) => {
  response.json({
    message: "Artetopia API",
  });
});

module.exports = app;
