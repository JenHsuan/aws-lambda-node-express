const express = require("express");
const user = require('../user/index');
const router = express.Router();

router.post('/', user.create);
router.get('/', user.list);
router.delete('/', user.delete);

module.exports = router;