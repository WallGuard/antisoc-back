require("dotenv").config();

import express from "express";

const cors = require("cors");
const { readFileSync } = require("fs");
const fileUpload = require("express-fileupload");
const path = require("path");
// const router = require('./routes/index');

const setRoutes = require("./routes/index");

// const usersController = require("./controllers/users");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload({}));

app.use(express.urlencoded({extended: true})); 
app.use(express.json());

setRoutes(app);

module.exports = app;
