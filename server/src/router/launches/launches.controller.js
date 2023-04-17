const {
  getAllLaunches,
  addNewlaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require("../../model/launches.model");

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
  let launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }
  /**
   * las 2 formas de validar fechas es correcta
   */
  launch.launchDate = new Date(launch.launchDate);
  // if(launch.launchDate.tostring === "Invalid Date")
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }

  addNewlaunch(launch);
  return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
  // const launchId = +req.params.id;
  const launchId = Number(req.params.id);

  if (!existsLaunchWithId(launchId)) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }

  const aborted = abortLaunchById(launchId);
  return res.status(200).json(aborted);
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
