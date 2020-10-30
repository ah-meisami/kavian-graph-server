const oracledb = require('oracledb');
const dbConfig = require('./db-config.js');
const graphData = require('./graph-data.js');
const graphEdge = require('./graph-edge.js');
const graphNode = require('./graph-node.js');

var express = require('express');
var app = express();

app.use(express.json());

app.get('/getData', function (req, res, next) {
  oracledb.createPool(dbConfig)
  .then(function() {
    return graphData.getData();
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

app.get('/getNode', function (req, res, next) {
  let accNo = req.query.accNo;

  oracledb.createPool(dbConfig)
  .then(function() {
    return graphNode.getNode(accNo);
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

app.get('/getEdge', function (req, res, next) {
  let accNo = req.query.accNo;

  oracledb.createPool(dbConfig)
  .then(function() {
    return graphEdge.getEdge(accNo);
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
