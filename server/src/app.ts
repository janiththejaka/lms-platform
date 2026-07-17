import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import routes from "./routes";

import globalErrorHandler from "./middleware/global-error-handler";


const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", routes);

app.use(globalErrorHandler);

export default app;