import PicApiFetcher from './js/fetch';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import LoadMoreBtn from './js/button';
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

const picApiFetcher = new PicApiFetcher();

const refs = {
  searchFormEl: document.querySelector('.search-form'),
  submitBtn: document.querySelector('.search-form__btn'),
  cardEl: document.querySelector('.gallery'),
};

refs.searchFormEl.addEventListener('submit', onSubmitSearchBtn);
loadMoreBtn.refs.showBtn.addEventListener('click', onLoad);

function onSubmitSearchBtn(e) {
  e.preventDefault();

  const searchQuery = e.currentTarget.elements.searchQuery.value.trim();

  picApiFetcher.query = searchQuery;
  picApiFetcher.resetPage();
  clearPicContainer();
  loadMoreBtn.show();
  loadMoreBtn.disable();

  picApiFetcher
    .fetchGalleryItem()
    .then(data => {
      console.log(data);
      if (data.hits.length === 0) {
        Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        loadMoreBtn.hide();
      } else {
        createMarkup(data.hits);

        loadMoreBtn.enable();

        lightbox.refresh();
        Notify.success(`Hooray! We found ${data.totalHits} images.`);

        if (refs.cardEl.children.length >= data.totalHits) {
          Notify.failure(
            `We're sorry, but you've reached the end of search results.`
          );
          loadMoreBtn.hide();
        }
      }
    })
    .catch(err => console.log(err.message));
}

function onLoad(e) {
  loadMoreBtn.disable();
  picApiFetcher
    .fetchGalleryItem()
    .then(data => {
      createMarkup(data.hits);

      lightbox.refresh();
      loadMoreBtn.enable();

      if (refs.cardEl.children.length >= data.totalHits) {
        onEndOfSearch();
      }
    })
    .catch(() => {
      onEndOfSearch();
    });
}

function createMarkup(arr) {
  const markup = arr
    .map(
      (
        {
          largeImageURL,
          webformatURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        },
        index
      ) => {
        const itemClass =
          index === 0
            ? 'photo-card photo-card__small'
            : index === 2
            ? 'photo-card photo-card__large'
            : index === 9
            ? 'photo-card photo-card__small photo-card__large'
            : index === 16
            ? 'photo-card photo-card__small'
            : index === 20 || index === 25
            ? 'photo-card photo-card__large'
            : index === 35
            ? 'photo-card photo-card__small'
            : 'photo-card';

        return `
          <div class="photo-card ${itemClass}">
            <a class="gallery__item" href='${largeImageURL}'>
              <img class="img"
                   src="${webformatURL}" 
                   alt="${tags}" 
                   loading="lazy" />
            </a>
            <div class="info">
              <p class="info-item">
                <b>Likes <span class="desk"> ${likes} </span></b>
              </p>
              <p class="info-item">
                <b>Views  <span class="desk">${views}</span></b>
              </p>
              <p class="info-item">
                <b>Comments <span class="desk">${comments}</span></b>
              </p>
              <p class="info-item">
                <b>Downloads <span class="desk">${downloads}</span></b>
              </p>
            </div>
          </div>
        `;
      }
    )
    .join('');
  refs.cardEl.insertAdjacentHTML('beforeend', markup);
}

function clearPicContainer() {
  refs.cardEl.innerHTML = '';
}
function onEndOfSearch() {
  loadMoreBtn.hide();
  Notify.failure("We're sorry, but you've reached the end of search results.");
}
