const mongoCollections = require("../config/mongoCollections");
const productCollections = mongoCollections.products;
const validator = require("../helper/validator");
const utils = require("../helper/utils");
const errorCode = require("../helper/common").errorCode;

const getById = async (id) => {
  validator.checkNonNull(id);
  validator.checkString(id);

  id = utils.parseObjectId(id);
  const productsCol = await productCollections();
  const product = await productsCol.findOne({ _id: id });
  if (product == null) {
    const error = new Error(`No product found with id - ${id.toString()}`);
    error.code = errorCode.NOT_FOUND;
    throw error;
  }
  return product;
};

const getByQuery = async (query) => {
  validator.checkNonNull(query);
  const {
    search,
    category,
    seller,
    zipCode,
    status,
    condition,
    sort_type,
    city,
    state,
  } = query;

  const main_query = [];

  //#region master search
  const search_query = [];
  if (typeof search == "string") {
    search_query.push({ name: { $regex: `.*${search}.*`, $options: "i" } });
    search_query.push({ keywords: { $regex: `.*${search}.*`, $options: "i" } });
  } else if (Array.isArray(search)) {
    search_query.push({ name: { $in: search } });
    search_query.push({ keywords: { $in: search } });
  }
  if (search_query.length != 0) {
    main_query.push({ $or: search_query });
  }
  //#endregion

  //#region category
  if (typeof category == "string") {
    main_query.push({ category: { $regex: `.*${category}.*`, $options: "i" } });
  } else if (Array.isArray(category)) {
    main_query.push({ category: { $in: category } });
  }
  //#endregion

  //#region seller
  if (typeof seller == "string") {
    const seller_id = utils.parseObjectId(seller);
    main_query.push({ seller_id: seller_id });
  } else if (Array.isArray(seller)) {
    for (let i = 0; i < seller.length; i++) {
      seller[i] = utils.parseObjectId(seller[i], "SellerId");
    }
    main_query.push({ seller_id: { $in: seller } });
  }
  //#endregion

  //#region zipcode
  if (typeof zipCode == "string") {
    main_query.push({ "location.zip": zipCode });
  } else if (Array.isArray(zipCode)) {
    main_query.push({ "location.zip": { $in: zipCode } });
  }
  //#endregion

  //#region city
  if (typeof city == "string") {
    main_query.push({
      "location.city": { $regex: city, $options: "i" },
    });
  } else if (Array.isArray(city)) {
    main_query.push({ "location.city": { $in: city } });
  }
  //#endregion

  //#region state
  if (typeof state == "string") {
    main_query.push({
      "location.state": { $regex: state, $options: "i" },
    });
  } else if (Array.isArray(state)) {
    main_query.push({ "location.state": { $in: state } });
  }
  //#endregion

  //#region status
  if (typeof status == "string") {
    main_query.push({ status: { $regex: status, $options: "i" } });
  } else if (Array.isArray(status)) {
    main_query.push({ status: { $in: status } });
  }
  //#endregion

  //#region condition
  if (typeof condition == "string") {
    main_query.push({ condition: { $regex: condition, $options: "i" } });
  } else if (Array.isArray(condition)) {
    main_query.push({ condition: { $in: condition } });
  }
  //#endregion

  if (main_query.length == 0) {
    return await getAll();
  }
  const productsCol = await productCollections();
  const products = await productsCol
    .find({
      $and: main_query,
    })
    .toArray();
  if (!Array.isArray(products) || products.length == 0) {
    const error = new Error(`No product found`);
    error.code = errorCode.NOT_FOUND;
    throw error;
  }
  return products;
};

const getAll = async () => {
  const productsCol = await productCollections();
  const products = await productsCol.find({}).toArray();
  if (!Array.isArray(products) || products.length == 0) {
    const error = new Error(`No products found`);
    error.code = errorCode.NOT_FOUND;
    throw error;
  }
  return products;
};

const create = async (
  name,
  category,
  keywords,
  price,
  seller_id,
  images,
  description,
  location,
  status,
  condition,
  dateListed
) => {
  validator.checkNonNull(
    name,
    category,
    keywords,
    price,
    seller_id,
    images,
    description,
    location,
    status,
    condition,
    dateListed
  );
  validator.checkString(name, "name");
  if (!Array.isArray(category)) throw "Category must be an array";
  if (!Array.isArray(keywords)) throw "keywords must be an array";
  validator.checkNumber(price, "price");
  validator.checkString(seller_id, "seller_id");
  seller_id = utils.parseObjectId(seller_id, "SellerId");

  if (!Array.isArray(images)) throw "Images must be an array";
  validator.checkString(description, "description");
  validator.checkLocation(location);
  validator.checkString(status, "status");
  validator.checkString(condition, "condition");
  validator.checkDate(dateListed, "Date Listed");

  const newProduct = {
    name: name,
    category: category,
    keywords: keywords,
    price: parseFloat(price),
    seller_id: seller_id,
    images: images,
    description: description,
    location: location,
    status: status,
    condition: condition,
    dateListed: dateListed,
  };

  const products = await productCollections();
  const insertInfo = await products.insertOne(newProduct);

  if (insertInfo.length === 0) throw new Error("Could not add a product");
  let id = insertInfo.insertedId;

  const product = await getById(id.toString());
  return product;
};

const update = async (
  id,
  name,
  category,
  keywords,
  price,
  seller_id,
  images,
  description,
  location,
  status,
  condition,
  dateListed
) => {
  id = validator.isValidObjectID(id);
  validator.checkNonNull(
    name,
    category,
    keywords,
    price,
    seller_id,
    images,
    description,
    location,
    status,
    condition,
    dateListed
  );
  validator.checkString(name, "name");
  if (!Array.isArray(category)) throw "Category must be an array";
  if (!Array.isArray(keywords)) throw "keywords must be an array";
  validator.checkNumber(price, "price");
  validator.checkString(seller_id, "seller_id");
  seller_id = utils.parseObjectId(seller_id, "SellerId");
  if (!Array.isArray(images)) throw "Images must be an array";
  validator.checkString(description, "description");
  validator.checkLocation(location);
  validator.checkString(status, "status");
  validator.checkString(condition, "Barely used");
  validator.checkDate(dateListed, "Date Listed");

  const updateProduct = {
    name: name,
    category: category,
    keywords: keywords,
    price: parseFloat(price),
    seller_id: seller_id,
    images: images,
    description: description,
    location: location,
    status: status,
    condition: condition,
    dateListed: dateListed,
  };

  const products = await productCollections();
  const updateInfo = await products.updateOne(
    { _id: id },
    { $set: updateProduct }
  );

  if (updateInfo.length === 0)
    throw new Error("Could not update the product info");

  const product = await getById(id.toString());
  return product;
};

const remove = async (id) => {
  validator.checkNonNull(id);
  validator.checkString(id);
  id = validator.isValidObjectID(id);
  const products = await productCollections();
  const oldProduct = await products.findOne({ _id: id });
  if (oldProduct === null) {
    const error = new Error(`No product found with id - ${id.toString()}`);
    error.code = errorCode.NOT_FOUND;
    throw error;
  }
  const product = await products.deleteOne({ _id: id });
  if (product.deletedCount === 0) {
    const error = new Error(
      `Could not delete restaurant with id: ${id.toString()}`
    );
    error.code = errorCode.NOT_FOUND;
    throw error;
  }
  return `${oldProduct.name}( id: ${oldProduct._id}) has been successfully deleted!`;
};

module.exports = {
  create,
  getById,
  getByQuery,
  getAll,
  update,
  remove,
};
