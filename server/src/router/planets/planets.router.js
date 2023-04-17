const express = require("express");
const { httpGetAllplanets } = require("./planets.controller");

const planetsRouter = express.Router();

// ENDPOINTS
planetsRouter.get("/", httpGetAllplanets);

module.exports = planetsRouter;
