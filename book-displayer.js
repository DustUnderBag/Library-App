import { Library } from "./Library.js";

//Cards
const cards_container = document.querySelector('.cards-container');

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

export function refreshCards() {
    clearCardContainer();
    createCardsFromLibrary(Library.sorted);
}

function createCardsFromLibrary(library) {
    library.forEach(makeCardFromBook);
}

function makeCardFromBook(book) {
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
}

function clearCardContainer() {
    while(cards_container.firstElementChild) {
        cards_container.removeChild(cards_container.lastElementChild);
    }
}

function progressHandler() {
    let identifier = this.getAttribute('data-identifier');
    Library.setProgress(identifier, this.value);
}

function deleteHandler() {
    let identifier = this.getAttribute('data-identifier');
    Library.deleteBook(identifier);
}

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