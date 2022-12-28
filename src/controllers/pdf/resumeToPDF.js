import { StatusCodes } from 'http-status-codes';
import ejs from 'ejs';
import pdf from 'html-pfd';
import path from 'path';

import userService from '../../db/services/user';
import { createTokensPair } from '../../utils/token';

import { createError, createValidationErrorBody } from '../../utils/createError';

const signIn = async (req, res, next) => {
  ejs.renderFile(path.join(__dirname, './views/', "report-template.ejs"), (err, data) => {
    try {
      pdf.create(data, options).toFile("report.pdf", function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send("File created successfully");
        }
    });
      } catch (err) {
      res.send(err)
    }
  })
};

export default signIn;
