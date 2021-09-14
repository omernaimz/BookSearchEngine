document.querySelector('#search-form').addEventListener('submit', function(event) {

    // Will do my own Submit logic - so block default behavior
    event.preventDefault();
    //Clean the Book list - avoid concating diffrent results. 
    document.querySelector('.card-container').innerHTML = '';
    var loader = document.querySelector('.loader');
    loader.style.display = "block";
    var searchValue = document.querySelector('.search-input').value;

    fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchValue}`).then(function(res) {
        return res.json();
    }).then(function(data) {
        loader.style.display = "none";
        var books = data.items;

        //setting the books array length to be max 10 books as requested
        if (books.length > 10) {
            books.length = 10;
        }

        //Extra feature - Hide books who don't have author (using that field on the front view)
        books = books.filter(function(book) {
            return book.volumeInfo.authors;
        });

        createBooks(books);
    });
});

//Create HTML elements for each book
function createBooks(books) {
    books.forEach(createBookElement);
}

function createBookElement(book) {
    var defaultImage = 'https://listimg.pinclipart.com/picdir/s/89-897310_image-transparent-books-svg-outline-books-icon-png.png';
    var bookInfo = book.volumeInfo;
    var publishedDate = new Date(bookInfo.publishedDate);
    //Creating the HTML card element, that validates keys existance in the Book object.
    var bookHtmlTemplate = `
    <tr class="inner-box">
                                            <th scope="row">
                                                <div class="event-date">
                                                    <span>${publishedDate.getFullYear()}</span>
                                                </div>
                                            </th>
                                            <td>
                                                <div class="event-img">
                                                    <img src="${bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : defaultImage}"
                                                        alt="${bookInfo.imageLinks ? bookInfo.imageLinks.smallThumbnail : defaultImage}"/>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="event-wrap">
                                                    <h3>${bookInfo.title}</h3>
                                                    <div class="meta">
                                                        <div class="organizers">
                                                            ${bookInfo.authors ? bookInfo.authors[0] : 'no author'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="r-no">
                                                    <span>${bookInfo.description}</span>
                                                </div>
                                            </td>
                                        </tr>
    `;

    var booksBodyElement = document.querySelector('.card-container');

    booksBodyElement.innerHTML += bookHtmlTemplate;
}