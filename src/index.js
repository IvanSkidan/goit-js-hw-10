import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const inputBox = document.querySelector("#search-box");
const countryList = document.querySelector(".country-list");
const countryInfo = document.querySelector(".country-info");

inputBox.addEventListener("input", debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  event.preventDefault();

  const search = inputBox.value.trim();
  // const search = event.target.value.trim();

  if (!search) {
    cleanMarkup();
    resetMarkup();
    return;
  };

  fetchCountries(search)
    .then(result => {
      if (result.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        return;
      }
      renderMarkup(result);
    })
    .catch(error => {
      cleanMarkup();
      Notify.failure('Oops, there is no country with that name');
    });
};

function renderMarkup(response) {
  if (response.length >= 2 && response.length <= 10) {
    countryList.innerHTML = '';
    countryList.style.display = "block";
    countryInfo.style.display = "none";
    renderMarkupList(response);
  };
  
  if (response.length === 1) {
      countryInfo.innerHTML = '';
      countryList.style.display = "none";
      countryInfo.style.display = "block";
      renderMarkupInfo(response);
    };
}

function renderMarkupList(countries) {
  const markupList = countries.map(({ flags, name }) => {
    return `<li class="list">
      <img src="${flags.svg}" alt="${name}" width="80" height="auto">
      <span class="accent">${name.official}</span>
      </li>`;
  }).join('');
  
  countryList.innerHTML = markupList;
  return markupList;
}

function renderMarkupInfo(countries) {
  const markupInfo = countries.map(({ flags, name, capital, population, languages }) => {
    languages = Object.values(languages).join(", ");
    return `<img src="${flags.svg}" alt="${name}" width="240" height="auto">
      <h1>${name.official}</h1>
      <p>Capital: <span>${capital}</span></p>
      <p>Population: <span>${population}</span></p>
      <p>Languages: <span>${languages}</span></p>`;
  }).join('');
  
  countryInfo.innerHTML = markupInfo;
  return markupInfo;
}

function cleanMarkup() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function resetMarkup() {
  countryList.style.display = "none";
  countryInfo.style.display = "none";
}
