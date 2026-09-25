import { findAllBarbers } from "../models/barberModel";

export const getAllBarbers = (callback: (err: any, results?: any) => void) => {
  findAllBarbers(callback);
};
