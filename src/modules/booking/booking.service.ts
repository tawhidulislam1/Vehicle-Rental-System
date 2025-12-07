import { pool } from "../../config/db";
interface BookingPayload {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
  total_price: number;
  status?: string;
}
const createBookings = async (payload: BookingPayload) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
  const vehicleInfo = await pool.query(`SELECT * FROM Vehicles WHERE id= $1`, [
    vehicle_id,
  ]);
  const today = new Date().toISOString().split("T")[0];

  if (!vehicleInfo || !vehicleInfo.rows || vehicleInfo.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  if (vehicleInfo.rows[0].availability_status === "booked") {
    throw new Error("Vehicle is already booked");
  }

  if (rent_start_date < (today as string)) {
    throw new Error("Rent dates cannot be in the past");
  }
  if (rent_end_date < rent_start_date) {
    throw new Error("Rent end date cannot be before start date");
  }
  const dueDays =
    (new Date(rent_end_date).getTime() - new Date(rent_start_date).getTime()) /
    (1000 * 60 * 60 * 24);
  const dailyPrice = vehicleInfo.rows[0].daily_rent_price;

  // Total price
  const total_price = dailyPrice * dueDays;
  const vehicle = {
    vehicle_name: vehicleInfo.rows[0].vehicle_name,
    daily_rent_price: dailyPrice,
  };

  const insertedData = await pool.query(
    `INSERT INTO Bookings( customer_id, vehicle_id, rent_start_date, rent_end_date, total_price) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );
  await pool.query(
    `UPDATE Vehicles SET availability_status = 'booked' WHERE id = $1`,
    [vehicle_id]
  );
  const booking = insertedData.rows[0];
  booking.rent_start_date = rent_start_date;
  booking.rent_end_date = rent_end_date;

  const result = {
    ...booking,
    vehicle,
  };
  return result;
};

const getBookings = async (id: string, role: string) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    await pool.query(
      `
      UPDATE Bookings
      SET status = 'returned'
      WHERE rent_end_date < $1
      AND status NOT IN ('returned', 'cancelled')
    `,
      [today]
    );

    await pool.query(
      `
      UPDATE Vehicles v
      SET availability_status = 'available'
      WHERE v.id IN (
        SELECT b.vehicle_id 
        FROM Bookings b
        WHERE b.rent_end_date < $1
        AND b.status = 'returned'
      )
    `,
      [today]
    );

    if (role === "admin") {
      const result = await pool.query(`
      SELECT 
        b.*,
        json_build_object(
          'vehicle_name', v.vehicle_name,
          'daily_rent_price', v.daily_rent_price
        ) AS vehicle
      FROM Bookings b
      JOIN Vehicles v ON b.vehicle_id = v.id
    `);
      return result;
    } else {
      const result = await pool.query(
        `
      SELECT 
        b.*,
        json_build_object(
          'vehicle_name', v.vehicle_name,
          'daily_rent_price', v.daily_rent_price
        ) AS vehicle
      FROM Bookings b
      JOIN Vehicles v ON b.vehicle_id = v.id
        WHERE b.customer_id = $1
    `,
        [id]
      );
      return result;
    }
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

const updateBooking = async (
  status: string,
  bookingId: string,
  role: string,
  userId: string
): Promise<{ rows: any[] }> => {
  const bookingResult = await pool.query(
    `SELECT * FROM Bookings WHERE id = $1`,
    [bookingId]
  );
  const rentStartDate = new Date(bookingResult.rows[0].rent_start_date)
    .toISOString()
    .split("T")[0];

  const today = new Date().toISOString().split("T")[0];

  if (rentStartDate === today && status === "cancelled") {
    throw new Error("You cannot cancel a booking on the start date");
  }
  const booking = bookingResult.rows[0];
  if (!booking) {
    throw new Error("Booking not found");
  }

  if (role === "customer") {
    if (booking.customer_id !== Number(userId)) {
      throw new Error("You are not allowed to update this booking");
    }
    if (status !== "cancelled") {
      throw new Error("Customers can only cancel bookings");
    }

    const updated = await pool.query(
      `UPDATE Bookings SET status = $1 WHERE id = $2 RETURNING *`,
      [status, bookingId]
    );
    await pool.query(
      `UPDATE Vehicles SET availability_status = 'available' WHERE id = $1`,
      [booking.vehicle_id]
    );

    return updated;
  }

  if (role === "admin") {
    if (status !== "returned") {
      throw new Error("Admin can only mark bookings as returned");
    }

    const updated = await pool.query(
      `UPDATE Bookings SET status = $1 WHERE id = $2 RETURNING *`,
      [status, bookingId]
    );

    await pool.query(
      `UPDATE Vehicles SET availability_status = 'available' WHERE id = $1`,
      [booking.vehicle_id]
    );

    const bookingWithVehicle = {
      ...updated.rows[0],
      vehicle: { availability_status: "available" },
    };

    return { rows: [bookingWithVehicle] };
  }

  throw new Error("Invalid role or status");
};

export const bookingService = {
  createBookings,
  getBookings,
  updateBooking,
};
