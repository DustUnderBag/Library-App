import { Library } from "./Library.js";
import { Book } from "./Book.js";

import { validateForm, validatePagesNumber, inputs_Validate } from "./form-validate.js";

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

let filtered = [];
let sorted = [];

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

function createCardsFromLibrary(library) {
    library.forEach( book => {
        let identifier = book.identifier;
        const card_DOM = document.createElement('div');
        card_DOM.classList.add('card');
        card_DOM.setAttribute('data-identifier', identifier);

        const bookInfo_DOM = document.createElement('div');
        bookInfo_DOM.classList.add('book-info');
    
        const title_DOM = document.createElement('h2');
        title_DOM.textContent = book.title;
        title_DOM.classList.add('card-title');
    
        const author_DOM = document.createElement('p');
        author_DOM.textContent = book.author;
        author_DOM.classList.add('card-author');
    
        const pages_DOM = document.createElement('p');
        pages_DOM.textContent = book.pages + ' pages';
        pages_DOM.classList.add('card-pages');
    
        //To create dropdown menu for reading progress in cards
        const progress_DOM = document.createElement("select");
        progress_DOM.setAttribute("data-identifier", identifier);
        progress_DOM.classList.add('card-progress')

        //Create option elements for all progress states.
        const unread_opt = document.createElement("option");
        unread_opt.setAttribute("value", "unread");
        unread_opt.append("Not started");
        progress_DOM.appendChild(unread_opt);

        const reading_opt = document.createElement("option");
        reading_opt.setAttribute("value", "reading");
        reading_opt.append("In progress");
        progress_DOM.appendChild(reading_opt);

        const read_opt = document.createElement("option");
        read_opt.setAttribute("value", "read");
        read_opt.append("Finished");
        progress_DOM.appendChild(read_opt);

        progress_DOM.value = book.progress;
        progress_DOM.addEventListener('change', progressHandler);
    
        //Delete button
        const delete_btn = document.createElement('button');
        delete_btn.classList.add('delete-btn');
        delete_btn.setAttribute('data-identifier', identifier);
        delete_btn.addEventListener('click', deleteHandler);
        
        //Edit button
        const edit_btn = document.createElement('button');
        edit_btn.classList.add('edit-btn')
        edit_btn.setAttribute('data-identifier', identifier);
        edit_btn.addEventListener('click', showEditModal);
    
        //append elements to card
        cards_container.appendChild(card_DOM); //card as container's child.

        card_DOM.appendChild(bookInfo_DOM); //contentWrapper as card's child.
        //append all contents to contentWrapper.
        bookInfo_DOM.appendChild(title_DOM);
        bookInfo_DOM.appendChild(author_DOM);
        bookInfo_DOM.appendChild(pages_DOM);

        //Create rating stars then append to card.
        const starWrapper = document.createElement('div');
        starWrapper.classList.add('card-star-wrapper');
        bookInfo_DOM.appendChild(starWrapper);
        for(let i = 1; i <= book.rating; i++ ) {
            const star = document.createElement('div');
            star.classList.add('card-star');
            starWrapper.appendChild(star);            
        }
        card_DOM.appendChild(progress_DOM);
        card_DOM.appendChild(delete_btn);
        card_DOM.appendChild(edit_btn);
    } );
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

function showEditModal() {
    let idf = this.getAttribute('data-identifier');
    let pos = Library.getPosFromIdentifier(idf);
    console.log(`Editing ${Library.myLibrary[pos].title}.`);
    btn_edit_submit.setAttribute('data-identifier', idf); //Indicate identifier for submit button.

    let title = Library.myLibrary[pos].title;
    let author = Library.myLibrary[pos].author;
    let pages = Library.myLibrary[pos].pages;
    let progress = Library.myLibrary[pos].progress;
    let rating = Library.myLibrary[pos].rating;

    edit_title.value = title;
    edit_author.value = author;
    edit_pages.value = pages;
    edit_progress.value = progress;

    const checkedStar = document.querySelector(`.edit-star[value= "${rating}" ]`);
    checkedStar.checked = true;

    edit_modal.showModal();    
}

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

function clearCardContainer() {
    while(cards_container.firstElementChild) {
        cards_container.removeChild(cards_container.lastElementChild);
    }
}

input_pages.addEventListener('change', validatePagesNumber);

function deleteHandler() {
    let identifier = this.getAttribute('data-identifier');
    Library.deleteBook(identifier);
}

function progressHandler() {
    let identifier = this.getAttribute('data-identifier');
    Library.setProgress(identifier, this.value);
}

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

function updateArraysFromSettings() {
    //Create filtered array from Library.myLibrary, based on selected filter setting.
    filtered = Library.filterBooks(filter_dropdown.value);
    //Create sorted array from filtered, based on selected sort setting.
    sorted = Library.sortBooks(filtered, sort_dropdown.value);
}

function resetSettings() {
    filter_dropdown.value = "all";
    sort_dropdown.value = "timeAdded";
}

function refreshCards() {
    clearCardContainer();
    createCardsFromLibrary(sorted);
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

filtered = Library.filterBooks(filter_dropdown.value);
sorted = Library.sortBooks(filtered, sort_dropdown.value);
createCardsFromLibrary(sorted);