const input_title = document.querySelector("input#title");
const input_author = document.querySelector("input#author");
const input_pages = document.querySelector("input#pages");

export function validateForm() {
    //Check for unfilled required inputs
    if(!checkRequiredInput(input_title)) return false;
    if(!checkRequiredInput(input_author)) return false;
    if(!checkRequiredInput(input_pages)) return false;

    //Check for invalid page number
    if( !checkPageNumber(input_pages) ) return false;
    
    return true;
}

export function checkRequiredInput(input) {
    const isInvalid = input.validity.valueMissing;
    if(isInvalid) {
        input.setCustomValidity("Please fill in this field.");
        input.focus();
    } else {
        input.setCustomValidity("");        
    }
    input.reportValidity();
    return !isInvalid;
}

export function checkPageNumber(input) {
    const isInvalid = input.validity.rangeUnderflow;
    if(isInvalid) {
        input.setCustomValidity("A book should have at least 1 page.");
        input.focus();
    } else {
        input.setCustomValidity("");
    }
    input.reportValidity();
    return !isInvalid;
}