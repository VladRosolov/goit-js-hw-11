import ApiService from './js/api-service';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', formHandler);
refs.loadMoreBtn.addEventListener('click', loadMore);

refs.loadMoreBtn.classList.add('is-hidden');

const newApiService = new ApiService();

async function formHandler(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';

  newApiService.value = e.currentTarget.elements.searchQuery.value.trim();
  newApiService.resetPage();

  if (newApiService.value !== '') {
    try {
      const response = await newApiService.fetchingUrl();
      refs.loadMoreBtn.classList.remove('is-hidden');
      markupImages(response);
    } catch (error) {
      console.log(error);
    }
  }
  return;
}

async function loadMore() {
  try {
    refs.loadMoreBtn.classList.add('is-hidden');
    const response = await newApiService.fetchingUrl();
    refs.loadMoreBtn.classList.remove('is-hidden');
    markupImages(response);
  } catch (error) {
    console.log(error);
  }
}

function markupImages(images) {
  //   console.log(images);
  const imageArr = images.data.hits;
  // console.log(newApiService.page * imageArr.length);
  // console.log(images.totalHits);
  if (imageArr.length !== 0) {
    if (images.totalHits < newApiService.page * imageArr.length) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notify.info(`We're sorry, but you've reached the end of search results.`);
    }
    const markup = imageArr
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `
          <div class="photo-card">
            <a class="large-image"  href="${largeImageURL}"/>
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <div class="info-box">
                <p class="info-title">Likes:</p>
                <p class="info-item">${likes}</p>
              </div>
              <div class="info-box">
                <p class="info-title">Views:</p>
                <p class="info-item">${views}</p>
              </div>
              <div class="info-box">
                <p class="info-title">Comments:</p>
                <p class="info-item">${comments}</p>
              </div>
              <div class="info-box">
                <p class="info-title">Downloads:</p>
                <p class="info-item">${downloads}</p>
              </div>
            </div>
          </div>
          `;
        }
      )
      .join('');
    refs.gallery.insertAdjacentHTML('beforeend', markup);
  } else {
    refs.loadMoreBtn.classList.add('is-hidden');
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  const lightBox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    animationSpeed: 250,
  });

  lightBox.refresh();
}
