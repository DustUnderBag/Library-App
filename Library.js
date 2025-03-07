export class Library {
    static myLibrary = [];

    static filtered = [];

    static sorted = [];

    static addBookToLibrary(book) {
        Library.myLibrary.push(book);
        console.log("Book: " + book.title);
    }

    static getPosFromIdentifier(identifier) {
        return Library.myLibrary.findIndex( book => book.identifier == identifier);
    }

    static deleteBook(identifier) {
        console.log('data-identifier: ' + identifier);
    
        let pos = this.getPosFromIdentifier(identifier);
        console.log(`position: ${pos}, title: ${Library.myLibrary[pos].title}.` );
    
        if(pos >= 0) { //Execute only if valid position is returned.
            Library.myLibrary.splice(pos, 1);
    
            updateArraysFromSettings();
            refreshCards();
        }
    }

    static setProgress(identifier, progress) {
        console.log('data-identifier: ' + identifier);
    
        let pos = this.getPosFromIdentifier(identifier);
    
        if(pos >= 0) { //Execute only if valid position is returned.
            Library.myLibrary[pos].progress = progress;
            console.log(`${Library.myLibrary[pos].title}'s(identifier:${identifier}) 
                progress has been set to ${Library.myLibrary[pos].progress}.`
            );
        }
    
        updateArraysFromSettings();
        refreshCards();
    }


    
}