import express from "express";
import { createUser, getUsers } from "../controllers/user.js";

const router = express.Router();

// Get all users
router.get("/api/users", getUsers);
router.post("/api/users", createUser);

export default router;
