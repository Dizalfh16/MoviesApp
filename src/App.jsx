import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import Search from "./pages/Search";
import Movies from "./pages/Movies";
import Series from "./pages/Series";
import Originals from "./pages/Originals";
import WatchList from "./pages/WatchList";
import Profile from "./pages/Profile";
import StudioMovies from "./pages/StudioMovies";
function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="pt-[72px] md:pt-[84px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/series" element={<Series />} />
          <Route path="/originals" element={<Originals />} />
          <Route path="/watchlist" element={<WatchList />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/studio/:id" element={<StudioMovies />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
