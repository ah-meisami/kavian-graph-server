const oracledb = require('oracledb');

function getNode(accNo) {
  return new Promise(function (resolve, reject) {
    let conn; // Declared here for scoping purposes.

    oracledb
      .getConnection()
      .then(function (c) {
        // console.log('Connected to database');

        conn = c;

                  return conn.execute(
          `select a.id, acct_src node from atm.graph_data d inner join atm.graph_acct a on d.ACCT_SRC = a.ACCT where acct_src=:accNo or acct_dstn=:accNo
          union
          select a.id, acct_dstn node from atm.graph_data d inner join atm.graph_acct a on d.ACCT_DSTN = a.ACCT where acct_src=:accNo or acct_dstn=:accNo
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

module.exports.getNode = getNode;