import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GlobalApi from "../Services/GlobalApi";
import IMAGE_BASE_URL from "../Constant";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGenreId, setSelectedGenreId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const TMDB_GENRES = [
    { id: 28, name: "Action", emoji: "🔥" },
    { id: 12, name: "Adventure", emoji: "🗺️" },
    { id: 16, name: "Animation", emoji: "🎨" },
    { id: 35, name: "Comedy", emoji: "😂" },
    { id: 80, name: "Crime", emoji: "🕵️" },
    { id: 18, name: "Drama", emoji: "🎭" },
    { id: 14, name: "Fantasy", emoji: "✨" },
    { id: 27, name: "Horror", emoji: "👻" },
    { id: 10749, name: "Romance", emoji: "❤️" },
    { id: 878, name: "Sci-Fi", emoji: "🛸" },
    { id: 53, name: "Thriller", emoji: "🔪" },
  ];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length >= 2) {
      setSelectedGenreId(null); // Clear active genre pill when typing text
      debounceRef.current = setTimeout(() => {
        searchByText(1);
      }, 400);
    } else if (!selectedGenreId) {
      setResults([]);
      setTotalPages(0);
      setPage(1);
    }

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const searchByText = async (pageNum = 1) => {
    if (pageNum === 1) setLoading(true);
    else setIsLoadingMore(true);

    try {
      const resp = await GlobalApi.searchMovies(query, pageNum);
      const newResults = resp.data.results.filter((r) => r.poster_path);
      
      if (pageNum === 1) setResults(newResults);
      else setResults((prev) => [...prev, ...newResults]);
      
      setTotalPages(resp.data.total_pages);
      setPage(pageNum);
    } catch (err) {
      console.error("Search error:", err);
    }
    
    setLoading(false);
    setIsLoadingMore(false);
  };

  const handleGenreClick = async (genreId, pageNum = 1) => {
    if (pageNum === 1) {
      if (selectedGenreId === genreId) {
        setSelectedGenreId(null);
        setResults([]);
        setPage(1);
        setTotalPages(0);
        return;
      }
      setSelectedGenreId(genreId);
      setQuery(""); // Clear text search
      setLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const resp = await GlobalApi.getMovieByGenreId(genreId, pageNum);
      const newResults = resp.data.results.filter((r) => r.poster_path);

      if (pageNum === 1) setResults(newResults);
      else setResults((prev) => [...prev, ...newResults]);

      setTotalPages(resp.data.total_pages);
      setPage(pageNum);
    } catch (err) {
      console.error("Genre search error:", err);
    }
    setLoading(false);
    setIsLoadingMore(false);
  };

  const loadMore = () => {
    if (page < totalPages) {
      if (selectedGenreId) {
        handleGenreClick(selectedGenreId, page + 1);
      } else if (query.trim().length >= 2) {
        searchByText(page + 1);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#040714] px-5 md:px-16 py-8">
      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto mb-10">
        <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari film, serial, atau aktor..."
          className="w-full bg-[#0c111b] border border-gray-600 rounded-full py-4 pl-12 pr-12 text-white text-lg
            focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
            placeholder-gray-500 transition-all duration-300"
        />
        {query && (
          <HiXMark
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl cursor-pointer hover:text-white transition"
            onClick={() => setQuery("")}
          />
        )}
      </div>

      {/* Genre Pills */}
      <div className="flex gap-3 overflow-x-auto scrollbar-none pb-4 mb-8">
        {TMDB_GENRES.map((genre) => (
          <button
            key={genre.id}
            onClick={() => handleGenreClick(genre.id)}
            className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 font-medium select-none
              ${selectedGenreId === genre.id 
                ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
              }`}
          >
            <span>{genre.emoji}</span> {genre.name}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-10">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div>
          <p className="text-gray-400 text-sm mb-4">
            Ditemukan {results.length} hasil untuk "{query}"
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-5">
            {results.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                onClick={() =>
                  navigate(
                    `/${item.media_type === "tv" ? "tv" : "movie"}/${item.id}`
                  )
                }
                className="cursor-pointer hover:scale-105 transition-all duration-300 group"
              >
                <img
                  src={IMAGE_BASE_URL + item.poster_path}
                  alt={item.title || item.name}
                  className="w-full rounded-lg border-2 border-transparent group-hover:border-gray-400 transition-all duration-300"
                />
                <p className="text-sm text-gray-300 mt-2 truncate group-hover:text-white transition">
                  {item.title || item.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-yellow-400">
                    ★ {item.vote_average?.toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-500 uppercase">
                    {item.media_type || "movie"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {page < totalPages && (
            <div className="flex justify-center mt-12 pb-4">
              <button
                onClick={loadMore}
                disabled={isLoadingMore}
                className={`bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium py-3 px-8 rounded-full shadow-lg transition-all flex items-center justify-center min-w-[200px] ${isLoadingMore ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105'}`}
              >
                {isLoadingMore ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Muat Lebih Banyak"
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && (query.length >= 2 || selectedGenreId) && results.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">
            Tidak ada hasil ditemukan.
          </p>
        </div>
      )}

      {/* Initial State */}
      {!loading && query.length < 2 && !selectedGenreId && (
        <div className="text-center py-20">
          <HiMagnifyingGlass className="text-6xl text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            Ketik minimal 2 karakter atau pilih genre untuk mencari
          </p>
        </div>
      )}
    </div>
  );
}

export default Search;
