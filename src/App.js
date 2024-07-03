function App() {
  return (
    <div className="app">
      <header className="app-header">
        <nav>
          <h1>usePopcorn</h1>
          <div className="search">
            <input
              type="text"
              className="search-input"
              placeholder="Search......."
            />
          </div>
          <div className="result">
            <h3>Fount X results</h3>
          </div>
        </nav>
      </header>
      <Main />
    </div>
  );
}

function Main() {
  return (
    <div className="main">
      <Lists />
      <WatchedLists />
    </div>
  );
}

function Lists() {
  return (
    <div className="lists">
      <h3>Popular Movies</h3>
      <MoviesList />
      <h3>Top Rated Movies</h3>
      <MoviesList />
    </div>
  );
}

function WatchedLists() {
  return (
    <div className="lists">
      <h3>Watched Movies</h3>
      <MoviesList />
      <h3>Watched TV Shows</h3>
      <MoviesList />
    </div>
  );
}

function MoviesList() {
  // Fetch and display movie data
  return <div>Loading...</div>;
}

export default App;
