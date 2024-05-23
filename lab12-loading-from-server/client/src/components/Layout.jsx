
import { Row, Col, Button } from 'react-bootstrap';
import { Outlet, Link, useParams, Navigate, useLocation } from 'react-router-dom';

import { Navigation } from './Navigation';
import { Filters } from './Filters';
import { FilmTable } from './FilmLibrary';
import { FilmForm } from './FilmEdit';
import { useEffect } from 'react';

import API from '../API.js';


function NotFoundLayout(props) {
    return (
      <>
        <h2>This route is not valid!</h2>
        <Link to="/">
          <Button variant="primary">Go back to the main page!</Button>
        </Link>
      </>
    );
  }
  
  function AddLayout(props) {
    return (
      <FilmForm addFilm={props.addFilm} />
    );
  }
  
  function EditLayout(props) {
    const { filmId } = useParams();
    const filmToEdit = props.films && props.films.find( f => f.id === parseInt(filmId) );
    
    return(
      <>
      {filmToEdit? 
        <FilmForm editFilm={props.editFilm} filmToEdit={filmToEdit} />
       : <Navigate to={"/add"} />}
      </>
    );
  }
  
  function TableLayout(props) {
  
    const { filterId } = useParams();
    const filterName = props.filters[filterId] ?  props.filters[filterId].label : 'All';
    const filterQueryId = filterId || '';

    // This is only for convenience, to avoid reloading from server when coming from /add or /edit
    // It will be removed when the add and edit operations communicate with the server
    const location = useLocation();
    let reloadFromServer = true;
    if (location.state)
      reloadFromServer = location.state.reloadFromServer;

    useEffect(() => {
      if (reloadFromServer) {
        API.getFilms(filterQueryId)
        .then(films => {
          props.setFilmList(films);
        })
        .catch(e => { console.log(e); } ); 
        //.catch(e => { handleErrors(e); } ); 
      }
    }, [filterQueryId, reloadFromServer]);
  
    // When an invalid filter is set, all the films are displayed.
    //const filteredFilms = (filterId in props.filters) ? props.filmList.filter(props.filters[filterId].filterFunction) : props.filmList;
      
    return (
      <>
        <div className="d-flex flex-row justify-content-between">
          <h1 className="my-2">Filter: <span>{filterName}</span></h1>
          <Link to={'/add'}>
            <Button variant="primary" className="my-2">&#43;</Button>
          </Link>
        </div>
        <FilmTable 
          films={props.filmList} delete={props.deleteFilm} editFilm={props.editFilm} />
      </>
    );
  }
  
  function GenericLayout(props) {
  
    return (
      <>
        <Row>
          <Col>
            <Navigation />
          </Col>
        </Row>
  
        <Row>
          <Col xs={3}>
            <Filters filterArray={props.filterArray} />
          </Col>
  
          <Col xs={9}>
            <Outlet />
  
          </Col>
        </Row>
      </>
    );
  }
  
  export { GenericLayout, NotFoundLayout, TableLayout, AddLayout, EditLayout };
