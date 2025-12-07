import express, { Request, Response } from "express";
import initDB from "./config/db";
import { userRoutes } from "./modules/user/user.route";
import { authRouter } from "./modules/auth/auth.route";
import { vehiclesRoute } from "./modules/Vehicles/vehicles.route";
import { bookingRoute } from "./modules/booking/booking.route";

const app = express();

// parser

app.use(express.json());

initDB();
app.get("/", (req: Request, res: Response) => {
  res.send("Hello world!!");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1", userRoutes);
app.use("/api/v1", vehiclesRoute);
app.use("/api/v1", bookingRoute);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});
export default app;
