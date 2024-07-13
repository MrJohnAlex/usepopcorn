import { useEffect, useState } from "react";
import StarRating from "./components/StarRating.";

const KEY = "431c44a2";

function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("dad");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  function onSelectMovie(id) {
    setSelectedId((s) => (s === id ? null : id));
  }

  function onHandleCloseMovie() {
    setSelectedId(null);
  }

  function onAddMovie(movie) {
    setWatched((cur) => [...cur, movie]);
  }

  function onRemoveMovie(id) {
    setWatched((current) => current.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const response = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!response.ok) {
            throw new Error("Something went wrong");
          }
          const data = await response.json();
          if (data.Response === "False") {
            throw new Error("No movies found");
          }
          setMovies(data.Search);
          setError("");
        } catch (error) {
          if (error.name !== "AbortError") {
            setError(error.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      onHandleCloseMovie();
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return (
    <div className="app">
      <header className="app-header">
        <nav>
          <Logo />
          <Search query={query} setQuery={setQuery} />
          <Result movies={movies} />
        </nav>
      </header>
      <main className="main">
        <Box>
          {isLoading && <Loading />}
          {!isLoading && !error && (
            <Main>
              {movies.map((movie) => (
                <Lists
                  movie={movie}
                  key={movie.imdbID}
                  onSelectMovie={onSelectMovie}
                />
              ))}
            </Main>
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetail
              selectedId={selectedId}
              onCloseMovie={onHandleCloseMovie}
              onAddMovie={onAddMovie}
              watchedMovies={watched}
            />
          ) : (
            <>
              <WatchedSummary watchMovies={watched} />
              <WatchedLists
                watchedMovies={watched}
                onRemoveMovie={onRemoveMovie}
              />
            </>
          )}
        </Box>
      </main>
    </div>
  );
}
function Logo() {
  return (
    <div className="logo">
      <span className="corn">🗃️</span>
      <h1>Movies App</h1>
    </div>
  );
}
function Search({ query, setQuery }) {
  return (
    <div className="search">
      <input
        type="text"
        className="search-input"
        placeholder="Search......."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
function Result({ movies }) {
  const result = movies.length;
  return (
    <div className="result">
      <h3>Fount {result} results</h3>
    </div>
  );
}
function Main({ children }) {
  return <div className="movies-lists">{children}</div>;
}

function Lists({ movie, onSelectMovie }) {
  return (
    <div className="lists" onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={movie.Title} />
      <div className="details">
        <h3>{movie.Title}</h3>
        <h3>📆{movie.Year}</h3>
      </div>
    </div>
  );
}

function MovieDetail({ selectedId, onCloseMovie, onAddMovie, watchedMovies }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const isWatched = watchedMovies
    .map((movie) => movie.imdbID)
    .includes(selectedId);
  const watchedUserRated = watchedMovies.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Type: type,
    Poster: poster,
    Plot: plot,
    Released: released,
    imdbRating,
    RunTime: runTime,
  } = movie;
  function handleAdd() {
    const newMovie = {
      imdbID: selectedId,
      title,
      year,
      type,
      poster,
      plot,
      released,
      imdbRating: Number(imdbRating),
      runTime: runTime,
    };
    console.log(runTime);
    onAddMovie(newMovie);
    onCloseMovie();
  }

  useEffect(
    function () {
      async function fetchMovieDetail() {
        try {
          setIsLoading(true);
          const response = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
          );
          if (!response.ok) {
            throw new Error("Something went wrong");
          }
          const data = await response.json();
          setMovie(data);
        } catch (error) {
          console.error(error.message);
        } finally {
          setIsLoading(false);
        }
      }
      fetchMovieDetail();
    },
    [selectedId]
  );
  useEffect(
    function () {
      if (!movie.Title) return;
      document.title = `Movie | ${movie.Title}`;

      return function () {
        document.title = "Movie App";
      };
    },
    [movie.Title]
  );

  useEffect(function () {
    function callback(e) {
      if (e.key === "Escape") {
        onCloseMovie();
      }
    }
    document.addEventListener("keydown", callback);
    return function () {
      document.removeEventListener("keydown", callback);
    };
  });

  return (
    <div className="movie-detail">
      {/* <button className="btn btn-back" onClick={onCloseMovie}>
        &larr;
      </button> */}
      {isLoading && <Loading />}
      {!isLoading && (
        <>
          <header>
            <img src={movie.Poster} alt={movie.Title} />
            <div className="details">
              <h3>{movie.Title}</h3>
              <h4>{movie.Released} </h4>
              <h4>⭐{movie.imdbRating}</h4>
            </div>
          </header>
          <section>
            <div className="star-rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    onSetRating={setUserRating}
                    size={24}
                  />
                  {userRating > 0 && (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAdd()}
                      type="button"
                    >
                      Add To Watch List
                    </button>
                  )}
                </>
              ) : (
                <p>You rated on this movie ⭐ {watchedUserRated}</p>
              )}
            </div>
            <p>
              <em>{movie.Plot}</em>
            </p>
            <p>Starring {movie.Actors}</p>
            <p>Director by {movie.Director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedLists({ watchedMovies, onRemoveMovie }) {
  return (
    <ul>
      {watchedMovies.map((movie) => (
        <WatchMovie
          key={movie.imdbID}
          movie={movie}
          onRemoveMovie={onRemoveMovie}
        />
      ))}
    </ul>
  );
}

function WatchMovie({ movie, onRemoveMovie }) {
  return (
    <li className="list">
      <div className="main-list">
        <img src={movie.Poster} alt={movie.Title} />
        <div>
          <h3>{movie.Title}</h3>
          <div className="watched-list">
            <p>
              <span>⭐</span>
              <span>{movie.imdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie.userRating}</span>
            </p>
            <p>
              {/* <span>⌚</span>
              <span>{movie.runTime}</span> */}
            </p>
          </div>
        </div>{" "}
      </div>
      <span className="btn-remove" onClick={() => onRemoveMovie(movie.imdbID)}>
        ⛔
      </span>
    </li>
  );
}
function WatchedSummary({ watchMovies }) {
  // Define the average function
  function average(numbers) {
    if (numbers.length === 0) return 0; // Handle the case of an empty array
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
  }
  const avgImdbRating = average(watchMovies.map((movie) => movie.imdbRating));
  const avgUserRating = average(watchMovies.map((movie) => movie.userRating));
  const avgRunTime = average(watchMovies.map((movie) => movie.runTime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>🗃️</span>
          <span>{watchMovies.length} movies</span>
        </p>
        <p>
          <span>⭐</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          {/* <span>⌚</span>
          <span>{avgRunTime.toFixed(1)} minutes</span> */}
        </p>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="loading">
      <p>Loading</p>
    </div>
  );
}

function Box({ children }) {
  return (
    <div className="box">
      {/* <span className="close">-</span> */}
      {children}
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="error">
      <p>⛔ {message}</p>
    </div>
  );
}
export default App;
