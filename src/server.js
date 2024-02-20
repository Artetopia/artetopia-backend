const express =require("express");
const cors = require("cors");
const AuthRouter = require("../src/routes/auth.router");
const CraftmanRouter = require("../src/routes/craftsmen.router");
const CategoriesRouter = require("../src/routes/category.router");
const templateColorsRouter = require("./routes/templateColors.router");
const UserRouter = require("./routes/users.router");
const OrderAll=require("../src/routes/ordersClient.router");
const ModalCraftman= require("../src/routes/infoCraft.router")
const OrderRouter = require("./routes/orders.router");

const app = express();

app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use("/auth", AuthRouter);
app.use("/craftman", CraftmanRouter);
app.use("/categories", CategoriesRouter);
app.use("/templateColors", templateColorsRouter);
app.use("/user", UserRouter);
app.use("/orders",OrderAll);
app.use("/rating",ModalCraftman);
app.use("/orders", OrderRouter);

app.get("/", (request, response) => {
  response.json({
    message: "Artetopia API",
  });
});

module.exports = app;