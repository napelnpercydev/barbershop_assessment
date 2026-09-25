import { Request, Response } from "express";
import { getAllBarbers } from "../services/barberService";

export const getBarbers = (req: Request, res: Response) => {
  getAllBarbers((err, results) => {
    if (err) {
      console.error("Error fetching barbers:", err);

      return res.status(500).json({
        message: "Failed to fetch barbers",
      });
    }

    return res.status(200).json({ barbers: results });
  });
};
