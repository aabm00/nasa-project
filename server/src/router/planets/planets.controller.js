const { getAllPlanets } = require("../../model/planets.model");

function httpGetAllplanets(req, res) {
  return res.status(200).json(getAllPlanets());
}

module.exports = {
  httpGetAllplanets,
};
