const cors = require('cors');
const oracledb = require('oracledb');
const dbConfig = require('./db-config.js');
const graphData = require('./graph-data.js');
const graphEdge = require('./graph-edge.js');
const graphNode = require('./graph-node.js');

var express = require('express');
var app = express();

app.use(cors());
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

  let new_nodes_list = []; //this new nodes list hsa a format that is acceptable by vis-network lib for graph visualization.

  oracledb.createPool(dbConfig)
  .then(function() {
    return graphNode.getNode(accNo);
  })
  .then(function(result) {
    result.rows.map(row => {
      let new_node = {id: row.ID, label: row.NODE};
      new_nodes_list.push(new_node);
    });
    res.json(new_nodes_list);
    // console.log('result.metaData',result.metaData);
    // console.log('result.rows',result.rows);
    // console.log('result.rows.length',Object.keys(result.rows).length);
  })
  .catch(function(err) {
    console.log(err);
  });
});

app.get('/getEdge', function (req, res, next) {
  let accNo = req.query.accNo;

  let new_edges_list = []; //this new edges list hsa a format that is acceptable by vis-network lib for graph visualization.

  oracledb.createPool(dbConfig)
  .then(function() {
    return graphEdge.getEdge(accNo);
  })
  .then(function(result) {
    result.rows.map(row => {
      let new_edge = {
        id: row.EDGE_ID,
        from: row.NODE_FROM_ID,
        to: row.NODE_TO_ID,
        node_from_acct: row.NODE_FROM_ACCT,
        node_to_acct: row.NODE_TO_ACCT,
        edge_attr_trn_cd: row.EDGE_ATTR_TRN_CD,
        edge_attr_trn_date: row.EDGE_ATTR_TRN_DATE,
        edge_attr_trn_amnt: row.EDGE_ATTR_TRN_AMNT
      };
      new_edges_list.push(new_edge);
    });
    res.json(new_edges_list);
    // console.log('result.metaData',result.metaData);
    // console.log('result.rows',result.rows);
    // console.log('result.rows.length',Object.keys(result.rows).length);
  })
  .catch(function(err) {
    console.log(err);
  });
});

const PORT = process.env.PORT || 30;
app.listen(PORT, function () {
  console.log(`web server listening on port ${PORT}`)
});
