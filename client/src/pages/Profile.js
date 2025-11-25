import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Row, Col, Button, Badge, ListGroup, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Web3Context } from '../context/Web3Context';

const Profile = () => {
  const { account, balance, connectWallet, disconnectWallet } = useContext(Web3Context);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/signin');
    }
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    disconnectWallet();
    navigate('/');
  };

  const formatBalance = (bal) => {
    return parseFloat(bal).toFixed(4);
  };

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <h3>Loading...</h3>
      </Container>
    );
  }

  return (
    <div className="profile-page-wrapper" style={{ 
      background: 'rgba(255, 255, 255, 0.05)',
      minHeight: '100vh',
      paddingBottom: '3rem'
    }}>
      <Container className="py-5">
        <div className="mb-5 fade-in-up">
          <h1 className="display-5 fw-bold mb-2" style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            👤 My Profile
          </h1>
          <p className="lead text-muted">Manage your account and wallet</p>
        </div>

        <Row className="g-4">
          {/* User Information Card */}
          <Col md={6}>
            <Card className="glass-card border-0 h-100">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-4">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      fontSize: '2rem'
                    }}
                  >
                    👤
                  </div>
                  <div>
                    <h3 className="mb-1 fw-bold">{user.name}</h3>
                    <p className="text-muted mb-0">{user.email}</p>
                  </div>
                </div>

                <ListGroup variant="flush">
                  <ListGroup.Item className="px-0 py-3 border-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Account Status</strong>
                        <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                          Active Member
                        </div>
                      </div>
                      <Badge bg="success" style={{ fontSize: '0.875rem' }}>
                        ✓ Verified
                      </Badge>
                    </div>
                  </ListGroup.Item>

                  <ListGroup.Item className="px-0 py-3 border-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Authentication Method</strong>
                        <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                          {user.authMethod === 'google' ? '🔵 Google' : '📧 Email'}
                        </div>
                      </div>
                    </div>
                  </ListGroup.Item>

                  <ListGroup.Item className="px-0 py-3 border-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Member Since</strong>
                        <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                          {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  </ListGroup.Item>
                </ListGroup>

                <div className="mt-4">
                  <Button 
                    variant="outline-danger" 
                    onClick={handleSignOut}
                    className="w-100"
                    style={{
                      fontWeight: '600',
                      padding: '0.75rem',
                      borderRadius: '12px',
                      borderWidth: '2px'
                    }}
                  >
                    🚪 Sign Out
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Wallet Connection Card */}
          <Col md={6}>
            <Card className="glass-card border-0 h-100">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-4">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: '80px',
                      height: '80px',
                      background: account 
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      fontSize: '2rem'
                    }}
                  >
                    {account ? '💰' : '🦊'}
                  </div>
                  <div>
                    <h3 className="mb-1 fw-bold">Wallet Status</h3>
                    <p className="text-muted mb-0">
                      {account ? 'Connected' : 'Not Connected'}
                    </p>
                  </div>
                </div>

                {account ? (
                  <>
                    <Alert variant="success" className="mb-3">
                      <div className="d-flex align-items-center">
                        <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>✅</span>
                        <div>
                          <strong>Wallet Connected</strong>
                          <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                            Ready for crypto payments
                          </div>
                        </div>
                      </div>
                    </Alert>

                    <ListGroup variant="flush">
                      <ListGroup.Item className="px-0 py-3 border-0">
                        <div>
                          <strong>Wallet Address</strong>
                          <div 
                            className="text-muted mt-1" 
                            style={{ 
                              fontSize: '0.875rem',
                              wordBreak: 'break-all',
                              fontFamily: 'monospace'
                            }}
                          >
                            {account}
                          </div>
                        </div>
                      </ListGroup.Item>

                      <ListGroup.Item className="px-0 py-3 border-0">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>Balance</strong>
                            <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                              Available funds
                            </div>
                          </div>
                          <Badge 
                            bg="success" 
                            style={{ 
                              fontSize: '1rem',
                              padding: '0.5rem 1rem'
                            }}
                          >
                            {formatBalance(balance)} ETH
                          </Badge>
                        </div>
                      </ListGroup.Item>

                      <ListGroup.Item className="px-0 py-3 border-0">
                        <div>
                          <strong>Network</strong>
                          <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                            Ethereum Mainnet / Testnet
                          </div>
                        </div>
                      </ListGroup.Item>
                    </ListGroup>

                    <div className="mt-4">
                      <Button 
                        variant="outline-danger" 
                        onClick={disconnectWallet}
                        className="w-100"
                        style={{
                          fontWeight: '600',
                          padding: '0.75rem',
                          borderRadius: '12px',
                          borderWidth: '2px'
                        }}
                      >
                        🔌 Disconnect Wallet
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Alert variant="warning" className="mb-3">
                      <div className="d-flex align-items-center">
                        <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>⚠️</span>
                        <div>
                          <strong>No Wallet Connected</strong>
                          <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                            Connect your MetaMask wallet to make crypto payments
                          </div>
                        </div>
                      </div>
                    </Alert>

                    <div className="mb-3 p-3" style={{
                      background: 'rgba(102, 126, 234, 0.1)',
                      borderRadius: '12px',
                      border: '2px solid rgba(102, 126, 234, 0.2)'
                    }}>
                      <h6 className="fw-bold mb-2">Why Connect Your Wallet?</h6>
                      <ul className="mb-0" style={{ fontSize: '0.875rem', paddingLeft: '1.25rem' }}>
                        <li>Pay with cryptocurrency (ETH)</li>
                        <li>Secure blockchain transactions</li>
                        <li>Track orders on-chain</li>
                        <li>Access exclusive Web3 features</li>
                      </ul>
                    </div>

                    <div className="mt-4">
                      <Button 
                        variant="primary" 
                        onClick={connectWallet}
                        className="w-100"
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: 'none',
                          fontWeight: '700',
                          padding: '0.75rem',
                          borderRadius: '12px',
                          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                        }}
                      >
                        🦊 Connect MetaMask Wallet
                      </Button>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Additional Info Card */}
        <Row className="mt-4">
          <Col>
            <Card className="glass-card border-0">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-3">🔐 Security & Privacy</h5>
                <Row>
                  <Col md={4} className="mb-3 mb-md-0">
                    <div className="text-center p-3">
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛡️</div>
                      <strong>Secure Authentication</strong>
                      <div className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        Your account is protected with industry-standard security
                      </div>
                    </div>
                  </Col>
                  <Col md={4} className="mb-3 mb-md-0">
                    <div className="text-center p-3">
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔒</div>
                      <strong>Encrypted Data</strong>
                      <div className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        All your personal information is encrypted
                      </div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="text-center p-3">
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⛓️</div>
                      <strong>Blockchain Security</strong>
                      <div className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        Transactions secured by Ethereum blockchain
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;
