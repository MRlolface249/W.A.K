import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../Hooks/useAuthContext";
import { useFavourites } from "../../Hooks/useFavourites";
import { useRating } from "../../Hooks/useRating";
import { apiKey } from "../../../env";
import axios from "axios";
import MovieCard from "../MovieCard";
import { Grid } from "@mui/material";

interface Movie {
  id: number;
  vote_average: number;
  poster_path: string;
  title: string;
  release_date: string;
}

const FavouritesList: React.FC = () => {
  const { user } = useAuthContext();
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [moviesData, setMoviesData] = useState<any[]>([]);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_API_URL}/${user.username}/favorites`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const movieDetailsPromises = response.data.map((movieId: number) =>
          fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`
          ).then((response) => response.json())
        );

        const movieDetails = await Promise.all(movieDetailsPromises);
        setMoviesData(movieDetails);
        setIsPending(false);
      } catch (err: any) {
        setIsPending(false);
        setError(err.message);
      }
    };

    fetchFavourites();
  }, []);

  return (
    <div className="favourites-page">
      <Grid container spacing={1} sx={{ marginRight: "-8px!important" }}>
        {error && <div>{error}</div>}
        {isPending && <div>Loading...</div>}
        {moviesData &&
          moviesData.map((movie: Movie, index: number) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <MovieCard movie={movie} />
            </Grid>
          ))}
      </Grid>
    </div>
  );
};

export default FavouritesList;
