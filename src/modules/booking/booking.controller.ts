import { Request, Response } from "express";
import { bookingService } from "./booking.service";

const createBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.createBookings(req.body);

    res.send({
      success: true,
      message: "booking created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const { id, role } = req.user!;
    const result = await bookingService.getBookings(id, role);

    if (result.rowCount === 0) {
      res.status(200).json({
        success: true,
        message: "No bookings found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updateVehicles = async (req: Request, res: Response) => {
  const { id: bookingId } = req.params;
  const { status } = req.body;
  const { role, id: userId } = req.user!;
  try {
    const result = await bookingService.updateBooking(
      status,
      bookingId as string,
      role,
      userId
    );

    const message =
      role === "customer"
        ? "Booking cancelled successfully"
        : "Booking marked as returned. Vehicle is now available";
    if (result.rows.length === 0) {
      res.status(404).json({
        success: true,
        message: "booking not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: message,
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const bookingController = {
  createBookings,
  getBookings,
  updateVehicles,
};
