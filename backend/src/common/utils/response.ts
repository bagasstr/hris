import type { Context } from "hono";

export const sendSuccess = <T>(c: Context, data: T, message = "Success", status = 200) => {
  return c.json(
    {
      success: true,
      message,
      data,
    },
    status as any,
  );
};

export const sendError = (c: Context, message = "Failed", status = 400, errors?: any) => {
  return c.json(
    {
      success: false,
      message,
      ...(errors ? { errors } : {}),
    },
    status as any,
  );
};
