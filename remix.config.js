/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
    serverBuildTarget: "netlify",
    server: "./server.js", // Ajusta si usas otro archivo para el servidor
    ignoredRouteFiles: ["**/.*"],
    future: {
      v3_routeConvention: true,
    },
  };
  