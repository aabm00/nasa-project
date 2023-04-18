const launchesDB = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

const launches = new Map();

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

async function existsLaunchWithId(launchId) {
  return await launchesDB.findOne({
    flightNumber: launchId,
  });
}

async function getLatestFligthNumber() {
  const latestlaunch = await launchesDB.findOne().sort("-flightNumber");

  if (!latestlaunch) return DEFAULT_FLIGHT_NUMBER;

  return latestlaunch.flightNumber;
}

async function getAllLaunches() {
  return await launchesDB.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}

/**
 * Guarda un Lauch teniendo en cuenta que este
 * contiene todas las propiedades necesarias
 * incluida el flightNumber
 *
 * @param {*} launch
 */
async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet found ");
  }

  /**
   * Find by Filtering
   * Datos a salvar
   * upsert: Si existe update, sino insert
   */
  await launchesDB.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );
}

/**
 * Crea un nuevo launch añadiendole propiedades
 * por defecto y asignandole un flightNumber
 */
async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFligthNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    customers: ["ZTM", "NASA"],
    upcoming: true,
    success: true,
  });

  await saveLaunch(newLaunch);
}

/**
 * En realidad no vamos a borrar el Launch simplemente
 * vamos a cambiar las propiedades `upcoming` y `success`
 * a `false`
 * - Find by filtering
 * - Update fields
 *
 * @param {*} launchId
 */
async function abortLaunchById(launchId) {
  const aborted = await launchesDB.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  console.log("ABORTED", aborted);

  return aborted.matchedCount === 1 && aborted.modifiedCount === 1;
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
};
