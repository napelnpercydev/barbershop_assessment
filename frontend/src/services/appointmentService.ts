import api from "./api";

export interface CreateAppointmentData {
  barberId: number;
  serviceId: number;
  appointmentDate: string;
  startTime: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

export const createAppointment = async (data: CreateAppointmentData) => {
  const response = await api.post("/appointments", data);
  return response.data;
};

export const test = async () => {
  const response = await api.get("/health");
  console.log(response.data);
  return response.data;
};

/*NEW */

export interface AvailabilityParams {
  barberId: number;
  serviceId: number;
  date: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface AvailabilityResponse {
  date: string;
  barberId: number;
  serviceId: number;
  slots: TimeSlot[];
}

export const checkAvailability = async (
  params: AvailabilityParams,
): Promise<AvailabilityResponse> => {
  const response = await api.get("/appointments/availability", { params });

  console.log("here bro damn", response.data);
  return response.data;
};
