import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Web3Context } from '../context/Web3Context';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const { addToCart } = useContext(Web3Context);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  if (!product) {
    return (
      <Container className="py-5 text-center">
        <h3>Loading...</h3>
      </Container>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      alert('Please sign in to add items to cart');
      navigate('/signin');
      return;
    }
    addToCart(product);
    alert('Added to cart!');
  };

  return (
    <Container className="py-5">
      {!user && (
        <Alert variant="info" className="mb-4">
          👋 Sign in to add this product to cart and make a purchase
        </Alert>
      )}
      <Row>
        <Col md={6}>
          <img 
            src={product.image || 'https://via.placeholder.com/500'} 
            alt={product.name}
            className="img-fluid rounded"
          />
        </Col>
        <Col md={6}>
          <h2>{product.name}</h2>
          <h3 className="text-primary my-3">${product.priceUsd}</h3>
          <p className="lead">{product.description}</p>
          <Card className="mb-3">
            <Card.Body>
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>Stock:</strong> {product.stock} available</p>
            </Card.Body>
          </Card>
          <Button 
            variant="primary" 
            size="lg"
            onClick={handleAddToCart}
            disabled={!user}
          >
            {user ? 'Add to Cart' : 'Sign In to Buy'}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
