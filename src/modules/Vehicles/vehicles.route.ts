import { Router } from "express";
import { vehiclesController } from "./vehicles.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/vehicles", auth("admin"), vehiclesController.createVehicles);
router.get("/vehicles", vehiclesController.getVehicles);
router.get("/vehicles/:id", vehiclesController.getSingleVehicles);
router.put("/vehicles/:id", auth("admin"), vehiclesController.updateVehicles);
router.delete(
  "/vehicles/:id",
  auth("admin"),
  vehiclesController.deleteVehicles
);

export const vehiclesRoute = router;
