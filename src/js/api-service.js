const axios = require('axios').default;

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '28166430-49d596e3415ce5cac11c6cb0f';

export default class ApiService {
  constructor() {
    this.searchValue = '';
    this.page = 1;
  }

  async fetchingUrl() {
    const searchParams = new URLSearchParams({
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: this.page,
    });

    // return fetch(`${BASE_URL}?key=${KEY}&q=${this.searchValue}&${searchParams}`)
    //   .then(response => {
    //     if (!response.ok) {
    //       throw new Error(response.status);
    //     }
    //     this.incrementPage();
    //     return response.json();
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    //
    //
    // const response = await fetch(
    //   `${BASE_URL}?key=${KEY}&q=${this.searchValue}&${searchParams}`
    // );
    // return await response.json();
    //
    //
    const response = await axios.get(
      `${BASE_URL}?key=${KEY}&q=${this.searchValue}&${searchParams}`
    );

    this.incrementPage();

    console.log(response.data);
    return await response;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get value() {
    return this.searchValue;
  }

  set value(newSearchValue) {
    this.searchValue = newSearchValue;
  }
}
