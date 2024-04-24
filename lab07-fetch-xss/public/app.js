'use strict';
/*
 * [2023/2024]
 * Web Applications
 */

import { Film, FilmLibrary } from "./FilmLibrary.js";
import { getAllFilms } from "./API.js";


const deleteOption = true;  // Enable or disable the optional part of the lab

// --- Functions Definitions --- //

/**
 * Function to create a single film enclosed in a <tr> tag.
 * @param {*} film the film object.
 */
function createFilmNode(film) {

    const tr = document.createElement('tr');
    //tr.id = "film" + film.id;

    // creating a <p> for the title
    const titleP = document.createElement('p');
    if(film.isFavorite()) 
        titleP.className = 'favorite';
    //titleP.innerText = film.title;
    // innerHTML is XSS vulnerable
    titleP.innerHTML = film.title;

    const td1 = document.createElement('td');
    td1.appendChild(titleP);
    tr.appendChild(td1);


    // creating the checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = "check-f" + film.id;
    checkbox.className = 'custom-control-input';
    checkbox.checked = film.isFavorite();
   
    const td2 = document.createElement('td');
    td2.className = 'text-center';
    td2.appendChild(checkbox);
    tr.appendChild(td2);
    

    // creating a <small> element for the date
    const dateText = document.createElement('small');
    dateText.innerText = film.formatWatchDate('MMMM D, YYYY');

    const td3 = document.createElement('td');
    td3.appendChild(dateText);
    tr.appendChild(td3);


    // creating a <span> for the rating stars
    const ratingSpan = document.createElement('span');
    ratingSpan.className = 'empty-star';
    for(let i=0; i<5; i++) {
        const star = document.createElement('i');
        star.classList.add('bi');
        if (i < film.rating)
            star.classList.add('bi-star-fill');
        else
            star.classList.add('bi-star');
        ratingSpan.appendChild(star); 
    }

    const td4 = document.createElement('td');
    td4.appendChild(ratingSpan);
    tr.appendChild(td4);

    if (deleteOption) {
        const deleteSpan = document.createElement('span');
        deleteSpan.className = 'delete-icon';
        deleteSpan.id = 'film' + film.id;

        const trash = document.createElement('i');
        trash.className = 'bi bi-trash';
        deleteSpan.appendChild(trash);

        const td5 = document.createElement('td');
        td5.appendChild(deleteSpan);
        tr.appendChild(td5);
    }

    return tr;
}

/**
 * Function to create the list of films.
 */
function createListFilms(films) {
    const listFilms = document.getElementById("list-films");
    
    // Create table header
    const tr = document.createElement('tr');

    // Be careful using innerHTML for XSS, however with constant strings this is safe
    tr.innerHTML = '<th>Title</th> \
        <th class="text-center">Favorite</th> \
        <th>Last seen</th> \
        <th>Rating</th>'+ (deleteOption? '<th>Delete</th>' : '');
    listFilms.appendChild(tr);

    for (const film of films) {
        const filmNode = createFilmNode(film);
        listFilms.appendChild(filmNode);
    }
}

/**
 * Function to destroy the list of films.
 */
function clearListFilms() {
    const listFilms = document.getElementById("list-films");
    listFilms.innerHTML = '';    // Be careful using innerHTML for XSS, however with constant strings this is safe
}

/**
 * Function to manage film filtering in the web page.
 * @param {string}   filterId  The filter node id.
 * @param {string}   titleText The text to put in the film list content h1 header.
 * @param {function} filterFn  The function that does the filtering and returns an array of gilms.
 */
function filterFilms( filterId, titleText, filterFn ) {
    
    document.querySelectorAll('#left-sidebar div a ').forEach( node => node.classList.remove('active'));
    document.getElementById('active-filter-name').innerText = titleText;
    document.getElementById(filterId).classList.add('active');
    clearListFilms();
    createListFilms(filterFn());

    if (deleteOption) {
        // register delete event handler for each film item
        document.querySelectorAll(".delete-icon").forEach(item => item.addEventListener('click', event => {
            const stringFilmId = event.currentTarget.id;
            //console.log(stringFilmId);
            const filmId = stringFilmId.slice('film'.length); // remove the initial 'film' string and leave only the number (filmId)
            filmLibrary.delete(filmId);
            filterFilms(filterId, titleText, filterFn);
            event.preventDefault();
        }));

    }

}


// ----- Main ----- //
const filmLibrary = new FilmLibrary();

const filmList = await getAllFilms();
////////////////////console.log(JSON.stringify(filmList));
////filmList.forEach(f => { filmLibrary.add(new Film(f.id, f.title, f.favorite, f.watchDate, f.rating)); })
filmList.forEach(f => { filmLibrary.add(f) });

filterFilms( 'filter-all', 'All', filmLibrary.filterAll );
// ---------------- //


// --- Creating Event Listeners for filters --- //
document.getElementById("filter-all").addEventListener( 'click', event => 
    filterFilms( 'filter-all', 'All', filmLibrary.filterAll )
);

document.getElementById("filter-favorites").addEventListener( 'click', event => 
    filterFilms( 'filter-favorites', 'Favorites', filmLibrary.filterByFavorite )
);

document.getElementById("filter-best").addEventListener( 'click', event => 
    filterFilms( 'filter-best', 'Best Rated', filmLibrary.filterByBestRated )
);

document.getElementById("filter-seen-last-month").addEventListener( 'click', event => 
    filterFilms( 'filter-seen-last-month', 'Seen Last Month', filmLibrary.filterBySeenLastMonth )
);

document.getElementById("filter-unseen").addEventListener( 'click', event => 
    filterFilms( 'filter-unseen', 'Unseen', filmLibrary.filterByUnseen )
);
