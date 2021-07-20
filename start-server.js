let http = require("http");
let fs = require("fs");
let mysql = require("mysql");
const querystring = require("querystring");
const { callbackify } = require("util");
const { tmpdir } = require("os");
let port = 3300;
let alert = require("alert");

function connectToDB() {
  var con = mysql.createConnection({
    host: "localhost",
    user: "korlearn",
    password: "korlearnpw",
    database: "kor",
  });

  return con;
}

// create server
http
  .createServer(function (req, res) {
    let now = new Date();
    console.log(req.method + ": " + req.url);

    //handle get request
    if (req.method === "GET") {
      handleGetRequest(req, res);
    } else if (req.method === "POST") {
      handlePostRequest(req, res);
    }
  })
  .listen(port);

// get request
function handleGetRequest(req, res) {
  //check if file exists
  fs.stat(`.${req.url}`, function (err, stat) {
    if (err == null) {
      //file exists
      if (req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/html; charset=UTF-8" });
        fs.createReadStream("index.html", "UTF-8").pipe(res);
        return;
      }

      if (req.url.endsWith(".css")) {
        res.writeHead(200, { "Content-Type": "text/css; charset=UTF-8" });
      } else if (req.url.endsWith(".html")) {
        res.writeHead(200, { "Content-Type": "text/html; charset=UTF-8" });
      } else if (req.url.endsWith(".js")) {
        res.writeHead(200, { "Content-Type": "application/javascript; charset=UTF-8" });
      }

      fs.createReadStream(`.${req.url}`, "UTF-8").pipe(res);
    } else if (err.code === "ENOENT") {
      //file doesn't exist
      res.writeHead(404, { "Content-Type": "text/plain; charset=UTF-8" });
      res.end("File not found!");
    } else {
      console.log("unknown error");
      res.writeHead(500, { "Content-Type": "text/plain; charset=UTF-8" });
      res.end("unkown error!");
    }
  });
}

console.log(`Server running at port ${port}...\nPress CTRL+C to stop.`);

// post request
function handlePostRequest(req, res) {
  //get data from submitted form
  let requestBody = "";
  req.on("data", function (data) {
    requestBody += data;
  });

  //when all read, parse the data string to get form fields data
  req.on("end", function () {
    console.log(`requestBody: ${requestBody}\n`);
    let formData = querystring.parse(requestBody);
    console.log("formData:");
    console.log(formData);

    // after submit, redirect to the next page
    if (req.url == "/html/submitBackground") {
      writeBackgroundToDb(formData, res.headers);
      res.writeHead(200, { "Content-Type": "text/html; charset=UTF-8" }); //send form submitted response
      fs.createReadStream("html/background-submitted.html", "UTF-8").pipe(res);
    }

    if (req.url == "/html/task1Questions.html") {
      checkCodeAndDirectToTask(formData, res, 1);
    }

    if (req.url == "/html/task2Questions.html") {
      checkCodeAndDirectToTask(formData, res, 2);
    }

    if (req.url == "/html/submitTask1") {
      writeTask1toDB(formData, res);
    }

    if (req.url == "/html/submitTask2") {
      writeTask2toDB(formData, res);
    }
  });
}

async function writeBackgroundToDb(formData) {
  console.log("Writing background data to Db...");

  con = connectToDB();
  con.connect();
  var code_task1 = Math.floor(Math.random() * 90000) + 10000;

  try {
    // write background table!
    //insert data into table
    await con.query(
      "INSERT INTO background (userID, firstName, lastName, email, age, \
          birthDate, nationality, language, learningTime, learningPlace, topik, english, code1)\
          VALUES(UUID(),?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.age,
        formData.birthDate,
        formData.nationality,
        formData.language,
        formData.learningTime,
        formData.learningPlace,
        formData.topik,
        formData.english,
        code_task1,
      ]
    );
  } catch (err) {
    console.error(err);
  }

  console.log("Writing background data Done!");

  try {
    // write userprogress table!

    var ID;

    function setValue(value) {
      ID = value;
    }

    con.query("SELECT userID from background WHERE code1=?", [code_task1], function (err, result, fields) {
      if (err) throw err;
      else {
        setValue(result[0].userID);
        writeUserprogress(ID);
      }
    });

    async function writeUserprogress(ID) {
      try {
        await con.query("INSERT INTO userprogress (userID, code1, task1done, task2done)\
      VALUES(?,?,?,?)", [ID, code_task1, 0, 0]);
      } catch (err) {
        console.error(err);
      }
    }
  } catch (err) {
    console.error(err);
  }

  console.log("Writing user progress data Done!");

  // con.end();
}

async function checkCodeAndDirectToTask(formData, res, task) {
  var id = formData.id;
  var code = formData.code;

  con = connectToDB();
  con.connect();

  console.log("Checking access code to the task");

  if (task == 1) {
    try {
      await con.query("SELECT task1done from userprogress WHERE userID=? and code1=?", [id, code], function (err, result, fields) {
        if (err) throw err;
        else {
          if (result.length == 1) {
            // if code and user id is right,
            if (result[0].task1done == 1) {
              // already task1 done
              console.log("This person already did the task. Redirect to information page...");
              res.writeHead(200, { "Content-Type": "text/html; charset=UTF-8" });
              fs.createReadStream("html/TaskAlreadyDone.html", "UTF-8").pipe(res);
            } else {
              // go to task1 page
              console.log("Entering to the task1 page");
              res.writeHead(200, { "Content-Type": "text/html; charset=UTF-8" });
              fs.createReadStream("html/task1Questions.html", "UTF-8").pipe(res); // redirect to task1 page
            }
          } else {
            res.writeHead(200, { "Content-Type": "text/html; charset=UTF-8" });
            fs.createReadStream("html/code_fail.html", "UTF-8").pipe(res);
          }
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  if (task == 2) {
    try {
      await con.query("SELECT task2done from userprogress WHERE userID=? and code2=?", [id, code], function (err, result, fields) {
        if (err) throw err;
        else {
          if (result.length == 1) {
            // if code and user id is right,
            if (result[0].task2done == 1) {
              // already task2 done
              console.log("This person already did the task. Redirect to information page...");
              res.writeHead(200, { "Content-Type": "text/html; charset=UTF-8" });
              fs.createReadStream("html/TaskAlreadyDone.html", "UTF-8").pipe(res);
            } else {
              // go to task2 page
              console.log("Entering to the task2 page");
              res.writeHead(200, { "Content-Type": "text/html; charset=UTF-8" });
              fs.createReadStream("html/task2Questions.html", "UTF-8").pipe(res); // redirect to task2 page
            }
          } else {
            res.writeHead(200, { "Content-Type": "text/html; charset=UTF-8" });
            fs.createReadStream("html/code_fail.html", "UTF-8").pipe(res);
          }
        }
      });
    } catch (err) {
      console.error(err);
    }
  }
}

async function writeTask1toDB(formData, res) {
  var id = formData.id;
  var code = formData.code;
  console.log("Writing task1 data to Db...");

  con = connectToDB();
  con.connect();

  var code_task2 = Math.floor(Math.random() * 90000) + 10000;

  try {
    await con.query("SELECT * from userprogress WHERE userID=? and code1=?", [id, code], function (err, result, fields) {
      if (err) throw err;
      else {
        if (result.length == 1) {
          // if code and user id is right,

          //save the result into DB
          //insert data into table
          con.query(
            "INSERT INTO task1 (userid, code1, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18, q19, q20, \
              q21, q22, q23, q24, q25, q26, q27, q28, q29, q30, q31, q32, q33, q34, q35, q36, q37, q38, q39, q40)\
                    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              formData.id,
              formData.code,
              formData.q1,
              formData.q2,
              formData.q3,
              formData.q4,
              formData.q5,
              formData.q6,
              formData.q7,
              formData.q8,
              formData.q9,
              formData.q10,
              formData.q11,
              formData.q12,
              formData.q13,
              formData.q14,
              formData.q15,
              formData.q16,
              formData.q17,
              formData.q18,
              formData.q19,
              formData.q20,
              formData.q21,
              formData.q22,
              formData.q23,
              formData.q24,
              formData.q25,
              formData.q26,
              formData.q27,
              formData.q28,
              formData.q29,
              formData.q30,
              formData.q31,
              formData.q32,
              formData.q33,
              formData.q34,
              formData.q35,
              formData.q36,
              formData.q37,
              formData.q38,
              formData.q39,
              formData.q40,
            ]
          );

          con.query(
            "UPDATE userprogress SET task1done=1, task1date=?, code2=? where userid=?",
            [new Date(), code_task2, formData.id],
            function (err, result, fields) {
              if (err) throw err;
            }
          );

          // redirect
          res.writeHead(200, { "Content-Type": "text/html; charset=UTF-8" }); //send form submitted response
          fs.createReadStream("html/task1_submitted.html", "UTF-8").pipe(res);
        } else {
          // if wrong, show alert
          alert("Wrong input: Please verify your access code and user ID.");
        }
      }
    });
  } catch (err) {
    console.error(err);
  }
}

async function writeTask2toDB(formData, res) {
  var id = formData.id;
  var code = formData.code;
  console.log("Writing task2 data to Db...");

  con = connectToDB();
  con.connect();

  try {
    await con.query("SELECT * from userprogress WHERE userID=? and code2=?", [id, code], function (err, result, fields) {
      if (err) throw err;
      else {
        if (result.length == 1) {
          // if code and user id is right,

          //save the result into DB
          //insert data into table
          con.query("INSERT INTO task2 (userid, code2, q1, q2, q3, q4, q5)\
                    VALUES(?,?,?,?,?,?,?)", [
            formData.id,
            formData.code,
            formData.q1,
            formData.q2,
            formData.q3,
            formData.q4,
            formData.q5,
          ]);

          con.query("UPDATE userprogress SET task2done=1, task2date=? where userid=?", [new Date(), formData.id], function (err, result, fields) {
            if (err) throw err;
          });

          // redirect
          res.writeHead(200, { "Content-Type": "text/html; charset=UTF-8" }); //send form submitted response
          fs.createReadStream("html/task2_submitted.html", "UTF-8").pipe(res);
        } else {
          // if wrong, show alert
          alert("Wrong input: Please verify your access code and user ID.");
        }
      }
    });
  } catch (err) {
    console.error(err);
  }
}
