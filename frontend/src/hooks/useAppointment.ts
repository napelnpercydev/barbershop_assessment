import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createAppointment,
  checkAvailability,
  type AvailabilityParams,
} from "../services/appointmentService";

export const useCreateAppointment = () => {
  return useMutation({
    mutationFn: createAppointment,
  });
};

export const useCheckAvailability = ({
  barberId,
  serviceId,
  date,
}: AvailabilityParams) => {
  return useQuery({
    queryKey: ["availability", barberId, serviceId, date],
    queryFn: () => checkAvailability({ barberId, serviceId, date }),

    // Only fetch once all required values are selected.
    enabled: barberId > 0 && serviceId > 0 && !!date,

    // Availability changes frequently.
    staleTime: 0,

    // Refetch when the user returns to the page.
    refetchOnWindowFocus: true,

    retry: 1,
  });
};
