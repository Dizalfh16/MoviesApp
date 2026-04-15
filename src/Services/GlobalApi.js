import axios from "axios";

const apiKey = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3OTA5MDQ1OGM0ZDE5ODI0Yzk2NDBmNmMwZjJhMGI4NSIsIm5iZiI6MTcyMzM5MTEzNi41MTQsInN1YiI6IjY2YjhkY2EwM2EwYzEwN2FjYTE3MTNiZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.D_o4tH90jTEtpmEqlz5joxcH4IszBpM_AYabjtPPcvU";

const movieBaseUrl = "https://api.themoviedb.org/3";
const movieByGenreBaseURL = `${movieBaseUrl}/discover/movie?api_key=`;

const api = axios.create({
  baseURL: movieBaseUrl,
  headers: {
    Authorization: `Bearer ${apiKey}`,
    accept: "application/json",
  },
});

const getTrendingMovies = api.get("/trending/all/day");
const getMovieByGenreId = (id) =>
  api.get(`/discover/movie`, { params: { with_genres: id } });

const getMovieDetails = (id) => api.get(`/movie/${id}`);
const getMovieCredits = (id) => api.get(`/movie/${id}/credits`);
const getSimilarMovies = (id) => api.get(`/movie/${id}/similar`);
const getMovieVideos = (id) => api.get(`/movie/${id}/videos`);

const searchMovies = (query) =>
  api.get(`/search/multi`, { params: { query } });
const getPopularMovies = (page = 1) =>
  api.get(`/movie/popular`, { params: { page } });
const getTvSeries = (page = 1) =>
  api.get(`/tv/popular`, { params: { page } });
const getTopRated = (page = 1) =>
  api.get(`/movie/top_rated`, { params: { page } });
const getMoviesByCompany = (companyId, page = 1) =>
  api.get(`/discover/movie`, { params: { with_companies: companyId, page } });

const getMovieReviews = (id) => api.get(`/movie/${id}/reviews`);

export default {
  getTrendingMovies,
  getMovieByGenreId,
  getMovieDetails,
  getMovieCredits,
  getSimilarMovies,
  getMovieVideos,
  getMovieReviews,
  searchMovies,
  getPopularMovies,
  getTvSeries,
  getTopRated,
  getMoviesByCompany,
};

