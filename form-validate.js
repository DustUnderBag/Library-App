const input_title = document.querySelector("input#title");
const input_author = document.querySelector("input#author");
const input_pages = document.querySelector("input#pages");
const input_progress = document.querySelector("select#progress");

//Store inputs for validation in an array
const inputs_Validate = [input_title, input_author, input_pages]; 

function validatePagesNumber() {
    if(input_pages.value <= 0) {
        input_pages.classList.add('invalid'); //To-Do: Insert alert message below this input with CSS.
        return false;
    } else {
        input_pages.classList.remove('invalid');
        return true;
    } 
}

function validateForm() {
    let allVaild = true;
    for(let input of inputs_Validate) {
        if(!input.value) {
            input.classList.add('invalid'); // //To-Do: Insert alert message below this input with CSS.
            input.focus();
            allVaild = false;
        } else {
            input.classList.remove('invalid');
        }
    }
    return allVaild;
}


export {validatePagesNumber, validateForm, inputs_Validate};