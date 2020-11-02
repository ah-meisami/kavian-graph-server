Using the <a href="https://jsao.io/2017/06/how-to-get-use-and-close-a-db-connection-using-promises/
" target="_blank">jsao.io</a> pattern to call oracle database and the expose it using express.
<br/>
<br/>
for testing:
<br/>
1.run this in command line: nodemon.cmd .\src\get-graph-from-db\index.js
<br/>
2.run this in web browser: <a href="http://127.0.0.1:3000/getData">http://127.0.0.1:3000/getData</a>
<br/>
3.run this in web browser: <a href="http://127.0.0.1:3000/getNode?accNo=0201894993002">http://127.0.0.1:3000/getNode?accNo=0201894993002</a>
<br/>
4.run this in web browser: <a href="http://127.0.0.1:3000/getEdge?accNo=0201894993002">http://127.0.0.1:3000/getEdge?accNo=0201894993002</a>

<br/>
<hr/>
issue: ORA-12516
<a href="https://github.com/oracle/node-oracledb/issues/605">https://github.com/oracle/node-oracledb/issues/605</a>
SQL> show parameter processes
SQL> alter system set processes=150 scope=spfile;
SQL> alter system set sessions=150 scope=spfile;
SQL> shutdown immediate
SQL> startup


<br/>
<hr/>
issue: create connection pool
<a href="https://github.com/oracle/node-oracledb/issues/600">https://github.com/oracle/node-oracledb/issues/600</a>