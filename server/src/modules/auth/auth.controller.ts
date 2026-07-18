import { Request, Response } from "express";

import asyncHandler from "../../shared/utils/async-handler";
import sendResponse from "../../shared/utils/send-response";
import authService from "./auth.service";
import { LoginInput, RegisterInput } from "./auth.validation";


const ACCESS_TOKEN_COOKIE_NAME = "accessToken";

const ACCESS_TOKEN_COOKIE_MAX_AGE =
  7 * 24 * 60 * 60 * 1000;


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

  login = asyncHandler(
    async (
      req: Request<object, object, LoginInput>,
      res: Response,
    ) => {
      const result = await authService.login(req.body);

      res.cookie(
        ACCESS_TOKEN_COOKIE_NAME,
        result.accessToken,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE,
        },
      );

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Login successful",
        data: result.user,
      });
    },
  );
}

export default new AuthController();