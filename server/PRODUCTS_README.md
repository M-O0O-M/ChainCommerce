# Electronic Products Database

## Product Categories

This e-commerce platform includes the following electronic product categories:

1. **Smartphones** - Latest flagship phones from Apple, Samsung, Google
2. **Laptops** - High-performance laptops for work and gaming
3. **Tablets** - Premium tablets with stylus support
4. **Audio** - Headphones and earbuds with noise cancellation
5. **Wearables** - Smartwatches and fitness trackers
6. **Cameras** - Professional mirrorless cameras
7. **Gaming** - Gaming consoles (PlayStation, Xbox, Nintendo)
8. **Smart Home** - Smart displays and home automation
9. **Monitors** - 4K displays for gaming and professional work
10. **Accessories** - Keyboards, mice, and peripherals
11. **Drones** - Consumer and professional drones

## Seeding the Database

To populate your database with electronic products:

```bash
cd server
npm run seed
```

This will:
- Clear existing products
- Add 27 electronic products across 11 categories
- Display a summary of added products

## API Endpoints

### Get all products
```
GET /api/products
```

### Get products by category
```
GET /api/products?category=Smartphones
GET /api/products?category=Laptops
GET /api/products?category=Gaming
```

### Get all categories
```
GET /api/products/categories
```

### Get single product
```
GET /api/products/:id
```

## Product Structure

Each product includes:
- `name` - Product name
- `description` - Detailed description
- `priceEth` - Price in ETH
- `category` - Product category
- `image` - Product image URL
- `stock` - Available quantity
