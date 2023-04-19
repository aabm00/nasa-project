const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const planets = require("./planets.mongo");

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

function loadPlanetsData() {
  /**
   * pipe(parse) convierte todas las filas del fichero en
   * objetos JS y los pasa como data para ver si cumple el
   * criterio de habitabilidad.
   */
  return new Promise((resolve, rejects) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        // console.log("DATA:", data);
        if (isHabitablePlanet(data)) {
          savePlanet(data);
        }
        // console.log("/////////////////////////");
      })
      .on("error", (err) => {
        console.log(err);
        rejects(err);
      })
      .on("end", async () => {
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(`${countPlanetsFound} habitable planets found!`);
        resolve();
      });
  });
}

async function getAllPlanets() {
  /**
   * Tiene 2 args:
   * - El primer Objeto con los fitros a aplicar
   * - El segundo es la 'projection' String | Objeto con
   * los campos o propiedades que se quieren añadir o
   * eliminar del resultado a devolver.
   *
   */
  return await planets.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}

// Codigo especifico de MongoDB + mongoose
async function savePlanet(planet) {
  try {
    /**
     * - find the planet by filter
     * - Hacemos que los dato coincidan con el Schema de planet
     *   upsert = insert + update. solo inserta docs que no existen
     * - Activate upsert
     */
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.error(`Could not save planet ${err}`);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
