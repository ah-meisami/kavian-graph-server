module.exports = {
  user: process.env.NODE_ORACLEDB_USER || 'atm',
  password: process.env.NODE_ORACLEDB_PASSWORD || 'atm',
  connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING || '192.168.234.130:1522/ORCL',
  poolMin: 10,
  poolMax: 100,
  poolIncrement: 5,
  poolAlias: 'pool-ah-meisami',
  _enableStats : false
};