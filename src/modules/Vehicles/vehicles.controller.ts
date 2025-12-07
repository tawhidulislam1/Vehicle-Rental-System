import { Request, Response } from "express";
import { vehiclesServices } from "./vehicles.service";

const createVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.createVehicles(req.body);
    res.send({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.getVehicles();
    if (result.rowCount === 0) {
      res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "error.message",
    });
  }
};
const getSingleVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.getSingleVehicles(
      req.params.id as string
    );
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle retrieved successfully",
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
const updateVehicles = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await vehiclesServices.updateVehicles(req.body, id!);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: true,
        message: "Vehicle not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle update Successfully",
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
const deleteVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.deleteVehicles(req.params.id!);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle Delete Successfully",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const vehiclesController = {
  createVehicles,

  getVehicles,
  getSingleVehicles,
  updateVehicles,
  deleteVehicles,
};
