import { useQuery } from "@tanstack/react-query";
import { getAllBarbers } from "../services/barberService";

export const useGetAllBarbers = () => {
  return useQuery({
    queryKey: ["barbers"],
    queryFn: getAllBarbers,
    staleTime: 1000 * 60 * 5,
  });
};
