import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, Alert, ButtonGroup, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Web3Context } from '../context/Web3Context';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [sortBy, setSortBy] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [maxPrice, setMaxPrice] = useState(10000);
  const { addToCart } = useContext(Web3Context);

  useEffect(() => {
    fetchProducts();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [selectedCategory, products, sortBy, searchQuery, priceRange]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/products');
      setProducts(response.data);
      setFilteredProducts(response.data);
      
      const uniqueCategories = ['All', ...new Set(response.data.map(p => p.category))];
      setCategories(uniqueCategories);
      
      // Calculate max price
      const prices = response.data.map(p => p.priceUsd);
      const max = Math.max(...prices);
      setMaxPrice(Math.ceil(max));
      setPriceRange({ min: 0, max: Math.ceil(max) });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by price range
    filtered = filtered.filter(p => 
      p.priceUsd >= priceRange.min && p.priceUsd <= priceRange.max
    );    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.priceUsd - b.priceUsd);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.priceUsd - a.priceUsd);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'latest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    if (addToCart) {
      addToCart(product);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <h3 className="mt-3">Loading products...</h3>
      </Container>
    );
  }

  return (
    <div className="products-page-wrapper">
      <Container className="py-5">
        <div className="page-header fade-in-up mb-5">
          <h1 className="display-4 fw-bold mb-2" style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Discover Amazing Products
          </h1>
          <p className="lead text-muted">Browse our collection of premium electronics</p>
        </div>
        
        {!user && (
          <Alert variant="info" className="mb-4 fade-in">
            <strong>👋 Welcome!</strong> Sign in to add products to cart and make purchases
          </Alert>
        )}

        {/* Search and Filter Section */}
        <div className="filter-section fade-in">
          <Row className="g-3">
            {/* Search Bar */}
            <Col md={12}>
              <InputGroup size="lg">
                <InputGroup.Text>
                  <span style={{ fontSize: '1.2rem' }}>🔍</span>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search products by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ fontSize: '1rem' }}
                />
                {searchQuery && (
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setSearchQuery('')}
                  >
                    Clear
                  </Button>
                )}
              </InputGroup>
            </Col>

            {/* Sort By */}
            <Col md={4}>
              <Form.Label className="fw-bold">Sort By</Form.Label>
              <Form.Select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                size="lg"
              >
                <option value="latest">Latest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </Form.Select>
            </Col>

            {/* Price Range */}
            <Col md={8}>
              <Form.Label className="fw-bold">
                Price Range: ${priceRange.min} - ${priceRange.max}
              </Form.Label>
              <div className="d-flex gap-3 align-items-center">
                <Form.Control
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                  min={0}
                  max={maxPrice}
                />
                <span className="fw-bold">to</span>
                <Form.Control
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  min={0}
                  max={maxPrice}
                />
                <Button 
                  variant="outline-primary"
                  onClick={() => setPriceRange({ min: 0, max: maxPrice })}
                >
                  Reset
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        {/* Category Filter */}
        <div className="my-4 fade-in">
          <h5 className="mb-3 fw-bold">
            <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>📂</span>
            Categories
          </h5>
          <div className="d-flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'primary' : 'outline-primary'}
                onClick={() => setSelectedCategory(category)}
                className="category-btn"
                style={{
                  background: selectedCategory === category 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : 'white',
                  border: selectedCategory === category ? 'none' : '2px solid #667eea'
                }}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Badge bg="primary" className="p-3" style={{ fontSize: '1rem' }}>
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </Badge>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <h3 className="text-muted">No products found</h3>
            <p>Try adjusting your filters or search query</p>
            <Button 
              variant="primary" 
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setPriceRange({ min: 0, max: maxPrice });
              }}
            >
              Reset All Filters
            </Button>
          </div>
        ) : (
          <Row>
            {filteredProducts.map((product, index) => (
              <Col key={product._id} md={4} lg={3} className="mb-4">
                <Card 
                  className="product-card h-100"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    animation: 'fadeInUp 0.6s ease-out forwards',
                    opacity: 0
                  }}
                >
                  <div style={{ overflow: 'hidden', height: '250px' }}>
                    <Card.Img 
                      variant="top" 
                      src={product.image || 'https://via.placeholder.com/300'} 
                      alt={product.name}
                      style={{ 
                        height: '100%', 
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                      }}
                    />
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Badge bg="secondary" className="mb-2 align-self-start">
                      {product.category}
                    </Badge>
                    <Card.Title className="fw-bold">{product.name}</Card.Title>
                    <Card.Text className="text-muted flex-grow-1" style={{ fontSize: '0.9rem' }}>
                      {product.description.substring(0, 80)}...
                    </Card.Text>
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <h4 className="mb-0 fw-bold" style={{ color: '#667eea' }}>
                            ${product.priceUsd}
                          </h4>
                          <small className="text-muted">{product.priceEth} ETH</small>
                        </div>
                        <Badge bg="success" className="p-2">
                          In Stock
                        </Badge>
                      </div>
                      <div className="d-flex gap-2">
                        <Button 
                          as={Link} 
                          to={`/product/${product._id}`} 
                          variant="outline-primary" 
                          size="sm"
                          className="flex-grow-1"
                        >
                          View Details
                        </Button>
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => handleAddToCart(product)}
                          disabled={!user}
                          className="flex-grow-1"
                          style={{
                            background: user ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : undefined,
                            border: 'none'
                          }}
                        >
                          {user ? '🛒 Add' : '🔒 Sign In'}
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Products;
