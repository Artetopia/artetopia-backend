require("dotenv").config();
const mongoose = require("mongoose");
const server = require("./src/server");

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`)
.then(() => {
    console.log("database connected");
    server.listen(8080, () => {
        console.log("server listening on port 8080");
    });
})
.catch((err) => {
    console.error("Error in the connection of the database", err);
});