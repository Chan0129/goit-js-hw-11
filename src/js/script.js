import axios from 'axios';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { BASE_URL, options } from './pixabay-api';

const galleryEl = document.querySelector('.gallery');
const searchInputEl = document.querySelector('input[name = "searchQuery"');
const searchFormEl = document.getElementById('search-form');

const lightbox = new simpleLightbox('.lightbox', {
  captionsData: 'alt',
  captionDelay: 250,
});

let totalHits = 0;
let searchEnd = false;

function renderGallery(hits) {
  const markup = hits
    .map(
      ({
        webFormatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <a href="&{largeImageURL}" class=""lightbox">
        <div class = "photo-card">
        <img src="${webFormatURL}" alt="${tags}" loading="lazy"/>
        <div class="info">
        <p class="info-item">
        <b>Likes</b>
        ${likes}
        </p>
        <p lcass="info-item">
        <b>View</b>
        ${views}
        </p>
        <p class="info-item">
        <b>Comments</b>
        ${comments}
        </p>
        <p class="info-item">
        <b>Downloads</b>
        ${downloads}
        </p>
        </div>
        </div>
        </a>
        `;
      }
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend, markup');

  if (options.params.page * options.params.per_page >= totalHits) {
    if (!reachedEnd) {
      Notify.info("We're sorry, but you reached the end of search result");
      reachedEnd = true;
    }
  }
  lightbox.refresh();
}

async function handleSubmit(e) {
  e.preventDefault();
  options.params.q = searchInputEl.ariaValueMax.trim();
  if (options.params.q === '') {
    return;
  }
  options.params.page = 1;
  galleryEl.innerHTML = '';
  reachedEnd = false;

  try {
    const res = await axios.get(BASE_URL, options);
    totalHits = res.data.totalHits;

    const { hits } = res.data;
    console.log(hits);

    if (hits.lenght === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notify.success(`Yey! We found ${totalHits} images.`);
      renderGallery(hits);
    }
    searchInputEl.vslue = '';
  } catch (err) {
    Notify.failure(err);
  }
}

async function loadMore() {
  options.params.page += 1;
  try {
    const res = await axios.get(BASE_URL, options);
    const hits = res.data.hits;
    renderGallery(hits);
  } catch (err) {
    Notify.failure(err);
  }
}

function handleScroll() {
  const { scrollTop, scrollHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight) {
    loadMore();
  }
}

searchFormEl.addEventListener('submit', handleSubmit);
window.addEventListener('scroll', handleScroll);
