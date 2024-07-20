//Modal input elements
const btn_newBook = document.querySelector("button#add-book");
const modal = document.querySelector('dialog.book-modal');

const input_title = document.querySelector("input#title");
const input_author = document.querySelector("input#author");
const input_pages = document.querySelector("input#pages");
//Store inputs for validation in an array
const inputs_Validate = [input_title, input_author, input_pages];

const input_isRead = document.querySelector("input#isRead");
const btn_submit = document.querySelector("button.submit");

//Cards
const cards_container = document.querySelector('.cards-container');


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

Book.prototype.addBookToLibrary = function() {
    myLibrary.push(this);
    console.log("Book: " + this.title);
}

btn_newBook.addEventListener('click', () => {
    modal.showModal();
});

function createNewBook() {
    let title = input_title.value;
    let author = input_author.value;
    let pages = input_pages.value;
    let isRead = (input_isRead.checked) ? true : false;
    
    let temp_obj = new Book(title, author, pages, isRead);
    return temp_obj;
}

function clearFormInputs() {
    for(input of inputs_Validate) {
        input.value = "";

        input.classList.remove('invalid');
        input.classList.remove('valid');
    }
    input_isRead.checked = false;
}

function createCardsFromLibrary(array) {
    array.forEach( (book, index) => {
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
        delete_Btn.addEventListener('click', deleteBook);
    
        cards_container.appendChild(card_DOM);
        card_DOM.appendChild(title_DOM);
        card_DOM.appendChild(author_DOM);
        card_DOM.appendChild(pages_DOM);
        card_DOM.appendChild(read_DOM);
        card_DOM.appendChild(delete_Btn);
    } );
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

    clearCardContainer(); //Remove all cards

    createNewBook().addBookToLibrary(); //Create book obj then store in the library[]

    createCardsFromLibrary(myLibrary); //Create cards from scratch.
    
    clearFormInputs();
    modal.close();
    
    e.preventDefault(); //prevent submitting the form to server.
})


function deleteBook() {
    clearCardContainer(); //Remove all cards
    
    let index = this.getAttribute('data-index'); //Locate book index inside myLibrary[]
    deleteBookFromLibrary(index);
    
    createCardsFromLibrary(myLibrary); ////Create cards from scratch.
}

function deleteBookFromLibrary(index) {
    console.log(`Deleted \"${myLibrary[index].title}\", its index: ${index}`);
    myLibrary.splice(index, 1);
}

function clearCardContainer() {
    while(cards_container.firstElementChild) {
        cards_container.removeChild(cards_container.lastElementChild);
    }
}

input_pages.addEventListener('change', validatePagesNumber);

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
    for(input of inputs_Validate) {
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

// Default Books
let book1 = new Book("Pride and Prejudice", "Jane Austen", 363, true);
let book2 = new Book("The Little Prince", "Antoine de Saint-Exupéry", 102, false);
let book3 = new Book("To Kill a Mockingbird", "Harper Lee", 281, true);
let book4 = new Book("The Handmaid's Tale", "Margaret Atwood", 370, false);
book1.addBookToLibrary();
book2.addBookToLibrary();
book3.addBookToLibrary();
book4.addBookToLibrary();
createCardsFromLibrary(myLibrary);