import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IMAGE_BASE_URL from "../Constant";
import { HiTrash } from "react-icons/hi2";
import { useAuth } from "../components/AuthContext";
import { supabase } from "../Services/supabaseClient";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    setIsLoading(true);
    if (!user) {
      setFavorites([]);
      setIsLoading(false);
      return;
    }
    const { data } = await supabase
      .from("favorites")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setFavorites(data);
    setIsLoading(false);
  };

  const removeFromFavorites = async (movieId) => {
    if (!user) return;
    const updated = favorites.filter((item) => item.movie_id !== movieId);
    setFavorites(updated);

    await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("movie_id", movieId);
  };

  return (
    <div className="min-h-screen bg-[#040714] px-5 md:px-16 py-8">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10 w-fit"
        >
          <span className="text-xl">←</span> Kembali
        </button>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="text-pink-500 text-3xl">❤️</span> Film Favorit Saya
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-white/5 rounded-lg border border-white/5 animate-pulse backdrop-blur-sm"></div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">💔</p>
          <p className="text-gray-400 text-lg mb-2">
            Belum ada film di daftar favorit Anda
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Tambahkan film dari halaman detail dengan menekan ikon hati.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-pink-600 rounded-lg hover:bg-pink-700 transition text-white font-medium shadow-lg shadow-pink-500/30"
          >
            Cari Film Favorit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-5">
          {favorites.map((item) => (
            <div key={item.id} className="relative group">
              <div
                onClick={() => navigate(`/movie/${item.movie_id}`)}
                className="cursor-pointer hover:scale-105 transition-all duration-300"
              >
                <img
                  src={IMAGE_BASE_URL + item.poster_path}
                  alt={item.title}
                  className="w-full aspect-[2/3] object-cover rounded-lg border-2 border-transparent group-hover:border-pink-500 transition-all duration-300 shadow-md"
                />
                <p className="text-sm text-gray-300 mt-2 truncate group-hover:text-white transition">
                  {item.title || item.name}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromFavorites(item.movie_id);
                }}
                className="absolute top-2 right-2 bg-red-600/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 z-10"
                title="Hapus dari favorit"
              >
                <HiTrash className="text-white text-sm" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
