const express = require("express");
const router = express.Router();
const user = require('../user/index');

router.post('/', user.create);

module.exports = router;