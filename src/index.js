import { createErrorResponse } from "./utils/index.js";
import errorConstants from "./errors/constants.js";
import rate from "./handlers/rate.js";

export async function handler(event) {
  try {
    const { path, method } = event.requestContext.http;

    if (path.startsWith("/api/rate")) {
      if (method.toLowerCase() === "post") {
        return await rate(
          JSON.parse(event.body),
          event?.pathParameters?.quoteId
        );
      }
    }
  } catch (err) {
    return createErrorResponse(500, errorConstants.commons.internalServerError);
  }
}
