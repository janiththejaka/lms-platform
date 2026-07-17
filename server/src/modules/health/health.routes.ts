import { Router } from "express";

import ApiError from "../../shared/errors/api-error";
import asyncHandler from "../../shared/utils/async-handler";
import healthController from "./health.controller";

const router = Router();

router.get("/", healthController.getHealth);

router.get(
  "/error-test",
  asyncHandler(async () => {
    throw new ApiError(418, "Global error handling is working");
  }),
);

router.get(
  "/unexpected-error-test",
  asyncHandler(async () => {
    throw new Error("Unexpected test failure");
  }),
);

export default router;