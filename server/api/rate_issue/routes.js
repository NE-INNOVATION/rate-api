const express = require("express");
let rn = require("random-number");
const router = express.Router({ mergeParams: true });
const dataStore = require("../../data/dataStore");
const axios = require("axios");
const { Agent } = require("https");
const winston = require("winston");
const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

let covGen = rn.generator({
  min: 100000000,
  max: 999999999,
  integer: true,
});

const client = axios.create({
  httpsAgent: new Agent({
    rejectUnauthorized: false,
  }),
});

router
  .route("/rate/:id/:quoteId")
  .get(async (req, res) => {
    logger.info(`app.api.quotes - getting quote with id - ${req.params.id}`);
    res.send(
      JSON.stringify(await getCoverageInfo(req.params.id, req.params.quoteId))
    );
  })
  .post(async (req, res) => {
    logger.info(`app.api.quotes - creating new quote`);
    res.send(
      JSON.stringify(await saveCoverageInfo(req.body, req.params.quoteId))
    );
  });

let getCoverageInfo = async (id, quoteId) => {
  try {
    let coverage = await dataStore.findCoverage(quoteId);
    return coverage;
  } catch (error) {
    logger.error(
      `app.api.quotes - getting quote#${id}, from quote#${quoteId} failed - ${JSON.stringify(
        error
      )}`
    );
  }
};

let saveCoverageInfo = async (data, quoteId) => {
  try {
    let coverage = {};

    coverage.quoteId = quoteId;
    coverage.bi = data.bi;
    coverage.pd = data.pd;
    coverage.med = data.med;
    coverage.comp = data.comp;
    coverage.col = data.col;
    coverage.rerim = data.rerim;
    coverage.premium = (Math.random() * 1000 + 600).toFixed(2);

    if (!data.id) {
      coverage.id = covGen().toString();
    }

    await client.post(
      `${process.env.DB_SERVICE_URL}/${process.env.COLLECTION_NAME}`,
      coverage,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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
