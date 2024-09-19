const Deal = require("../models/Deal")

// Create the Deal //


exports.createDeal = async (req, res) => {
    try {

        const { title, description, totalAllocation, closingDate ,amountCommitted } = req.body;
        // Validate required fields
        if (!title || !description || !totalAllocation || !closingDate) {
            return res.status(400).json({ message: 'All fields are required.' });
        }


        // Create a new deal
        const newDeal = new Deal({
            title,
            description,
            totalAllocation,
            closingDate,
            amountCommitted,
            committedLPs: []     // Initially, no LPs are committed
        });


        // Save the deal to the database
        const savedDeal = await newDeal.save();
        return res.status(201).json({
            message: 'Deal created successfully',
            deal: savedDeal
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


exports.getActiveDeals = async (req, res) => {
    try {

        const activeDeals = await Deal.find({
            closingDate: { $gt: new Date() }
        })

        // Map the active deals to Include the add. info .
        const activeDealsWithProgress  = activeDeals.map(deal => {
            const totalAllocation = deal.totalAllocation;
            const amountCommitted = deal.amountCommitted;
            const committedLPsCount = deal.committedLPs.length;

            // Calculate progress percentage towards the allocation
            const progress = (amountCommitted / totalAllocation) * 100;

            // Calculate the time left until the closing date (in milliseconds)
            const countdown = new Date(deal.closingDate) - new Date();

            return {
                _id: deal._id,
                title: deal.title,
                description: deal.description,
                totalAllocation,
                amountCommitted,
                progress,  // Progress bar percentage
                committedLPsCount,  // Number of LPs already committed
                countdown,  // Time left in milliseconds
                closingDate: deal.closingDate
            };


        })
        
        res.status(200).json({
            message: 'Active deals retrieved successfully',
            activeDeals: activeDealsWithProgress
        });

    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}