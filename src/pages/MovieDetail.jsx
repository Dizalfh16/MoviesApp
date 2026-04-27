import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GlobalApi from "../Services/GlobalApi";
import IMAGE_BASE_URL from "../Constant";
import { HiArrowLeft, HiPlay, HiPlus, HiStar, HiCheck, HiHeart } from "react-icons/hi2";
import { useAuth } from "../components/AuthContext";
import { supabase } from "../Services/supabaseClient";
import Popup from "../components/Popup";
import TrailerModal from "../components/TrailerModal";

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [tmdbReviews, setTmdbReviews] = useState([]);
  const [myReviewText, setMyReviewText] = useState("");
  const [myRating, setMyRating] = useState(0);
  const { user } = useAuth();

  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const [popupData, setPopupData] = useState({ show: false, message: "", type: "success" });

  const showPopup = (msg, type = 'success') => {
    setPopupData({ show: true, message: msg, type });
    if (type === 'success') {
      setTimeout(() => setPopupData((prev) => ({ ...prev, show: false })), 2000);
    }
  };

  const closePopup = () => setPopupData((prev) => ({ ...prev, show: false }));

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMovieData();
  }, [id]);

  useEffect(() => {
    checkWatchlist();
    checkFavorite();
    fetchReviews();
  }, [id, user]);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("movie_id", parseInt(id))
      .order("created_at", { ascending: false });

    if (data) {
      setReviews(data);
      if (user) {
        const myExistingReview = data.find(r => r.user_id === user.id);
        if (myExistingReview) {
          setMyReviewText(myExistingReview.review_text);
          setMyRating(myExistingReview.rating);
        } else {
          setMyReviewText("");
          setMyRating(0);
        }
      }
    }
  };

  const submitReview = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (myRating === 0) {
      showPopup("Harap pilih bintang ulasan.", "error");
      return;
    }

    await supabase.from("reviews").delete().eq("user_id", user.id).eq("movie_id", parseInt(id));

    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      movie_id: parseInt(id),
      movie_title: movie.title || movie.name,
      poster_path: movie.poster_path,
      rating: myRating,
      review_text: myReviewText.trim()
    });

    if (error) {
      showPopup("Gagal mengirim ulasan: " + error.message, "error");
    } else {
      fetchReviews();
      showPopup("Ulasan berhasil tersimpan!", "success");
    }
  };

  const checkWatchlist = async () => {
    if (!user) {
      setIsInWatchlist(false);
      return;
    }
    const { data } = await supabase
      .from("watchlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("movie_id", parseInt(id))
      .maybeSingle();

    if (data) setIsInWatchlist(true);
    else setIsInWatchlist(false);
  };

  const checkFavorite = async () => {
    if (!user) {
      setIsFavorite(false);
      return;
    }
    // We try catching the error in case the table doesn't exist yet
    const { data, error } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("movie_id", parseInt(id))
      .maybeSingle();

    if (data) setIsFavorite(true);
    else setIsFavorite(false);
  };

  const toggleWatchlist = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    if (isInWatchlist) {
      setIsInWatchlist(false);
      await supabase
        .from("watchlist")
        .delete()
        .eq("user_id", user.id)
        .eq("movie_id", movie.id);
    } else {
      setIsInWatchlist(true);
      await supabase
        .from("watchlist")
        .insert({
          user_id: user.id,
          movie_id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
        });
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    if (isFavorite) {
      setIsFavorite(false);
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("movie_id", movie.id);
    } else {
      setIsFavorite(true);
      const { error } = await supabase
        .from("favorites")
        .insert({
          user_id: user.id,
          movie_id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
        });
      if (error) {
        console.error("Supabase Insert Error:", error);
        showPopup(`Gagal menambahkan ke favorit.\nError: ${error.message}\n\nHint: Cek pengaturan RLS (Row Level Security) di tabel Anda.`, "error");
        setIsFavorite(false);
      }
    }
  };

  const fetchMovieData = async () => {
    setLoading(true);
    try {
      const mediaType = window.location.pathname.startsWith('/tv') ? 'tv' : 'movie';
      const [detailRes, creditsRes, similarRes, videosRes, reviewsRes] = await Promise.all([
        GlobalApi.getMediaDetails(mediaType, id),
        GlobalApi.getMediaCredits(mediaType, id),
        GlobalApi.getMediaSimilar(mediaType, id),
        GlobalApi.getMediaVideos(mediaType, id),
        GlobalApi.getMediaReviews(mediaType, id),
      ]);
      setMovie(detailRes.data);
      setCredits(creditsRes.data);
      setSimilarMovies(similarRes.data.results.slice(0, 12));
      setTmdbReviews(reviewsRes.data.results.slice(0, 5)); // Ambil max 5 review TMDB

      const trailerVideo = videosRes.data.results.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );
      setTrailer(trailerVideo || videosRes.data.results[0]);
    } catch (err) {
      console.error("Error fetching movie:", err);
    }
    setLoading(false);
  };

  const recordHistory = async (movieData) => {
    if (!user || !movieData) return;

    try {
      // Hapus entri lama jika sudah ada (agar timestamp terupdate/film naik ke atas)
      await supabase
        .from("history")
        .delete()
        .eq("user_id", user.id)
        .eq("movie_id", movieData.id);

      // Masukkan ke riwayat
      await supabase.from("history").insert({
        user_id: user.id,
        movie_id: movieData.id,
        title: movieData.title || movieData.name,
        poster_path: movieData.poster_path,
      });
    } catch (e) {
      console.error("Error saving history", e);
    }
  };

  useEffect(() => {
    if (user && movie) {
      recordHistory(movie);
    }
  }, [user, movie]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#040714] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#040714] flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl mb-4">Film tidak ditemukan</h2>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          Kembali
        </button>
      </div>
    );
  }

  const cast = credits?.cast?.slice(0, 8) || [];
  const director = credits?.crew?.find((c) => c.job === "Director");
  const ratingPercent = Math.round((movie.vote_average / 10) * 100);

  return (
    <div className="min-h-screen bg-[#040714] text-white">
      {/* Hero Backdrop */}
      <div className="relative w-full h-[50vh] md:h-[70vh]">
        <img
          src={IMAGE_BASE_URL + movie.backdrop_path}
          alt={movie.title || movie.name}
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040714] via-[#040714]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#040714]/80 via-transparent to-transparent h-32 md:h-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040714]/80 to-transparent" />

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-20 md:top-24 left-6 md:left-16 z-20 flex items-center gap-2 px-4 py-2 bg-black/50 rounded-full hover:bg-black/80 transition-all duration-300 backdrop-blur-sm border border-white/10"
        >
          <HiArrowLeft className="text-lg" />
          <span className="text-sm font-medium">Kembali</span>
        </button>
      </div>

      {/* Movie Info */}
      <div className="relative -mt-[200px] md:-mt-[250px] z-10 px-6 md:px-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="hidden md:block shrink-0">
            <img
              src={IMAGE_BASE_URL + movie.poster_path}
              alt={movie.title}
              className="w-[250px] rounded-xl shadow-2xl shadow-black/60"
            />
          </div>

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-lg">
              {movie.title || movie.name}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300 mb-4">
              <span className="flex items-center gap-1 text-yellow-400">
                <HiStar className="text-lg" />
                {movie.vote_average?.toFixed(1)}
              </span>
              <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
              <span>{(movie.release_date || movie.first_air_date)?.split("-")[0]}</span>
              <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
              <span>{movie.runtime ? `${movie.runtime} min` : (movie.number_of_seasons ? `${movie.number_of_seasons} Seasons` : '')}</span>
              {movie.adult && (
                <>
                  <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                  <span className="px-2 py-0.5 bg-red-600/80 rounded text-xs font-bold">
                    18+
                  </span>
                </>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-5">
              {movie.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-medium backdrop-blur-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              {trailer && (
                <button
                  onClick={() => setIsTrailerOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all duration-300 hover:scale-105"
                >
                  <HiPlay className="text-xl" />
                  Tonton Trailer
                </button>
              )}
              <button
                onClick={toggleWatchlist}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm
                  ${isInWatchlist
                    ? "bg-green-600/30 border border-green-500/50 text-green-400"
                    : "bg-white/10 border border-white/30 hover:bg-white/20"
                  }`}
              >
                {isInWatchlist ? (
                  <><HiCheck className="text-xl" /> Ditambahkan</>
                ) : (
                  <><HiPlus className="text-xl" /> Watchlist</>
                )}
              </button>
              <button
                onClick={toggleFavorite}
                className={`flex items-center justify-center p-3 rounded-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm
                  ${isFavorite
                    ? "bg-pink-600/30 border border-pink-500/50 text-pink-400"
                    : "bg-white/10 border border-white/30 hover:bg-white/20 text-white"
                  }`}
                title={isFavorite ? "Hapus dari Favorit" : "Tambah ke Favorit"}
              >
                <HiHeart className="text-xl" />
              </button>
            </div>

            {/* Overview */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-200">
                Sinopsis
              </h3>
              <p className="text-gray-400 leading-relaxed max-w-3xl">
                {movie.overview || "Sinopsis belum tersedia."}
              </p>
            </div>

            {/* Director */}
            {director && (
              <p className="text-sm text-gray-400 mb-2">
                <span className="text-gray-300 font-medium">Sutradara:</span>{" "}
                {director.name}
              </p>
            )}

            {/* Rating Bar */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm text-gray-400">Rating Pengguna</span>
              <div className="w-[200px] h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${ratingPercent}%`,
                    background:
                      ratingPercent >= 70
                        ? "linear-gradient(90deg, #22c55e, #4ade80)"
                        : ratingPercent >= 50
                        ? "linear-gradient(90deg, #eab308, #facc15)"
                        : "linear-gradient(90deg, #ef4444, #f87171)",
                  }}
                />
              </div>
              <span className="text-sm font-bold text-white">
                {ratingPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Cast Section */}
        {cast.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-bold mb-4">Pemeran</h3>
            <div className="flex gap-4 overflow-x-auto scrollbar-none pb-4">
              {cast.map((person) => (
                <div
                  key={person.id}
                  className="shrink-0 w-[120px] text-center"
                >
                  {person.profile_path ? (
                    <img
                      src={IMAGE_BASE_URL + person.profile_path}
                      alt={person.name}
                      className="w-[100px] h-[100px] rounded-full object-cover mx-auto mb-2 border-2 border-gray-700 hover:border-blue-500 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-[100px] h-[100px] rounded-full bg-gray-700 mx-auto mb-2 flex items-center justify-center text-2xl text-gray-500">
                      🎭
                    </div>
                  )}
                  <p className="text-sm font-medium truncate">{person.name}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {person.character}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <div className="mt-10 pb-10">
            <h3 className="text-xl font-bold mb-4">Film Serupa</h3>
            <div className="flex gap-3 overflow-x-auto scrollbar-none pb-4">
              {similarMovies.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    const typePath = window.location.pathname.startsWith('/tv') ? 'tv' : 'movie';
                    navigate(`/${item.media_type || typePath}/${item.id}`);
                  }}
                  className="shrink-0 cursor-pointer hover:scale-105 transition-all duration-300"
                >
                  <img
                    src={
                      item.poster_path
                        ? IMAGE_BASE_URL + item.poster_path
                        : ""
                    }
                    alt={item.title || item.name}
                    className="w-[130px] md:w-[180px] rounded-lg border-2 border-transparent hover:border-gray-400 transition-all duration-300"
                  />
                  <p className="text-sm mt-2 text-gray-300 w-[130px] md:w-[180px] truncate">
                    {item.title || item.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Reviews Section */}
        <div className="mt-10 pb-16 border-t border-white/10 pt-10">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-yellow-400">⭐</span> Ulasan Penonton
          </h3>

          {/* Form Tulis Ulasan (Hanya untuk User Login) */}
          {user ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8 backdrop-blur-sm">
              <h4 className="text-lg font-semibold mb-3">Tulis Ulasanmu</h4>
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setMyRating(star)}
                    className="text-2xl focus:outline-none transition-transform hover:scale-110"
                  >
                    <HiStar className={star <= myRating ? "text-yellow-400" : "text-gray-600"} />
                  </button>
                ))}
                <span className="text-sm text-gray-400 ml-2">
                  {myRating > 0 ? `${myRating} dari 5 Bintang` : "Pilih bintang"}
                </span>
              </div>
              <textarea
                rows="3"
                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-colors resize-none mb-3"
                placeholder="Apa pendapatmu tentang film ini?"
                value={myReviewText}
                onChange={(e) => setMyReviewText(e.target.value)}
              />
              <button
                onClick={submitReview}
                className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors"
              >
                Kirim Ulasan
              </button>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8 text-center">
              <p className="text-gray-400 mb-3">Ingin memberikan pendapat tentang film ini?</p>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Login untuk Menulis Ulasan
              </button>
            </div>
          )}

          {/* Daftar Ulasan yang Sudah Ada */}
          <div className="space-y-4">
            {reviews.length === 0 && tmdbReviews.length === 0 ? (
              <p className="text-gray-500 text-center py-6">Belum ada ulasan untuk film ini. Jadilah yang pertama!</p>
            ) : (
              <>
                {/* Supabase Local Reviews */}
                {reviews.map((r) => (
                  <div key={r.id} className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                          User
                        </div>
                        <div>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <HiStar key={i} className={`text-sm ${i < r.rating ? "text-yellow-400" : "text-gray-600"}`} />
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {new Date(r.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric'})}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed mt-3">"{r.review_text}"</p>
                  </div>
                ))}

                {/* TMDB Reviews */}
                {tmdbReviews.map((r) => (
                  <div key={r.id} className="bg-black/30 p-4 rounded-xl border border-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        {r.author_details?.avatar_path ? (
                          <img 
                            src={r.author_details.avatar_path.startsWith('/') ? IMAGE_BASE_URL + r.author_details.avatar_path : r.author_details.avatar_path.substring(1)} 
                            alt={r.author} 
                            onError={(e) => { e.target.src = "https://via.placeholder.com/40x40?text=" + r.author.charAt(0) }}
                            className="w-10 h-10 rounded-full object-cover shadow-lg"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-tr from-gray-600 to-gray-800 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                            {r.author.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-300">{r.author}</span>
                            {r.author_details?.rating && (
                              <div className="flex items-center gap-1 mt-0.5">
                                <HiStar className="text-sm text-yellow-400" />
                                <span className="text-xs text-yellow-400">{r.author_details.rating}/10</span>
                                <span className="text-xs text-gray-500 ml-1">(TMDB)</span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {new Date(r.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric'})}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed mt-3 whitespace-pre-wrap line-clamp-4">
                      "{r.content}"
                    </p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      <Popup isVisible={popupData.show} message={popupData.message} type={popupData.type} onClose={closePopup} />
      <TrailerModal 
        isOpen={isTrailerOpen} 
        onClose={() => setIsTrailerOpen(false)} 
        trailerKey={trailer?.key} 
      />
    </div>
  );
}

export default MovieDetail;
