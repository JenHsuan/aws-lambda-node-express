const express = require("express");
const router = express.Router();
const user = require('../user/index');

router.post('/', user.create);
router.get('/', user.list);
router.delete('/', user.delete);

module.exports = router;