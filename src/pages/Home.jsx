import React, { useState, useEffect } from "react";
import Slider from "../components/Slider";
import ProductionHouse from "../components/ProductionHouse";
import GenreMovieList from "../components/GenreMovieList";
import MovieList from "../components/MovieList";
import { useAuth } from "../components/AuthContext";
import { supabase } from "../Services/supabaseClient";

const TMDB_GENRES_MAP = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
};

function Home() {
  const { user } = useAuth();
  const [preferredGenres, setPreferredGenres] = useState([]);

  useEffect(() => {
    if (user) fetchPreferences();
  }, [user]);

  const fetchPreferences = async () => {
    const { data } = await supabase
      .from("user_preferences")
      .select("favorite_genres")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data && data.favorite_genres) {
      setPreferredGenres(data.favorite_genres);
    }
  };

  return (
    <div className="bg-[#040714] min-h-screen">
      <Slider />
      <ProductionHouse />

      {/* Rekomendasi Berdasarkan Preferensi */}
      {preferredGenres.length > 0 && (
        <div className="mt-6 mb-6 pb-2">
          <h2 className="text-2xl md:text-3xl text-yellow-400 font-extrabold px-5 md:px-16 flex items-center gap-3">
            <span>✨</span> Rekomendasi Untukmu
          </h2>
          <p className="text-gray-400 text-sm px-5 md:px-16 mb-4">Disesuaikan dengan genre favoritmu</p>
          
          {preferredGenres.map((genreId, index) => (
            <div key={`pref-${genreId}`} className="mb-2">
              <h3 className="text-lg text-white font-bold px-5 md:px-16 mt-2 opacity-90 border-l-4 border-yellow-500 ml-5 md:ml-16 pl-3">
                Koleksi {TMDB_GENRES_MAP[genreId]}
              </h3>
              <MovieList genreId={genreId} index_={index} />
            </div>
          ))}
        </div>
      )}

      {/* General Genre List */}
      <h2 className="text-2xl md:text-3xl text-white font-bold px-5 md:px-16 mt-10 border-t border-white/10 pt-10">
        Jelajahi Semua
      </h2>
      <GenreMovieList />
    </div>
  );
}

export default Home;
