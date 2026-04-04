import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GlobalApi from "../Services/GlobalApi";
import IMAGE_BASE_URL from "../Constant";
import { HiArrowLeft, HiPlay, HiPlus, HiStar } from "react-icons/hi2";

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMovieData();
  }, [id]);

  const fetchMovieData = async () => {
    setLoading(true);
    try {
      const [detailRes, creditsRes, similarRes, videosRes] = await Promise.all([
        GlobalApi.getMovieDetails(id),
        GlobalApi.getMovieCredits(id),
        GlobalApi.getSimilarMovies(id),
        GlobalApi.getMovieVideos(id),
      ]);
      setMovie(detailRes.data);
      setCredits(creditsRes.data);
      setSimilarMovies(similarRes.data.results.slice(0, 12));

      const trailerVideo = videosRes.data.results.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );
      setTrailer(trailerVideo || videosRes.data.results[0]);
    } catch (err) {
      console.error("Error fetching movie:", err);
    }
    setLoading(false);
  };

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
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040714] via-[#040714]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040714]/80 to-transparent" />

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-black/50 rounded-full hover:bg-black/80 transition-all duration-300 backdrop-blur-sm"
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
              {movie.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300 mb-4">
              <span className="flex items-center gap-1 text-yellow-400">
                <HiStar className="text-lg" />
                {movie.vote_average?.toFixed(1)}
              </span>
              <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
              <span>{movie.release_date?.split("-")[0]}</span>
              <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
              <span>{movie.runtime} min</span>
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
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all duration-300 hover:scale-105"
                >
                  <HiPlay className="text-xl" />
                  Tonton Trailer
                </a>
              )}
              <button className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/30 rounded-lg hover:bg-white/20 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                <HiPlus className="text-xl" />
                Watchlist
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
                  onClick={() => navigate(`/movie/${item.id}`)}
                  className="shrink-0 cursor-pointer hover:scale-105 transition-all duration-300"
                >
                  <img
                    src={
                      item.poster_path
                        ? IMAGE_BASE_URL + item.poster_path
                        : ""
                    }
                    alt={item.title}
                    className="w-[130px] md:w-[180px] rounded-lg border-2 border-transparent hover:border-gray-400 transition-all duration-300"
                  />
                  <p className="text-sm mt-2 text-gray-300 w-[130px] md:w-[180px] truncate">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieDetail;
