const oracledb = require('oracledb');

function getEdge(accNo) {
  return new Promise(function (resolve, reject) {
    let conn; // Declared here for scoping purposes.

    oracledb
      .getConnection()
      .then(function (c) {
        // console.log('Connected to database');

        conn = c;

                  return conn.execute(
          `select
          d.id         edge_id
          ,src.id      node_from_id
          ,d.acct_src  node_from_acct
          ,dstn.id     node_to_id
          ,d.acct_dstn node_to_acct
          ,d.trn_cd    edge_attr_trn_cd
          ,d.trn_date  edge_attr_trn_date
          ,d.trn_amnt  edge_attr_trn_amnt
          from
              atm.graph_data d
              inner join atm.graph_acct src on d.acct_src = src.acct
              inner join atm.graph_acct dstn on d.acct_dstn = dstn.acct
          where d.acct_src=:accNo or d.acct_dstn=:accNo
          order by d.id
          `,
          [accNo],
          {
            outFormat: oracledb.OBJECT
          }
        );
      })
      .then(
        function (result) {
          // console.log('Query executed');

          resolve(result);
        },
        function (err) {
          console.log('Error occurred', err);

          reject(err);
        }
      )
      .then(function () {
        if (conn) {
          // If conn assignment worked, need to close.
          return conn.close();
        }
      })
      .then(function () {
        console.log('Connection closed');
      })
      .catch(function (err) {
        // If error during close, just log.
        console.log('Error closing connection', err);
      });
  });
}

module.exports.getEdge = getEdge;
