const express = require('express');
const productRoutes = require('./routes/productRoutes');

const app = express();
app.use(express.json());
app.use('/products', productRoutes);

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
