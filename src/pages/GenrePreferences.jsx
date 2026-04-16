import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { supabase } from "../Services/supabaseClient";

const TMDB_GENRES = [
  { id: 28, name: "Action", emoji: "🔥" },
  { id: 12, name: "Adventure", emoji: "🗺️" },
  { id: 16, name: "Animation", emoji: "🎨" },
  { id: 35, name: "Comedy", emoji: "😂" },
  { id: 80, name: "Crime", emoji: "🕵️" },
  { id: 18, name: "Drama", emoji: "🎭" },
  { id: 10751, name: "Family", emoji: "👨‍👩‍👧" },
  { id: 14, name: "Fantasy", emoji: "✨" },
  { id: 27, name: "Horror", emoji: "👻" },
  { id: 10402, name: "Music", emoji: "🎵" },
  { id: 9648, name: "Mystery", emoji: "🔍" },
  { id: 10749, name: "Romance", emoji: "❤️" },
  { id: 878, name: "Sci-Fi", emoji: "🛸" },
  { id: 53, name: "Thriller", emoji: "🔪" },
  { id: 10752, name: "War", emoji: "⚔️" }
];

function GenrePreferences() {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchPreferences();
  }, [user]);

  const fetchPreferences = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("user_preferences")
      .select("favorite_genres")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data && data.favorite_genres) {
      setSelectedGenres(data.favorite_genres);
    }
    setIsLoading(false);
  };

  const toggleGenre = (id) => {
    if (selectedGenres.includes(id)) {
      setSelectedGenres(selectedGenres.filter((genreId) => genreId !== id));
    } else {
      if (selectedGenres.length < 3) {
        setSelectedGenres([...selectedGenres, id]);
      } else {
        setShowErrorPopup("Kamu hanya bisa memilih maksimal 3 genre favorit.");
      }
    }
  };

  const savePreferences = async () => {
    setIsSaving(true);
    // Hapus setting lama (atau upsert)
    await supabase.from("user_preferences").delete().eq("user_id", user.id);
    
    // Insert baru
    const { error } = await supabase.from("user_preferences").insert({
      user_id: user.id,
      favorite_genres: selectedGenres
    });

    setIsSaving(false);
    if (!error) {
      setShowSuccessPopup(true);
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } else {
      setShowErrorPopup("Gagal menyimpan: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#040714] px-5 md:px-16 py-8 relative">
      {/* Custom Alert Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-[#111827] border border-blue-500 p-8 rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.4)] max-w-xs w-full mx-5 text-center transform scale-105 transition-transform duration-300">
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-blue-500/30">
              <span className="text-4xl">✅</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-2">Mantap!</h2>
            <p className="text-gray-400 mb-4 text-sm">Preferensi genremu telah berhasil dikunci. Menyiapkan beranda barumu...</p>
            <div className="flex justify-center mt-2">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Error Popup */}
      {showErrorPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-[#111827] border border-red-500/50 p-6 rounded-2xl shadow-[0_0_40px_rgba(239,68,68,0.3)] max-w-xs w-full mx-5 text-center transform scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-500/30">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Peringatan</h2>
            <p className="text-gray-400 mb-6 text-sm">{showErrorPopup}</p>
            <button 
              onClick={() => setShowErrorPopup("")}
              className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 font-bold transition shadow-lg"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10 w-fit"
        >
          <span className="text-xl">←</span> Kembali
        </button>
      </div>

      <div className="max-w-4xl mx-auto mt-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <span className="text-blue-500">🎭</span> Preferensi Genre
        </h1>
        <p className="text-gray-400 mb-8">
          Pilih hingga 3 genre yang paling kamu sukai. Ini akan membantu kami memberikan rekomendasi yang lebih baik di Beranda!
        </p>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-10">
              {TMDB_GENRES.map((genre) => {
                const isSelected = selectedGenres.includes(genre.id);
                return (
                  <div
                    key={genre.id}
                    onClick={() => toggleGenre(genre.id)}
                    className={`cursor-pointer flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 border-2 select-none
                      ${isSelected 
                        ? "bg-blue-600/20 border-blue-500 scale-105 shadow-[0_0_15px_rgba(59,130,246,0.3)]" 
                        : "bg-white/5 border-transparent hover:bg-white/10 hover:scale-105"
                      }`}
                  >
                    <span className="text-4xl mb-3">{genre.emoji}</span>
                    <span className={`font-semibold ${isSelected ? "text-white" : "text-gray-300"}`}>
                      {genre.name}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end border-t border-white/10 pt-6">
              <div className="flex items-center gap-4">
                <span className="text-gray-400">
                  Terpilih: <span className="text-white font-bold">{selectedGenres.length}</span>/3
                </span>
                <button
                  onClick={savePreferences}
                  disabled={isSaving || selectedGenres.length === 0}
                  className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg
                    ${isSaving || selectedGenres.length === 0 
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
                      : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/30"
                    }`}
                >
                  {isSaving ? "Menyimpan..." : "Simpan Preferensi"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default GenrePreferences;
