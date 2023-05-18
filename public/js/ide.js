let editor;
let ifCustomInputHidden = true;
let change = false;

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

const clearTerminal = () => {
    document.getElementById("terminal").innerHTML = ""
}

const executeCode = async (submit, quesId, contestId) => {
    try {
        clearTerminal()
        const language = document.getElementById("languages").value;
        const customInput = document.getElementById("customInput").value;
        console.log(customInput);
        // if(customInput) console.log(customInput);

        const req = await fetch("/compiler", {
            method: "POST",

            // Adding body or contents to send
            body: JSON.stringify({
                quesId,
                contestId,
                language,
                code: editor.getSession().getValue(),
                customInput,
                submit: submit ? true : false
            }),

            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        const res = await req.json()

        if (res.error) {
            return document.getElementById("terminal").insertAdjacentHTML("beforeend", `<span class="text-danger">Error: ${res.error}</span><br>`)
        }
        console.log(res.output);
        const elem = document.createElement("pre")
        elem.innerHTML = `${res.output}` + "<br>"
        document.getElementById("terminal").insertAdjacentElement("beforeend", elem)
    } catch (e) {
        console.log(e);
    }
}

//custom input function:
const customInput = () => {
    document.getElementById("inputArea").classList.toggle("d-none")
    document.getElementById("terminal").classList.toggle("d-none")

    if (document.getElementById("text_output").innerText === "OUTPUT:") {
        document.getElementById("text_output").innerText = ""
    }
    else {
        document.getElementById("text_output").innerText = "OUTPUT:";
    }
}


//light - dark mode implementation:
const sunMoonContainer = document.querySelector('.sun-moon-container')

document.querySelector('.theme-toggle-button').addEventListener('click', () => {

    if (change == true) {
        document.body.classList.toggle('dark');
        editor.setTheme("ace/theme/monokai");
        change = false;
    }
    else {
        document.body.classList.toggle('dark');
        editor.setTheme("ace/theme/xcode");
        change = true;
    }
    const currentRotation = parseInt(getComputedStyle(sunMoonContainer).getPropertyValue('--rotation'))
    sunMoonContainer.style.setProperty('--rotation', currentRotation + 180)
})