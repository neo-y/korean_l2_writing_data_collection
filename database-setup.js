let mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "korlearn",
  password: "korlearnpw",
  database: "kor",
});

con.connect();

// write background table
con.query(
  "CREATE TABLE IF NOT EXISTS background (id INT AUTO_INCREMENT PRIMARY KEY, \
        userID MEDIUMTEXT, \
          firstName VARCHAR(255), \
          lastName VARCHAR(255), \
          email TEXT, \
          age INT, \
          birthDate DATE, \
          nationality VARCHAR(255), \
          language VARCHAR(255), \
          learningTime VARCHAR(255), \
          learningPlace TEXT, \
          topik VARCHAR(255),\
		  english VARCHAR(255), \
      code1 INT)",
  function (error, results, fields) {
    if (error) throw error;
    console.log("background table created!");
  }
);

// write userprogress table
con.query(
  "CREATE TABLE IF NOT EXISTS userprogress (id INT AUTO_INCREMENT PRIMARY KEY, \
          userID MEDIUMTEXT, \
          code1 INT, \
          task1done BOOLEAN, \
          task1date DATE, \
          code2 INT, \
          task2done BOOLEAN, \
          task2date DATE)",
  function (error, results, fields) {
    if (error) throw error;
    console.log("user progress table created!");
  }
);

con.query(
  "CREATE TABLE IF NOT EXISTS task1 (id INT AUTO_INCREMENT PRIMARY KEY, \
                  userid TEXT, \
                    code1 INT, \
                   q1 TEXT, q2 TEXT, q3 TEXT, q4 TEXT, q5 TEXT, q6 TEXT, q7 TEXT, q8 TEXT, q9 TEXT, q10 TEXT, \
                   q11 TEXT, q12 TEXT, q13 TEXT, q14 TEXT, q15 TEXT, q16 TEXT, q17 TEXT, q18 TEXT, q19 TEXT, q20 TEXT, \
                   q21 TEXT, q22 TEXT, q23 TEXT, q24 TEXT, q25 TEXT, q26 TEXT, q27 TEXT, q28 TEXT, q29 TEXT, q30 TEXT, \
                   q31 TEXT, q32 TEXT, q33 TEXT, q34 TEXT, q35 TEXT, q36 TEXT, q37 TEXT, q38 TEXT, q39 TEXT, q40 TEXT)",
  function (error, results, fields) {
    if (error) throw error;
    console.log("task1 table created!");
  }
);

con.query(
  "CREATE TABLE IF NOT EXISTS task2 (id INT AUTO_INCREMENT PRIMARY KEY, \
                  userid TEXT, \
                    code2 INT, \
                   q1 MEDIUMTEXT, q2 MEDIUMTEXT, q3 MEDIUMTEXT, q4 MEDIUMTEXT, q5 MEDIUMTEXT)",
  function (error, results, fields) {
    if (error) throw error;
    console.log("task2 table created!");
  }
);

con.end();
