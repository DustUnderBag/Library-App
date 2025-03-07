import { Library } from "./Library.js";


export function updateArraysFromSettings() {
    //Update filtered book array from Library, based on selected filter setting.
    Library.filtered = filterBooks( document.getElementById('filter-progress').value );

    //Update sorted book array from filtered, based on selected sort setting.
    Library.sorted = sortBooks( Library.filtered, document.getElementById('sort').value );
}

function filterBooks(progress) { //Non-mutating
    if(progress == "all") { //return original array if all progress.
        return Library.myLibrary;
    }else { 
        return Library.myLibrary.filter( book => (book.progress == progress));
    }
}

function sortBooks(array, property) {
    /* Parameters
       - Sort array(books) by comparing every title/author/timeAdded.
       - property: refers to object property on which the comparison performs.
     */

    //Clone input array to make the sort() non-mutating.
    let array_clone = [...array]; 
    
    //Compare string property
    if(property == "title" || property == "author") { 
        return array_clone.sort( (a, b) => 
            a[property].localeCompare( b[property]) );
    }
    
    //Compare numeric property
    return array_clone.sort( (a, b) => b[property] - a[property] );
}