import { Library } from "./Library.js";
import { Book } from "./Book.js";

import { validateForm, validatePagesNumber, inputs_Validate } from "./form-validate.js";
import { updateArraysFromSettings } from "./book-sorter.js";
import { refreshCards } from "./book-displayer.js";

//Add Book modal & inputs
const btn_newBook = document.querySelector("button#add-book");

const modal = document.querySelector('dialog.book-modal');


const starWrapper = document.querySelector('.star-wrapper');
const stars = document.querySelectorAll('input.star')

const btn_submit = document.querySelector("button.submit");
const btn_cancel = document.querySelector("button.cancel");

const input_pages = document.querySelector("input#pages");

//Edit Book modal & inputs
const edit_modal = document.querySelector('dialog.edit-modal');
const edit_title = document.querySelector('#edit-title');
const edit_author = document.querySelector('#edit-author');
const edit_pages = document.querySelector('#edit-pages');
const edit_progress = document.querySelector('#edit-progress');

const edit_starWrapper = document.querySelector('.edit-star-wrapper');
const edit_stars = document.querySelectorAll('.edit-star');

const btn_edit_submit = document.querySelector("button#edit-submit");
const btn_edit_Cancel = document.querySelector("button#edit-cancel");

//Cards
const cards_container = document.querySelector('.cards-container');

//Filter & sort dropdown menus
const sort_label = document.querySelector('label[for="sort"]');
const sort_dropdown = document.getElementById('sort');

const filter_label = document.querySelector('label[for="filter-progress"]');
const filter_dropdown = document.getElementById('filter-progress');
const reset_btn = document.querySelector('button.reset-settings');



btn_newBook.addEventListener('click', () => {
    modal.showModal();
});

function createNewBook() {
    let title = document.querySelector("input#title").value;
    let author =  document.querySelector("input#author").value;
    let pages = document.querySelector("input#pages").value;
    let progress = document.querySelector("select#progress").value;
    let rating = getRating();

    return new Book(title, author, pages, progress, rating);
}

function clearFormInputs() {
    for(let input of inputs_Validate) {
        input.value = "";

        input.classList.remove('invalid');
        input.classList.remove('valid');
    }
    document.querySelector("select#progress").value = "unread";
    uncheckStars();
}



starWrapper.addEventListener('click', e => {
    uncheckStars();
    ratingHandler(e);
});

edit_starWrapper.addEventListener('click', e => {
    uncheckEditStars();
    ratingHandler(e);
});

function ratingHandler(e) {
    e.preventDefault(); //prevent clicked input from triggering its label.
    
    const label = e.target;
    const target = label.previousElementSibling;

    let rating = target.value;
    if( !rating ) rating = 0;
    target.checked = true;
}

function getRating() {
    const checkedStar = document.querySelector('.star:checked');
    if(!checkedStar) return 0; //In case no star is checked / does not exist.

    let rating = +checkedStar.value;
    return rating;
}

function updateRating() {
    const checkedStar = document.querySelector('.edit-star:checked');
    if(!checkedStar) return 0; //In case no star is checked / does not exist.

    let rating = +checkedStar.value;
    return rating;
}

function uncheckStars() {
    for(let star of stars) {
        star.checked = false;
    }
}

function uncheckEditStars() {
    for(let star of edit_stars) {
        star.checked = false;
    }
}

btn_submit.addEventListener('click', e => {
    if( !validateForm() ) {
        alert("Please fill all required inputs!");
        return;
    }
    if( !validatePagesNumber() ) {
        alert("Page number must be at least 1!");
        input_pages.focus(); //Focus on invalid page number.
        return;
    }

    let book = createNewBook();
    Library.addBookToLibrary(book); //Create book obj then store in the library[]

    updateArraysFromSettings();
    refreshCards();
    
    modal.close();
    
    e.preventDefault(); //prevent submitting the form to server.
})

btn_cancel.addEventListener('click', () => {
    modal.close();
});

modal.addEventListener('close', clearFormInputs);

btn_edit_submit.addEventListener('click', editHandler);
btn_edit_Cancel.addEventListener('click', () => edit_modal.close());



function editHandler() {
    let idf = this.getAttribute('data-identifier');
    let pos = Library.getPosFromIdentifier(idf);

    Library.myLibrary[pos].edit(edit_title.value, 
                        edit_author.value, 
                        edit_pages.value, 
                        edit_progress.value, 
                        updateRating());

    updateArraysFromSettings();
    refreshCards();

    edit_title.value = null;
    edit_author.value = null;
    edit_pages.value = null;
    edit_progress.value = 'unread';
    uncheckEditStars();
    edit_modal.close();
}



input_pages.addEventListener('change', validatePagesNumber);





//Filter & Sorting settings
filter_dropdown.addEventListener('change', e => {
    //Add .changed class to indicate changed filter setting
    (filter_dropdown.value != "all")
    ? filter_label.classList.add('changed')
    : filter_label.classList.remove('changed');

    if( allSettingsChanged() ) { //Check if either setting is changed.
        revealResetBtn();  //reveal reset_btn if either one is not default setting.
    } else {
        hideResetBtn();  //hide if both are default setting.
    }

    updateArraysFromSettings();
    refreshCards();
});

sort_dropdown.addEventListener('change', e => {
    //Add .changed class to indicate changed sort setting
    (sort_dropdown.value != "timeAdded")
    ? sort_label.classList.add('changed')
    : sort_label.classList.remove('changed');

    if( allSettingsChanged() ) { //Check if either setting is changed.
        revealResetBtn();  //reveal reset_btn if either one is not default setting.
    } else {
        hideResetBtn(); //hide if both are default setting.
    }

    updateArraysFromSettings();
    refreshCards();
});

/*Check if either setting is changed.
  - Return true if either one is changed
  - Return false if both are unchanged.
*/
function allSettingsChanged() {
    if( sort_dropdown.value != "timeAdded" || filter_dropdown.value != "all" ) {
        return true;
    } else {
        return false;
    }
}

function revealResetBtn() {
    reset_btn.style.transform = "scale(1)";
    reset_btn.style.position = "static";
}

function hideResetBtn() {
    reset_btn.style.transform = "scale(0)";
    reset_btn.style.position = "absolute";
}

reset_btn.addEventListener('click', e => {
    resetSettings(); //Only reset dropdowns' values
    filter_label.classList.remove('changed')
    sort_label.classList.remove('changed')
    hideResetBtn();
    updateArraysFromSettings();
    refreshCards();
});



function resetSettings() {
    filter_dropdown.value = "all";
    sort_dropdown.value = "timeAdded";
}



// Default Books
let book1 = new Book("Pride and Prejudice", "Jane Austen", 363, "read", 4);
let book2 = new Book("Ulysses", "James Joyce", 560, "reading", 3);
let book3 = new Book("Nineteen Eighty Four", "George Orwell", 449, "unread", 5);
let book4 = new Book("The Handmaid's Tale", "Margaret Atwood", 370, "reading", 2);
let book5 = new Book("In Search of Lost Time", "Marcel Proust", 4215, "read", 1);

//Set made-up time stamp of books being added.
book1.timeAdded = 5;
book2.timeAdded = 4;
book3.timeAdded = 3;
book4.timeAdded = 2;
book5.timeAdded = 1;

//Added default books to Library.myLibrary.
Library.addBookToLibrary(book1);
Library.addBookToLibrary(book2);
Library.addBookToLibrary(book3);
Library.addBookToLibrary(book4);
Library.addBookToLibrary(book5);

updateArraysFromSettings();
refreshCards();