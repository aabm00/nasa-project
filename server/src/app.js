const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const api = require("./router/api");

const app = express();

/**
 * Solo permitimos el acceso al cliente REACT
 */
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(morgan("combined"));

/**
 * Parse los datos JSON del body de la request
 */
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/v1", api);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
