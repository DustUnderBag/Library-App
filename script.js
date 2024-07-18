const newBook_btn = document.getElementById('add-book');
const modal = document.querySelector('dialog.book-form');

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

let book1 = new Book("Pride and Prejudice", "Jane Austen", 363, true);
let book2 = new Book("The Little Prince", "Antoine de Saint-Exupéry", 102, false);

addBookToLibrary(book1);
addBookToLibrary(book2);

function updateLibraryCards() {
    for(let i = 0; i < myLibrary.length; i++) {
        let id = 'book' + (i + 1);
        console.log(id);
        const title = document.querySelector(`#${id} .title`);
        const author = document.querySelector(`#${id} .author`);
        const pages = document.querySelector(`#${id} .pages`);
        console.log(title, author, pages);

        title.textContent += myLibrary[i].title;
        author.textContent += myLibrary[i].author;
        pages.textContent += myLibrary[i].pages + " total pages";
    }
}

newBook_btn.addEventListener('click', () => {
    modal.showModal();
});

updateLibraryCards();

