const News = require("../models/News")
const Inverstor = require("../models/Investment")
const{notifyUsersOfNews} =require("../Utils/notificationUtils")
const Company = require('../models/Company');
const Funding = require('../models/funding');
const NewsletterSubscriber =require("../models/newsLetterSubscription")


// Add Subscribe the News_Letters //

exports.subscribeNewsletter = async (req, res) => {
  try {
    const { firstName, lastName, email, consent  } = req.body;
    
    if (!consent) {
      return res.status(400).json({ message: 'You must agree to the privacy policy.' });
    }

    if (req.user.email !== email) {
      return res.status(400).json({ message: 'Provided email does not match the registered investor.' });
    }

    // Create new subscriber
    const existingSubscriber = await NewsletterSubscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ message: 'You are already subscribed to the newsletter.' });
    }

    const newSubscriber = new NewsletterSubscriber({ firstName, lastName, email, consent, subscriber: req.user._id , Newsletter:'true'  });
    await newSubscriber.save();



    // Optionally update all news to set Newsletter to 'true'
    // await News.updateMany({}, { $set: { Newsletter: 'true' } });

    res.status(201).json({ message: 'Subscribed to newsletter successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Create  a News ///

exports.AddNews = async(req,res)=>{
    try{
      const {title,content,company}=req.body
      const data = new News({
        title,
        content,
        company
      })

      const result = await data.save()

       // Notify users who have invested in the related company
      await notifyUsersOfNews(company, title, content);


      res.status(201).json({

        Message:'News Added Successfully',
        data:result

      })
    }
    catch(error){
     res.status(500).json({
        error:error.message
     })
    }

}


// get news //
  
exports.getNews = async (req, res) => {
    try {

      const userId = req.user._id; 
      const userInvestments = req.user.investments;  
  
      let investmentCompanyIds = [];
  
      // Fetch related companies from the user's investments
      for (const investmentId of userInvestments) {
        const investor = await Inverstor.findById(investmentId).populate('company');  // Assuming Investor schema has a company field
        if (investor && investor.company) {
          investmentCompanyIds.push(investor.company._id);
        }
      }
  
      console.log("Related companies based on user investments:", investmentCompanyIds);


  
      // Find all unread news that the current user hasn't read and is related to their investments
      const unreadNews = await News.find({
        $and: [
          { readBy: { $ne: userId } },  // Ensure the user's ID is NOT in the `readBy` array
          { company: { $in: investmentCompanyIds } }  // News must be related to companies the user has invested in
        ]
      });



       // Check if the user is subscribed to newsletters
       const subscriber = await NewsletterSubscriber.findOne({ email: req.user.email, subscriber: userId, Newsletter: 'true' });
       if (!subscriber) {
         return res.status(400).json({ message: 'Investor is not subscribed for news updates' });
       }


  
      // Find all read news that the current user has already read
      const readNews = await News.find({
        $and: [
          { readBy: { $eq: userId } },  // Ensure the user's ID is IN the `readBy` array
          { company: { $in: investmentCompanyIds } }  // News must be related to companies the user has invested in
        ]
      });
  
      res.status(200).json({
        message: "News retrieved successfully",
        unreadNews,   // Unread news items
        readNews      // Read news items
      });
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  
  



  exports.markAsRead = async (req, res) => {
    try {
      const { newsId } = req.params;  // ID of the news to mark as read
      const userId = req.user._id;    // ID of the current user
  
      // Find the news and update the `readBy` array with the current user's ID
      const news = await News.findByIdAndUpdate(
        newsId,
        { $addToSet: { readBy: userId } },  // Add the user ID to `readBy` if it's not already there
        { new: true }  // Return the updated document
      );
  
      if (!news) {
        return res.status(404).json({ message: "News not found" });
      }
  
      res.status(200).json({ message: "News marked as read", news });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };




// Get Company News Page with Investment Details and Funding Status
exports.getCompanyNewsPage = async (req, res) => {
  try {
    const companyId = req.params.companyId;  
    const userId = req.user._id;             

    // Check if the user has invested in this company
    const investment = await Inverstor.findOne({
      user: userId,
      company: companyId
    });

    if (!investment) {
      return res.status(403).json({ message: "Access denied. You haven't invested in this company." });
    }

   
    const company = await Company.findById(companyId);

    const latestFunding = await Funding.findOne({ company: companyId })
      .sort({ date: -1 }); 

    const companyNews = await News.find({ company: companyId })
      .sort({ createdAt: -1 });  // Sort by latest news first

    // Prepare the response data with company updates, funding, and investment details
    res.status(200).json({
      message: "Company news page retrieved successfully",
      companyDetails: {
        name: company.name,
        description: company.description,
        sector: company.sector
      },
      investmentDetails: {
        amountInvested: investment.amount,  // The amount the user invested in this company
        rounds: investment.roundsParticipated // Funding rounds in which the user participated
      },
      fundingStatus: latestFunding ? {
        round: latestFunding.round,
        amountRaised: latestFunding.amountRaised,
        date: latestFunding.date
      } : null,  // Display the latest funding round if available
      companyNews: companyNews.map(newsItem => ({
        title: newsItem.title,
        content: newsItem.content,
        createdAt: newsItem.createdAt,
        media: newsItem.media  // Links to documents, images, videos, etc.
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
  