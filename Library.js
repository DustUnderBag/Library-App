export class Library {
    static myLibrary = [];

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

    static filterBooks(progress) { //Non-mutating
        if(progress == "all") { //return original array if all progress.
            return Library.myLibrary;
        }else { 
            return Library.myLibrary.filter( book => (book.progress == progress));
        }
    }

    static sortBooks(array, property) {
        /* Parameters
           - Sort array(books) by comparing every title/author/timeAdded.
           - property: refers to object property on which the comparison performs.
         */
        let array_clone = [...array]; //Clone input array to make the sort() non-mutating.
        
        //Compare string property
        if(property == "title" || property == "author") { 
            return array_clone.sort( (a, b) => 
                a[property].localeCompare( b[property]) );
        }
        
        //Compare numeric property
        return array_clone.sort( (a, b) => b[property] - a[property] );
    }
    
}