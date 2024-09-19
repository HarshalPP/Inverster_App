const CompanyModel = require("../models/Company")


// Create a Company Controller //

// Add a new company
exports.addCompany = async (req, res) => {
  
    const { name, company_url, description, industry, stage , fundingRounds} = req.body;
    try {

       const ExistingCompany = await CompanyModel.findOne({name:name})
       if(ExistingCompany){
        res.status(400).json({
          message:'Company is Already Exist....'
        })
       }
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
      const { page = 1, limit = 10, search = "" } = req.query;
  
      const currentPage = parseInt(page, 10);
      const itemsPerPage = parseInt(limit, 10);
  
      // Create the search query object
      let query = {};
      if (search) {
        query = {
          name: { $regex: new RegExp(search, "i") }
        };
      }
  
      // Get the total number of companies matching the search query
      const totalItems = await CompanyModel.countDocuments(query);
  
      // Calculate total pages
      const totalPages = Math.ceil(totalItems / itemsPerPage);
  
      // Fetch the companies based on the query with pagination and sorting
      const companyDetails = await CompanyModel.find(query)
        .populate('fundingRounds')
        .sort({ name: -1 }) // Sort by name in descending order
        .skip((currentPage - 1) * itemsPerPage)
        .limit(itemsPerPage);
  
      // Send the response with pagination info
      res.status(200).json({
        totalItems,
        totalPages,
        currentPage,
        companyDetails
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  