const express = require("express");
const config = require("config");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Coverage = require("../models/Coverage");

// @route   GET api/rate/:quoteId
// @desc    Get Rate
// @access  Private
router.get("/rate/:quoteId", async (req, res) => {
  try {
    res.json({});
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/rate/:quoteId
// @desc    Create or update a coverage
// @access  Private
router.post(
  "/rate/:quoteId",
  [
    [
      check("bi", "Bodily Injury is required").not().isEmpty(),
      check("col", "Collision is required").not().isEmpty(),
      check("quoteId", "Quote ID is required").not().isEmpty(),
      check("comp", "Comprehensive is required").not().isEmpty(),
      check("med", "Medical Payment is required").not().isEmpty(),
      check("pd", "Property Damage is required").not().isEmpty(),
      check("rerim", "Rental Reimbursement is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { quoteId, bi, col, comp, med, pd, rerim } = req.body;

    const premium = (Math.random() * 1000 + 600).toFixed(2);

    try {
      const coverage = new Coverage({
        quoteId,
        bi,
        col,
        comp,
        med,
        pd,
        rerim,
        premium,
      });

      await coverage.save();

      res.json({ quoteId, premium });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   DELETE api/rate/:id?
// @desc    Delete coverage by Id
// @access  Private
router.delete("/rate/:id?", async (req, res) => {
  try {
    res.json({ msg: "Coverage deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
