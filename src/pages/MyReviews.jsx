import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IMAGE_BASE_URL from "../Constant";
import { HiStar, HiTrash } from "react-icons/hi2";
import { useAuth } from "../components/AuthContext";
import { supabase } from "../Services/supabaseClient";

function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, [user]);

  const fetchReviews = async () => {
    setIsLoading(true);
    if (!user) {
      setReviews([]);
      setIsLoading(false);
      return;
    }
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) setReviews(data);
    setIsLoading(false);
  };

  const deleteReview = async (id) => {
    if (!user) return;
    const updated = reviews.filter((item) => item.id !== id);
    setReviews(updated);
    await supabase.from("reviews").delete().eq("id", id);
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
        <span className="text-yellow-400 text-3xl">⭐</span> Ulasan Saya
      </h1>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-white/5 rounded-xl border border-white/5 animate-pulse backdrop-blur-sm" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">💬</p>
          <p className="text-gray-400 text-lg mb-2">Belum ada ulasan yang Anda tulis.</p>
          <p className="text-gray-500 text-sm mb-6">Tonton film dan berikan bintang serta pendapat Anda!</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-yellow-600 rounded-lg hover:bg-yellow-700 transition text-white font-medium shadow-lg shadow-yellow-500/30"
          >
            Mulai Nilai Film
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors relative group">
              <img
                onClick={() => navigate(`/movie/${review.movie_id}`)}
                src={IMAGE_BASE_URL + review.poster_path}
                alt={review.movie_title}
                className="w-20 md:w-24 aspect-[2/3] object-cover rounded-md cursor-pointer hover:scale-105 transition-transform shadow-md"
              />
              <div className="flex-1">
                <h2 
                  onClick={() => navigate(`/movie/${review.movie_id}`)}
                  className="text-lg md:text-xl font-bold text-white cursor-pointer hover:text-blue-400 transition-colors"
                >
                  {review.movie_title}
                </h2>
                <div className="flex items-center gap-1 my-1">
                  {[...Array(5)].map((_, i) => (
                    <HiStar key={i} className={`text-sm ${i < review.rating ? "text-yellow-400" : "text-gray-600"}`} />
                  ))}
                </div>
                <p className="text-gray-300 text-sm md:text-base mt-2 whitespace-pre-wrap line-clamp-3 italic">
                  "{review.review_text}"
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  {new Date(review.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric'})}
                </p>
              </div>
              <button
                onClick={() => deleteReview(review.id)}
                className="absolute top-4 right-4 bg-red-600/80 p-2 rounded-full opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-red-600"
                title="Hapus Ulasan"
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

export default MyReviews;
