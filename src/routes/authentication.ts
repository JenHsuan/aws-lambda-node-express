const express = require("express");
const authentication = require('../authentication/index');
const router = express.Router();

router.post('/', authentication.signin);

module.exports = router;