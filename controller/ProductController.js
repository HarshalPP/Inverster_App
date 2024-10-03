const mongoose = require('mongoose');
const { Product0, Product1, Product2, Product3, Product4, Product5 } = require('../models/Product');
const ProductCollection = require("../models/Productcollection")
const Consignor = require("../models/consignew")

exports.addProduct = async (req, res) => {
    const { title, price, description } = req.body;
  
    try {
      const newProduct = new Product({
        title,
        price,
        description,
      });

      await newProduct.save();
  
      res.status(201).json({
        success: true,
        message: 'Product added successfully',
        data: newProduct,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: err.message,
      });
    }
  };



   // let tempStage = {}
// const stageDocument = []
// const stageCount = []
//stageDocument.push(tempStage)
// tempStage  = { $match: { name: "abcd" } }

exports.aggregateProducts = async (req, res) => {
  const { searchQuery = '', page = 1, limit = 10 } = req.query;

  try {
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);

    let stageDocument = [];

    let tempStage = {
      $match: {
        title: { $regex: searchQuery, $options: 'i' }
      }
    };
    stageDocument.push(tempStage);

    stageDocument.push({ $skip: (pageInt - 1) * limitInt });
    stageDocument.push({ $limit: limitInt });

    const StageCount = stageDocument.length;


    const pipeline = [
      { $unionWith: { coll: "product_1" } },
      { $unionWith: { coll: "product_2" } },
      { $unionWith: { coll: "product_3" } },
      { $unionWith: { coll: "product_4" } },
      { $unionWith: { coll: "product_5" } },
      ...stageDocument, 
    ];


    const results = await Product0.aggregate(pipeline).exec();


    const countPipeline = [
      { $unionWith: { coll: "product_1" } },
      { $unionWith: { coll: "product_2" } },
      { $unionWith: { coll: "product_3" } },
      { $unionWith: { coll: "product_4" } },
      { $unionWith: { coll: "product_5" } },
      {
        $match: {
          title: { $regex: searchQuery, $options: 'i' }
        }
      },
      { $count: "total" }
    ];

    const totalCount = await Product0.aggregate(countPipeline).exec();
    const count = totalCount.length > 0 ? totalCount[0].total : 0;


    res.status(200).json({
      success: true,
      data: results,
      pagination: {
        currentPage: pageInt,
        limit: limitInt,
        totalCount: count,
        StageCount: StageCount, 
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};





exports.aggregateProductstage = async (req, res) => {
    const { searchQuery = '', page = 1, limit = 10 } = req.query;
  
    try {
      const pipeline = [
        { $unionWith: { coll: "product_0" } },
        { $unionWith: { coll: "product_1" } },
        { $unionWith: { coll: "product_2" } },
        { $unionWith: { coll: "product_3" } },
        { $unionWith: { coll: "product_4" } },
        { $unionWith: { coll: "product_5" } },
        {
          $match: {
            title: { $regex: searchQuery, $options: 'i' }
          }
        },
        { $skip: (parseInt(page) - 1) * parseInt(limit) },
        { $limit: parseInt(limit) },
      ];
  
      const results = await Product0.aggregate(pipeline).exec();
  
      const totalCount = await Product0.aggregate([
        { $unionWith: { coll: "product_0" } },
        { $unionWith: { coll: "product_1" } },
        { $unionWith: { coll: "product_2" } },
        { $unionWith: { coll: "product_3" } },
        { $unionWith: { coll: "product_4" } },
        { $unionWith: { coll: "product_5" } },
        {
          $match: {
            title: { $regex: searchQuery, $options: 'i' }
          }
        },
        { $count: "total" } 
      ]);
  
      const count = totalCount.length > 0 ? totalCount[0].total : 0;


      res.status(200).json({
        success: true,
        data: results,
        pagination: {
          currentPage: parseInt(page),
          limit: parseInt(limit),
          count: count,
        }
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: err.message
      });
    }
  };








 



//   TASK -2

exports.getConsignorName = async (req, res) => {
    const { id } = req.params;
  
    try {
      const product = await ProductCollection.findOne({ id: parseInt(id) }); 
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      const consignorInfo = await Consignor.findOne({ id: product.consignorId }); 
  
      if (!consignorInfo) {
        return res.status(404).json({ success: false, message: 'Consignor not found' });
      }

      res.status(200).json({
        success: true,
        consignorName: consignorInfo.consignorName,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  };


  // create a controller //

  exports.createProduct = async (req, res) => {
    const { id, consignorId, title, description, price } = req.body; 
 
    if (!id || !consignorId || !title || !description || price == null) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
  
    try {
      const newProduct = new ProductCollection({
        id: parseInt(id),
        consignorId: parseInt(consignorId),
        title,
        description,
        price,
      });
  
      const savedProduct = await newProduct.save();
  
      res.status(201).json({
        success: true,
        data: savedProduct,
        message: 'Product created successfully',
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: err.message,
      });
    }
  };



  exports.createConsignorInfo = async (req, res) => {
    const { id, consignorName } = req.body; 
  
 
    if (!id || !consignorName) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
  
    try {
      const newConsignor = new Consignor({
        id: parseInt(id),
        consignorName,
      });
  
      const savedConsignor = await newConsignor.save();
  
      res.status(201).json({
        success: true,
        data: savedConsignor,
        message: 'Consignor info created successfully',
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: err.message,
      });
    }
  };


  
  //for every product, update consignorName from corresponding consignor id
// Nithin Bhandari
// 18:16
// create a api, that api would accept no parameters,
// in that api, for every product, update consignorName from corresponding consignor id


//Update API //

exports.updateConsignorNames = async(req,res)=>{
  try{
   const FindProducts = await ProductCollection.find({})
   if(!FindProducts){
    return res.status(200).json('Product is not found')
   }
    for(let Products of  FindProducts){

      const FindConsignerId = await Consignor.findOne({id:Products.consignorId})
      if(FindConsignerId){
        Products.consignorName =  FindConsignerId.consignorName
        await Products.save();
      }
  
    }

   return res.status(200).json({
    mesg:true,
    data:FindProducts
   })
  }
  catch(error){
    return res.status(500).json({msg:'Internal Server Error' , error:error.message})
  }
}



exports.InsertMany = async(req,res)=>{
  try{
   const Products=[]
   for(let i=11 ; i<=100 ; i++){
    Products.push({
      id:i,
      consignorId:(i%10)+1,
      price:Math.floor(Math.random() * 1000)+1,
      description:"Demi Products description",
      title:"Demin title Description"

    })
   }

   const InsertedProducts = await ProductCollection.insertMany(Products)
   if(!InsertedProducts){
    return res.status(400).json('Products is not Added')
   }

   return res.status(201).json({
    success:true,
    data:InsertedProducts
   })


  }
  catch(error){
    return res.status(500).json({
      error:error.message
    })
  }
}


