import { Response } from "express";

interface ApiResponseOptions<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
}

const sendResponse = <T>(
  res: Response,
  options: ApiResponseOptions<T>,
): Response => {
  const {
    statusCode,
    success,
    message,
    data,
    meta,
  } = options;

  return res.status(statusCode).json({
    success,
    message,
    ...(data !== undefined && { data }),
    ...(meta !== undefined && { meta }),
  });
};

export default sendResponse;