import { TGenericErrorResponse } from "../app/interfaces/error.types";
export const handlerDuplicateError = (err: { message: string }): TGenericErrorResponse => {
  const matchedArray = err.message.match(/"([^"]*)"/);

  const duplicatedValue = matchedArray?.[1] || "Field";
  return {
    statusCode: 400,
    message: `${duplicatedValue} already exists!!`,
  };
};
