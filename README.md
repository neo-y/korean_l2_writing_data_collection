# Data collection project for error analysis of Korean language learner

## Description
TODO add project overview


## Requirements

1. [Node.js](https://nodejs.org/en/)  
2. [mySQL, server ver ==5.6](https://dev.mysql.com/downloads/mysql/)
3. [Grafana](https://grafana.com/grafana/download?pg=get&plcmt=selfmanaged-box1-cta1)


## Install and Setup

1. Clone this repository



2. Install extra nodejs packages using npm

2-1) mysql
```bash
npm install mysql
```

2-2) alert
```bash
npm install alert
```


3. Setup mySQL server
3-1) create user and database in mysql command line client


! Please change configuration in the variable `con` in `database-setup.js` and `start-server.js` to use other user name and password.

Example with:
localhost, database name 'kor'
user name(`korlearn`) and password(`korlearnpw`) set in scripts:

```
create user 'korlearn'@'localhost' IDENTIFIED by 'korlearnpw';
```

Grant privileges
```
grant all privileges on *.* to 'korlearn'@'localhost';
```

Create database
```
CREATE DATABASE kor DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
```




3-2) create tables in database
```bash
node database-setup.js
```

4. Setup Grafana
4-1) go to grafana server (default: localhost:3000) and login
(default admin, admin)

4-2) add MySQL database
- go to Configuration-Data sources
- click Add data source
- choose MySQL
- put host, database, user, password information and click Save&test
host:localhost
database:kor
user:korlearn
password:korlearnpw

4-3) add dashboard
- go to creat-import
- click Upload JSON file
- select grafana-setup.json
- click import


## Usage

1. Run server
```bash
node start-server.js
```
clients can start access the server and submit data.

2. Check database in Grafana
Go to grafana server (default: localhost:3000) and login
You can see participants information and their status and some statistics
If you want, you can add more statistics by creating panels
The dashboard will be refreshed automatically.

3. Database
TODO explain database and their columns



## License
[MIT](https://choosealicense.com/licenses/mit/)
