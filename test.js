var mongoose = require('mongoose');
var Currency = require("./index.js").loadType(mongoose);
var Schema = mongoose.Schema;

var ProductSchema = Schema({
  price: { type: Currency },
});
var Product = mongoose.model("Product", ProductSchema);
var product = new Product({ price: "500" });
console.log(product.price);
