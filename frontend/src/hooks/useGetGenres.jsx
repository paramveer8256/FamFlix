import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGetGenres = (contentType) => {
  return useQuery({
    queryKey: ["genres", contentType],
    queryFn: async () => {
      const res = await axios.get(`/api/v1/${contentType}/genre`);
      return res.data.genres;
    },
    enabled: !!contentType, // only fetch when contentType is provided
    staleTime: 1000 * 60 * 10, // 10 min cache
    retry: 2, // retry on failure twice
  });
};
export default useGetGenres;
