const express = require("express")
const app = express()
const fs = require("fs")
const bodyParser = require('body-parser')
const { execFile } = require("child_process")
const path = require("path")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")

const secretKey="hjuikoijuihjgolp;hgfhop;gf"

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

     verify.user === "priyanshu1915341@gndec.ac.in" || verify.user === "payal1915338@gndec.ac.in" || verify.user === "devansh1915307@gndec.ac.in" ? next() : res.redirect("/login")
    } catch (e) {
        res.redirect("/login")
    }
}

const loggedInRedirect = async (req, res, next) => {
    try {
        const cookie = req.cookies.user
        const verify = jwt.verify(cookie, secretKey)

      verify.user === "priyanshu1915341@gndec.ac.in" || verify.user === "payal1915338@gndec.ac.in" || verify.user === "devansh1915307@gndec.ac.in" ? res.redirect("/") : next()
    } catch (e) {
        next()
    }
}

app.get("/login",loggedInRedirect,(req, res)=>{
    res.render("login.ejs")
})
app.get("/", loggedInNext, (req, res)=>{
    res.render("index.ejs")
})
app.get("/index.html", loggedInNext, (req, res)=>{
    res.render("index.ejs")
})
app.get("/contests.html", loggedInNext, (req, res)=>{
    res.render("contests.ejs")
})
app.get("/QuesFact.html", loggedInNext, (req, res)=>{
    res.render("QuesFact.ejs")
})
app.get("/QuesPalindrome.html", loggedInNext, (req, res)=>{
    res.render("QuesPalindrome.ejs")
})

app.post("/login", async (req, res) => {
    try {
      if ((req.body.user === "priyanshu1915341@gndec.ac.in" && req.body.password === "1234") || (req.body.user === "payal1915338@gndec.ac.in" && req.body.password === "0000") || (req.body.user === "devansh1915307@gndec.ac.in" && req.body.password === "0000")) {
            const cookie = jwt.sign({ user: req.body.user }, secretKey)
            res.cookie("user", cookie, {
                expires: new Date(Date.now() + (6 * 60 * 60 * 1000)), //expires after 6 hours
                httpOnly: true
            }).redirect("/")
        } else {
            res.send(`<script>
            const c = confirm("Wrong Details")

            c == true ? window.location.href="/login" : window.location.href="/login"
            </script>`)
        }
    } catch (error) {
        res.status(400).send(error)
    }
})

app.post("/compiler", loggedInNext, async (req, res) => {
    try {
        const { language, code, customInput, submit } = req.body
        console.log(customInput);
        const rand = Math.floor(Math.random() * 100)
        const extensions = {
            c: "c",
            cpp: "cpp",
            python: "py"
        }

        const filename = path.join(__dirname, "/uploads/") + rand + "." + extensions[language]
        await fs.promises.writeFile(filename, code);

        // create custom input file if custom input is there 
        // let inputFile = "./server/uploads/execFiles/inputHunBhai.txt"
        if (customInput && !submit) {
            await fs.promises.writeFile(__dirname + "/uploads/execFiles/customInput.txt", customInput);
            // inputFile = "./server/uploads/execFiles/customInput.txt"
        }

        if (language === "python") {
            // execFile("python3", ["cat","/Users/anorangefalcon/Desktop/OJ G50/server/uploads/execFiles/inputHunBhai.txt", "|", "python3", filename], (err, stdout, stderr) => {
            execFile("cat", [path.join(__dirname, "/uploads/inputHunBhai.txt"), "|", "python3", filename], { "shell": true }, (err, stdout, stderr) => {
                if (stderr) {
                    console.log(stderr);
                    console.log(err);
                    return res.json({ error: stderr })
                }
                console.log(stdout);
                res.json({ output: stdout })
            })
        }



        let inputFiles = ["input1.txt", "input2.txt", "input3.txt"]
        let outputFiles = ["output1.txt", "output2.txt", "output3.txt"]
        if (language === "cpp") {
            const outfile = `./server/uploads/execFiles/${rand}.out`

            execFile("g++", [filename, "-o", outfile], (err, stdout, stderr) => {
                console.log(stdout);
                if (stderr) {
                    console.log(stderr);
                    return res.json({ error: stderr })
                } else {
                    // return execFile(`./${outfile}`, (err, output, stderr) => {
                    let outputsSuccess = 0;
                    if (submit) {
                        return inputFiles.map((fileName, key) => {
                            execFile(`./${outfile}`, ["<", "./server/uploads/execFiles/" + fileName], { shell: true }, async (err, output, stderr) => {
                                console.log(stderr);
                                if (err) {
                                    console.log(err);
                                } else {
                                    // console.log(output);
                                    const read = await fs.promises.readFile(`./server/uploads/execFiles/${outputFiles[key]}`, "utf-8")
                                    console.log(output, read);

                                    // const success=outputsSuccess || 0
                                    // output === read ? outputsSuccess=success+1: outputsSuccess=
                                    outputsSuccess = (output === read) ? outputsSuccess + 1 : outputsSuccess
                                    // outputs.push(output)
                                    console.log(key, inputFiles.length - 1);

                                    return (key === inputFiles.length - 1) ? 
                                    setTimeout(()=>{
                                        res.json({ output: `${outputsSuccess}/3 tests passed.` })
                                    }, 100) : ""
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
        if (language === "c") {
            const outfile = `./server/uploads/execFiles/${rand}.out`

            execFile("gcc", [filename, "-o", outfile], (err, stdout, stderr) => {
                console.log(stdout);
                if (stderr) {
                    console.log(stderr);
                    return res.json({ error: stderr })
                } else {
                    return execFile(`./${outfile}`, ["<", inputFile], { shell: true }, (err, output, stderr) => {
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
    } catch (error) {
        console.log(error);
    }
})

app.post("/submit-ques", async (req, res) => {
    try {
        const { language, code, customInput } = req.body
        console.log(customInput);
        const rand = Math.floor(Math.random() * 100)
        const extensions = {
            c: "c",
            cpp: "cpp",
            python: "py"
        }

        const filename = path.join(__dirname, "/uploads/") + rand + "." + extensions[language]
        await fs.promises.writeFile(filename, code);

        // create custom input file if custom input is there 
        // let inputFile = "./server/uploads/execFiles/inputHunBhai.txt"
        if (customInput) {
            await fs.promises.writeFile(__dirname + "/uploads/execFiles/customInput.txt", customInput);
            inputFile = "./server/uploads/execFiles/customInput.txt"
            await fs.promises.writeFile(__dirname + "/uploads/execFiles/inputHunBhai.txt", customInput);
        }

        // if (language === "python") {
        //     // execFile("python3", ["cat","/Users/anorangefalcon/Desktop/OJ G50/server/uploads/execFiles/inputHunBhai.txt", "|", "python3", filename], (err, stdout, stderr) => {
        //     execFile("cat", [path.join(__dirname, "/uploads/inputHunBhai.txt"), "|", "python3", filename], { "shell": true }, (err, stdout, stderr) => {
        //         if (stderr) {
        //             console.log(stderr);
        //             console.log(err);
        //             return res.json({ error: stderr })
        //         }
        //         console.log(stdout);
        //         res.json({ output: stdout })
        //     })
        // }
        
        if (language == "python") {
            const { spawn } = require('child_process');
            const cat = spawn("cat", [path.join(__dirname, "/uploads/inputHunBhai.txt")]);
            const python = spawn("python3", [filename]);
        
            cat.stdout.pipe(python.stdin);
        
            python.stdout.on("data", (data) => {
                console.log(data.toString());
                res.json({ output: data.toString() });
            });
        
            python.stderr.on("data", (data) => {
                console.log(data.toString());
                res.json({ error: data.toString() });
            });
        
            python.on("error", (err) => {
                console.log(err);
                res.json({ error: "Failed to execute Python script" });
            });
        }
        
        if (language === "cpp") {
            const outfile = `./server/uploads/execFiles/${rand}.out`

            execFile("g++", [filename, "-o", outfile], (err, stdout, stderr) => {
                console.log(stdout);
                if (stderr) {
                    console.log(stderr);
                    return res.json({ error: stderr })
                } else {
                    // return execFile(`./${outfile}`, (err, output, stderr) => {
                    return execFile(`./${outfile}`, ["<", inputFile], { shell: true }, (err, output, stderr) => {
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
                console.log(stdout);
                if (stderr) {
                    console.log(stderr);
                    return res.json({ error: stderr })
                } else {
                    return execFile(`./${outfile}`, ["<", inputFile], { shell: true }, (err, output, stderr) => {
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
    } catch (error) {
        console.log(error);
    }
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server on port- ${port}`);
})