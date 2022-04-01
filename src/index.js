import './css/styles.css';
import debounce from "lodash.debounce";
import { fetchCountries } from "./js/fetchCountries";
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
    searchBox: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryCard: document.querySelector('.country-info')
}

refs.searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
    e.preventDefault();
    let searchQuery = refs.searchBox.value.trim();
    fetchCountries(searchQuery)
        .then(result => {
            if (result.length > 10) {
                clearFields();
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
            }
            else if (result.length > 2 && result.length < 10) {
                refs.countryCard.innerHTML = "";
                const makeCountries = result
                .map(makeCountryItemMarkup)
                    .join('');
                refs.countryList.innerHTML = makeCountries;
            }
            else if (result.length === 1) {
                refs.countryList.innerHTML = "";
                refs.countryCard.innerHTML = makeCountryCardMarkup(result[0]);
            }
        })
        .catch(error => {
            console.log(error);
            clearFields();
            if (searchQuery) {
                Notiflix.Notify.failure('Oops, there is no country with that name');
            }
        });
}
  
const makeCountryItemMarkup = country => {
  return `
  <li class="country__item">
    <img alt=${country.name.official} src=${country.flags.svg} class='country__flag'>
    </img>
    <p class='country__name'>${country.name.official}</p>
  </li>`;
};

const makeCountryCardMarkup = country => {
  const languages = Object.values(country.languages).join(',');
    return `
    <div class='countryCard__title'>
        <img alt=${country.name.official} src=${country.flags.svg} class='countryCard__flag'>
        </img>
        <p class='countryCard__name'>${country.name.official}</p>
    </div>
    <p class='countryCard__value'><span class='countryCard__label'>Capital: </span>${country.capital}</p>
    <p class='countryCard__value'><span class='countryCard__label'>Population: </span>${country.population}</p>
    <p class='countryCard__value'><span class='countryCard__label'>Languages: </span>${languages}</p>
  </div>`;
};

const clearFields = () => {
    refs.countryCard.innerHTML = "";
    refs.countryList.innerHTML = "";
}




