import PicApiFetcher from './js/fetch';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const picApiFetcher = new PicApiFetcher();

const refs = {
  searchFormEl: document.querySelector('.search-form'),
  loadBtn: document.querySelector('.load-btn'),
  submitBtn: document.querySelector('.search-form__btn'),
  cardEl: document.querySelector('.gallery'),
};

refs.searchFormEl.addEventListener('submit', onSubmitSearchBtn);
refs.loadBtn.addEventListener('click', onLoad);

function onSubmitSearchBtn(e) {
  e.preventDefault();

  picApiFetcher.query = e.currentTarget.elements.searchQuery.value.trim();
  picApiFetcher.resetPage();

  picApiFetcher
    .fetchGalleryItem()
    .then(data => {
      console.log(data);
      if (data.hits.length === 0) {
        Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        createMarkup(data.hits);
        // foundImg();
        lightbox.refresh();
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
    })
    .catch(err => console.log(err.message));
}

function onLoad(e) {
  picApiFetcher.fetchGalleryItem().then(data => console.log(data));
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
            : index === 8
            ? 'photo-card photo-card__small photo-card__large'
            : index === 17
            ? 'photo-card photo-card__small'
            : index === 20 || index === 25
            ? 'photo-card photo-card__large'
            : index === 32
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
