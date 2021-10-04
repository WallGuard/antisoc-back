import {
  ChangeUserError,
  CreateUserError,
  InternalServerError,
} from "../error/testGraphError";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const path = require("path");
const { User } = require("../db/models/user");

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

export const resolvers = {
  Query: {
    getAllUsers: async (_, args) => {
      try {
        const {page = 1, count = 5} = args;
        console.log(page);
        const limit = count;
        let offset = page * count - count;

        const users = await User.findAndCountAll({
          limit,
          offset,
          // where: {}, // conditions
        });
        // const users = await User.findAll()
        // console.log(users);
        return users.rows;
      } catch (err) {
        return err;
      }
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
    changeUser: async (_, { input }) => {
      try {
        // console.log("USER_ID:", input.id);
        // if (users.find((user) => input.id == user.id) == undefined) {
        //   console.log(new ChangeUserError);
        //   throw new ChangeUserError({
        //     data: {
        //       something: "bla-bla-bla",
        //     },
        //     internalData: {
        //       error: `The SQL server is almost dead.`,
        //     },
        //   });
        // };
        // const updatedUser = users.find((user) => user.id == input.id);
        // users[input.id - 1] = { ...updatedUser, ...input };
        // return { ...updatedUser, ...input };

        const candidate = await User.findOne({
          where: {
            id: input.id,
          },
        });
        if (input.firstName) {
          candidate.firstName = input.firstName;
        };
        if (input.lastName) {
          can;didate.lastName = input.lastName;
        }
        if (input.gender) {
          candidate.gender = input.gender;
        };
        if (input.status) {
          candidate.status = input.status;
        };

        await User.update(
          {
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            gender: candidate.gender,
            status: candidate.status,
          },
          {
            where: {
              id: candidate.id,
            },
          }
        );

        return candidate;
      } catch (err) {
        if (err.internalData) {
          console.log('');
          console.log(err.internalData);
          console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
          console.log('');
          return err;
        }
        console.log("SERVER DOWN ON CHANGE USER");
        console.log(err);
        return new InternalServerError();
      }
    },
  },
};