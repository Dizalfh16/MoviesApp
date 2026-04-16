import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import Search from "./pages/Search";
import Movies from "./pages/Movies";
import Series from "./pages/Series";
import Originals from "./pages/Originals";
import WatchList from "./pages/WatchList";
import Profile from "./pages/Profile";
import StudioMovies from "./pages/StudioMovies";
import Login from "./pages/Login";
import Favorites from "./pages/Favorites";
import History from "./pages/History";
import MyReviews from "./pages/MyReviews";
import GenrePreferences from "./pages/GenrePreferences";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="pt-[72px] md:pt-[84px] flex-grow">
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
            <Route path="/login" element={<Login />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/history" element={<History />} />
            <Route path="/reviews" element={<MyReviews />} />
            <Route path="/preferences" element={<GenrePreferences />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
