# NASA PROJECT FROM COURSE ZTM – Complete NodeJS Developer in 2022 (GraphQL, MongoDB, + more)

## CHAPTER 9

### CLIENT

- Al realizar `npm install` ha dado muchos errores pero he evitado ejecutar `npm audit fix`. y `npm audit fix --force` como resultado sigue dando errores pero funciona.
- `npm start` para inicializar la APP REACT y funciona correctamente en el puerto 3000.
- No se visualizan los planetas habitables en el desplegable de la página principal `launch`. He tenido que cambiar el nombre en la page `Launch` de la propiedad `planet.keplerName` a `planet.kepler_name`

  <option value={planet.kepler_name} key={planet.kepler_name}>
    {planet.kepler_name}
  </option>

### SERVER

- Hemos creado un fichero `server.js` vacio
- `npm init -y` inicializamos el `package.json` con las respuestas al wizard por defecto aplicanfo el flag `-y`
  Ha detectado el nombre de la carpeta como `server` o el fichero `server.js` y ha creado automaticamente:
  - La propiedad `"name": "server"`
  - La propiedad `"main": "server.js"`
  - Un `script -> start` para arrancar el server.
- `npm install express` instalamos **express**
- `npm install --save-dev nodemon` instalamos **nodemon** como dependencia de desarrollo para evitar taner que restart el server cada vez que realizamos cambios
- Cambiamos La propiedad `name` como `nasa-project-api`
- Cambiamos La propiedad `description` como `NASA Mission Control API`
- `"watch": "nodemon server.js"` Añadimos el `script` para arracar el server en modo watch y reiniciarlo cada vez que hayan cambios
- `src` creamos la carpeta dentro de `server` y anidamos las carpetas ` router y model` y `server.js`de esta forma ailamos el codigo de la configuración
- `"main": "src/server.js"`, `"start": "node src/server.js"` y `"nodemon src/server.js"` en `package.json` cambiamos las rutas afectadas por el cambio.
- `"start": "PORT=5000 node src/server.js"` Podemos aplicar directamente variables de entorno en los script si es necesario, como en este caso el puerto donde se ejecuta ek Server
- `npm install --save-dev cross-env` Para poder ejecutar variables de entorno directamente en los `scripts` del `package,json`
  Ver:
  [Configurar el uso de variables de entorno en package.json para Windows](https://rafaelneto.dev/blog/configurar-variables-entorno-package-json-windows/)
  Ahora podemos por ejemplo:
  `"start": "cross-env PORT=5000 node src/server.js",`
- `serverjs` y `app.js` los separamos en 2 ficheros
- Creamos el formato de carpetas de `MVC` agrupando `routers` y `controllers` en la carpeta `router` ya que dependen entre ellos y aparte la carpeta `models`
- Los ficheros Controller y Routers estan juntos en la carpeta `router` porque tienen una relación 1 - 1
- La carpeta `model` esta separada porque:
  - Un controller puede usar varios models 1 - n
  - Un model puede ser usado en varios controllers 1 - n
- `Planet endpoints` los creamos y despues implementamos la llamada al endpoint en `src > hooks > requests.js` de la parte `Client REACT`
- `npm install cors` En este momento la parte cliente se ejecuta en el `puerto 3000` y el server en el `puerto 8000` por lo tanto tenemos un problema de CORS ya que el origen de la llamada (browser) es diferente de la del server, entendiendo por origen:
  PROTOCOLO + DOMINIO + PUERTO
  http:// + localhost + :3000
  Como los puertos son diferentes tenemos el conflicto de `CORS` y tenemos que instalar el middleware para solucionarlo
- `npm install csv-parse` para obtener los planetas habiltables del
  fichero `csv` en el fichero `planets.model.js`

- `npm init -y` root `package.json` para crear scripts que ejecuten tanto `client` como `server` desde el directorio `nasa-project`
  - `"server": "cd server && npm run watch"` o `"server": "npm run watch --prefix server"` cambia de directorio y ejecuta el comando
  - `"client": "cd client && npm start"` o `"client": "npm start --prefix client"`
  - `"watch": "npm run server && npm run client"` este comando no funciona por que nunca se ejecutara el cliente ta que `&&` espera a que el primer comando acabe para ejecutar el segundo y el `server` que activo de forma permanente.
    Por lo tanto debemos utilizar `&` que lo que hace es ejecutar el primer comando en el backgroud y entonces ejecuta el 2º comando en el mismo terminal
    `"watch": "npm run server & npm run client"` pero no funciona.
    Otra opción seria:
    `"watch": "start npm run server & start npm run client"` esta si funciona pero abre 2 terminales
  - **ARTICULO** [4 Solutions To Run Multiple Node.js or NPM Commands Simultaneously](https://itnext.io/4-solutions-to-run-multiple-node-js-or-npm-commands-simultaneously-9edaa6215a93)
  - `npm install --save-dev concurrently` en la root del proyecto instalo este paquete para poder ejecutar server y client simultaneamente en la misma terminal con el comando
    `"watch": "concurrently \"npm run server\" \"npm run client\""`

### Serving REACT in production in the same PORT as the SERVER

#### CLIENT

- Para ello vamos a ejecutar el `build` de la parte `client` y guardarlo en una nueva carpeta `public` en el `server`:

  - `npm install --save-dev cross-env` Hemos de instalar en el client esta dependencia para que funcionen las variables de entorno en los scripts de package.json.
    **NOTA**: En casos como estos para evitar duplicar dependencias en client y server es mejor usar monorepo (npm workspaces) que nos permiten compartie dependecias entre diferentes proyectos relacionados como es este caso.

    Ahora ejecutando el script en el clent `npm run build` creara en el `server` la carpeta `public` con el build del client.

#### SERVER

- En `app.js` Añadimos middleware para servir contenido `estatico` en este caso el build de la parte client que se crea mediante el script en la carpeta public del server:
  `app.use(express.static(path.join(__dirname, "..", "public")))`

#### ROOT PACKAGE

- Creamos un script `deploy` para generar el build en el client y copiarlo en el server y arrancar el server:
  `"deploy": "npm run build --prefix client && npm start --prefix server"`
- Ahora podremos ejecutar `server` y `client` desde el mismo puerto en este caso con el script `deploy` desde el puerto `8000` tambien aunque esta puerto esta vez viene dado en una variable de entorno en el script que arranca el server
  `"start": "cross-env PORT=5000 node src/server.js"`

- Como nota en el video `CH9-16` habla de que es necesario crear un endpoint `/` para poder visualizar la app react en `http://localhost:5000` pero yo la tengo comentada porque para mi funciona sin ella:
  `app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});`

### 018 Logging Requests With Morgan

#### SERVER

- `npm install morgan` middleware para crear logs. Es muy versatil y nos permite crear los en ficheros a través de streams y enviarlos cada dia a algun server.
- En `app.js` lo colocamos los mas alto posible dentro de los middleware de seguridad para coger todos los datos posibles a la vuelta de los endpoints (sabemos que por los middleware se pasa 2 veces uno cuando se produce la request y otra cuando ya se ha ejecutado el endpoint por si queremos hacer alguna modificacion o chequeo en la response).
  Lo colocaremos despues del middleware `CORS`
- Cuando ejecutamos el server y el client por separado (diferentes puertos) `npm run watch` solo obtengo logs del server
- Cuando ejecutamos el server y el client en el mismo puerto (producción)`npm run deploy` obtengo logs de los 2 server y client

### 019 The Launches Model, Router y Controller

#### SERVER

- `launches.model.js` Para saber que datos necesitamos debemos mirar las siguientes `vistas` del client:
  - `Launch` se programa un lanzamiento.
  - `Upcoming` vemos los datos para cada uno de los lanzamientos programados
  - `History` existe un historial de los lanzamientos
- Creamos un objeto con los datos necesarios.
- `Map` Para guardar el listado de Launches en vez de un Array de Objetos utilizaremos un Maps. Las ventajas son:

  - Permite tener como key cualquier tipo string, Number functions, etc
  - Los Maps preservan el orden de inserción al contrario de los objetos donde no esta garantizado.
  - Permitira buscar rápidamente un Launch por la `key`
  - launches es un Map y no es un 'JS Object notation', pero
    Map nos da la funcion 'values' que devuelve un iterable
    de los valores (Objetos de objetos), los cuales a su vez los podemos convertir en una Array para poder pasarlos como JSON desde el controller.

### 021 Serving Applications With Client Side Routing

#### SERVER

- Cuando ejecutamos la App REACT en producción, desde el mismo puerto que el Server añadiendo el build de la App en el directorio public del Server y exponiendola como a través de:
  app.use(express.static(path.join(\_\_dirname, "..", "public")));

En principio podemos navegar entre vistas a traves del menu de la app, pero en cuanto hacemos un refresh en alguna de las páginas nos sale un mensage de:
`Cannot GET /launch`

Ahora en nuestro server tenemos la API y el Frontend disponibles en el mismo puerto
El server esta manejando las rutas de los endpoints de la API, pero no las rutas de la App (client) que son manejadas por React.
las rutas del cliente las gestiona el fichero `index.html` dentro de la carpeta `public` del `server`
El proceso es el siguiente:

- Primero intenta buscar la ruta en el `express.static` middleware, si no lo encuentra.
- Segundo intenta buscarlo en la API (rutas de los endpoints) donde no existe
- Tercero Debe ser index.html y React quien maneje todas las rutas por lo tanto debemos añadir:

  `app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});`

donde el `*` es un comodin para todas las rutas clientes

Esto funciona con `REACT`, `ANGULAR`, y `VUE`

### 022 Working With Data Models Building a Data Access Layer

#### SERVER

- **CONTROLLERS - business logic**

  - Seria la capa donde estaria el `Business logic`
  - No deben de preocuparse de como se almacenan los datos en el MODEL (Base de datos, En memoria, En el Cloud).
  - No deberia preocuparse de realizar ninguna trasformación en los datos provinientes del MODEL. Los datos deben venir del MODEL o diferentes posibles MODELS siempre en el mismo formato.
  - es responsable de validar y formatear los datos provinientes del Cliente (req.body) antes de pasarlos al MODEL
  - Es simplemente un intermediario que utiliza el MODEL para leer o escribir datos y recibir peticiones del cliente y enviar respuestas con los codigos de estados correctos [HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
  - Recopila Datos a través de funciones de Acceso al MODEL para enviarselas al Cliente.
  - Para evitar repetir nombres de metodos una buena estrategia es hacer que los nombres de los metodos de los controllers empiecen por hhtp : `httpGetAllLaunches`

- **MODEL - Data access**

  - Seria la capa que habla con la BD, o cualquier sistema donde esten los datos
  - Solo trabaja con los Datos
  - Responsable de como los datos deben ser escritos y leidos y de formatearlos de la manera adecuada para enviarlos al CONTROLLER

  **VIEW - User interface**

  - La capa con la que interactuan los usuarios

### 027 DELETE launches Aborting Launches 1

- En realidad aunque se usa `DELETE` no se borra sino que simplemente se cambian las propiedades `upcoming` y `success` a `false`

### REPOSITORIO

- Crear repositorio `nasa-project` publico en [github](https://github.com/aabm00/nasa-project)
- git init
- git add .
- git status
- git commit -m "first commit updated code from chapter 9"
- git remote add origin git@github.com:aabm00/nasa-project.git
- git remote
- git push -u origin master

- git branch chapter-9
- git push -u origin chapter-9
