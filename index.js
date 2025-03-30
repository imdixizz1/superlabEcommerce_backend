//express
const express = require("express");
const app = express();

//cors
const cors = require("cors");

app.use(cors());
app.use(express.json());

//logging middleware
const logger = require("morgan");
app.use(logger("dev"));

//path
const path = require("path");


app.use("/storage", express.static(path.join(__dirname, "storage")));
//dotenv
require("dotenv").config({ path: ".env" });


const routes = require("./routes/index.route");
app.use("/api", routes);  

//connection.js
const db = require("./middleware/mongoConnection");


app.use("/storage", express.static(path.join(__dirname, "storage")));

db.on("error", () => {
  console.log("Connection Error: ");
});

db.once("open", () => {
  console.log("Mongo: successfully connected to db");
});


app.listen(process?.env.PORT, () => {
  console.log("Server is running on port " + process?.env?.PORT);
});