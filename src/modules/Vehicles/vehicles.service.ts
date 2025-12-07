import { pool } from "../../config/db";

const createVehicles = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  const result = await pool.query(
    `INSERT INTO Vehicles( vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );
  return result;
};
const getVehicles = async () => {
  const result = await pool.query(`SELECT * FROM Vehicles`);
  return result;
};
const getSingleVehicles = async (id: string) => {
  const result = await pool.query(`SELECT * FROM Vehicles WHERE id = $1`, [id]);
  return result;
};
const updateVehicles = async (payload: Record<string, unknown>, id: string) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  const result = await pool.query(
    `UPDATE Vehicles SET vehicle_name=$1  ,type=$2 ,registration_number=$3,daily_rent_price=$4,availability_status=$5 WHERE id=$6 RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      id,
    ]
  );
  return result;
};
const deleteVehicles = async (id: string) => {
  const checking = await pool.query(`SELECT * FROM Vehicles WHERE id = $1`, [
    id,
  ]);
  if (checking.rows[0].availability_status === "booked") {
    throw new Error("Cannot delete a booked vehicle");
  }
  const result = await pool.query(`DELETE FROM Vehicles WHERE id=$1`, [id]);
  return result;
};
export const vehiclesServices = {
  createVehicles,
  getVehicles,
  getSingleVehicles,
  updateVehicles,
  deleteVehicles,
};
