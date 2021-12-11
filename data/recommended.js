const mongoCollections = require("../config/mongoCollections");
const productCollections = mongoCollections.products;
const userCollections = mongoCollections.users;
const validator = require("../helper/validator");
const utils = require("../helper/utils");
const errorCode = require("../helper/common").errorCode;
const userData = require("./users");
let { ObjectId } = require("mongodb");

async function getRecco(thiscategory, thisProdId) {
  validator.checkNonNull(thiscategory);
  if (Array.isArray(thiscategory) == false)
    throw "Category needs to be an array";
  const prodCol = await productCollections();
  const recProd = await prodCol
    .find(
      { category: { $in: thiscategory } },
      { projection: { name: 1, price: 1, images: 1 } }
    )
    .toArray();
  recProd.splice(
    recProd.findIndex(function (i) {
      return i._id.toString() == thisProdId;
    }),
    1
  );
  recProd.forEach((x, index) => {
    recProd[index]._id = x._id.toString();
    recProd[index].images = x.images[0];
  });
  return recProd;
}

module.exports = {
  getRecco,
};
