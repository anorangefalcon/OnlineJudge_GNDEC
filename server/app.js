const express = require("express")
const app = express()
const fs = require("fs")
const bodyParser = require('body-parser')
const { execFile } = require("child_process")
const path = require("path")

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post("/compiler", async (req, res) => {
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