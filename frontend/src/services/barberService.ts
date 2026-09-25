import api from "./api";

export interface Barber {
  id: number;
  name: string;
  bio: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export const getAllBarbers = async (): Promise<Barber[]> => {
  const response = await api.get("/barbers");
  console.log(response.data,"lol bro");
  return response.data.barbers;
};
