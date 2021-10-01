require("dotenv").config();

import cookieParser from "cookie-parser";
import express from "express";
const bodyParser = require('body-parser');

import cors from "cors";
import { readFileSync } from "fs";
import fileUpload from "express-fileupload";
import path from "path";
import setRoutes from "./routes/index";
import errorHandler from './utils/errorHandler';

// const usersController = require("./controllers/users");

const app = express();

app.use(cors());
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload({}));
app.unsubscribe(cookieParser());
app.use(errorHandler);

app.use(express.urlencoded({extended: true})); 
app.use(express.json());

setRoutes(app);

export default app;
