const express = require('express');
const app = express();

app.use(express.json());

let products = []; // In-memory array to store products
let nextId = 1; // Auto-incrementing ID

// POST /products – Add new product
app.post('/products', (req, res) => {
  const { name, price, category, stock } = req.body;

  if (!name || price == null || !category || stock == null) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const newProduct = {
    id: nextId++,
    name,
    price,
    category,
    stock,
  };

  products.push(newProduct);
  res.status(201).json({ message: 'Product added successfully', product: newProduct });
});

// GET /products – Retrieve all products
app.get('/products', (req, res) => {
  res.json(products);
});

// PUT /products/:id – Update product by ID
app.put('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const { name, price, category, stock } = req.body;
  const existingProduct = products[index];

  products[index] = {
    ...existingProduct,
    name: name || existingProduct.name,
    price: price != null ? price : existingProduct.price,
    category: category || existingProduct.category,
    stock: stock != null ? stock : existingProduct.stock,
  };

  res.json({ message: 'Product updated', product: products[index] });
});

// DELETE /products/:id – Remove product by ID
app.delete('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const deleted = products.splice(index, 1);
  res.json({ message: 'Product deleted', deleted });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Inventory API running on http://localhost:${PORT}`);
});