import db from "../config/db";

export const findAllBarbers = (callback: (err: any, results?: any) => void) => {
  const sql = `
    SELECT
      id,
      name,
      bio,
      image_url,
      is_active,
      created_at
    FROM barber
  `;

  db.query(sql, callback);
};

export const findBarberById = (
  barberId: number,
  callback: (err: any, results?: any) => void,
) => {
  const sql = `
    SELECT
      id,
      name,
      bio,
      image_url,
      is_active
    FROM barber
    WHERE id = ?
  `;

  db.query(sql, [barberId], callback);
};
