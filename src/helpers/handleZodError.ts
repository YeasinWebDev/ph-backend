import { ZodError, ZodIssue } from "zod";
import { TGenericErrorResponse } from "../app/interfaces/error.types";

export const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources = err.issues.map((issue: ZodIssue) => ({
    path: issue.path[issue.path.length - 1]?.toString() || "",
    message: issue.message,
  }));

  return {
    statusCode: 400,
    message: "Zod Error",
    errorSources,
  };
};
