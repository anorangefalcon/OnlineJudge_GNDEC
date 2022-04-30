let editor;

window.onload = function () {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    // editor.setTheme("ace/theme/xcode");
    editor.session.setMode("ace/mode/c_cpp");
}

const changeLanguage = () => {
    const language = document.getElementById("languages").value;

    if (language == 'c' || language == 'cpp') {
        editor.session.setMode("ace/mode/c_cpp");
    }
    else if (language == 'python') {
        editor.session.setMode("ace/mode/python");
    }
}

const clearTerminal=()=>{
    document.getElementById("terminal").innerHTML=""
}

const executeCode = async() => {
    try {
        const language = document.getElementById("languages").value;

        const req = await fetch("/compiler", {
            method: "POST",

            // Adding body or contents to send
            body: JSON.stringify({
                language,
                code: editor.getSession().getValue()
            }),

            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        const res = await req.json()

        // console.log(res);

        if(res.error){
            // return document.getElementById("terminal").insertAdjacentHTML("beforeend", `<span class="text-danger">Some error ocurred. Make sure the code is correct and appropriate language is chosen.</span>`)
            return document.getElementById("terminal").insertAdjacentHTML("beforeend", `<span class="text-danger">Error: ${res.error}</span><br>`)
        }
        if(language ==="python"){
             res.output.map((result) => {
            document.getElementById("terminal").insertAdjacentHTML("beforeend", result + "<br>")
        })
    }else{
        document.getElementById("terminal").insertAdjacentHTML("beforeend", res.output + "<br>")
    }
    } catch (e) {
        console.log(e);
    }
}