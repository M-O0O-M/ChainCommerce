import React, { useContext, useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Web3Context } from '../context/Web3Context';
import { ethers } from 'ethers';
import axios from 'axios';
import { createOrderOnChain, getContractAddress } from '../utils/contractHelper';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, account, signer, balance, connectWallet } = useContext(Web3Context);
  const [processing, setProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [useSmartContract, setUseSmartContract] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Redirect to sign in if not logged in
      navigate('/signin');
    }
  }, [navigate]);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (parseFloat(item.priceUsd) * item.quantity), 0);
  };

  const calculateTotalEth = () => {
    return cart.reduce((total, item) => total + (parseFloat(item.priceEth) * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    if (!selectedPayment) {
      alert('Please select a payment method!');
      return;
    }

    // Auto-connect wallet if crypto payment is selected and wallet is not connected
    if (selectedPayment === 'crypto' && !account) {
      setProcessing(true);
      try {
        const connectedAccount = await connectWallet();
        if (!connectedAccount) {
          alert('⚠️ Wallet connection failed!\n\nPlease make sure MetaMask is installed and try again.');
          setProcessing(false);
          return;
        }
        // Wait a moment for state to update
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        alert('⚠️ Failed to connect wallet!\n\nError: ' + error.message);
        setProcessing(false);
        return;
      }
    }

    setProcessing(true);
    try {
      if (selectedPayment === 'crypto') {

        const totalEth = calculateTotalEth();
        let txHash, orderId;

        if (useSmartContract) {
          try {
            // Use smart contract
            const productIds = cart.map(item => item._id);
            const result = await createOrderOnChain(signer, productIds, totalEth);
            txHash = result.txHash;
            orderId = result.orderId;
            
            alert(`✅ Order created on blockchain!\n\n🆔 Order ID: ${orderId}\n📝 Transaction: ${txHash}\n\nYour order has been recorded on the blockchain for full transparency and traceability.`);
          } catch (error) {
            console.error('Smart contract error:', error);
            alert('⚠️ Smart contract not deployed. Using direct transfer...\n\nYour payment will still be processed securely.');
            
            // Fallback to direct transfer
            const tx = await signer.sendTransaction({
              to: getContractAddress() || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
              value: ethers.parseEther(totalEth.toString())
            });
            await tx.wait();
            txHash = tx.hash;
            alert(`✅ Payment successful!\n\n📝 Transaction Hash: ${txHash}\n\nYou can view your transaction on Etherscan.`);
          }
        } else {
          // Direct transfer
          const tx = await signer.sendTransaction({
            to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
            value: ethers.parseEther(totalEth.toString())
          });
          await tx.wait();
          txHash = tx.hash;
          alert(`✅ Payment successful!\n\n📝 Transaction Hash: ${txHash}\n\nYou can view your transaction on Etherscan.`);
        }

        // Record order in backend
        await axios.post('http://localhost:5001/api/orders', {
          walletAddress: account,
          items: cart,
          totalEth: totalEth,
          totalUsd: calculateTotal(),
          paymentMethod: 'Crypto (ETH)',
          txHash: txHash,
          blockchainOrderId: orderId || 'N/A'
        });
      } else {
        // Simulate other payment methods
        await axios.post('http://localhost:5001/api/orders', {
          walletAddress: account || 'N/A',
          items: cart,
          totalUsd: calculateTotal(),
          paymentMethod: selectedPayment,
          txHash: 'N/A'
        });

        alert(`✅ Payment successful via ${selectedPayment}!\n\nThank you for your purchase. You will receive a confirmation email shortly.`);
      }
      
      // Clear cart
      cart.forEach(item => removeFromCart(item._id));
      setShowPaymentModal(false);
      
    } catch (error) {
      console.error('Checkout error:', error);
      alert(`❌ Payment failed!\n\nError: ${error.message}\n\nPlease try again or contact support if the problem persists.`);
    } finally {
      setProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
      </Container>
    );
  }

  return (
    <div className="cart-page-wrapper" style={{ 
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
            🛒 Shopping Cart
          </h1>
          <p className="lead text-muted">Review your items before checkout</p>
        </div>

        <div className="glass-card p-4 mb-4">
          <Table responsive className="mb-0" style={{ border: 'none' }}>
            <thead style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <tr>
                <th style={{ borderRadius: '12px 0 0 0', padding: '1rem' }}>Product</th>
                <th style={{ padding: '1rem' }}>Price</th>
                <th style={{ padding: '1rem' }}>Quantity</th>
                <th style={{ padding: '1rem' }}>Subtotal</th>
                <th style={{ borderRadius: '0 12px 0 0', padding: '1rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={item._id} style={{
                  animation: `fadeInUp 0.4s ease-out ${index * 0.1}s forwards`,
                  opacity: 0
                }}>
                  <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                    <div className="d-flex align-items-center">
                      <div>
                        <strong>{item.name}</strong>
                        <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                          {item.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                    <strong style={{ color: '#667eea' }}>${item.priceUsd}</strong>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {item.priceEth} ETH
                    </div>
                  </td>
                  <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                    <Form.Control
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                      style={{ 
                        width: '80px',
                        borderRadius: '8px',
                        border: '2px solid #e5e7eb',
                        fontWeight: '600'
                      }}
                    />
                  </td>
                  <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                    <strong style={{ fontSize: '1.1rem', color: '#10b981' }}>
                      ${(parseFloat(item.priceUsd) * item.quantity).toFixed(2)}
                    </strong>
                  </td>
                  <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => removeFromCart(item._id)}
                      style={{
                        borderRadius: '8px',
                        fontWeight: '600',
                        padding: '0.5rem 1rem'
                      }}
                    >
                      🗑️ Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        
        <div className="glass-card p-4">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="d-flex align-items-center gap-3">
                <div className="p-3" style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '12px',
                  color: 'white'
                }}>
                  <h2 className="mb-0">🛍️</h2>
                </div>
                <div>
                  <div className="text-muted mb-1">Total Amount</div>
                  <h3 className="mb-0 fw-bold" style={{ color: '#667eea' }}>
                    ${calculateTotal().toFixed(2)}
                  </h3>
                  <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                    ≈ {calculateTotalEth().toFixed(4)} ETH
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 text-md-end mt-3 mt-md-0">
              <Button 
                size="lg"
                onClick={handleCheckout}
                disabled={processing}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  fontWeight: '700',
                  padding: '1rem 3rem',
                  borderRadius: '50px',
                  boxShadow: '0 8px 30px rgba(16, 185, 129, 0.4)',
                  fontSize: '1.1rem'
                }}
              >
                {processing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Processing...
                  </>
                ) : (
                  <>💳 Proceed to Payment</>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        <Modal 
        show={showPaymentModal} 
        onHide={() => setShowPaymentModal(false)} 
        centered
        size="lg"
      >
        <Modal.Header closeButton style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderBottom: 'none'
        }}>
          <Modal.Title>
            <span style={{ fontSize: '1.5rem' }}>💳</span> Select Payment Method
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '2rem' }}>
          {/* Wallet Connection Alert */}
          {selectedPayment === 'crypto' && !account && (
            <Alert variant="info" className="mb-3">
              <strong>🦊 Wallet Connection Required</strong>
              <p className="mb-0 mt-2">
                Click "Connect Wallet & Pay" to connect your MetaMask wallet and complete the payment.
              </p>
            </Alert>
          )}

          {/* Wallet Connected Info */}
          {selectedPayment === 'crypto' && account && (
            <Alert variant="success" className="mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>✅ Wallet Connected</strong>
                  <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {account.substring(0, 10)}...{account.substring(account.length - 8)}
                  </div>
                </div>
                <Badge bg="success" style={{ fontSize: '0.875rem' }}>
                  {parseFloat(balance).toFixed(4)} ETH
                </Badge>
              </div>
            </Alert>
          )}

          {/* Smart Contract Option */}
          {selectedPayment === 'crypto' && (
            <Alert 
              variant="info" 
              className="mb-3"
              style={{
                background: 'rgba(102, 126, 234, 0.1)',
                border: '2px solid rgba(102, 126, 234, 0.3)',
                borderRadius: '12px'
              }}
            >
              <Form.Check 
                type="checkbox"
                label={
                  <span>
                    <strong>Use Smart Contract</strong>
                    <span className="text-muted d-block" style={{ fontSize: '0.875rem' }}>
                      Recommended for order tracking and blockchain verification
                    </span>
                  </span>
                }
                checked={useSmartContract}
                onChange={(e) => setUseSmartContract(e.target.checked)}
                style={{ fontSize: '1rem' }}
              />
              {useSmartContract && (
                <div className="mt-2 p-2" style={{ 
                  background: 'rgba(16, 185, 129, 0.1)', 
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}>
                  ✅ Your order will be recorded on the blockchain with full traceability
                  <br />
                  ✅ Immutable proof of purchase
                  <br />
                  ✅ Enhanced security and transparency
                </div>
              )}
            </Alert>
          )}

          {/* Payment Methods */}
          <div className="d-grid gap-3">
            <Button
              variant={selectedPayment === 'crypto' ? 'primary' : 'outline-primary'}
              size="lg"
              onClick={() => setSelectedPayment('crypto')}
              style={{
                background: selectedPayment === 'crypto' 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                  : 'white',
                border: selectedPayment === 'crypto' ? 'none' : '2px solid #667eea',
                fontWeight: '600',
                padding: '1rem',
                borderRadius: '12px',
                transition: 'all 0.3s ease'
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <span>💰 Crypto (ETH)</span>
                <Badge bg={selectedPayment === 'crypto' ? 'light' : 'primary'} 
                       style={{ 
                         color: selectedPayment === 'crypto' ? '#667eea' : 'white',
                         fontSize: '0.875rem'
                       }}>
                  {calculateTotalEth().toFixed(4)} ETH
                </Badge>
              </div>
            </Button>
            <Button
              variant={selectedPayment === 'Credit Card' ? 'primary' : 'outline-primary'}
              size="lg"
              onClick={() => setSelectedPayment('Credit Card')}
              style={{
                background: selectedPayment === 'Credit Card' 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                  : 'white',
                border: selectedPayment === 'Credit Card' ? 'none' : '2px solid #667eea',
                fontWeight: '600',
                padding: '1rem',
                borderRadius: '12px'
              }}
            >
              💳 Credit Card
            </Button>
            <Button
              variant={selectedPayment === 'PayPal' ? 'primary' : 'outline-primary'}
              size="lg"
              onClick={() => setSelectedPayment('PayPal')}
              style={{
                background: selectedPayment === 'PayPal' 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                  : 'white',
                border: selectedPayment === 'PayPal' ? 'none' : '2px solid #667eea',
                fontWeight: '600',
                padding: '1rem',
                borderRadius: '12px'
              }}
            >
              🅿️ PayPal
            </Button>
            <Button
              variant={selectedPayment === 'Apple Pay' ? 'primary' : 'outline-primary'}
              size="lg"
              onClick={() => setSelectedPayment('Apple Pay')}
              style={{
                background: selectedPayment === 'Apple Pay' 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                  : 'white',
                border: selectedPayment === 'Apple Pay' ? 'none' : '2px solid #667eea',
                fontWeight: '600',
                padding: '1rem',
                borderRadius: '12px'
              }}
            >
              🍎 Apple Pay
            </Button>
            <Button
              variant={selectedPayment === 'Google Pay' ? 'primary' : 'outline-primary'}
              size="lg"
              onClick={() => setSelectedPayment('Google Pay')}
              style={{
                background: selectedPayment === 'Google Pay' 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                  : 'white',
                border: selectedPayment === 'Google Pay' ? 'none' : '2px solid #667eea',
                fontWeight: '600',
                padding: '1rem',
                borderRadius: '12px'
              }}
            >
              🔵 Google Pay
            </Button>
          </div>

          {/* Total Display */}
          <div 
            className="mt-4 p-3 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              borderRadius: '12px',
              border: '2px solid rgba(102, 126, 234, 0.2)'
            }}
          >
            <div className="text-muted mb-1">Total Amount</div>
            <h3 className="mb-0 fw-bold" style={{ color: '#667eea' }}>
              ${calculateTotal().toFixed(2)}
            </h3>
            {selectedPayment === 'crypto' && (
              <div className="text-muted mt-1" style={{ fontSize: '0.875rem' }}>
                ≈ {calculateTotalEth().toFixed(4)} ETH
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: '2px solid #e5e7eb', padding: '1.5rem' }}>
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowPaymentModal(false)}
            style={{
              fontWeight: '600',
              padding: '0.75rem 2rem',
              borderRadius: '50px',
              borderWidth: '2px'
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="success" 
            onClick={handlePayment}
            disabled={processing || !selectedPayment}
            style={{
              background: processing 
                ? '#6c757d' 
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              fontWeight: '700',
              padding: '0.75rem 2rem',
              borderRadius: '50px',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
            }}
          >
            {processing ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : selectedPayment === 'crypto' && !account ? (
              <>🦊 Connect Wallet & Pay</>
            ) : (
              <>🔒 Pay Now</>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      </Container>
    </div>
  );
};

export default Cart;
