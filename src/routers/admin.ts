import { Router } from "express";
import { AdminDashboard } from "../controllers/admin"; 
import { IsAdmin } from "../support/middleware";

export const adminRouter = Router()

adminRouter

// Dashbaord
.get("/admin/users", IsAdmin,AdminDashboard.users)
.get("/admin/users/:id", IsAdmin, AdminDashboard.singleUser)
