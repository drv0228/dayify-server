// server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");

const { resolve } = require("path");
// Replace if using a different env file or config
const env = require("dotenv").config({ path: "./.env" });

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

require("dotenv").config();
const PORT = process.env.PORT;

const app = express();

app.use(express.static(process.env.STATIC_DIR));

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

// Stripe
app.get("/", (req, res) => {
  const path = resolve(process.env.STATIC_DIR);
  res.sendFile(path);
});

app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.post("/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "USD",
      amount: 1999,
      automatic_payment_methods: { enabled: true },
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
