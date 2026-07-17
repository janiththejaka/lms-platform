import { Router } from "express";

import validateRequest from "../../middleware/validate-request";
import { registerSchema } from "./auth.validation";
import authController from "./auth.controller";

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  authController.register,
);

export default router;