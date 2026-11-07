const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('./index');
const { prisma } = require('./controllers/productController');

let server;
let baseUrl;

test.before(async () => {
  await prisma.product.deleteMany();
  await prisma.product.createMany({
    data: [
      { id: 1, name: 'Laptop', price: 12000000 },
      { id: 2, name: 'Mouse', price: 150000 },
    ],
  });
  server = app.listen(0);
  baseUrl = `http://localhost:${server.address().port}`;
});

test.after(async () => {
  server.close();
  await prisma.$disconnect();
});

test('GET /products returns all products (200)', async () => {
  const res = await fetch(`${baseUrl}/products`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.length, 2);
});

test('GET /products/:id returns product detail or 404', async () => {
  const ok = await fetch(`${baseUrl}/products/1`);
  assert.equal(ok.status, 200);
  const notFound = await fetch(`${baseUrl}/products/999`);
  assert.equal(notFound.status, 404);
});

test('POST /products creates product (201) and validates input (400)', async () => {
  const created = await fetch(`${baseUrl}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Keyboard', price: 350000 }),
  });
  assert.equal(created.status, 201);
  const body = await created.json();
  assert.equal(body.name, 'Keyboard');

  const invalid = await fetch(`${baseUrl}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: '' }),
  });
  assert.equal(invalid.status, 400);
});

test('PUT /products updates product with id in body (200) and returns 404/400 on error', async () => {
  const updated = await fetch(`${baseUrl}/products`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: 1, name: 'Laptop Gaming', price: 15000000 }),
  });
  assert.equal(updated.status, 200);
  const body = await updated.json();
  assert.equal(body.name, 'Laptop Gaming');
  assert.equal(body.price, 15000000);

  const notFound = await fetch(`${baseUrl}/products`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: 999, name: 'Ghost', price: 1000 }),
  });
  assert.equal(notFound.status, 404);
});

test('DELETE /products/:id deletes product (200) and returns 404 if missing', async () => {
  const deleted = await fetch(`${baseUrl}/products/2`, { method: 'DELETE' });
  assert.equal(deleted.status, 200);

  const missing = await fetch(`${baseUrl}/products/2`, { method: 'DELETE' });
  assert.equal(missing.status, 404);
});
