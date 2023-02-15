const Product = require("../models/productModel");
const resourceFilter = require("../utils/resourceFilter");

exports.getAllProducts = async (req, res) => {
  try {
    // const products = await Product.find();
    let products = new resourceFilter(Product.find(), req.query).filter();
    products = await products.resource;

    res.status(200).json({
      status: "success",
      data: {
        results: products.length,
        products,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
      err,
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
      err,
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, image, stock, category } = req.body;
    console.log(req.body);
    const product = await Product.create({
      name,
      description,
      image,
      stock,
      category,
    });

    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
      err,
    });
  }
};
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, image, stock, category } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        image,
        stock,
        category,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
      err,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
      err,
    });
  }
};
