import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import GlobalApi from "../Services/GlobalApi";
import IMAGE_BASE_URL from "../Constant";
import { HiChevronLeft, HiChevronRight, HiPlayCircle, HiStar } from "react-icons/hi2";

function Slider() {
  const [movieList, setMovieList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const autoPlayRef = useRef(null);

  useEffect(() => {
    getTrendingMovies();
  }, []);

  // Auto-play slider
  useEffect(() => {
    if (movieList.length === 0) return;
    autoPlayRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % Math.min(movieList.length, 8));
    }, 5000);
    return () => clearInterval(autoPlayRef.current);
  }, [movieList]);

  const getTrendingMovies = () => {
    GlobalApi.getTrendingMovies.then((resp) => {
      setMovieList(resp.data.results.slice(0, 8));
    });
  };

  const goToSlide = useCallback((index) => {
    setActiveIndex(index);
    // Reset auto-play timer
    clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % Math.min(movieList.length, 8));
    }, 5000);
  }, [movieList.length]);

  const goNext = () => {
    goToSlide((activeIndex + 1) % movieList.length);
  };

  const goPrev = () => {
    goToSlide((activeIndex - 1 + movieList.length) % movieList.length);
  };

  if (movieList.length === 0) {
    return (
      <div className="w-full h-[250px] md:h-[450px] bg-[#0a0a2e] animate-pulse rounded-xl mx-auto mt-2" />
    );
  }

  const currentMovie = movieList[activeIndex];

  return (
    <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[85vh] overflow-hidden group">
      {/* Background Image with smooth transition */}
      {movieList.map((item, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={IMAGE_BASE_URL + item.backdrop_path}
            alt={item.title || item.name}
            className="w-full h-full object-cover object-center"
          />
        </div>
      ))}

      {/* Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#040714] via-[#040714]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#040714]/80 via-transparent to-transparent h-32 md:h-40" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#040714]/80 via-transparent to-transparent" />

      {/* Movie Info */}
      <div className="absolute bottom-8 md:bottom-12 left-6 md:left-16 right-6 md:right-1/3 z-10">
        <h2
          className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-2 md:mb-3 line-clamp-2 drop-shadow-lg cursor-pointer hover:text-blue-300 transition-colors"
          onClick={() => navigate(`/${currentMovie.media_type === "tv" ? "tv" : "movie"}/${currentMovie.id}`)}
        >
          {currentMovie.title || currentMovie.name}
        </h2>

        {/* Rating & Release */}
        <div className="flex items-center gap-3 mb-3 md:mb-4">
          <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-2.5 py-1 rounded-full text-xs md:text-sm font-semibold backdrop-blur-sm">
            <HiStar className="text-sm" />
            {currentMovie.vote_average?.toFixed(1)}
          </div>
          <span className="text-gray-300 text-xs md:text-sm">
            {currentMovie.release_date?.split("-")[0] || currentMovie.first_air_date?.split("-")[0]}
          </span>
          <span className="text-gray-500 text-xs md:text-sm hidden sm:inline">
            {currentMovie.media_type === "tv" ? "📺 Series" : "🎬 Movie"}
          </span>
        </div>

        {/* Overview */}
        <p className="text-gray-300 text-xs md:text-sm line-clamp-2 md:line-clamp-3 mb-4 md:mb-5 max-w-lg leading-relaxed hidden sm:block">
          {currentMovie.overview}
        </p>

        {/* CTA Button */}
        <button
          onClick={() => navigate(`/${currentMovie.media_type === "tv" ? "tv" : "movie"}/${currentMovie.id}`)}
          className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black px-5 md:px-7 py-2.5 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <HiPlayCircle className="text-xl md:text-2xl" />
          Lihat Detail
        </button>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goPrev}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
      >
        <HiChevronLeft className="text-xl md:text-2xl" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
      >
        <HiChevronRight className="text-xl md:text-2xl" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-3 md:bottom-5 right-6 md:right-16 z-10 flex items-center gap-2">
        {movieList.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "w-7 h-2.5 bg-white"
                : "w-2.5 h-2.5 bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;
