import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";
import config from "../../config";
const createUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, role, phone } = payload;
  const hashedPass = await bcrypt.hash(password as string, 10);
  const result = await pool.query(
    `INSERT INTO Users(name, email, password ,role , phone) VALUES($1, $2 , $3 , $4 , $5) RETURNING *`,
    [name, email, hashedPass, role, phone]
  );

  delete result.rows[0].password;

  return result;
};
const loginUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * From Users WHERE email =$1`, [
    email,
  ]);
  if (result.rows.length === 0) {
    return { success: false, message: "User not found" };
  }
  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return false;
  }
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    config.jwtSecret as string,
    { expiresIn: "5d" }
  );
  delete result.rows[0].password;
  
  return { user, token };
};

export const authServices = {
  createUser,
  loginUser,
};
