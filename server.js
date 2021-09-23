require("dotenv").config();

import { serverStartLogo } from "./server_logo";
// const socket = require("socket.io");
const sequelize = require("./src/db/db");

import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import http from "http";
import typeDefs from "./src/db/schema";
import { resolvers } from './src/resolvers/users'
import app from './src/app';


const PORT = process.env.PORT || 3002;

const startApolloServer = async (typeDefs, resolvers) => {
  try {
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      debug: false,
      formatError: (err) => {
        console.error(err);
        return { message: err.message };
      },
      plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    });
    await server.start();
    server.applyMiddleware({ app });
    await sequelize.authenticate();
    // await sequelize.drop();
    await sequelize.sync();
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));

    console.log("\x1b[36m%s\x1b[0m", serverStartLogo(PORT, server.graphqlPath));
  } catch (err) {
    console.log(err);
  }
};

startApolloServer(typeDefs, resolvers);
