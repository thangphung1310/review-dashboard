var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // scrape.then((data) => {
  //   res.send(data)
  // })
  // .catch(console.error)
  res.send('cc')
});

module.exports = router;
