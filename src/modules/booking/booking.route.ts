import { Router } from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth";

const router = Router();
router.post("/bookings", auth("admin", "customer"), bookingController.createBookings);
router.get(
  "/bookings",
  auth("admin", "customer"),
  bookingController.getBookings
);
router.put(
  "/bookings/:id",
  auth("admin", "customer"),
  bookingController.updateVehicles
);

export const bookingRoute = router;
