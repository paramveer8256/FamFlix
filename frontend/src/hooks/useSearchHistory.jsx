import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchSearchHistory = async () => {
  const res = await axios.get(`/api/v1/search/history`);
  return res.data.content;
};

const useSearchHistory = () => {
  return useQuery({
    queryKey: ["search-history"],
    queryFn: fetchSearchHistory,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
    retry: 2,
  });
};

export default useSearchHistory;
