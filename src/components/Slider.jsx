import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalApi from "../Services/GlobalApi";
import IMAGE_BASE_URL from "../Constant";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

function Slider() {
  const [movieList, setMovieList] = useState([]);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getTrendingMovies();
  }, []);

  const getTrendingMovies = () => {
    GlobalApi.getTrendingMovies.then((resp) => {
      setMovieList(resp.data.results);
    });
  };

  const slideRight = (offset) => {
    sliderRef.current.scrollLeft += offset;
  };

  const slideLeft = (offset) => {
    sliderRef.current.scrollLeft -= offset;
  };

  return (
    <div className="relative">
      {/* Left Arrow */}
      <HiChevronLeft
        className="hidden md:block text-white text-[30px] absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer z-10 bg-black/50 rounded-full p-1 hover:bg-black/80 transition-all duration-300"
        onClick={() => slideLeft(500)}
      />

      {/* Slider Container */}
      <div
        ref={sliderRef}
        className="flex overflow-x-auto w-full px-8 md:px-16 py-4 scrollbar-none scroll-smooth gap-5"
      >
        {movieList.map((item, index) => (
          <img
            key={index}
            src={IMAGE_BASE_URL + item.backdrop_path}
            alt={item.title || item.name}
            onClick={() => navigate(`/movie/${item.id}`)}
            className="min-w-[90%] md:min-w-[80%] rounded-lg cursor-pointer
              hover:border-[3px] border-gray-400
              transition-all duration-300 hover:scale-[1.02]
              shadow-[0_0_30px_rgba(0,0,0,0.8)]"
          />
        ))}
      </div>

      {/* Right Arrow */}
      <HiChevronRight
        className="hidden md:block text-white text-[30px] absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer z-10 bg-black/50 rounded-full p-1 hover:bg-black/80 transition-all duration-300"
        onClick={() => slideRight(500)}
      />
    </div>
  );
}

export default Slider;
