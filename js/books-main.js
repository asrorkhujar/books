// GLOBAL VARS
const genres = [];
// const genres = [];
const bookList = JSON.parse(localStorage.getItem('booklist')) || [];

// PAGINATION
let TOTAL_RESULTS = 10;
let PER_PAGE_COUNT = 9;
let PAGE_LINKS_TO_SHOW = 5; // only odd numbers
let NEIGHBOUR_PAGES_COUNT = Math.floor(PAGE_LINKS_TO_SHOW / 2);
let CURRENT_PAGE = 1;
let PAGES_COUNT = Math.ceil(TOTAL_RESULTS / PER_PAGE_COUNT);

let foundBooks = books;

// SEARCH FORM
const elBookSearchForm = document.querySelector('.js-book-search-form');
const elBookSearchInput = elBookSearchForm.querySelector('.js-book-search-input');
const elGenresSelect = elBookSearchForm.querySelector('select');
const elMinYearInput = elBookSearchForm.querySelector('.js-start-year-input');
const elMaxYearInput = elBookSearchForm.querySelector('.js-end-year-input');
const elSortSelect = elBookSearchForm.querySelector('.js-sort-select');



// RESULT
const elBooksList = document.querySelector('.books__list');

const elPagination = document.querySelector('.js-pagination');
const elPaginationStartLink = elPagination.querySelector('.js-pagination-start');
const elPaginationPrevLink = elPagination.querySelector('.js-pagination-prev');
const elPaginationNextLink = elPagination.querySelector('.js-pagination-next');
const elPaginationEndLink = elPagination.querySelector('.js-pagination-end');
const elPaginationList = elPagination.querySelector('.js-pagination-list');

// TEMPLATE
const elBooksItemTemplate = document.querySelector('#books-item-template').content;
const elPaginationItemTemplate = document.querySelector('#pagination-item-template').content;

/* // MODAL
const elBookInfoModal = document.querySelector('.book-info-modal');
const elBookInfoModalTitle = elBookInfoModal.querySelector('.book-info-modal__title');
const elBookInfoModalRating = elBookInfoModal.querySelector('.book-info-modal__rating');
const elBookInfoModalYear = elBookInfoModal.querySelector('.book-info-modal__year');
const elBookInfoModalDuration = elBookInfoModal.querySelector('.book-info-modal__duration');
const elBookInfoModalIFrame = elBookInfoModal.querySelector('.book-info-modal__iframe');
const elBookInfoModalCategories = elBookInfoModal.querySelector('.book-info-modal__categories');
const elBookInfoModalSummary = elBookInfoModal.querySelector('.book-info-modal__summary');
const elBookInfoModalImdbLink = elBookInfoModal.querySelector('.book-info-modal__imdb-link');
const elBookInfoModalBookmarkButton = elBookInfoModal.querySelector('.js-bookmark-button'); */

//BOOKLIST-MODAL-LIST

const elBookListModal = document.querySelector('.booklist-modal');
const elBookListALL = elBookListModal.querySelector('.booklist-modal__list');
const bookListFragment = document.createDocumentFragment();

function showBooklist() {
  elBookListALL.innerHTML = '';

  for (let bookItem of bookList) {
    let newBookmark = `<li class="bookmark booklist-modal__item list-group-item d-flex align-items-center justify-content-between" data-unique-id="${bookItem.imdbId}">
    <h3 class="bookmark__title h5">${bookItem.title} (${bookItem.year})</h3>
    <button class="bookmark__remove btn btn-danger btn-sm text-white" type="button" title="Remove from booklist">&#10006;</button>
    </li>`;
    elBookListALL.insertAdjacentHTML('beforeend', newBookmark)
  }
}

elBookListModal.addEventListener('show.bs.modal', showBooklist);

elBookListModal.addEventListener('click', (evt) => {
  if (evt.target.matches('.bookmark__remove')) {
    const bookmarkIndex = bookList.findIndex(bookmark => bookmark.imdbId === evt.target.dataset.uniqueId);
    const removedBookmark = bookList.splice(bookmarkIndex, 1)[0];

    const elBookmark = elBooksList.querySelector(`.js-bookmark-button[data-imdb-id="${removedBookmark.imdbId}"]`);
    elBookmark.classList.remove('btn-secondary');
    elBookmark.classList.add('btn-outline-secondary');
    elBookmark.textContent = 'Bookmark';

    localStorage.setItem('booklist', JSON.stringify(bookList));
    showBooklist();
  }
})

// FUNCTIONS
/* function getUniqueGenres() {
  books.forEach(book => {
    book.categories.forEach(category => {
      if (!genres.includes(category)) {
        genres.push(category);
      }
    });
  });
  genres.sort();
} */

function showGenreOptions() {
  const elGenresFragment = document.createDocumentFragment();
  genres.forEach(genre => {
    const elGenreOption = document.createElement('option');
    elGenreOption.textContent = genre;
    elGenreOption.value = genre;
    elGenresFragment.appendChild(elGenreOption);
  });
  elGenresSelect.appendChild(elGenresFragment);
}

function showBooks(books, titleRegex = '') {
  elBooksList.innerHTML = '';
  const elBooksFragment = document.createDocumentFragment();

  for (let book of books) {
    const elNewBookItem = elBooksItemTemplate.cloneNode(true);
    elNewBookItem.querySelector('.book__img').src = book.imageLink;
    elNewBookItem.querySelector('.book__img').alt = `${book.title} poster`;

    if (titleRegex.source !== '(?:)' && titleRegex) {
      elNewBookItem.querySelector('.book__title').innerHTML = book.title.replace(titleRegex, `<mark class="p-0" style="background-color: yellow;">${titleRegex.source}</mark>`);
    } else {
      elNewBookItem.querySelector('.book__title').textContent = book.title;
    }

    elNewBookItem.querySelector('.book__language').textContent = book.language;
    elNewBookItem.querySelector('.book__year').textContent = book.year;
    elNewBookItem.querySelector('.book__pages').textContent = book.pages;
    elNewBookItem.querySelector('.book__author').textContent = book.author;
    elNewBookItem.querySelector('.book-info-modal__wikipedia-link').href = book.link;
    const elBookmarkBtn = elNewBookItem.querySelector('.js-bookmark-button');
    elBookmarkBtn.dataset.title = book.title;
    const indexBookInBookList = bookList.findIndex(book => book.title === elBookmarkBtn.dataset.title);

    if (indexBookInBookList > -1) {
      elBookmarkBtn.classList.add('btn-secondary');
      elBookmarkBtn.classList.remove('btn-outline-secondary');
      elBookmarkBtn.textContent = 'Bookmarked ✔';
    } else {
      elBookmarkBtn.classList.remove('btn-secondary');
      elBookmarkBtn.classList.add('btn-outline-secondary');
      elBookmarkBtn.textContent = 'Bookmark';
    }

    elBooksFragment.appendChild(elNewBookItem);
  }

  elBooksList.appendChild(elBooksFragment);
}

/* function updateBookInfoModal(imdbId) {
  const book = books.find(book => book.imdbId === imdbId);

  elMovieInfoModal.dataset.uniqueId = imdbId;
  elMovieInfoModalTitle.textContent = movie.title;
  elMovieInfoModalRating.textContent = movie.imdbRating;
  elMovieInfoModalYear.textContent = movie.year;
  elMovieInfoModalDuration.textContent = getHoursStringFromMinutes(movie.runtime);
  elMovieInfoModalIFrame.src = `https://www.youtube-nocookie.com/embed/${movie.youtubeId}`;
  elMovieInfoModalCategories.textContent = movie.categories.join(', ');
  elMovieInfoModalSummary.textContent = movie.summary;
  elMovieInfoModalImdbLink.href = `https://www.imdb.com/title/${movie.imdbId}`;
  elMovieInfoModalBookmarkButton.dataset.imdbId = movie.imdbId;

  const indexMovieInWatchList = watchList.findIndex(movie => movie.imdbId === imdbId);

  if (indexMovieInWatchList > -1) {
    elMovieInfoModalBookmarkButton.classList.add('btn-success');
    elMovieInfoModalBookmarkButton.classList.remove('btn-outline-success');
    elMovieInfoModalBookmarkButton.textContent = 'Bookmarked ✅';
  } else {
    elMovieInfoModalBookmarkButton.classList.remove('btn-success');
    elMovieInfoModalBookmarkButton.classList.add('btn-outline-success');
    elMovieInfoModalBookmarkButton.textContent = 'Bookmark';
  }
} */

function findBooks(titleRegex) {
  return books.filter(book => {
    const meetsCriteria = book.title.match(titleRegex) && (elGenresSelect.value === 'All' || book.categories.includes(elGenresSelect.value)) && (elMinYearInput.value.trim() === '' || book.year >= Number(elMinYearInput.value)) && (elMaxYearInput.value.trim() === '' || book.year <= Number(elMaxYearInput.value));
    return meetsCriteria;
  });
}

function sortBooks(books, sortType) {
  if (sortType === 'az') {
    books.sort((a, b) => {
      if (a.title > b.title) return 1;
      if (a.title < b.title) return -1;
      return 0;
    });
  } else if (sortType === 'za') {
    books.sort((a, b) => {
      if (a.title < b.title) return 1;
      if (a.title > b.title) return -1;
      return 0;
    });
  } else if (sortType === 'pages_asc') {
    books.sort((a, b) => a.pages - b.pages);
  } else if (sortType === 'pages_desc') {
    books.sort((a, b) => b.pages - a.pages);
  } else if (sortType === 'year_asc') {
    books.sort((a, b) => a.year - b.year);
  } else if (sortType === 'year_desc') {
    books.sort((a, b) => b.year - a.year);
  }
}

// FUNCTION-PAGINATION
function showPagination() {
  let startIndex = (CURRENT_PAGE - 1) * PER_PAGE_COUNT;
  let endIndex = startIndex + PER_PAGE_COUNT;
  showBooks(foundBooks.slice(startIndex, endIndex));

  let startPage = CURRENT_PAGE - NEIGHBOUR_PAGES_COUNT;
  let endPage = CURRENT_PAGE + NEIGHBOUR_PAGES_COUNT;

  PAGES_COUNT = Math.ceil(foundBooks.length / PER_PAGE_COUNT);

  if (endPage > PAGES_COUNT) {
    startPage -= Math.abs(PAGES_COUNT - endPage);
  }

  elPaginationList.innerHTML = '';
  const elPageLinksFragment = document.createDocumentFragment();

  for (let pageIndex = startPage; pageIndex <= endPage; pageIndex++) {
    if (pageIndex < 1) {
      endPage++;
      continue;
    }

    if (pageIndex > PAGES_COUNT) {
      break;
    }

    const elPaginationItem = elPaginationItemTemplate.cloneNode(true);
    elPaginationItem.querySelector('.page-link').textContent = pageIndex;

    if (pageIndex === CURRENT_PAGE) {
      elPaginationItem.querySelector('li').classList.add('active');
    }

    elPageLinksFragment.appendChild(elPaginationItem);
  }

  elPaginationList.appendChild(elPageLinksFragment);
  updatePaginationControlsState();
}

function updatePaginationControlsState() {
  if (CURRENT_PAGE === 1) {
    elPaginationPrevLink.parentElement.classList.add('disabled');
    elPaginationStartLink.parentElement.classList.add('disabled');
  } else {
    elPaginationPrevLink.parentElement.classList.remove('disabled');
    elPaginationStartLink.parentElement.classList.remove('disabled');
  }

  if (CURRENT_PAGE === PAGES_COUNT) {
    elPaginationNextLink.parentElement.classList.add('disabled');
    elPaginationEndLink.parentElement.classList.add('disabled');
  } else {
    elPaginationNextLink.parentElement.classList.remove('disabled');
    elPaginationEndLink.parentElement.classList.remove('disabled');
  }
}

function goToPage(pageIndex) {
  if (pageIndex > PAGES_COUNT) {
    pageIndex = PAGES_COUNT;
  }

  if (pageIndex < 1) {
    pageIndex = 1;
  }

  CURRENT_PAGE = pageIndex;

  showPagination();
}

function goToPrevPage() {
  goToPage(CURRENT_PAGE - 1);
}

function goToNextPage() {
  goToPage(CURRENT_PAGE + 1);
}

function goToFirstPage() {
  goToPage(1);
}

function goToLastPage() {
  goToPage(PAGES_COUNT);
}


function onBookSearchFormSubmit(evt) {
  evt.preventDefault();

  const titleRegex = new RegExp(elBookSearchInput.value.trim(), 'gi');
  foundBooks = findBooks(titleRegex);

  if (foundBooks.length > 0) {
    sortBooks(foundBooks, elSortSelect.value);
    showBooks(foundBooks, titleRegex);

    TOTAL_RESULTS = foundBooks.length;
    CURRENT_PAGE = 1;
    PAGES_COUNT = Math.ceil(TOTAL_RESULTS / PER_PAGE_COUNT);

    let booksToShow = foundBooks.slice(0, PER_PAGE_COUNT);

    showBooks(booksToShow, titleRegex);
    showPagination();

  } else {
    elBooksList.innerHTML = '<div class="col-12">No film found</div>';
  }
}

function onBooksListInfoButtonClick(evt) {
  if (evt.target.matches('.js-more-info-button')) {
    updateBookInfoModal(evt.target.dataset.imdbId);
    return;
  }

  if (evt.target.matches('.js-bookmark-button')) {
    const elBookmarkBtn = evt.target;
    const book = books.find(book => book.imdbId === elBookmarkBtn.dataset.imdbId);
    const indexBookInBookList = bookList.findIndex(book => book.imdbId === elBookmarkBtn.dataset.imdbId);

    if (indexBookInBookList === -1) {
      bookList.push(book);
      elBookmarkBtn.classList.add('btn-secondary');
      elBookmarkBtn.classList.remove('btn-outline-secondary');
      elBookmarkBtn.textContent = 'Bookmarked ✔';
    } else {
      bookList.splice(indexBookInBookList, 1);
      elBookmarkBtn.classList.remove('btn-secondary');
      elBookmarkBtn.classList.add('btn-outline-secondary');
      elBookmarkBtn.textContent = 'Bookmark';
    }

    localStorage.setItem('booklist', JSON.stringify(bookList));
  }
}

// MODAL-BOOKMARK-BUTTON

function onModalInfoButtonClick(evt) {
  if (evt.target.matches('.js-bookmark-button')) {
    const elBookmarkBtn = evt.target;
    const book = books.find(book => book.title === elBookmarkBtn.dataset.title);
    const indexBookInBookList = bookList.findIndex(book => book.title === elBookmarkBtn.dataset.title);

    if (indexBookInBookList === -1) {
      bookList.push(book);
      elBookmarkBtn.classList.add('btn-success');
      elBookmarkBtn.classList.remove('btn-outline-success');
      elBookmarkBtn.textContent = 'Bookmarked ✅';
    } else {
      bookList.splice(indexBookInBookList, 1);
      elBookmarkBtn.classList.remove('btn-success');
      elBookmarkBtn.classList.add('btn-outline-success');
      elBookmarkBtn.textContent = 'Bookmark';
    }

    localStorage.setItem('booklist', JSON.stringify(bookList));
  }
}

function onBookInfoModalHidden() {
  elBookInfoModalIFrame.src = '';

  const elBookmarkBtn = elBooksList.querySelector(`.js-bookmark-button[data-title="${elBookListModal.dataset.uniqueId}"]`);
  const indexBookInBookList = bookList.findIndex(book => book.title === elBookmarkBtn.dataset.title);

  if (indexBookInBookList > -1) {
    elBookmarkBtn.classList.add('btn-secondary');
    elBookmarkBtn.classList.remove('btn-outline-secondary');
    elBookmarkBtn.textContent = 'Bookmarked ✔';
  } else {
    elBookmarkBtn.classList.remove('btn-secondary');
    elBookmarkBtn.classList.add('btn-outline-secondary');
    elBookmarkBtn.textContent = 'Bookmark';
  }
}


// EVENT LISTENERS
if (elBooksList) {
  elBooksList.addEventListener('click', onBooksListInfoButtonClick);
}



if (elBookSearchForm) {
  elBookSearchForm.addEventListener('submit', onBookSearchFormSubmit);
}

if (elPaginationStartLink) {
  elPaginationStartLink.addEventListener('click', goToFirstPage);
}

if (elPaginationPrevLink) {
  elPaginationPrevLink.addEventListener('click', goToPrevPage);
}

if (elPaginationNextLink) {
  elPaginationNextLink.addEventListener('click', goToNextPage);
}

if (elPaginationEndLink) {
  elPaginationEndLink.addEventListener('click', goToLastPage);
}

if (elPaginationList) {
  elPaginationList.addEventListener('click', evt => {
    if (evt.target.matches('.page-link')) {
      goToPage(Number(evt.target.textContent));
    }
  });
}


// INITIATION
/* getUniqueGenres();
showGenreOptions(); */
showBooks(foundBooks, '');
showPagination();