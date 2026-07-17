import { Request, Response } from "express";

import asyncHandler from "../../shared/utils/async-handler";
import sendResponse from "../../shared/utils/send-response";
import authService from "./auth.service";
import { RegisterInput } from "./auth.validation";

class AuthController {
  register = asyncHandler(
    async (req: Request<object, object, RegisterInput>, res: Response) => {
      const user = await authService.register(req.body);

      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Student registered successfully",
        data: user,
      });
    },
  );
}

export default new AuthController();