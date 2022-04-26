const express = require("express")
// const path = require("path")
const app = express()
const fs = require("fs")
const bodyParser = require('body-parser')

let { PythonShell } = require('python-shell')

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post("/compiler", async (req, res) => {
    try {
        const { language, code } = req.body

        const rand = Math.floor(Math.random() * 100)
        // console.log(rand, language, code);

        const extensions = {
            c: "c",
            cpp: "cpp",
            python: "py"
        }

        // const filename = path.join(__dirname+"/uploads/"+rand+"."+extensions[language])
        const filename = __dirname + "/uploads/" + rand + "." + extensions[language]
        console.log(filename);

        const file = await fs.promises.writeFile(filename, code);

        if (language === "python") {
            return PythonShell.run(filename, null, function (err, output) {
                if (err) throw err;
                console.log(output);
                res.json({ output })
            });
        }
    } catch (error) {
        console.log(error);
    }

})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server on port- ${port}`);
})