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

  const slideRight = (offset) => {
    elementRef.current.scrollLeft += offset;
  };

  const slideLeft = (offset) => {
    elementRef.current.scrollLeft -= offset;
  };

  return (
    <div className="relative">
      <HiChevronLeft
        className="hidden md:block text-white text-[30px] absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer z-10 bg-black/60 rounded-full p-1 hover:bg-black/90 transition-all"
        onClick={() => slideLeft(300)}
      />

      <div
        ref={elementRef}
        className="flex overflow-x-auto gap-3 scrollbar-none scroll-smooth pt-4 px-3 md:px-8 pb-4"
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
            } rounded-lg hover:border-[3px] border-gray-300
              cursor-pointer hover:scale-110
              transition-all duration-300 ease-in-out`}
          />
        ))}
      </div>

      <HiChevronRight
        className="hidden md:block text-white text-[30px] absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer z-10 bg-black/60 rounded-full p-1 hover:bg-black/90 transition-all"
        onClick={() => slideRight(300)}
      />
    </div>
  );
}

export default MovieList;
