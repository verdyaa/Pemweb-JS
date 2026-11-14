const { prisma } = require('../controllers/productController');

async function seed() {
  await prisma.product.deleteMany();
  await prisma.$executeRawUnsafe("DELETE FROM sqlite_sequence WHERE name='Product';").catch(() => {});
  const items = [
    { name: 'Pulpen', price: 5000 },
    { name: 'Buku Tulis', price: 12000 },
    { name: 'Spidol', price: 8000 },
    { name: 'Penggaris', price: 6000 },
    { name: 'Penghapus', price: 3000 },
  ];
  for (const item of items) {
    await prisma.product.create({ data: item });
  }
  await prisma.$disconnect();
}

seed();
