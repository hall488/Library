let books = document.querySelector('.books');

let bookMenu = document.querySelector('.book-menu');

let newBtn = document.querySelector('.new-book');

let rmvBtn = document.querySelector('.remove-book');

let cnlBtn = document.querySelector('.cancel');

let addBtn = document.querySelector('.add-book');

let sortBtn = document.querySelector('.sort-books');

let colors = ['--book-color-1','--book-color-2','--book-color-3','--book-color-4'];

let statuses = ['Unopened', 'Opened', 'Read'];

let formatBook = b => {
    let color = library[b.getAttribute('index')].color;
    b.style.background = `var(${color})`;
    console.log(b.children[3]);
    b.children[3].style.background = `var(${color})`;
    b.style.boxShadow = 
            `2px -2px 0 0 whitesmoke,
            0px -2px 0 0 var(${color}),
            4px -4px 0 0 wheat,
            2px -4px 0 0 var(${color}),
            6px -6px 0 0 whitesmoke,
            4px -6px 0 0 var(${color}),
            8px -8px 0 0 wheat,
            6px -8px 0 0 var(${color}),
            8px -10px 0 0 var(${color}),
            10px -10px 0 0 var(${color})`;
};

let library = [];

class Book {
    constructor(title, author, pages, status) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        if(statuses.includes(status)) {
            this.status = status;
        } else {
            console.log('Expected a status');
        }
        this.color = colors[Math.floor(Math.random()*4)];
        console.log(this.color);
        this.addBookToLibrary();
    }

    addBookToLibrary = () => library.push(this);
}

library.push = function() {
    Array.prototype.push.apply(this, arguments);
    addBookToDisplay(arguments[0], library.length - 1);
}

function addBookToDisplay(book, index) {
    let newBook = document.createElement('li');
    newBook.setAttribute('index', index);
    newBook.classList += 'book';
    let classes = ['title', 'author', 'pages', 'status'];
    classes.forEach(c => {
        let div = document.createElement('div');
        div.classList += c;
        c == 'pages' ? div.textContent = `Pgs: ${book[c]}`: div.textContent = book[c];
        
        newBook.appendChild(div);
    });

    let tContainer = document.createElement('div');
    tContainer.classList += 'tContainer';
    let trash = document.createElement('i');
    trash.classList.add('fa-solid','fa-trash');
    trash.style.display = 'none';
    tContainer.appendChild(trash);
    newBook.appendChild(tContainer);
    
    trash.addEventListener('click', t => {
        library.splice(index);
        Array.from(books.children).forEach(b => {
            let idx = b.getAttribute('index');
            if(idx > index) b.setAttribute('index', idx - 1);
        })
        newBook.remove();
        lookMode();
    });

    formatBook(newBook);
    newBook.children[3].addEventListener('click', s => {
        s.target.textContent = changeStatus(s.target.textContent);
    });
    books.appendChild(newBook);
}

function changeStatus(status) {
    switch(status) {
        case 'Unopened': return 'Opened';
        case 'Opened': return 'Read';
        case 'Read': return 'Unopened';
        default: return 'Unexpected Status';
    }

}

let b1 = new Book('The Poop that Took a Pee', 'Butters', 120, 'Read');
let b2 = new Book('Mr.Stinky Pants', 'Chaucer', 100, 'Opened');
let b3 = new Book('Tony Pizza', 'Tony Pizza', 234, 'Read');


newBtn.addEventListener('click', () => {
    bookMenu.style.display = 'flex';
});

cnlBtn.addEventListener('click', () => {
    bookMenu.style.display ='none';
});

addBtn.addEventListener('click' , () => {
    let data = new FormData(bookMenu);
    let val = data.entries();
    let args = [];
    for(let pair of val) {
        args.push(pair[1]);
    }

    bookMenu.reportValidity();
    
    if(bookMenu.checkValidity()) {
        let newB = new Book(...args);
        bookMenu.reset();
        bookMenu.style.display ='none';
    }
    
});

bookMenu.addEventListener('submit', e => {
    e.preventDefault();
});

rmvBtn.addEventListener('click', () => {

    if(rmvBtn.textContent == 'Remove Book'){
        removeMode();
    } else {
        lookMode();
    }
        
});

function removeMode() {
    Array.from(books.children).forEach(c => {
        c.children[4].children[0].style.display = 'flex';
    });
    rmvBtn.textContent = 'Cancel';
    rmvBtn.style.background = 'crimson';
    rmvBtn.style.color = 'whitesmoke';
}

function lookMode() {
    Array.from(books.children).forEach(c => {
        c.children[4].children[0].style.display = 'none';
    });
    rmvBtn.textContent = 'Remove Book';
    rmvBtn.style.background = 'whitesmoke';
    rmvBtn.style.color = 'rgb(46, 46, 46)';
}

sortBtn.addEventListener('click', () => {
    library = library.sort( (a,b) => a.pages > b.pages ? 1 : -1);
    Array.from(books.children).forEach(c => c.remove());
    library.forEach( l => addBookToDisplay(l, library.indexOf(l)));
});