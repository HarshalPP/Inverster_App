const FundingRound = require('../models/funding');
const Company = require('../models/Company');

// Create a new funding round
exports.createFundingRound = async (req, res) => {
  try {
    const { company, round, amountRaised, date } = req.body;

    // Create a new funding round document
    const fundingRound = new FundingRound({
      company,
      round,
      amountRaised,
      date
    });

    // Save the document to the database
    const result = await fundingRound.save();

    // Optionally update the company document with this funding round (if needed)
    await Company.findByIdAndUpdate(
      company,
      { $push: { fundingRounds: result._id } } // Add the funding round ID to the company's fundingRounds array
    );

    res.status(201).json({
      message: 'Funding round created successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get funding rounds for a company
exports.getFundingRounds = async (req, res) => {
  try {
    const companyId = req.params.companyId;

    // Fetch all funding rounds related to the company
    const fundingRounds = await FundingRound.find({ company: companyId }).sort({ date: -1 }); // Sort by date in descending order

    res.status(200).json({
      message: 'Funding rounds retrieved successfully',
      data: fundingRounds
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a funding round
exports.updateFundingRound = async (req, res) => {
  try {
    const { fundingRoundId } = req.params;
    const updates = req.body;

    // Find and update the funding round
    const fundingRound = await FundingRound.findByIdAndUpdate(fundingRoundId, updates, { new: true });

    if (!fundingRound) {
      return res.status(404).json({ message: 'Funding round not found' });
    }

    res.status(200).json({
      message: 'Funding round updated successfully',
      data: fundingRound
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a funding round
exports.deleteFundingRound = async (req, res) => {
  try {
    const { fundingRoundId } = req.params;

    // Find and delete the funding round
    const fundingRound = await FundingRound.findByIdAndDelete(fundingRoundId);

    if (!fundingRound) {
      return res.status(404).json({ message: 'Funding round not found' });
    }

    // Optionally update the company document to remove the funding round reference
    await Company.findByIdAndUpdate(
      fundingRound.company,
      { $pull: { fundingRounds: fundingRoundId } } // Remove the funding round ID from the company's fundingRounds array
    );

    res.status(200).json({
      message: 'Funding round deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
