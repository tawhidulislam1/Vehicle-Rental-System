import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

const getUser = async () => {
  const result = await pool.query(`SELECT * FROM Users`);
  return result;
};

const updateUser = async (
  name: string,
  email: string,
  phone: string,
  paramsId: string,
  role: string,
  userId: string,
  LoginUserRole: string
) => {
  if (LoginUserRole === "customer") {
    if (Number(userId) === Number(paramsId)) {
      const result = await pool.query(
        `UPDATE Users SET name=$1  ,email=$2 , phone=$3 WHERE id=$4 RETURNING *`,
        [name, email, phone, paramsId]
      );

      return result;
    } else {
      throw new Error("Unauthorized to update other users");
    }
  }
  if (LoginUserRole === "admin") {
    const result = await pool.query(
      `UPDATE Users SET name=$1  ,email=$2 , phone=$3 , role=$4 WHERE id=$5 RETURNING *`,
      [name, email, phone, role, paramsId]
    );

    return result;
  }
};
const deleteUser = async (id: string) => {
  const bookingInfo = await pool.query(
    `SELECT 1 FROM Bookings WHERE customer_id = $1 LIMIT 1`,
    [id]
  );
  if (bookingInfo.rows.length > 0) {
    throw new Error("Cannot delete user with existing bookings");
  }
  const result = await pool.query(`DELETE FROM Users WHERE id=$1`, [id]);
  return result;
};
export const userServices = {
  getUser,
  updateUser,
  deleteUser,
};
