export class Book {
    constructor(title, author, pages, progress, rating){
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.progress = progress;
        this.rating = rating;

        this.timeAdded = Math.floor( Date.now() / 1000 );
        this.identifier = Math.floor( Math.random() * 100000 ); // Generate random unique Idex.
    }

    getInfo() {
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

    edit(newTitle, newAuthor, newPages, newProgress, newRating) {
        this.title = newTitle;
        this.author = newAuthor;
        this.pages = newPages;
        this.progress = newProgress;
        this.rating = newRating;
    }
}

export function createNewBook() {
    let title = document.querySelector("input#title").value;
    let author =  document.querySelector("input#author").value;
    let pages = document.querySelector("input#pages").value;
    let progress = document.querySelector("select#progress").value;
    let rating = getRating();

    return new Book(title, author, pages, progress, rating);
}

function getRating() {
    const checkedStar = document.querySelector('.star:checked');
    if(!checkedStar) return 0; //In case no star is checked / does not exist.

    let rating = +checkedStar.value;
    return rating;
}