import { Router } from "express";

import validateRequest from "../../middleware/validate-request";
import { loginSchema, registerSchema } from "./auth.validation";
import authController from "./auth.controller";

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  authController.register,
);

router.post(
  "/login",
  validateRequest(loginSchema),
  authController.login,
);

export default router;