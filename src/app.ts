import cors from "cors";
import express, { Request, Response } from "express";
import { UserRouters } from "./app/modules/user/user.route";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
import { authRouter } from "./app/modules/auth/auth.route";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Tour Management System Backend",
  });
});

app.use("/api/v1/user", UserRouters);
app.use("/api/v1/auth", authRouter)
app.use(globalErrorHandler);

app.use(notFound)

export default app;
