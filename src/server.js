const express = require("express");
const cors = require("cors");
const AuthRouter = require("../src/routes/auth.router");

const app = express();

app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use("/auth", AuthRouter);

app.get("/", (request, response) => {
  response.json({
    message: "Artetopia API",
  });
});

module.exports = app;
