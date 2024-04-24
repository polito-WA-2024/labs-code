'use strict';

/* 
 * [2023/2024]
 * Web Applications
 * 
 * This file contains functions to call server APIs
 */

import { Film } from "./FilmLibrary.js";

const URL = 'http://localhost:3001/api';

async function getAllFilms() {
  // call  /api/films
  const response = await fetch(URL+'/films');
  const questions = await response.json();
  if (response.ok) {
    return questions.map((e) => new Film(e.id, e.title, e.favorite, e.watchDate, e.rating) );
  } else {
    throw questions;  // expected to be an object (extracted by json) that provides info about the error
  }
}

export { getAllFilms };
