import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IMAGE_BASE_URL from "../Constant";
import { HiTrash } from "react-icons/hi2";
import { useAuth } from "../components/AuthContext";
import { supabase } from "../Services/supabaseClient";

function WatchList() {
  const [watchlist, setWatchlist] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchWatchlist();
  }, [user]);

  const fetchWatchlist = async () => {
    if (!user) {
      setWatchlist([]);
      return;
    }
    const { data } = await supabase
      .from("watchlist")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setWatchlist(data);
  };

  const removeFromWatchlist = async (movieId) => {
    if (!user) return;
    const updated = watchlist.filter((item) => item.movie_id !== movieId);
    setWatchlist(updated);

    await supabase
      .from("watchlist")
      .delete()
      .eq("user_id", user.id)
      .eq("movie_id", movieId);
  };

  return (
    <div className="min-h-screen bg-[#040714] px-5 md:px-16 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
        ➕ Watch List Saya
      </h1>

      {watchlist.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🎬</p>
          <p className="text-gray-400 text-lg mb-2">
            Watch List Anda masih kosong
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Tambahkan film dari halaman detail dengan menekan tombol "Watchlist"
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition text-white font-medium"
          >
            Jelajahi Film
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-5">
          {watchlist.map((item) => (
            <div key={item.id} className="relative group">
              <div
                onClick={() => navigate(`/movie/${item.movie_id}`)}
                className="cursor-pointer hover:scale-105 transition-all duration-300"
              >
                <img
                  src={IMAGE_BASE_URL + item.poster_path}
                  alt={item.title}
                  className="w-full rounded-lg border-2 border-transparent group-hover:border-gray-400 transition-all duration-300"
                />
                <p className="text-sm text-gray-300 mt-2 truncate group-hover:text-white transition">
                  {item.title || item.name}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromWatchlist(item.movie_id);
                }}
                className="absolute top-2 right-2 bg-red-600/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600"
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

export default WatchList;
