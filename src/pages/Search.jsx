import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GlobalApi from "../Services/GlobalApi";
import IMAGE_BASE_URL from "../Constant";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      searchMovies();
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const searchMovies = async () => {
    setLoading(true);
    try {
      const resp = await GlobalApi.searchMovies(query);
      setResults(resp.data.results.filter((r) => r.poster_path));
    } catch (err) {
      console.error("Search error:", err);
    }
    setLoading(false);
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
            {results.map((item) => (
              <div
                key={item.id}
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
                    {item.media_type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && query.length >= 2 && results.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">
            Tidak ada hasil untuk "{query}"
          </p>
        </div>
      )}

      {/* Initial State */}
      {!loading && query.length < 2 && (
        <div className="text-center py-20">
          <HiMagnifyingGlass className="text-6xl text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            Ketik minimal 2 karakter untuk mencari
          </p>
        </div>
      )}
    </div>
  );
}

export default Search;
