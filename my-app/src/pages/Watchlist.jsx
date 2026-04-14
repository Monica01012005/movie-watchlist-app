import { useEffect, useState } from "react";

const BASE = "http://localhost:5000";
const OMDB = import.meta.env.VITE_OMDB_KEY;

export default function Watchlist() {
  const [token, setToken] = useState(null);

  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [watchlistIds, setWatchlistIds] = useState(new Set());

  const [loadingWatchlist, setLoadingWatchlist] = useState(true);
  const [loadingResults, setLoadingResults] = useState(true);

  // Load token
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  // Load watchlist
  const loadWatchlist = async () => {
    if (!token) return;

    setLoadingWatchlist(true);
    try {
      const res = await fetch(`${BASE}/api/watchlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to load watchlist");
        setMovies([]);
        return;
      }

      const moviesArray = Array.isArray(data) ? data : [];
      setMovies(moviesArray);
      setWatchlistIds(new Set(moviesArray.map((m) => m.imdbID)));
    } catch (err) {
      console.error(err);
      setError("Server error");
      setMovies([]);
    } finally {
      setLoadingWatchlist(false);
    }
  };

  // Load default movies (full details)
  const loadDefaultMovies = async () => {
    try {
      const defaultMovies = [
        "tt0111161",
        "tt0068646",
        "tt0071562",
        "tt0110912",
        "tt0108052",
        "tt0118799",
        "tt0102926",
        "tt1345836",
      ];

      const promises = defaultMovies.map((id) =>
        fetch(`https://www.omdbapi.com/?apikey=${OMDB}&i=${id}`)
          .then((r) => r.json())
          .catch(() => null)
      );

      const data = await Promise.all(promises);
      setResults(data.filter((m) => m && m.Title));
    } catch (err) {
      console.error(err);
      setError("Failed to load movies");
    } finally {
      setLoadingResults(false);
    }
  };

  // Run when token is ready
  useEffect(() => {
    if (token) {
      loadWatchlist();
      loadDefaultMovies();
    }
  }, [token]);

  // 🔥 Search movies with full details
  const search = async () => {
    if (!query) return;

    try {
      setLoadingResults(true);

      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${OMDB}&s=${query}`
      );
      const data = await res.json();

      if (!data.Search) {
        setResults([]);
        setError("No movies found");
        return;
      }

      // Fetch full details for each result
      const detailedMovies = await Promise.all(
        data.Search.map((movie) =>
          fetch(`https://www.omdbapi.com/?apikey=${OMDB}&i=${movie.imdbID}`)
            .then((r) => r.json())
            .catch(() => null)
        )
      );

      setResults(detailedMovies.filter((m) => m && m.Title));
      setError("");
    } catch (err) {
      console.error(err);
      setError("Search failed");
    } finally {
      setLoadingResults(false);
    }
  };

  // Add movie
  const add = async (m) => {
    try {
      if (watchlistIds.has(m.imdbID)) {
        setError("Already in watchlist");
        setTimeout(() => setError(""), 2000);
        return;
      }

      const addRes = await fetch(`${BASE}/api/watchlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          imdbID: m.imdbID,
          title: m.Title,
          year: m.Year,
          poster: m.Poster,
          rating: m.imdbRating,
          plot: m.Plot,
        }),
      });

      const data = await addRes.json();

      if (!addRes.ok) {
        setError(data.message || "Failed to add");
        return;
      }

      loadWatchlist();
      setQuery("");
    } catch (err) {
      console.error(err);
      setError("Add failed");
    }
  };

  // Toggle watched
  const toggle = async (id) => {
    try {
      const res = await fetch(`${BASE}/api/watchlist/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.message || "Update failed");
        setTimeout(() => setError(""), 2000);
        return;
      }

      loadWatchlist();
    } catch (err) {
      console.error(err);
      setError("Update failed");
      setTimeout(() => setError(""), 2000);
    }
  };

  // Remove movie
  const remove = async (id) => {
    try {
      const res = await fetch(`${BASE}/api/watchlist/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.message || "Delete failed");
        setTimeout(() => setError(""), 2000);
        return;
      }

      loadWatchlist();
    } catch (err) {
      console.error(err);
      setError("Delete failed");
      setTimeout(() => setError(""), 2000);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Please login first
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl text-center mb-6">🎬 Movie Watchlist</h1>

      {error && (
        <div className="bg-red-500 p-2 text-center mb-4 rounded">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="flex gap-2 max-w-xl mx-auto mb-6">
        <input
          className="flex-1 p-3 bg-gray-800 rounded"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={search} className="bg-blue-600 px-4 rounded">
          Search
        </button>
      </div>

      {/* Results */}
      <h2 className="text-xl mb-3">Results</h2>

      {loadingResults ? (
        <p className="text-center">Loading movies...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {results.map((m) => (
            <div key={m.imdbID} className="bg-gray-800 p-2 rounded">
              <img
                src={
                  m.Poster !== "N/A"
                    ? m.Poster
                    : "https://via.placeholder.com/300x450"
                }
                alt={m.Title}
                className="h-64 w-full object-cover"
              />

              <p className="font-bold">{m.Title}</p>
              <p className="text-sm text-gray-400">{m.Year}</p>
              <p className="text-yellow-400">⭐ {m.imdbRating}</p>

              <p className="text-xs mt-1 line-clamp-3">
                {m.Plot}
              </p>

              <button
                onClick={() => add(m)}
                disabled={watchlistIds.has(m.imdbID)}
                className={`w-full mt-2 py-1 rounded ${
                  watchlistIds.has(m.imdbID)
                    ? "bg-gray-600"
                    : "bg-green-600"
                }`}
              >
                {watchlistIds.has(m.imdbID) ? "Added" : "Add"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Watchlist */}
      <h2 className="text-xl mb-3">Your Watchlist</h2>

      {loadingWatchlist ? (
        <p className="text-center">Loading watchlist...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {movies.map((m) => (
            <div key={m._id} className="bg-gray-800 p-3 rounded">
              <img
                src={
                  m.poster !== "N/A"
                    ? m.poster
                    : "https://via.placeholder.com/300x450"
                }
                alt={m.title}
                className="h-72 w-full object-cover"
              />

              <h3>{m.title}</h3>
              <p className="text-sm text-gray-400">{m.year}</p>
              <p className="text-yellow-400">⭐ {m.rating}</p>
              <p className="text-xs mt-1">{m.plot}</p>

              <button
                onClick={() => toggle(m._id)}
                className="bg-yellow-600 w-full mt-2"
              >
                {m.watched ? "Watched" : "Mark Watched"}
              </button>

              <button
                onClick={() => remove(m._id)}
                className="bg-red-600 w-full mt-2"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}