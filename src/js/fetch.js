import axios from 'axios';

export default class PicApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  async fetchGalleryItem() {
    console.log(this);
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '34415256-969657eed504ea6a898ee73a4';
    const searchOptions = {
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
    };
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&page=${this.page}&per_page=40&q=${this.searchQuery}&${searchOptions}`
    );
    this.incrementPage();

    return response.data;
  }
  resetPage() {
    this.page = 1;
  }
  incrementPage() {
    this.page += 1;
  }
  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
