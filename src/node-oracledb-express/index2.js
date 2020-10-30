const oracledb = require('oracledb');
const dbConfig = require('./db-config.js');
const employees = require('./employees.js');

var express = require('express');
var app = express();

app.use(express.json());

app.get('/getEmployees', function (req, res, next) {
  oracledb.createPool(dbConfig)
  .then(function() {
    return employees.getEmployee();
  })
  .then(function(result) {
    res.json(result);
    console.log('result.metaData',result.metaData);
    console.log('result.rows',result.rows);
    console.log('result.rows.length',Object.keys(result.rows).length);
  })
  .catch(function(err) {
    console.log(err);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`web server listening on port ${PORT}`)
});
