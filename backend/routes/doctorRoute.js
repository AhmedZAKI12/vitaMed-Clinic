import express from 'express';
import {
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  appointmentConfirm, 
  doctorList,
  changeAvailablity,
  appointmentComplete,
  doctorDashboard,
  getRecommendedDoctor,
  doctorProfile,
  updateDoctorProfile,
  getDoctorReviews
} from '../controllers/doctorController.js';

import authDoctor from '../middleware/authDoctor.js';

const doctorRouter = express.Router();

doctorRouter.post("/login", loginDoctor)

doctorRouter.get("/appointments", authDoctor, appointmentsDoctor)

doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel)

doctorRouter.post("/confirm-appointment",authDoctor,appointmentConfirm)

doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete)

doctorRouter.get("/list", doctorList)

doctorRouter.post("/change-availability", authDoctor, changeAvailablity)

doctorRouter.get("/dashboard", authDoctor, doctorDashboard)

doctorRouter.get("/profile", authDoctor, doctorProfile)

doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile)

doctorRouter.get("/recommend",getRecommendedDoctor)

doctorRouter.get("/reviews/:docId",getDoctorReviews)

export default doctorRouter;