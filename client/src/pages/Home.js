import React from 'react';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const Home = () => {
  const features = [
    {
      icon: '🔐',
      title: 'Secure Payments',
      description: 'Blockchain-powered transactions ensure security and transparency',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Quick checkout with MetaMask wallet integration',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: '🌍',
      title: 'Global Reach',
      description: 'Accept payments from anywhere in the world',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      icon: '💎',
      title: 'Premium Quality',
      description: 'Curated selection of top-tier electronics',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
      icon: '🎯',
      title: 'Best Prices',
      description: 'Competitive pricing on all products',
      gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
    },
    {
      icon: '🚀',
      title: 'Fast Shipping',
      description: 'Free worldwide shipping on orders over $100',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    }
  ];

  return (
    <>
      <div className="hero-section" style={{
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          animation: 'pulse 4s ease-in-out infinite'
        }}></div>
        <Container className="text-center position-relative" style={{ zIndex: 1 }}>
          <div className="fade-in-up">
            <div style={{ marginBottom: '2rem', animation: 'float 3s ease-in-out infinite', display:'none'}}>
              <Logo size={180} showText={false}/>
            </div>
            <h1 className="display-2 fw-bold mb-4" style={{
              fontFamily: 'Poppins, sans-serif',
              letterSpacing: '-2px',
              position: 'relative'
            }}>
              <span style={{ color: 'white', textShadow: '2px 4px 8px rgba(0, 0, 0, 0.3)' }}>Welcome to </span>
              <span style={{
                color: '#fbbf24',
                display: 'inline-block',
                filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.8)) drop-shadow(0 0 40px rgba(245, 158, 11, 0.6))',
                animation: 'textGlow 2s ease-in-out infinite',
                position: 'relative',
                fontWeight: '900'
              }}>
                ChainCommerce
              </span>
            </h1>
            <p className="lead mb-5 text-white" style={{
              fontSize: '1.5rem',
              textShadow: '1px 2px 4px rgba(0, 0, 0, 0.2)',
              maxWidth: '700px',
              margin: '0 auto 2rem'
            }}>
              Shop with cryptocurrency. Pay with MetaMask. Experience the future of e-commerce.
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Button 
                as={Link} 
                to="/products" 
                size="lg"
                style={{
                  background: 'white',
                  color: '#667eea',
                  border: 'none',
                  padding: '1rem 3rem',
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  borderRadius: '50px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                className="btn-hover-lift"
              >
                🛍️ Browse Products
              </Button>
            </div>
          </div>
        </Container>
      </div>
      
      <Container className="py-5">
        <div className="text-center mb-5 fade-in">
          <h2 className="display-5 fw-bold mb-3" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Why Choose Us?
          </h2>
          <p className="lead text-muted">Experience the future of blockchain-powered shopping</p>
        </div>
        
        <Row className="g-4">
          {features.map((feature, index) => (
            <Col key={index} md={6} lg={4}>
              <Card 
                className="h-100 border-0 glass-card"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: 'fadeInUp 0.6s ease-out forwards',
                  opacity: 0
                }}
              >
                <Card.Body className="text-center p-4">
                  <div 
                    className="mb-3"
                    style={{
                      fontSize: '4rem',
                      background: feature.gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      display: 'inline-block'
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h4 className="fw-bold mb-3">{feature.title}</h4>
                  <p className="text-muted mb-0">{feature.description}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="text-center mt-5 pt-5">
          <Card className="glass-card border-0 p-5">
            <h3 className="fw-bold mb-3">Ready to Start Shopping?</h3>
            <p className="lead text-muted mb-4">
              Join thousands of satisfied customers worldwide
            </p>
            <Button 
              as={Link} 
              to="/products" 
              size="lg"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                padding: '1rem 3rem',
                fontSize: '1.1rem',
                fontWeight: '700',
                borderRadius: '50px',
                boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)'
              }}
            >
              Explore Products Now →
            </Button>
          </Card>
        </div>
      </Container>
    </>
  );
};

export default Home;
