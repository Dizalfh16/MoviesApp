import React from "react";
import Slider from "../components/Slider";
import ProductionHouse from "../components/ProductionHouse";
import GenreMovieList from "../components/GenreMovieList";

function Home() {
  return (
    <div>
      <Slider />
      <ProductionHouse />
      <GenreMovieList />
    </div>
  );
}

export default Home;
