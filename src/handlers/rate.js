import { dbConnectAndExecute } from "../db/index.js";
import { createErrorResponse, createResponse } from "../utils/index.js";
import Coverage from "../db/models/Coverage.js";
import errorConstants from "../errors/constants.js";
import MONGO_CONNECTION_STRING from "../env/index.js";

export default async function rate(body, quoteId) {
  const { bi, col, comp, med, pd, rerim } = body;

  if (!quoteId || !bi || !col || !comp || !med || !pd || !rerim) {
    return createErrorResponse(400, errorConstants.commons.badRequest);
  }

  const coverage = new Coverage({
    quoteId,
    bi,
    col,
    comp,
    med,
    pd,
    rerim,
    premium: "100.00",
  });

  const result = await dbConnectAndExecute(MONGO_CONNECTION_STRING, () =>
    coverage.save()
  );

  if (result) {
    return createResponse(200, {
      message: "Coverage Created Successfully!!!",
      quoteId,
      premium: "100.00",
    });
  } else {
    throw new Error();
  }
}
