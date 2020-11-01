const oracledb = require('oracledb');

function getData() {
  return new Promise(function (resolve, reject) {
    let conn; // Declared here for scoping purposes.

    oracledb
      .getConnection()
      .then(function (c) {
        // console.log('Connected to database');

        conn = c;

        return conn.execute(
          `select acct_src accNo, count(*) No from atm.graph_data group by acct_src having count(*) between 100 and 150 order by count(*) asc`
          ,
          [],
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

module.exports.getData = getData;
