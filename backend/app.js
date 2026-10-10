require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const initialData = require('./data');

const app = express();
const PORT = process.env.PORT || 3000;


const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
  : '*';

app.use(cors({
  origin: allowedOrigins === '*' ? '*' : allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());


let products = [...initialData];


const MONGO_URI = process.env.MONGO_URI;
let isDbConnected = false;

if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => {
      isDbConnected = true;
      console.log('Successfully connected to MongoDB.');
    })
    .catch((err) => {
      console.warn('MongoDB connection fallback (running in in-memory mode):', err.message);
    });
} else {
  console.log('No MONGO_URI provided. Running backend in in-memory mode.');
}

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Backend Product API is running!',
    status: 'online',
    database: isDbConnected ? 'Connected (MongoDB)' : 'In-Memory Mode'
  });
});


app.get('/api/products', (req, res) => {
  res.json({ success: true, count: products.length, data: products });
});


app.get('/api/data', (req, res) => {
  res.json({ success: true, count: products.length, data: products });
});


app.post('/api/products', (req, res) => {
  const { name, title, price, category, description, inStock } = req.body;
  const productName = name || title;

  if (!productName) {
    return res.status(400).json({ success: false, message: 'Product name is required' });
  }

  const newProduct = {
    id: Date.now(),
    name: productName,
    price: Number(price) || 0.00,
    category: category || 'General',
    description: description || '',
    inStock: inStock !== undefined ? Boolean(inStock) : true
  };

  products.unshift(newProduct);
  res.status(201).json({ success: true, message: 'Product created successfully', data: newProduct });
});


app.post('/api/data', (req, res) => {
  const { name, title, price, category, description, inStock } = req.body;
  const productName = name || title;

  if (!productName) {
    return res.status(400).json({ success: false, message: 'Product name is required' });
  }

  const newProduct = {
    id: Date.now(),
    name: productName,
    price: Number(price) || 0.00,
    category: category || 'General',
    description: description || '',
    inStock: inStock !== undefined ? Boolean(inStock) : true
  };

  products.unshift(newProduct);
  res.status(201).json({ success: true, message: 'Product created successfully', data: newProduct });
});

// DELETE a product
app.delete('/api/products/:id', (req, res) => {
  const productId = Number(req.params.id);
  const initialLength = products.length;
  products = products.filter(p => p.id !== productId);

  if (products.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  res.json({ success: true, message: 'Product deleted successfully' });
});

// DELETE alias /api/data/:id
app.delete('/api/data/:id', (req, res) => {
  const productId = Number(req.params.id);
  const initialLength = products.length;
  products = products.filter(p => p.id !== productId);

  if (products.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  res.json({ success: true, message: 'Product deleted successfully' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(` Server running on http://localhost:${PORT}`);
  console.log(`=================================`);
});
