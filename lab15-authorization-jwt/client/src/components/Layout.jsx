
import { Row, Col, Button, Alert, Toast } from 'react-bootstrap';
import { Outlet, Link, useParams, Navigate, useLocation } from 'react-router-dom';

import { Navigation } from './Navigation';
import { Filters } from './Filters';
import { FilmTable } from './FilmLibrary';
import { FilmForm } from './FilmEdit';
import { useEffect } from 'react';
import { LoginForm } from './Auth';

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

  function LoginLayout(props) {
    return (
      <Row>
        <Col>
          <LoginForm login={props.login} />
        </Col>
      </Row>
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

    //console.log("DEBUG: re-render TableLayout");
    //console.log(JSON.stringify(props));


    // Without this the if(dirty) test in the [dirty] useEffect is not passed
    useEffect(() => {
      props.setDirty(true);
    }, [filterQueryId]);
    // Alternatively, the if(dirty) can be omitted but two requests will be sent to the server

    useEffect(() => {
      if (props.dirty) {  
        API.getFilms(filterQueryId)
        .then(films => {
          props.setFilmList(films);
          props.setDirty(false);
        })
        .catch(e => { props.handleErrors(e); } ); 
      }
    }, [props.dirty]);
    

    useEffect(() => {
        if (props.filmList) {
          if (props.authToken) {
            if (Array.isArray(props.filmList)) {
              API.getFilmStats(props.authToken, props.filmList.map(e => e.title))
                .then(stats => props.setFilmStats(stats))
                .catch(err => {
                  props.setFilmStats({});
                  API.getAuthToken()
                    .then(resp => props.setAuthToken(resp.token));
                });
            }
          }
        }
    }, [props.filmList, props.authToken]);

  
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
      <div>
      <h4>
        {/* Example about how to make sure the app does not crash in case you have a value which is not a number */}
        <span>Tot revenues (M$): {props.filmStats.revenues ?
            (Number.parseFloat(props.filmStats.revenues)).toFixed(2) : '--'}</span>
        <span className="ms-4">{props.filmStats.audience?
          (`Audience: ${props.filmStats.audience}`) : null }</span>
      </h4>
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
            <Navigation loggedIn={props.loggedIn} user={props.user} logout={props.logout} />
          </Col>
        </Row>

        <Row><Col>
          {props.message? <Alert className='my-1' onClose={() => props.setMessage('')} variant='danger' dismissible>
            {props.message}</Alert> : null}
          {/* Alternative, with autohide
            <Toast show={props.message !== ''} onClose={() => props.setMessage('')} delay={4000} autohide>
              <Toast.Body>{props.message}</Toast.Body>
            </Toast>
          */}
        </Col></Row>

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
  
  export { GenericLayout, NotFoundLayout, TableLayout, AddLayout, EditLayout, LoginLayout };
