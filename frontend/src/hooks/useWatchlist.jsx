import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useWatchlist = () => {
  return useQuery({
    queryKey: ["watchlist"],
    queryFn: async () => {
      const res = await axios.get(`/api/v1/watchlist/movies`);
      return res.data.content;
    },
    retry: 2, // retry on failure twice
  });
};
export default useWatchlist;
