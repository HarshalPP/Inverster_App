// Handles investments data
const Inverstor = require("../models/Investment")
const User = require("../models/User")

// create  a Inverstment //

exports.addInvestment = async (req, res) => {
    try {
      const { user, company, amount, round } = req.body;
  
      // Create a new investment entry
      const createInvestor = new Inverstor({
        user,
        company,
        amount,
        round
      });
  
      // Save the investment
      const result = await createInvestor.save();  
      // Find the user and update their investments
      const findUser = await User.findByIdAndUpdate(
        result.user,
        { $push: { investments: result._id } }, // Use $push to add investment to the investments array
        { new: true } // Return updated user
      );
  
      if (!findUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Successful response
      return res.status(201).json({
        message: 'Investment completed successfully',
        data: result
      });
  
    } catch (error) {
      // Handle errors
      console.error("Error adding investment:", error);
      return res.status(500).json({ error: error.message });
    }
  };
  


