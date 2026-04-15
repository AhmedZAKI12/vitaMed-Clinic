import express from "express";
import {
  loginAdmin,
  getAllDoctors,
  deleteDoctor,
  changeAvailability,
  getDashboardData,
  getAllAppointments,
  cancelAppointment,
  completeAppointment,
  addDoctor
} from "../controllers/adminController.js";

import authAdmin from "../middleware/authAdmin.js";

import upload from "../middleware/multer.js";
import { updateAppointmentStatus } from '../controllers/adminController.js'

const adminRouter = express.Router();



adminRouter.post(
  '/update-appointment-status',
  authAdmin,
  updateAppointmentStatus
)



// ================= AUTH =================
adminRouter.post("/login", loginAdmin);

// ================= DOCTORS =================
adminRouter.get("/all-doctors", authAdmin, getAllDoctors);

adminRouter.delete(
  "/delete-doctor/:id",
  authAdmin,
  deleteDoctor
);
adminRouter.post(
  "/add-doctor",
  authAdmin,
  upload.single("image"),
  addDoctor
);


adminRouter.post(
  "/change-availability",
  authAdmin,
  changeAvailability
);

// ================= DASHBOARD =================
adminRouter.get(
  "/dashboard",
  authAdmin,
  getDashboardData
);

// ================= APPOINTMENTS =================
adminRouter.get(
  "/appointments",
  authAdmin,
  getAllAppointments
);

adminRouter.post(
  "/cancel-appointment",
  authAdmin,
  cancelAppointment
);



adminRouter.post(
  "/complete-appointment",
  authAdmin,
  completeAppointment
);


export default adminRouter;