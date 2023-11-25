// server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");

require("dotenv").config();
const PORT = process.env.PORT;

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

function readProductsFile() {
  const productsList = fs.readFileSync("./data/products.json");
  const parsedProductsList = JSON.parse(productsList);
  return parsedProductsList;
}

app.get("/products", (req, res) => {
  const products = readProductsFile();
  res.json(products);
});

app.get("/search", (req, res) => {
  const query = req.query.q;
  const products = readProductsFile();
  const searchResults = products.filter((product) =>
    product.title.toLowerCase().includes(query.toLowerCase())
  );
  res.json(searchResults);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
