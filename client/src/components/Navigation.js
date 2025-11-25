import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Badge, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Web3Context } from '../context/Web3Context';
import Logo from './Logo';

const Navigation = () => {
  const { account, balance, cart, connectWallet, disconnectWallet } = useContext(Web3Context);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(38)}`;
  };

  const formatBalance = (bal) => {
    return parseFloat(bal).toFixed(4);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    disconnectWallet();
    navigate('/');
  };

  const handleWalletClick = () => {
    if (account) {
      // Already connected, show options
      return;
    } else {
      connectWallet();
    }
  };

  const walletTooltip = (props) => (
    <Tooltip id="wallet-tooltip" {...props}>
      {account ? `Balance: ${formatBalance(balance)} ETH` : 'Connect your MetaMask wallet'}
    </Tooltip>
  );

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow">
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ padding: '0.5rem 0' }}>
          <Logo size={70} showText={true} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="fw-semibold">Home</Nav.Link>
            <Nav.Link as={Link} to="/products" className="fw-semibold">Products</Nav.Link>
            {user && (
              <Nav.Link as={Link} to="/cart" className="fw-semibold position-relative">
                🛒 Cart 
                {cart.length > 0 && (
                  <Badge 
                    bg="danger" 
                    className="ms-2"
                    style={{
                      animation: 'pulse 2s infinite',
                      fontSize: '0.75rem'
                    }}
                  >
                    {cart.length}
                  </Badge>
                )}
              </Nav.Link>
            )}
          </Nav>
          <Nav className="align-items-center">
            {user ? (
              <>
                {/* Wallet Connection */}
                {account ? (
                  <Dropdown align="end" className="me-2">
                    <OverlayTrigger placement="bottom" overlay={walletTooltip}>
                      <Dropdown.Toggle 
                        variant="success" 
                        size="sm"
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          border: 'none',
                          fontWeight: '600',
                          padding: '0.5rem 1rem',
                          borderRadius: '50px'
                        }}
                      >
                        💰 {formatAddress(account)}
                      </Dropdown.Toggle>
                    </OverlayTrigger>
                    <Dropdown.Menu>
                      <Dropdown.Item disabled>
                        <strong>Balance</strong>
                        <div className="text-success">{formatBalance(balance)} ETH</div>
                      </Dropdown.Item>
                      <Dropdown.Item disabled>
                        <strong>Address</strong>
                        <div style={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>
                          {account}
                        </div>
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={disconnectWallet} className="text-danger">
                        🔌 Disconnect Wallet
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                ) : (
                  <OverlayTrigger placement="bottom" overlay={walletTooltip}>
                    <Button 
                      variant="outline-warning" 
                      size="sm" 
                      onClick={handleWalletClick}
                      className="me-2"
                      style={{
                        fontWeight: '600',
                        padding: '0.5rem 1rem',
                        borderRadius: '50px',
                        borderWidth: '2px'
                      }}
                    >
                      🦊 Connect Wallet
                    </Button>
                  </OverlayTrigger>
                )}

                {/* User Dropdown */}
                <Dropdown align="end">
                  <Dropdown.Toggle 
                    variant="outline-light" 
                    id="user-dropdown" 
                    size="sm"
                    style={{
                      fontWeight: '600',
                      padding: '0.5rem 1rem',
                      borderRadius: '50px',
                      borderWidth: '2px'
                    }}
                  >
                    👤 {user.name}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item disabled>
                      <strong>{user.name}</strong>
                      <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                        {user.email}
                      </div>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item as={Link} to="/profile">
                      👤 My Profile
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/cart">
                      🛒 My Cart ({cart.length})
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleSignOut} className="text-danger">
                      🚪 Sign Out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Button 
                  as={Link} 
                  to="/signin" 
                  variant="outline-light" 
                  size="sm"
                  className="me-2"
                  style={{
                    fontWeight: '600',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '50px',
                    borderWidth: '2px'
                  }}
                >
                  Sign In
                </Button>
                <Button 
                  as={Link} 
                  to="/signup" 
                  size="sm"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    fontWeight: '600',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '50px'
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
