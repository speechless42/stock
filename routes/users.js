var express = require('express');
var router = express.Router();
const { RestClient } = require('@fugle/marketdata');
require("dotenv").config( { path: "./.env" })
/* GET users listing. */

/*取得IDs 輸入到計算爆量。 */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
