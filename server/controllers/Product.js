const Product=require("../models/productModel")
const User=require("../models/userModel")

exports.getAll=async (req, res,next) => {
    try{
    //get category from query
    const category = req.query.category ? { category: req.query.category } : {};
    //get searchKeyWords
    const searchKeyword = req.query.searchKeyword
      ? {
          name: {
            $regex: req.query.searchKeyword,
            // manjuscule / miniscule
            $options: 'i',
          },
        }
      : {};
    //desc sort/asc sort by price
    const sortOrder = req.query.sortOrder? req.query.sortOrder === 'highest' ? { rating: 1  }: { rating: -1 }: { rating: 1 };
    
    // find Product by category and search word
    const products = await Product.find({ ...category, ...searchKeyword }).sort(sortOrder);
    //return products
    res.send(products);
  }
  catch(ex)
  {
      next(ex.message)
  }
}

exports.getTop=async(req,res,next)=>{
  try{
    const products = await Product.find().sort({"sold":-1}).limit(10);
    //return products
    return res.status(200).send(products);
  }
  catch(ex)
  {
    next(ex.message)
  }
}

exports.getById=async (req, res,next) => {
    try{
    const product = await Product.findOne({ _id: req.params.id });
    if (product) {
      res.status(200).send(product);
    } else {
      res.status(404).send({ message: 'Product Not Found.' });
    }
  }
  catch(ex)
  {
    next(ex.message)
  }
}

exports.gettingByCache=async(req,res,next)=>{
    try
    {
      const {favoris}=await User.findById(req.user._id).select("favoris")
      let categories=favoris.sort((a,b)=>(a.indicator > b.indicator) ? -1 : ((b.indicator > a.indicator) ? 1 : 0))
      categories=categories.map(c=>c.category)
      //console.log(categories)

      var products=[]
      await Promise.all(categories.map(async(category)=>{
        const favorisproducts=await Product.find({"category":{"$eq":category}}).sort({rating:1})
        favorisproducts.forEach(product=>products.push(product))
      }))
      
      const notfavorisproducts=await Product.find({"category":{"$nin":categories}}).sort({rating:1})
      notfavorisproducts.forEach(product=>products.push(product))  
      //console.log(products)
      
    return res.status(200).send(products) 
    }
    catch(ex)
    {
      next(ex.message)
    }
}

exports.getCategories=async(req,res,next)=>{
  
    function removeDups(names) {
      let unique = {};
      names.forEach(function(i) {
        if(!unique[i]) {
          unique[i] = true;
        }
      });
      return Object.keys(unique);
    }
    try{
    const data=await Product.find().select("category")
    let categories=[]
    data.map(cat=>categories.push(cat.category))
    categories=removeDups(categories)
    res.send(categories)
  }
  catch(ex)
  {
  next(ex.message)
  }
}

exports.createCache=async(req,res,next)=>{
    try{
    console.log("creating cache")
   const product = await Product.findOne({ _id: req.params.id });
   let user=await User.findById(req.user._id);
   const indexProduct=user.favoris.findIndex(c=>c.category==product.category)
   if(indexProduct!=-1) user.favoris[indexProduct].indicator++
   else user.favoris.push({category:product.category,indicator:1})
   await user.save()
   if (product) {
     res.send(product);
   } else {
     res.status(404).send({ message: 'Product Not Found.' });
   }
  }
  catch(ex)
  {
    next(ex.message)
  }
}

exports.addReview=async (req, res,next) => {
    try{
    const product = await Product.findById(req.params.id);
    if (product) {
      // create new review
      const review = {
        name: req.body.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      //add review to reviews
      product.reviews.push(review);
      //update number reviews
      product.numReviews = product.reviews.length;
      //recalculate rating product
      product.rating =product.reviews.reduce((a, c) => c.rating + a, 0) /product.reviews.length;
      // save updates
      const updatedProduct = await product.save();
      //return only the updated product as data 
      res.status(201).send({
        data: updatedProduct.reviews[updatedProduct.reviews.length - 1],
        message: 'Review saved successfully.',
      });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  }
  catch(ex)
  {
    next(ex.message)
  }
}

// update name,price,image,brand,category,countInStock,description
exports.update=async (req, res,next) => {
    try{
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.price = req.body.price;
      product.points_price=req.body.points;
      product.images = req.body.images;
      product.brand = req.body.brand;
      product.category = req.body.category;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      const updatedProduct = await product.save();
      if (updatedProduct) {
        return res
          .status(200)
          .send({ message: 'Product Updated', data: updatedProduct });
      }
    }
    else return res.status(500).send({ message: ' Error in Updating Product.' });
    }
    catch(ex)
    {
      next(ex.message)
    }
}

// delete product by Id
exports.remove=async (req, res,next) => {
    try{
    const deletedProduct = await Product.findById(req.params.id);
    if (deletedProduct) {
      await deletedProduct.remove();
      res.send({ message: 'Product Deleted' });
       } else {
      res.send('Error in Deletion.');
       }
     }
    catch(ex)
    {
      next(ex.message)
    }
}

//create new Product with name,price,image,brand,category,countInStock,description
exports.create=async (req, res,next) => {
    try{
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      points_price:req.body.points,
      images: req.body.images,
      brand: req.body.brand,
      category: req.body.category,
      countInStock: req.body.countInStock,
      description: req.body.description,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
    });
    const newProduct = await product.save();
    if (newProduct) {
      return res
        .status(201)
        .send({ message: 'New Product Created', data: newProduct });
    }
    return res.status(500).send({ message: ' Error in Creating Product.' });
  }
  catch(ex){
    next(ex.message)
  }
}