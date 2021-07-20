# Data collection project for error analysis of Korean language learner

## Description
This repository contains source code for the web-based data collection project to gather writing data of beginner Korean learners.

  

  
## Requirements
1. [Node.js](https://nodejs.org/en/)  
2. [mySQL, server ver ==5.6](https://dev.mysql.com/downloads/mysql/)
3. [Grafana](https://grafana.com/grafana/download?pg=get&plcmt=selfmanaged-box1-cta1)


## Install and Setup

1. Clone this repository
  
2. Install extra nodejs packages in the repository folder using npm

    2-1) mysql
          ```
          npm install mysql
          ```

   2-2) alert
          ```
          npm install alert
          ```

  
3. Setup mySQL server  
! Please change the configuration in the variable `con` in `database-setup.js` and `start-server.js` to use other user name and password.
Example code below with localhost, database name `kor`, username `korlearn` and password `korlearnpw` (default set in scripts):   
   
    3-1)   
    Create user and database in mysql command line client  


    ```
    create user 'korlearn'@'localhost' IDENTIFIED by 'korlearnpw';
    ```

    Grant privileges
    ```
    grant all privileges on *.* to 'korlearn'@'localhost';
    ```

    Create database
    ```
    create database kor default character set utf8 collate utf8_general_ci ;
    ```




    3-2) create tables in database
      `
      node database-setup.js
      `

4. Setup Grafana  
      4-1) Go to the grafana server (default: localhost:3000) and login  
      (default id: admin, password: admin)

      4-2) Add MySQL database
      - Go to `Configuration-Data sources`
      - Click `Add data source`
      - Choose `MySQL`
      - Put host, database, user, password information and click `Save&test`   
        Example with default setting:   
            ```
            host:localhost,   
            database:kor,   
            user:korlearn,   
            password:korlearnpw
            ```

      4-3) Add dashboard
      - In the main page, go to `creat-import`
      - Click `Upload JSON file`
      - Select `grafana-setup.json` in the repository root
      - Click `import`


## Usage

1. Run the server
```bash
node start-server.js
```
Clients(participants) can now access the server and submit data.  
Default server address is `localhost:3300`


2. Check database in Grafana
Go to grafana server (default: localhost:3000) and login
You can see participants information and their status and some statistics
If you want, you can add more statistics by creating panels
The dashboard will be refreshed automatically.

3. Database
TODO explain database and their columns



## License
[MIT](https://choosealicense.com/licenses/mit/)
