const http = require("http");

const app = require("./app");
const { mongoConnect } = require("./services/mongo");
const { loadPlanetsData } = require("./model/planets.model");

const PORT = process.env.PORT || 8000;

/**
 * El argumento de createServer sera quien sera el encargado
 * de responder a las request.
 * Por lo tanto todos los midleware y routas definidas en 'app'
 * serán las encargadas de responder a las requests
 * Express es una funcion listener 'app' del servidor http de node
 * Esta forma de xrear el server nos permite organizar mejor el codigo
 * separando el server de express
 */
const server = http.createServer(app);

async function startserver() {
  await mongoConnect();

  /**
   * Cargamos los planetas habitables antes de
   * empezar a escuchar requests del cliente
   */
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}...`);
  });
}

startserver();
