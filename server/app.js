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
        const { language, code } = req.body
        const rand = Math.floor(Math.random() * 100)
        const extensions = {
            c: "c",
            cpp: "cpp",
            python: "py"
        }

        const filename = path.join(__dirname, "/uploads/") + rand + "." + extensions[language]
        const file = await fs.promises.writeFile(filename, code);

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
                    return execFile(`./${outfile}`, ["<", "./server/uploads/execFiles/inputHunBhai.txt"], { shell: true }, (err, output, stderr) => {
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
                    return execFile(`./${outfile}`, ["<", "./server/uploads/execFiles/inputHunBhai.txt"], { shell: true }, (err, output, stderr) => {
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