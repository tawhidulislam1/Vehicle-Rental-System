import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
  connectionString: `${config.connection_str}`,
});

const initDB = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS Users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE CHECK (email = LOWER(email)),
        password VARCHAR(255) NOT NULL CHECK (length(password) >= 6),
        phone VARCHAR(20) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'customer'))
        );
        `);
  await pool.query(`
              CREATE TABLE IF NOT EXISTS Vehicles(
              id SERIAL PRIMARY KEY,
              vehicle_name VARCHAR(200) NOT NULL,
             type VARCHAR(20) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
              registration_number VARCHAR(255) NOT NULL UNIQUE,
              daily_rent_price NUMERIC NOT NULL CHECK (daily_rent_price > 0),
              availability_status VARCHAR(20) NOT NULL CHECK (availability_status IN ('available', 'booked')) 

              );
          `);
  await pool.query(`
            
              CREATE TABLE IF NOT EXISTS Bookings(
              
              id SERIAL PRIMARY KEY,
              customer_id INT REFERENCES Users(id) ON DELETE CASCADE,
              vehicle_id INT REFERENCES Vehicles(id) ON DELETE CASCADE,
              rent_start_date DATE NOT NULL,
              rent_end_date DATE NOT NULL,
              total_price NUMERIC NOT NULL CHECK (total_price >= 0),
              status VARCHAR(20) NOT NULL  DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'returned'))
              );
          `);
};

export default initDB;
