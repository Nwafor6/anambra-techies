import { Router } from "express";
import { AdminDashboard, TalentController } from "../controllers/admin"; 
import { IsAdmin } from "../support/middleware";

export const adminRouter = Router()

adminRouter

// Dashbaord
.get("/admin/users", IsAdmin,AdminDashboard.users)
.get("/admin/users/:id", IsAdmin, AdminDashboard.singleUser)

// Create a new talent
.post('/talents', TalentController.createTalent)

// Get all talents (with optional pagination)
.get('/talents', IsAdmin, TalentController.getAllTalents) // Implement this method in TalentController

// Get a single talent by ID
.get('/talents/:id',IsAdmin, TalentController.getTalentById) // Implement this method in TalentController

// Delete a talent by ID
.delete('/talents/:id', IsAdmin, TalentController.deleteTalent) // Implement this method in TalentController

// Send login credentials
.post('/talents/:id/send-login-credentials', IsAdmin, TalentController.sendLoginCredentials)
