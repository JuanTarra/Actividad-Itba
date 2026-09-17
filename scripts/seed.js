require('dotenv').config();

const mongoose = require('mongoose');

const Category = require('../src/models/Category');
const Product = require('../src/models/Product');
const Order = require('../src/models/Order');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('[seed] Conectado a MongoDB');

  await Promise.all([
    Category.deleteMany({}),
    Product.deleteMany({}),
    Order.deleteMany({}),
  ]);
  console.log('[seed] Colecciones limpiadas');

  const categories = await Category.insertMany([
    { name: 'Electrónica', description: 'Dispositivos y accesorios electrónicos' },
    { name: 'Hogar', description: 'Artículos para el hogar' },
    { name: 'Indumentaria', description: 'Ropa y calzado' },
  ]);

  const [electronica, hogar, indumentaria] = categories;

  const products = await Product.insertMany([
    {
      name: 'Auriculares Bluetooth',
      description: 'Auriculares inalámbricos con cancelación de ruido',
      price: 45999,
      stock: 25,
      category: electronica._id,
    },
    {
      name: 'Teclado Mecánico',
      description: 'Teclado mecánico retroiluminado RGB',
      price: 38500,
      stock: 15,
      category: electronica._id,
    },
    {
      name: 'Cafetera Eléctrica',
      description: 'Cafetera de filtro para 12 tazas',
      price: 29900,
      stock: 10,
      category: hogar._id,
    },
    {
      name: 'Set de Sábanas',
      description: 'Juego de sábanas 2 plazas, 100% algodón',
      price: 18750,
      stock: 30,
      category: hogar._id,
    },
    {
      name: 'Zapatillas Running',
      description: 'Zapatillas deportivas para running',
      price: 52999,
      stock: 20,
      category: indumentaria._id,
    },
    {
      name: 'Campera Impermeable',
      description: 'Campera rompevientos con capucha',
      price: 41200,
      stock: 12,
      category: indumentaria._id,
    },
  ]);

  await Order.insertMany([
    {
      customerName: 'Cliente Testing',
      customerEmail: 'cliente@agencia01.test',
      items: [
        { product: products[0]._id, quantity: 1, unitPrice: products[0].price },
        { product: products[3]._id, quantity: 2, unitPrice: products[3].price },
      ],
      discountCode: 'BIENVENIDA10',
      total: (products[0].price + products[3].price * 2) * 0.9,
      status: 'paid',
    },
  ]);

  console.log('[seed] Datos de testing insertados:');
  console.log(`  - ${categories.length} categorías`);
  console.log(`  - ${products.length} productos`);
  console.log('  - 1 orden de ejemplo');

  await mongoose.disconnect();
  console.log('[seed] Listo. Conexión cerrada.');
}

seed().catch((err) => {
  console.error('[seed] Error:', err);
  process.exit(1);
});
