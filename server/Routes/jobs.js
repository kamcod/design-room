const express = require('express');
const {getDashboardStats} = require("../controllers/jobs");
const Router = express.Router();

Router.route('/getDashboardStats').get(getDashboardStats)
module.exports = Router;
