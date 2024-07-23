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

//Filter & sort dropdown menus
const sort_dropdown = document.getElementById('sort');
const filter_dropdown = document.getElementById('filter-progress');
const reset_btn = document.querySelector('button.reset-settings');

const myLibrary = [];
let filtered = [];
let sorted = [];

function Book(title, author, pages, progress) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.progress = progress;
    this.timeAdded = Math.floor( Date.now() / 1000 );
    this.identifier = Math.floor( Math.random() * 100000 ); // Generate random unique Idex.
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
    array.forEach( book => {
        let identifier = book.identifier;
        const card_DOM = document.createElement('div');
        card_DOM.classList.add('card');
        card_DOM.setAttribute('data-identifier', identifier);
    
        const title_DOM = document.createElement('h2');
        title_DOM.textContent = book.title + `id: ${identifier}`;
    
        const author_DOM = document.createElement('p');
        author_DOM.textContent = book.author;
    
        const pages_DOM = document.createElement('p');
        pages_DOM.textContent = book.pages;
    
        //To create dropdown menu for reading progress in cards
        const progress_DOM = document.createElement("select");
        progress_DOM.setAttribute("data-identifier", identifier);

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
        progress_DOM.addEventListener('change', setProgress);
    
        //Delete button
        const delete_Btn = document.createElement('button');
        delete_Btn.textContent = "X";
        delete_Btn.classList.add('delete_btn');
        delete_Btn.setAttribute('data-identifier', identifier);
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

    createNewBook().addBookToLibrary(); //Create book obj then store in the library[]

    filtered = filter_books(myLibrary, filter_dropdown.value); 
    sorted = sort_books(filtered, sort_dropdown.value);

    clearCardContainer(); //Remove all cards
    createCardsFromLibrary(sorted);
    
    clearFormInputs();
    modal.close();
    
    e.preventDefault(); //prevent submitting the form to server.
})


function deleteBook() {
    clearCardContainer(); //Remove all cards

    let idf = this.getAttribute('data-identifier'); //Locate book identifier inside myLibrary[]  
    console.log('data-identifier: ' + idf);

    let position = getPosFromIdentifier(idf);
    console.log(`position: ${position}, title: ${myLibrary[position].title}.` );

    if(position >= 0) { //Execute only if valid position is returned.
        myLibrary.splice(position, 1);

        filtered = filter_books(myLibrary, filter_dropdown.value); 
        sorted = sort_books(filtered, sort_dropdown.value);
    
        createCardsFromLibrary(sorted);
    }

}

function getPosFromIdentifier(identifier) {
    return myLibrary.findIndex( book => book.identifier == identifier);
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

function setProgress() {
    let identifier = this.getAttribute('data-identifier');
    let position = getPosFromIdentifier(identifier);

    if(position >= 0) { //Execute only if valid position is returned.
        myLibrary[position].progress = this.value;
        console.log(`${myLibrary[position].title}'s(identifier:${identifier}) 
            progress has been set to ${myLibrary[position].progress}.`
        );
    }
    
}

//Filter & Sorting settings
filter_dropdown.addEventListener('change', e => {
    filtered = filter_books(myLibrary, filter_dropdown.value);
    clearCardContainer();
    createCardsFromLibrary(filtered);
});

sort_dropdown.addEventListener('change', e => {
    sorted = sort_books(filtered, sort_dropdown.value);
    clearCardContainer();
    createCardsFromLibrary(sorted);
});

reset_btn.addEventListener('click', e => {
    reset_settings(); //reset dropdowns' values...

    //...then run filter and sort.
    filtered = filter_books(myLibrary, filter_dropdown.value); 
    sorted = sort_books(filtered, sort_dropdown.value);

    clearCardContainer();
    createCardsFromLibrary(sorted);
});

function filter_books(array, progress) { //Non-mutating
    if(progress == "all") { //return original array if all progress.
        return myLibrary;
    }else { 
        return array.filter( book => (book.progress == progress)) 
    };

}

function sort_books(array, property) {
    /* Parameters
       - Sort array(books) by comparing every title/author/timeAdded.
       - property: refers to object property on which the comparison performs.
     */
    let array_clone = [...array]; //Clone input array to make the sort() non-mutating.
    if(property == "title" || property == "author") {
        return array_clone.sort( (a, b) => 
            a[property].localeCompare( b[property]) );
    } else {
        return array_clone.sort( (a, b) => b[property] - a[property] );
    }
}

function reset_settings() {
    filter_dropdown.value = "all";
    sort_dropdown.value = "timeAdded";
}

// Default Books
let book1 = new Book("Pride and Prejudice", "Jane Austen", 363, "read");
let book2 = new Book("Ulysses", "James Joyce", 560, "reading");
let book3 = new Book("Nineteen Eighty Four", " George Orwell", 449, "unread");
let book4 = new Book("The Handmaid's Tale", "Margaret Atwood", 370, "reading");
let book5 = new Book("In Search of Lost Time", "Marcel Proust", 4215, "read");

//Set made-up time stamp of books being added.
book1.timeAdded = 5;
book2.timeAdded = 4;
book3.timeAdded = 3;
book4.timeAdded = 2;
book5.timeAdded = 1;

//Added default books to myLibrary.
book1.addBookToLibrary();
book2.addBookToLibrary();
book3.addBookToLibrary();
book4.addBookToLibrary();
book5.addBookToLibrary();

filtered = filter_books(myLibrary, filter_dropdown.value);
sorted = sort_books(filtered, sort_dropdown.value);
createCardsFromLibrary(sorted);