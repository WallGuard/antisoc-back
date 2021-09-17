require("dotenv").config();
import {
  ChangeUserError,
  CreateUserError,
  InternalServerError,
} from "./error/testGraphError";
import { serverStartLogo } from "./server_logo";

// const socket = require("socket.io");
const sequelize = require("./db/db");

import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import http from "http";

import typeDefs from "./db/schema";

const app = require("./app");

let users = [
  { id: 1, username: "Mikhail", age: 29 },
  { id: 2, username: "Vladislav", age: 27 },
  { id: 3, username: "Olya", age: 24 },
  { id: 4, username: "Svetlana", age: 18 },
];

const createUser = (input) => {
  const id = users.length;
  return {
    id,
    ...input,
  };
};

const resolvers = {
  Query: {
    getAllUsers: () => {
      return users;
    },
    getUser: (_, { id }) => {
      console.log(id);
      return users.find((user) => user.id == id);
    },
  },
  Mutation: {
    createUser: (_, { input }) => {
      try {
        if (users.find((user) => user.id == input.id) == undefined) {
          const user = createUser(input);
          users.push(user);
          return user;
        }
        return new CreateUserError({
          data: {
            something: "important",
          },
          internalData: {
            error: `The SQL server is dead.`,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    changeUser: (_, { input }) => {
      try {
        console.log("USER_ID:", input.id);
        if (users.find((user) => input.id == user.id) == undefined) {
          return new ChangeUserError({
            data: {
              something: "important",
            },
            internalData: {
              error: `The SQL server is almost dead.`,
            },
          });
        }
        const updatedUser = users.find((user) => user.id == input.id);
        users[input.id - 1] = { ...updatedUser, ...input };
        return { ...updatedUser, ...input };
      } catch (err) {
        console.log('SERVER DOWN ON CHANGE USER');
        console.log(err);
        return new InternalServerError({
          data: {
            something: "important",
          },
          internalData: {
            error: `The SQL server is almost dead.`,
          },
        });
      }
    },
  },
};

const PORT = process.env.PORT || 3001;

const startApolloServer = async (typeDefs, resolvers) => {
  try {
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground(),
      ],
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
