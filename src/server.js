const express =require("express");
const cors = require("cors");
const AuthRouter = require("../src/routes/auth.router");
const CraftmanRouter = require("../src/routes/craftsmen.router");
const CategoriesRouter = require("../src/routes/category.router");
const templateColorsRouter = require("./routes/templateColors.router");
const UserRouter = require("./routes/users.router");
const OrderRouter = require("./routes/orders.router");

const app = express();

app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use("/api/auth", AuthRouter);
app.use("/api/craftman", CraftmanRouter);
app.use("/api/categories", CategoriesRouter);
app.use("/api/templateColors", templateColorsRouter);
app.use("/api/user", UserRouter);
app.use("/api/orders", OrderRouter);

app.get("/api", (request, response) => {
  response.json({
    message: "Artetopia API",
  });
});

module.exports = app;