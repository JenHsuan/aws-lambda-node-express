const express = require("express");
const router = express.Router();
const authentication = require('../authentication/index');

router.post('/', authentication.signin);

module.exports = router;