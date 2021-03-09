const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CoverageSchema = new Schema({
  quoteId: {
    type: String,
    required: true,
  },
  bi: {
    type: String,
    required: true,
  },
  col: {
    type: String,
    required: true,
  },
  comp: {
    type: String,
    required: true,
  },
  med: {
    type: String,
    required: true,
  },
  pd: {
    type: String,
    required: true,
  },
  premium: {
    type: String,
    required: true,
  },
  rerim: {
    type: String,
    required: true,
  },
});

module.exports = Coverage = mongoose.model("coverages", CoverageSchema);
