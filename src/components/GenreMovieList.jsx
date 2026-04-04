import React, { useEffect, useState } from "react";
import MovieList from "./MovieList";

function GenreMovieList() {
  const genreList = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 18, name: "Drama" },
    { id: 878, name: "Sci-Fi" },
    { id: 53, name: "Thriller" },
    { id: 10751, name: "Family" },
  ];

  return (
    <div className="mt-4">
      {genreList.map((item, index) => (
        <div key={item.id} className="mb-1">
          <h2 className="text-[20px] text-white font-bold px-5 md:px-16 mt-2">
            {item.name}
          </h2>
          <MovieList genreId={item.id} index_={index} />
        </div>
      ))}
    </div>
  );
}

export default GenreMovieList;
