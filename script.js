//Modal input elements
const btn_newBook = document.querySelector("button#add-book");
const modal = document.querySelector('dialog.book-modal');

const input_title = document.querySelector("input#title");
const input_author = document.querySelector("input#author");
const input_pages = document.querySelector("input#pages");
const text_inputs = [input_title, input_author, input_pages];

const input_isRead = document.querySelector("input#isRead");
const btn_submit = document.querySelector("button[type='submit']");

//Cards
const cards_container = document.querySelector(".cards-container");

const myLibrary = [];

function Book(title, author, pages, isRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
}

Book.prototype.getInfo = function() {
    let readState = this.isRead ? "is read" 
                                : "hasn't been read yet";
    return `${this.title} by ${this.author} has ${this.pages} pages. It ${readState}.`;
}

function addBookToLibrary(obj) {
    myLibrary.push(obj);
}

function displayLibrary() {
    for(let i = 0; i < myLibrary.length; i++) {
        let id = 'book' + (i + 1);
        console.log(id);
        const title = document.querySelector(`#${id} .title`);
        const author = document.querySelector(`#${id} .author`);
        const pages = document.querySelector(`#${id} .pages`);
        console.log(title, author, pages);

        title.textContent = myLibrary[i].title;
        author.textContent = myLibrary[i].author;
        pages.textContent = myLibrary[i].pages + " total pages";
    }
}

/*
let book1 = new Book("Pride and Prejudice", "Jane Austen", 363, true);
let book2 = new Book("The Little Prince", "Antoine de Saint-Exupéry", 102, false);
*/

btn_newBook.addEventListener('click', () => {
    modal.showModal();
});


function createNewBook() {
    let title = input_title.value;
    let author = input_author.value;
    let pages = input_pages.value;
    let isRead = (input_isRead.checked) ? true : false;
    
    let temp_obj = new Book(title, author, pages, isRead);
    console.log(temp_obj);
    return temp_obj;
}

function clearFormInputs() {
    for(input of text_inputs) {
        input.value = "";
    }
    input_isRead.checked = false;
}

function createCard(book, index) {
    const card_DOM = document.createElement('div');
    card_DOM.classList.add('card');
    card_DOM.setAttribute('data-index', index);

    const title_DOM = document.createElement('h2');
    title_DOM.textContent = book.title;

    const author_DOM = document.createElement('p');
    author_DOM.textContent = book.author;

    const pages_DOM = document.createElement('p');
    pages_DOM.textContent = book.pages;

    const read_DOM = document.createElement('input');
    read_DOM.setAttribute('type', 'checkbox');
    read_DOM.setAttribute('data-index', index);
    read_DOM.checked = (book.isRead) ? true : false;

    const delete_Btn = document.createElement('button');
    delete_Btn.textContent = "X";
    delete_Btn.classList.add('delete_btn');
    delete_Btn.setAttribute('data-index', index);

    cards_container.appendChild(card_DOM);
    card_DOM.appendChild(title_DOM);
    card_DOM.appendChild(author_DOM);
    card_DOM.appendChild(pages_DOM);
    card_DOM.appendChild(read_DOM);
    card_DOM.appendChild(delete_Btn);
}

btn_submit.addEventListener('click', e => {
    addBookToLibrary(createNewBook());
    let index = myLibrary.length - 1;
    createCard(myLibrary[index], index);


    clearFormInputs();
    modal.close();
    e.preventDefault();
})