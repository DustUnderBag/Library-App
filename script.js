//Modal input elements
const btn_newBook = document.querySelector("button#add-book");
const modal = document.querySelector('dialog.book-modal');

const input_title = document.querySelector("input#title");
const input_author = document.querySelector("input#author");
const input_pages = document.querySelector("input#pages");
//Store inputs for validation in an array
const inputs_Validate = [input_title, input_author, input_pages];

const input_progress = document.querySelector("select#progress");

const btn_submit = document.querySelector("button.submit");

//Cards
const cards_container = document.querySelector('.cards-container');


const myLibrary = [];

function Book(title, author, pages, progress) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.progress = progress;
}

Book.prototype.getInfo = function() {
    let progress_str;
    if(this.progress == "unread") {
        progress_str = "hasn't started";
    }else if(this.progress == "reading") {
        progress_str = "is in progress";
    }else {
        progress_str = "is finished";
    }
    return `${this.title} by ${this.author} has ${this.pages} pages. Reading ${progress_str}.`;
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
    let progress = input_progress.value;
    
    let temp_obj = new Book(title, author, pages, progress);
    return temp_obj;
}

function clearFormInputs() {
    for(input of inputs_Validate) {
        input.value = "";

        input.classList.remove('invalid');
        input.classList.remove('valid');
    }
    input_progress.value = "unread";
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
    
        //To create dropdown menu for reading progress in cards
        const progress_DOM = document.createElement("select");
        progress_DOM.setAttribute("data-index", index);
        progress_DOM.setAttribute("id", index);

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
    
        //Delete button
        const delete_Btn = document.createElement('button');
        delete_Btn.textContent = "X";
        delete_Btn.classList.add('delete_btn');
        delete_Btn.setAttribute('data-index', index);
        delete_Btn.addEventListener('click', deleteBook);
    
        //append elements to card
        cards_container.appendChild(card_DOM);
        card_DOM.appendChild(title_DOM);
        card_DOM.appendChild(author_DOM);
        card_DOM.appendChild(pages_DOM);
        card_DOM.appendChild(progress_DOM);
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
let book1 = new Book("Pride and Prejudice", "Jane Austen", 363, "read");
let book2 = new Book("The Little Prince", "Antoine de Saint-Exupéry", 102, "reading");
let book3 = new Book("To Kill a Mockingbird", "Harper Lee", 281, "unread");
let book4 = new Book("The Handmaid's Tale", "Margaret Atwood", 370, "reading");
book1.addBookToLibrary();
book2.addBookToLibrary();
book3.addBookToLibrary();
book4.addBookToLibrary();
createCardsFromLibrary(myLibrary);