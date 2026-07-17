import { Request, Response } from "express";

import asyncHandler from "../../shared/utils/async-handler";
import sendResponse from "../../shared/utils/send-response";
import healthService from "./health.service";

class HealthController {
  getHealth = asyncHandler(async (_req: Request, res: Response) => {
    const result = healthService.getHealthStatus();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: result.message,
    });
  });
}

export default new HealthController();