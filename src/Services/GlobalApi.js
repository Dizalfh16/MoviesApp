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

export default { getTrendingMovies, getMovieByGenreId };
