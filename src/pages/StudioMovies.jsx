import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GlobalApi from "../Services/GlobalApi";
import IMAGE_BASE_URL from "../Constant";
import { HiChevronLeft } from "react-icons/hi2";

function StudioMovies() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Map of studio info based on ID
  const studioInfo = {
    2: { name: "Disney", bgGradient: "from-blue-900/40" },
    3: { name: "Pixar", bgGradient: "from-teal-900/40" },
    420: { name: "Marvel", bgGradient: "from-red-900/40" },
    1: { name: "Star Wars", bgGradient: "from-amber-900/40" },
    7521: { name: "National Geographic", bgGradient: "from-yellow-900/40" },
  };

  const currentStudio = studioInfo[id] || { name: "Studio", bgGradient: "from-gray-900/40" };

  useEffect(() => {
    getStudioMovies();
  }, [id]);

  const getStudioMovies = () => {
    setLoading(true);
    GlobalApi.getMoviesByCompany(id).then((resp) => {
      setMovieList(resp.data.results);
      setLoading(false);
    });
  };

  return (
    <div className="min-h-screen bg-[#040714] pb-8">
      {/* Dynamic Header Banner */}
      <div className={`w-full h-[200px] md:h-[300px] bg-gradient-to-b ${currentStudio.bgGradient} to-[#040714] relative flex items-end px-5 md:px-16 pb-8`}>
        <div className="absolute top-6 left-5 md:hidden" onClick={() => navigate(-1)}>
            <HiChevronLeft className="text-white text-3xl cursor-pointer bg-black/40 rounded-full p-1 backdrop-blur-sm border border-white/10" />
        </div>
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10"
          >
            <HiChevronLeft className="text-xl" /> Kembali
          </button>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-widest drop-shadow-lg">
            {currentStudio.name.toUpperCase()}
          </h1>
          <p className="text-gray-300 mt-2 text-sm md:text-base">Koleksi film dari {currentStudio.name}</p>
        </div>
      </div>

      <div className="px-5 md:px-16 mt-4">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <div key={item} className="h-[250px] md:h-[350px] bg-white/5 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {movieList.map((movie) => (
              <div 
                key={movie.id}
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="hover:scale-105 transition-all duration-300 cursor-pointer group"
              >
                <img 
                  src={IMAGE_BASE_URL + movie.poster_path} 
                  alt={movie.title}
                  className="rounded-lg shadow-lg border-[2px] border-transparent group-hover:border-white w-full h-[250px] md:h-[350px] object-cover"
                />
                <h2 className="text-white mt-2 text-sm md:text-base font-semibold truncate group-hover:text-blue-400 transition-colors">
                  {movie.title || movie.name}
                </h2>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-gray-400 text-xs">
                    {movie.release_date?.split("-")[0] || movie.first_air_date?.split("-")[0]}
                  </p>
                  <p className="text-yellow-400 text-xs font-semibold flex items-center gap-1">
                    ★ {movie.vote_average?.toFixed(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudioMovies;
