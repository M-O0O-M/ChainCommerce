import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your shopping assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const botResponses = {
    greeting: [
      "Hello! Welcome to Web3 Store! 👋",
      "Hi there! How can I assist you today?",
      "Hey! Looking for something specific?"
    ],
    products: [
      "We have 137+ amazing products across 11 categories including Smartphones, Laptops, Tablets, Audio, Wearables, Cameras, Gaming, Monitors, Accessories, Smart Home, and Drones!",
      "Browse our extensive collection of electronics! From the latest smartphones to gaming gear, we've got it all.",
      "Check out our Products page to see all available items. You can filter by category too!"
    ],
    payment: [
      "We accept multiple payment methods: Crypto (ETH), Credit Card, PayPal, Apple Pay, and Google Pay!",
      "You can pay with cryptocurrency using our smart contract or use traditional payment methods.",
      "For crypto payments, we support Ethereum. Just connect your wallet!"
    ],
    shipping: [
      "We offer fast shipping worldwide! Most orders arrive within 3-7 business days.",
      "Free shipping on orders over $100!",
      "Track your order anytime from your account dashboard."
    ],
    account: [
      "Sign up to unlock full features: add to cart, checkout, and track orders!",
      "Create an account to save your favorite items and get personalized recommendations.",
      "Already have an account? Sign in to continue shopping!"
    ],
    help: [
      "I can help you with: product information, payment methods, shipping, account setup, and more!",
      "Need assistance? Just ask me about products, payments, shipping, or your account.",
      "I'm here to make your shopping experience smooth! What would you like to know?"
    ],
    default: [
      "That's a great question! Let me help you find what you need.",
      "I'm not sure about that, but I can help you with products, payments, shipping, or account questions!",
      "Could you rephrase that? I can assist with product info, payments, shipping, and accounts."
    ]
  };

  const getResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    
    if (msg.match(/hi|hello|hey|greet/)) {
      return botResponses.greeting[Math.floor(Math.random() * botResponses.greeting.length)];
    } else if (msg.match(/product|item|buy|shop|category|laptop|phone|tablet|camera|gaming|audio|drone/)) {
      return botResponses.products[Math.floor(Math.random() * botResponses.products.length)];
    } else if (msg.match(/pay|payment|crypto|eth|ethereum|credit|card|paypal|apple pay|google pay/)) {
      return botResponses.payment[Math.floor(Math.random() * botResponses.payment.length)];
    } else if (msg.match(/ship|delivery|track|order/)) {
      return botResponses.shipping[Math.floor(Math.random() * botResponses.shipping.length)];
    } else if (msg.match(/account|sign|login|register|profile/)) {
      return botResponses.account[Math.floor(Math.random() * botResponses.account.length)];
    } else if (msg.match(/help|assist|support/)) {
      return botResponses.help[Math.floor(Math.random() * botResponses.help.length)];
    } else {
      return botResponses.default[Math.floor(Math.random() * botResponses.default.length)];
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botMessage = { text: getResponse(input), sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const quickActions = [
    { label: '📱 Products', message: 'Show me products' },
    { label: '💳 Payment', message: 'Payment methods' },
    { label: '🚚 Shipping', message: 'Shipping info' },
    { label: '👤 Account', message: 'Account help' }
  ];

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>🤖 Shopping Assistant</div>
              <small style={{ opacity: 0.9 }}>Online now</small>
            </div>
            <Button
              variant="link"
              className="text-white p-0"
              onClick={() => setIsOpen(false)}
              style={{ fontSize: '1.5rem', textDecoration: 'none' }}
            >
              ×
            </Button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '1rem'
                }}
              >
                <div
                  style={{
                    maxWidth: '75%',
                    padding: '0.75rem 1rem',
                    borderRadius: '16px',
                    background: msg.sender === 'user' 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : '#e5e7eb',
                    color: msg.sender === 'user' ? 'white' : '#1f2937',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    animation: 'fadeInUp 0.3s ease'
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', gap: '0.3rem', padding: '0.75rem' }}>
                <div className="spinner-grow spinner-grow-sm" role="status"></div>
                <div className="spinner-grow spinner-grow-sm" role="status"></div>
                <div className="spinner-grow spinner-grow-sm" role="status"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: '0.5rem 1rem', background: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant="outline-primary"
                  onClick={() => {
                    setInput(action.message);
                    setTimeout(() => handleSend(), 100);
                  }}
                  style={{ borderRadius: '20px', fontSize: '0.75rem' }}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="chatbot-input-area">
            <InputGroup>
              <Form.Control
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{ borderRadius: '12px 0 0 12px' }}
              />
              <Button
                variant="primary"
                onClick={handleSend}
                style={{ borderRadius: '0 12px 12px 0' }}
              >
                Send
              </Button>
            </InputGroup>
          </div>
        </div>
      )}

      <button
        className="chatbot-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with us"
      >
        <span style={{ fontSize: '1.8rem' }}>💬</span>
      </button>
    </div>
  );
};

export default Chatbot;
