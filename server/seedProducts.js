const products = require('./productsData');

// Since we're using in-memory storage, this script just displays product info
function displayProductInfo() {
  console.log('Products loaded from productsData.js');
  console.log(`Total products: ${products.length}`);

  // Display category summary
  const categories = [...new Set(products.map(p => p.category))];
  console.log('\nCategories available:');
  categories.forEach(cat => {
    const count = products.filter(p => p.category === cat).length;
    console.log(`  - ${cat}: ${count} products`);
  });

  console.log('\nProducts are loaded in-memory when the server starts.');
  console.log('No database seeding required!');
}

displayProductInfo();
