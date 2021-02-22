const express = require("express");
let rn = require("random-number");
const router = express.Router({ mergeParams: true });
const dataStore = require("../../data/dataStore");
const winston = require("winston");
const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

let gen = rn.generator({
  min: 100000000,
  max: 999999999,
  integer: true,
});

router
  .route("/coverageInfo/:quoteId/:coverageId?")
  .get(async (req, res) => {
    logger.info(
      `app.api.quotes - getting quote with id - ${req.params.coverageId}`
    );
    res.send(
      JSON.stringify(
        await getCoverageInfo(req.params.coverageId, req.params.quoteId)
      )
    );
  })
  .post(async (req, res) => {
    logger.info(`app.api.quotes - creating new quote`);
    res.send(
      JSON.stringify(await saveCoverageInfo(req.body, req.params.quoteId))
    );
  });

let getCoverageInfo = async (coverageId, quoteId) => {
  try {
    let coverage = await dataStore.findCoverage(coverageId, quoteId);
    return coverage;
  } catch (error) {
    logger.error(
      `app.api.quotes - getting quote#${coverageId}, from quote#${quoteId} failed - ${JSON.stringify(
        error
      )}`
    );
  }
};

let saveCoverageInfo = async (data, quoteId) => {
  try {
    let coverage = {};
    if (data.id) {
      coverage = await dataStore.findCoverage(data.id, quoteId);
    } else {
      coverage.id = gen().toString();
    }
    coverage.quoteId = quoteId;
    coverage.bi = data.bi;
    coverage.pd = data.pd;
    coverage.med = data.med;
    coverage.comp = data.comp;
    coverage.col = data.col;
    coverage.rerim = data.rerim;
    coverage.premium = (Math.random() * 1000 + 600).toFixed(2);

    await dataStore.addCoverage(coverage);
    
    return {
      id: coverage.id,
      premium: coverage.premium,
    };
  } catch (error) {
    logger.error(
      `app.api.quotes - error creating new quote - ${JSON.stringify(error)}`
    );
  }
};

module.exports = router;
