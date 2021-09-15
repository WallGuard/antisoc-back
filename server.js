require('dotenv').config();

const socket = require("socket.io");
const sequelize = require('./db/db');

const app = require("./app");
// const config = require("./config");
// const logger = require("./utils/logger");

// process.on("unhandledRejection", (reason, p) => {
//   logger.error(
//     "🚧 UnhandledPromiseRejectionWarning: Unhandled promise rejection 🚧",
//     reason,
//     p
//   );
// });

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, async (err) => {
  try {
    await sequelize.authenticate();
    // await sequelize.drop();
    await sequelize.sync();
  } catch (err) {
    console.log(err);
  }
  
  
  // if (err) {
  //   return logger.error("Error starting the server: ", err);
  // }
  // eslint-disable-next-line no-console
  console.log(`
  /===============================\\
 |   Server is listening on ${PORT}   |
  \\===============================/
  `);
});
// const io = socket(server, {
//   pingTimeout: 60000,
//   cors: {
//     origin: "*",
//   },
// });
// require("./sockets/route.js")(io);
