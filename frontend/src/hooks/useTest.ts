import { test } from "../services/appointmentService";
import { useQuery } from "@tanstack/react-query";

export function useTest() {
  return useQuery({
    queryKey: ["health"],
    queryFn: test,
  });
}
