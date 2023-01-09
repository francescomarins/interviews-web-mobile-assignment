#Setting up the database
Execute the following command before testing the application.

```
mysql -u "root" -p 'your-my-sql-password' < db.sql
```
Substitute 'your-my-sql-password' with your actual password.

This command will access the mysql shell as root to execute the script db.sql
The script contains the creation of a user to access data using the server, the creation of the database and the insertion of some entries.

In server.js check to have the right path set for the operating system you are using:
MacOs:
socketPath: "/tmp/mysql.sock"

Ubuntu:
socketPath: "/var/lib/mysql/mysql.sock"
