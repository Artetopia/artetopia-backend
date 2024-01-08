const express = require("express");
const cors = require("cors");
const AuthRouter = require("../src/routes/auth.router");
// const craftsmenRouter = require("../src/routes/craftsmen.router");
const usersRouter = require("../src/routes/users.router");

const app = express();

app.use(cors()); // what is for?

app.use(express.json());

app.use("/auth", AuthRouter); // usar camelCase en 'authRouter'
app.use("/users", usersRouter);

app.get("/", (request, response) => {
  response.json({
    message: "Artetopia API",
  });
});

module.exports = app;
