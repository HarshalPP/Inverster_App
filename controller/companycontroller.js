const CompanyModel = require("../models/Company")


// Create a Company Controller //

// Add a new company
exports.addCompany = async (req, res) => {
    const { name, logo, description, industry, stage , fundingRounds} = req.body;
    try {
      const newCompany = new CompanyModel({ name, logo, description, industry, stage, fundingRounds });
      await newCompany.save();
      res.status(201).json(newCompany);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };


  // Get all companies
exports.getAllCompanies = async (req, res) => {
    try {
      const companies = await Company.find();
      res.status(200).json(companies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };