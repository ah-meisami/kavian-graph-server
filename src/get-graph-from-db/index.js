const cors = require('cors');
const connectionpool = require('./connectionpool.js');

var express = require('express');
var app = express();

app.use(cors());
app.use(express.json());

app.get('/getData', function(req, res, next) {
	connectionpool.getData()
		.then(function(result) {
			res.json(result.rows);
			// console.log('result.metaData',result.metaData);
			// console.log('result.rows',result.rows);
			console.log(`/getData - num of rows:', ${Object.keys(result.rows).length}`);
		})
		.catch(function(err) {
			console.log(err);
		});
});

app.get('/getNode', function(req, res, next) {
	let accNo = req.query.accNo;
	let new_nodes_list = []; //this new nodes list hsa a format that is acceptable by vis-network lib for graph visualization.

  connectionpool.getNode(accNo)
		.then(function(result) {
			result.rows.map((row) => {
				let new_node = { id: row.ID, label: row.NODE };
				new_nodes_list.push(new_node);
			});
			res.json(new_nodes_list);
			// console.log('result.metaData',result.metaData);
			// console.log('result.rows',result.rows);
			console.log(`/getNode - num of rows:', ${Object.keys(result.rows).length}`);
		})
		.catch(function(err) {
			console.log(err);
		});
});

app.get('/getEdge', function(req, res, next) {
	let accNo = req.query.accNo;
	let new_edges_list = []; //this new edges list hsa a format that is acceptable by vis-network lib for graph visualization.

  connectionpool.getEdge(accNo)
		.then(function(result) {
			result.rows.map((row) => {
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
			console.log(`/getEdge - num of rows:', ${Object.keys(result.rows).length}`);
		})
		.catch(function(err) {
			console.log(err);
		});
});

const PORT = process.env.PORT || 30;
app.listen(PORT, function() {
	connectionpool.init();
	console.log(`web server listening on port ${PORT}`);
});
