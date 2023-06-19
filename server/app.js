const express = require("express")
const app = express()
const mysql = require('mysql');
const fs = require("fs")
const bodyParser = require('body-parser')
const { execFile } = require("child_process")
const path = require("path")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const { spawn } = require('child_process');
const { log } = require("console");

app.use(express.static("../public"))

const secretKey = "hjuikoijuihjgolp;hgfhop;gf"

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  // password: {demo},
  // database: {demo},
  password: '',
  database: 'onlinejudge',
  insecureAuth: true,
  authPlugins: {
    mysql_native_password: false
  }
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});
module.exports = connection;

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// for post requests
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// use cookie parser 
app.use(cookieParser())

const loggedInNext = async (req, res, next) => {
  try {
    const cookie = req.cookies.user
    const verify = jwt.verify(cookie, secretKey)
    if (!verify.user) {
      return res.redirect("/login")
    }
    req.user = verify.user
    next()
  } catch (e) {
    res.redirect("/login")
  }
}

const loggedInRedirect = async (req, res, next) => {
  try {
    const cookie = req.cookies.user
    const verify = jwt.verify(cookie, secretKey)
    if (verify.user) {
      return res.redirect("/")
    }
    next()
  } catch (e) {
    next()
  }
}


app.get("/login", loggedInRedirect, (req, res) => {
  res.render("login.ejs")
})
app.get("/", loggedInNext, (req, res) => {
  res.render("home.ejs", {user: req.user})
})
app.get("/index.html", loggedInNext, (req, res) => {
  res.render("index.ejs", {user: req.user})
})
app.get("/login.html", loggedInNext, (req, res) => {
  res.render("login.ejs")
})
app.get("/contests.html", loggedInNext, (req, res) => {
  res.render("contests.ejs", {user: req.user})
})
app.get("/QuesFact.html", loggedInNext, (req, res) => {
  res.render("QuesFact.ejs", {user: req.user})
})
app.get("/QuesPalindrome.html", loggedInNext, (req, res) => {
  res.render("QuesPalindrome.ejs", {user: req.user})
})
app.get("/QuesSmallerGreater.html", loggedInNext, (req, res) => {
  res.render("QuesSmallerGreater.ejs", {user: req.user})
})
app.get("/QuesEquilibriumIndex.html", loggedInNext, (req, res) => {
  res.render("QuesEquilibriumIndex.ejs", {user: req.user})
})
app.get("/QuesLongestSubstring.html", loggedInNext, (req, res) => {
  res.render("QuesLongestSubstring.ejs", {user: req.user})
})
app.get("/QuesMaxProduct.html", loggedInNext, (req, res) => {
  res.render("QuesMaxProduct.ejs", {user: req.user})
})
app.get("/Contest1.html", loggedInNext, (req, res) => {
  res.render("Contest1.ejs", {user: req.user})
})
app.get("/home.html", loggedInNext, (req, res) => {
  res.render("home.ejs", {user: req.user})
})
// app.get("/RankingContest1.html", loggedInNext, (req, res) => {
//   res.render("RankingContest1.ejs", {user: req.user})
// })



app.post("/login", async (req, res) => {
  try {
    const email = req.body.user;
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    connection.query("select * from demousers;", (error, results) => {
      if (error) {
        console.error(error);
      } else {
        //   console.log(results);
      }
    });

    const query = `SELECT email, password FROM demousers WHERE email = ? and password = ?;`;
    connection.query(query, [email, password], (err, result) => {
      if (err) {
        //   console.log(err);
        //   console.log(result && result.length);
        return res.status(500).send("Internal Server Error");
      }
      if (result.length && (email === result[0].email) && password === result[0].password) {
        const cookie = jwt.sign({ user: req.body.user }, secretKey);
        return res
          .cookie("user", cookie, {
            expires: new Date(Date.now() + 6 * 60 * 60 * 1000), //expires after 6 hours
            httpOnly: true,
          })
          .redirect("/");
      }
      if (result.length === 0) {
        //   console.log(email);
        //   console.log(result);
        return res.status(401).send("Invalid email or password");
      }
      const user = { email: result[0].email, id: result[0].id };
      const token = jwt.sign({ user }, secretKey);
      return res
        .cookie("user", token, {
          expires: new Date(Date.now() + 6 * 60 * 60 * 1000), //expires after 6 hours
          httpOnly: true,
        })
        .redirect("/");
    });
  } catch (error) {
    return res.status(400).send(error);
  }
});


app.post("/compiler", loggedInNext, async (req, res) => {
  try {
    const { language, code, customInput, submit, quesId, contestId } = req.body
    console.log("quesId-> " + quesId);
    const rand = Math.floor(Math.random() * 100)
    const extensions = {
      c: "c",
      cpp: "cpp",
      python: "py",
      java: "java"
    }

    const filename = path.join(__dirname, "/uploads/") + rand + "." + extensions[language]
    await fs.promises.writeFile(filename, code);

    if (customInput && !submit) {
      await fs.promises.writeFile(__dirname + "/uploads/execFiles/customInput.txt", customInput);
    }

    let inputFiles;
    let outputFiles;

    try {
      inputFiles = await fs.promises.readdir(`./server/problems/${quesId}/inputs/`);
      outputFiles = await fs.promises.readdir(`./server/problems/${quesId}/outputs/`);
    } catch (error) {
      console.error('Error reading directory:', error);
      return;
    }

    // const scoreGreaterChecker = (testCasesPassed) => {
    //   const score = testCasesPassed * (10 * quesId);

    // }

    //funtion that connects to the db and updates the score
    const updateScore = (testCasesPassed) => {
      const score = testCasesPassed * (10 * quesId);
      const queryCheckOldScore = `SELECT ques${quesId} as score FROM contest${contestId} WHERE email = '${req.user}';`;

      connection.query(queryCheckOldScore, (error, results) => {
        if (error) {
          console.error(error);
        } else {
          const oldScore = results[0].score;
          if (oldScore < score) {
            const queryUpdateScore = `UPDATE contest${contestId} SET ques${quesId} = ${score} WHERE email = '${req.user}';`

            connection.query(queryUpdateScore, (error, results) => {
              if (error) {
                console.error('Error updating score:', error);
              } else {
                console.log('Score updated successfully');
              }
            });
          }
          else {
            log("already at its best score.")
          }
        }
      });


    }

    if (language === "cpp") {
      const outfile = `./server/uploads/execFiles/${rand}.out`

      execFile("g++", [filename, "-o", outfile], (err, stdout, stderr) => {
        if (stderr) {
          return res.json({ error: stderr })
        } else {
          let outputsSuccess = 0;
          if (submit) {
            return inputFiles.map((fileName, key) => {
              console.log("hehe" + `./server/problems/${quesId}/inputs/` + fileName)
              execFile(`./${outfile}`, ["<", `./server/problems/${quesId}/inputs/` + fileName], { shell: true }, async (err, output, stderr) => {
                if (err) {
                  console.log(err);
                } else {
                  const read = await fs.promises.readFile(`./server/problems/${quesId}/outputs/${outputFiles[key]}`, "utf-8")
                  console.log(output, read);

                  outputsSuccess = (output === read) ? outputsSuccess + 1 : outputsSuccess
                  console.log(key, inputFiles.length - 1);

                  updateScore(outputsSuccess)
                  return (key === inputFiles.length - 1) ?
                    setTimeout(() => {
                      res.json({ output: `${outputsSuccess}/${inputFiles.length} tests passed.` })
                    }, 10) : ""
                }
              })
            })
          }
          return execFile(`./${outfile}`, ["<", "./server/uploads/execFiles/customInput.txt"], { shell: true }, (err, output, stderr) => {
            console.log(stderr);
            if (err) {
              console.log(err);
            } else {
              console.log(output);
              res.json({ output })
            }
          })
        }
      })
    }

    if (language === "c") {
      const outfile = `./server/uploads/execFiles/${rand}.out`
      execFile("gcc", [filename, "-o", outfile], (err, stdout, stderr) => {
        console.log("stdout: " + stdout);
        if (stderr) {
          console.log("stderr:" + stderr);
          return res.json({ error: stderr })
        } else {
          // return execFile(`./${outfile}`, (err, output, stderr) => {
          let outputsSuccess = 0;
          if (submit) {
            return inputFiles.map((fileName, key) => {
              console.log("hehe" + `./server/problems/${quesId}/inputs/` + fileName)
              execFile(`./${outfile}`, ["<", `./server/problems/${quesId}/inputs/` + fileName], { shell: true }, async (err, output, stderr) => {
                console.log("stderr:" + stderr);
                if (err) {
                  console.log(err);
                } else {
                  // console.log(output);
                  const read = await fs.promises.readFile(`./server/problems/${quesId}/outputs/${outputFiles[key]}`, "utf-8")
                  console.log(output, read);


                  outputsSuccess = (output === read) ? outputsSuccess + 1 : outputsSuccess
                  console.log(key, inputFiles.length - 1);
                  updateScore(outputsSuccess)

                  return (key === inputFiles.length - 1) ?
                    setTimeout(() => {
                      res.json({ output: `${outputsSuccess}/${inputFiles.length} tests passed.` })
                    }, 10) : ""
                }
              })
            })
            // return outputsSuccess? res.json({ output:`${outputsSuccess}/3 tests passed.` }):""
          }
          return execFile(`./${outfile}`, ["<", "./server/uploads/execFiles/customInput.txt"], { shell: true }, (err, output, stderr) => {
            console.log(stderr);
            if (err) {
              console.log(err);
            } else {
              console.log(output);
              res.json({ output })
            }
          })
        }
      })
    }

    if (language === "python") {
      const pyfile = filename;

      if (submit) {
        let outputsSuccess = 0;

        const processTestCases = async () => {
          for (let i = 0; i < inputFiles.length; i++) {
            const fileName = inputFiles[i];
            const python = spawn('python3', [pyfile]);
            const inputFile = fs.createReadStream(`./server/problems/${quesId}/inputs/` + fileName);
            const outputFile = `./server/problems/${quesId}/outputs/${outputFiles[i]}`;

            inputFile.pipe(python.stdin);

            let output = '';
            python.stdout.on('data', (data) => {
              output += data.toString();
            });

            await new Promise((resolve) => {
              python.stdout.on('end', async () => {
                const expectedOutput = await fs.promises.readFile(outputFile, "utf-8");
                console.log(output, expectedOutput);

                if (output.trim() === expectedOutput.trim()) {
                  outputsSuccess++;
                }

                if (i === inputFiles.length - 1) {
                  updateScore(outputsSuccess);
                  res.json({ output: `${outputsSuccess}/${inputFiles.length} tests passed.` });
                }

                resolve();
              });
            });
          }
        };

        processTestCases();
      } else {
        const python = spawn('python3', [pyfile]);
        const customInputFile = fs.createReadStream("./server/uploads/execFiles/customInput.txt");

        customInputFile.pipe(python.stdin);

        let output = '';
        python.stdout.on('data', (data) => {
          output += data.toString();
        });

        python.stdout.on('end', () => {
          console.log(output);
          res.json({ output });
        });
      }
    }

    log("req.user: " + req.user)
    if (language === "java") {
      const javaFile = filename;

      if (submit) {
        let outputsSuccess = 0;

        const processTestCases = async () => {
          for (let i = 0; i < inputFiles.length; i++) {
            const fileName = inputFiles[i];
            const java = spawn('java', [javaFile]);
            const inputFile = fs.createReadStream(`./server/problems/${quesId}/inputs/` + fileName);
            const outputFile = `./server/problems/${quesId}/outputs/${outputFiles[i]}`;

            inputFile.pipe(java.stdin);

            let output = '';
            java.stdout.on('data', (data) => {
              output += data.toString();
            });

            await new Promise((resolve) => {
              java.stdout.on('end', async () => {
                const expectedOutput = await fs.promises.readFile(outputFile, "utf-8");
                console.log(output, expectedOutput);

                if (output.trim() === expectedOutput.trim()) {
                  outputsSuccess++;
                }

                if (i === inputFiles.length - 1) {
                  updateScore(outputsSuccess);
                  res.json({ output: `${outputsSuccess}/${inputFiles.length} tests passed.` });
                }

                resolve();
              });
            });
          }
        };

        processTestCases();
      } else {
        const java = spawn('java', [javaFile]);
        const customInputFile = fs.createReadStream("./server/uploads/execFiles/customInput.txt");

        customInputFile.pipe(java.stdin);

        let output = '';
        java.stdout.on('data', (data) => {
          output += data.toString();
        });

        java.stdout.on('end', () => {
          console.log(output);
          res.json({ output });
        });
      }
    }

  } 
  catch (error) {
    console.log(error);
  }
  // finally {
  //   const customInputFile = "./server/uploads/execFiles/customInput.txt";
  //   fs.readFile(customInputFile, 'utf8', (err, data) => {
  //     if (err) {
  //       console.error('Error reading file:', err);
  //       return;
  //     }

  //     console.log('File contents:', data);
  //   });
  //   fs.writeFile(customInputFile, '', (err) => {
  //     if (err) {
  //       console.error('Error clearing file:', err);
  //       return;
  //     }
  //     console.log('File cleared successfully.');
  //   });

  // }
})

app.get("/RankingContest1.html", loggedInNext, async (req, res) => {
  try {
    const query = 'SELECT email, ques1 + ques2 + ques3 + ques4 + ques5 + ques6 AS totalScore FROM contest1 ORDER BY totalScore DESC';

    connection.query(query, (error, results) => {
      if (error) {
        console.error(error);
        // Handle the error appropriately, e.g., res.status(500).send('An error occurred');
      } else {
        const rankingData = results;
        console.log(results);
        res.render("RankingContest1.ejs", { rankingData, user: req.user}); // Pass rankingData as a parameter
      }
      // res.render("RankingContest1.ejs", {user: req.user})
    });
  } catch (error) {
    console.log("Unable to render data from MySQL database.");
    // Handle the error appropriately, e.g., res.status(500).send('An error occurred');
  }
});

app.get("/logout", (req, res) => {
  try {
    res.clearCookie("user")
    res.redirect("/login")
  } catch (error) {
    console.log(error)
  }
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server on port- ${port}`);
})