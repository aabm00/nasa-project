const launches = new Map();

let latestFlightNumber = 100;

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

launches.set(launch.flightNumber, launch);

function existsLaunchWithId(launchId) {
  return launches.has(launchId);
}

/**
 * launches es un Map y no es un 'JS Object notation', pero
 * Map nos da la funcion 'values' que devuelve un iterable
 * de los valores (Objetos de objetos), los cuales a su vez
 * los podemos convertir en una Array para poder pasarlos
 * como JSON
 *
 * @returns [launches]
 */
function getAllLaunches() {
  // console.log("Launches Values", launches.values());
  // console.log("Launches array of values", Array.from(launches.values()));
  return Array.from(launches.values());
}

/**
 *
 * @param {*} launch
 */
function addNewlaunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      flightNumber: latestFlightNumber,
      customers: ["ZTM", "NASA"],
      upcoming: true,
      success: true,
    })
  );
}

/**
 * En realidad no vamos a borrar el Launch simplemente
 * vamos a cambiar las propiedades `upcoming` y `success`
 * a `false`
 *
 * @param {*} launchId
 */
function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  addNewlaunch,
  abortLaunchById,
};
