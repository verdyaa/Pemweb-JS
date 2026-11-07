const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const parseId = (req) => Number(req.params.id ?? req.body?.id);

const validateInput = (name, price) =>
  typeof name === 'string' && name.trim() !== '' && typeof price === 'number' && !Number.isNaN(price);

const getProducts = async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
};

const getProductById = async (req, res) => {
  const id = parseId(req);
  if (!id) return res.status(400).json({ message: 'Valid id is required' });
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

const createProduct = async (req, res) => {
  const { name, price } = req.body || {};
  if (!validateInput(name, price)) {
    return res.status(400).json({ message: 'Valid name and numeric price are required' });
  }
  const newProduct = await prisma.product.create({
    data: { name: name.trim(), price },
  });
  res.status(201).json(newProduct);
};

const updateProduct = async (req, res) => {
  const id = parseId(req);
  const { name, price } = req.body || {};
  if (!id || !validateInput(name, price)) {
    return res.status(400).json({ message: 'Valid id, name, and numeric price are required' });
  }
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: 'Product not found' });

  const updated = await prisma.product.update({
    where: { id },
    data: { name: name.trim(), price },
  });
  res.json(updated);
};

const deleteProduct = async (req, res) => {
  const id = parseId(req);
  if (!id) return res.status(400).json({ message: 'Valid id is required' });
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: 'Product not found' });

  await prisma.product.delete({ where: { id } });
  res.json({ message: 'Product deleted', data: existing });
};

module.exports = {
  prisma,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
