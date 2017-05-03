var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.statusCode = 200;
});

module.exports = router;
