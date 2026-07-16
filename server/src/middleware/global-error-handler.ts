import {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";

import ApiError from "../shared/errors/api-error";

interface ErrorResponse {
  success: false;
  message: string;
  errors?: unknown;
  stack?: string;
}

const globalErrorHandler: ErrorRequestHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const isProduction = process.env.NODE_ENV === "production";

  let statusCode = 500;
  let message = "Internal server error";
  let errors: unknown;

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errors = error.details;
  }

  console.error(error);

  const response: ErrorResponse = {
    success: false,
    message,
    ...(!isProduction && errors !== undefined && { errors }),
    ...(!isProduction && error.stack && { stack: error.stack }),
  };

  res.status(statusCode).json(response);
};

export default globalErrorHandler;