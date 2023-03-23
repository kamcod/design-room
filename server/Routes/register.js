const express = require('express');
const {loginUser, loginOutUser} = require("../controllers/register");
const Router = express.Router();

Router.route('/login').post(loginUser)
Router.route('/logout').delete(loginOutUser)

module.exports = Router;
