import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalApi from "../Services/GlobalApi";
import IMAGE_BASE_URL from "../Constant";

function Originals() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOriginals();
  }, []);

  const fetchOriginals = async () => {
    try {
      const resp = await GlobalApi.getTopRated();
      setMovies(resp.data.results);
    } catch (err) {
      console.error("Error:", err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#040714] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040714] px-5 md:px-16 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
        ⭐ Originals — Film Terbaik
      </h1>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-5">
        {movies.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/movie/${item.id}`)}
            className="cursor-pointer hover:scale-105 transition-all duration-300 group"
          >
            <img
              src={IMAGE_BASE_URL + item.poster_path}
              alt={item.title}
              className="w-full rounded-lg border-2 border-transparent group-hover:border-gray-400 transition-all duration-300"
            />
            <p className="text-sm text-gray-300 mt-2 truncate group-hover:text-white transition">
              {item.title}
            </p>
            <span className="text-xs text-yellow-400">
              ★ {item.vote_average?.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Originals;
