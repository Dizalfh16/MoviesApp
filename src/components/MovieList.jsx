import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalApi from "../Services/GlobalApi";
import IMAGE_BASE_URL from "../Constant";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

function MovieList({ genreId, index_ }) {
  const [movieList, setMovieList] = useState([]);
  const elementRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getMovieByGenreId();
  }, []);

  const getMovieByGenreId = () => {
    GlobalApi.getMovieByGenreId(genreId).then((resp) => {
      setMovieList(resp.data.results);
    });
  };

  const slideRight = () => {
    const el = elementRef.current;
    if (el) {
      const maxScroll = el.scrollWidth - el.clientWidth;
      // Define a dynamic scroll amount based on visible width
      const scrollAmount = window.innerWidth > 768 ? el.clientWidth * 0.8 : el.clientWidth * 0.9;
      
      if (el.scrollLeft >= maxScroll - 10) {
        // Loop back to start
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  const slideLeft = () => {
    const el = elementRef.current;
    if (el) {
      const scrollAmount = window.innerWidth > 768 ? el.clientWidth * 0.8 : el.clientWidth * 0.9;
      
      if (el.scrollLeft <= 10) {
        // Loop to end
        const maxScroll = el.scrollWidth - el.clientWidth;
        el.scrollTo({ left: maxScroll, behavior: "smooth" });
      } else {
        el.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="relative group">
      <HiChevronLeft
        className="hidden md:block text-white text-[40px] absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer z-10 bg-black/60 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 hover:bg-black/90 hover:scale-110 transition-all duration-300 shadow-xl border border-white/10"
        onClick={slideLeft}
      />

      <div
        ref={elementRef}
        className="flex overflow-x-auto gap-3 md:gap-5 scrollbar-none pt-4 px-3 md:px-8 pb-4"
      >
        {movieList.map((item, index) => (
          <img
            key={index}
            src={IMAGE_BASE_URL + (index_ % 3 === 0 ? item.backdrop_path : item.poster_path)}
            alt={item.title || item.name}
            onClick={() => navigate(`/movie/${item.id}`)}
            className={`${
              index_ % 3 === 0
                ? "min-w-[260px] md:min-w-[320px]"
                : "min-w-[110px] md:min-w-[180px]"
            } rounded-lg hover:border-[3px] border-white/50 hover:border-white
              cursor-pointer hover:scale-[1.05] md:hover:scale-[1.08] shadow-lg
              transition-transform duration-300 ease-out`}
          />
        ))}
      </div>

      <HiChevronRight
        className="hidden md:block text-white text-[40px] absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer z-10 bg-black/60 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 hover:bg-black/90 hover:scale-110 transition-all duration-300 shadow-xl border border-white/10"
        onClick={slideRight}
      />
    </div>
  );
}

export default MovieList;
