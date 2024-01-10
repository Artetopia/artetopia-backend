const express = require("express");
const cors = require("cors");
const AuthRouter = require("../src/routes/auth.router");
const templateRouter = require("./routes/selectTemplate.router")

const app = express();

app.use(cors());

app.use(express.json());

app.use("/auth", AuthRouter);
app.use("/selectTemplate", templateRouter);

app.get("/", (request, response) => {
    response.json({
        message: "Artetopia API"
    });
});

module.exports = app;