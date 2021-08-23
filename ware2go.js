const axios = require('axios');
const prompt = require('prompt-sync')();

let actor1 = prompt("Enter first actor's name: ");
let actor2 = prompt("Enter second actor's name: ");

let moviedb_api_key = prompt("Enter your themoviedb.org api key: ");

actor1 = actor1.replace(/\s/, "+");
actor2 = actor2.replace(/\s/, "+");

const getActorId = async (actor) => {
  const PERSON_SEARCH_URL = 'https://api.themoviedb.org/3/search/person';

  try {
    const response = await axios.get(PERSON_SEARCH_URL, {
          params: {
            api_key: moviedb_api_key,
            query: actor
        }
      });
      return response.data.results[0].id;
  } catch(error) {
    console.error(error);
  }
}

const getMovieTitles = async (actor) => {
  try {
    const id = await getActorId(actor);
    const MOVIE_LIST_URL= `https://api.themoviedb.org/3/person/${id}/movie_credits`;
    const movieList = await axios.get(MOVIE_LIST_URL, {
          params: {
            api_key: moviedb_api_key,
          }
        });
    const movieTitles = movieList.data["cast"].map( movie => movie.title );
    return movieTitles;
  } catch(error) {
    console.error(error);
  }
}

// async function printMovieList(actor) {
const printMovieList = async (actor) => {
  // await getMovieTitles(actor).then(async (movies) => {
  //   movies.forEach(movie => console.log(movie));
  // });
  const movieTitles = await getMovieTitles(actor);
  actor = actor.replace('+', ' ');

  console.log("\nThe films of", actor, "\n");
  movieTitles.forEach(movie => console.log(movie));
  console.log("\n");
};

printMovieList(actor1);

printMovieList(actor2);

// async function compareMovies(firstActor, secondActor) {
const compareMovies = async (firstActor, secondActor) => {
  const moreMoviesText = "has been in more films."

  try {
    const firstActorMovieList = await getMovieTitles(firstActor);
    const firstMovieListLength = firstActorMovieList.length;
    const secondActorMovieList = await getMovieTitles(secondActor);
    const secondMovieListLength = secondActorMovieList.length;

    // TODO: what if equal?
    if(firstMovieListLength > secondMovieListLength) {
      firstActor = firstActor.replace('+', ' ');

      console.log(firstActor, moreMoviesText);
      return firstActor;
    } else {
      secondActor = secondActor.replace('+', ' ');

      console.log(secondActor, moreMoviesText);
      return secondActor;
    }
  } catch(error) {
    console.error(error);
  }
}

compareMovies(actor1, actor2);
