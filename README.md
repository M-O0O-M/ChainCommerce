# <img src="https://i.postimg.cc/BZkG1MmW/d5a36513-bff6-41ce-8979-fc759896e13f-1762935348-removebg-preview.png" alt="ChainCommerce Logo" width="30" height="30">ChainCommerce - Web3 E-commerce Platform

A modern, decentralized e-commerce platform that combines traditional web technologies with blockchain capabilities. Built with the MERN stack and integrated with Ethereum blockchain for secure cryptocurrency payments via MetaMask.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Blockchain Integration](#blockchain-integration)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [Usage Guide](#usage-guide)
- [Smart Contract Details](#smart-contract-details)
- [API Documentation](#api-documentation)
- [Security Considerations](#security-considerations)
- [License](#license)

## ✨ Features

- 🔐 **Secure Authentication** - Email/password and Google OAuth integration
- 🦊 **MetaMask Wallet Integration** - Connect and manage Ethereum wallets
- 💰 **Cryptocurrency Payments** - Accept ETH payments with real-time conversion
- 🛒 **Shopping Cart** - Full-featured cart with quantity management
- 📦 **Product Catalog** - Browse and search products with detailed views
- 🔗 **Blockchain Transaction Tracking** - All payments recorded on-chain
- 📱 **Responsive Design** - Beautiful UI with Bootstrap 5 and custom styling
- 👤 **User Profiles** - Manage account and wallet connection status
- 💬 **AI Chatbot** - Integrated customer support assistant
- 📊 **Order Management** - Track orders with blockchain verification

## 🛠️ Tech Stack

### **Frontend Technologies**

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | Core UI framework for building component-based interface |
| **React Router DOM** | 6.x | Client-side routing and navigation |
| **Bootstrap** | 5.3.x | Responsive UI components and styling |
| **React Bootstrap** | 2.x | React components for Bootstrap |
| **Ethers.js** | 6.x | Ethereum blockchain interaction library |
| **Axios** | 1.x | HTTP client for API requests |
| **JavaScript (ES6+)** | - | Primary programming language |

### **Backend Technologies**

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 16+ | JavaScript runtime environment |
| **Express.js** | 4.x | Web application framework |
| **MongoDB** | 5.x | NoSQL database for storing user and product data |
| **Mongoose** | 7.x | MongoDB object modeling and schema validation |
| **JWT** | 9.x | JSON Web Tokens for authentication |
| **bcryptjs** | 2.x | Password hashing and security |
| **CORS** | 2.x | Cross-Origin Resource Sharing middleware |
| **dotenv** | 16.x | Environment variable management |
| **JavaScript (Node.js)** | - | Server-side programming language |

### **Blockchain Technologies**

| Technology | Version | Purpose |
|------------|---------|---------|
| **Solidity** | 0.8.x | Smart contract programming language |
| **Hardhat** | 2.x | Ethereum development environment |
| **Ethers.js** | 6.x | Ethereum library for wallet and contract interaction |
| **MetaMask** | - | Browser extension for Ethereum wallet management |
| **Ethereum** | - | Blockchain network for decentralized transactions |

### **Development Tools**

- **Git** - Version control
- **npm** - Package management
- **VS Code** - Code editor
- **Postman** - API testing
- **MongoDB Compass** - Database management

## ⛓️ Blockchain Integration

### **Overview**

This platform leverages Ethereum blockchain technology to provide transparent, secure, and immutable payment processing. Unlike traditional e-commerce platforms that rely solely on centralized payment processors, our system records transactions directly on the blockchain.

### **How Blockchain is Used**

#### **1. Wallet Connection**
```
User → MetaMask Extension → Ethereum Network → Smart Contract
```

- Users connect their MetaMask wallet to the application
- The wallet address serves as a unique identifier
- No private keys are ever stored or transmitted
- Connection is maintained through browser session

#### **2. Payment Processing**

**Traditional Payment Flow:**
```
User → Payment Gateway → Bank → Merchant
(3-5 days settlement, fees 2-3%)
```

**Blockchain Payment Flow:**
```
User → MetaMask → Ethereum Network → Smart Contract → Merchant Wallet
(Minutes settlement, gas fees only)
```

**Step-by-Step Process:**

1. **Order Creation**
   - User adds products to cart
   - System calculates total in USD and converts to ETH
   - Real-time exchange rate ensures accurate pricing

2. **Payment Initiation**
   - User clicks "Pay Now" with crypto payment method
   - If wallet not connected, automatic connection prompt appears
   - MetaMask popup shows transaction details

3. **Smart Contract Execution**
   ```solidity
   function createOrder(string[] memory productIds) 
       public payable returns (uint256)
   ```
   - Smart contract receives payment and product IDs
   - Generates unique order ID on-chain
   - Emits OrderCreated event for tracking
   - Funds transferred to merchant wallet

4. **Transaction Confirmation**
   - Ethereum network validates transaction (15-30 seconds)
   - Transaction hash generated as proof
   - Order recorded in both database and blockchain

5. **Verification**
   - Transaction hash can be verified on Etherscan
   - Immutable record of purchase
   - Full transparency and traceability

#### **3. Smart Contract Architecture**

**Contract: EcommercePayment.sol**

```solidity
// Core functionality
- createOrder(): Process payment and create order
- getOrder(): Retrieve order details
- getOrdersByBuyer(): Get user's order history
- Events: OrderCreated, OrderStatusUpdated
```

**Key Features:**
- **Immutability**: Orders cannot be altered once recorded
- **Transparency**: All transactions publicly verifiable
- **Security**: Funds directly transferred, no intermediary custody
- **Traceability**: Complete audit trail on blockchain

#### **4. Data Storage Strategy**

**On-Chain (Blockchain):**
- Order ID
- Buyer wallet address
- Total amount in ETH
- Timestamp
- Product IDs
- Transaction hash

**Off-Chain (MongoDB):**
- Product details (name, description, images)
- User profiles and authentication
- Order metadata
- Shopping cart state

**Why Hybrid Approach?**
- **Cost Efficiency**: Storing large data on blockchain is expensive
- **Performance**: Database queries are faster than blockchain reads
- **Flexibility**: Can update product details without blockchain transactions
- **Privacy**: Personal information not exposed on public blockchain

#### **5. Security Benefits**

**Blockchain Security:**
- ✅ **Decentralization**: No single point of failure
- ✅ **Cryptographic Security**: Transactions signed with private keys
- ✅ **Immutability**: Cannot alter transaction history
- ✅ **Transparency**: All transactions publicly auditable
- ✅ **No Chargebacks**: Irreversible transactions prevent fraud

**Application Security:**
- ✅ **JWT Authentication**: Secure user sessions
- ✅ **Password Hashing**: bcrypt encryption
- ✅ **HTTPS**: Encrypted data transmission
- ✅ **Input Validation**: Prevent injection attacks
- ✅ **CORS Protection**: Controlled API access

#### **6. Gas Fees and Optimization**

**What are Gas Fees?**
Gas fees are transaction costs paid to Ethereum miners for processing and validating transactions.

**Optimization Strategies:**
- Batch multiple products in single transaction
- Use efficient Solidity code patterns
- Deploy on Layer 2 solutions (Polygon, Arbitrum) for lower fees
- Provide gas estimation before transaction

**Typical Costs:**
- Ethereum Mainnet: $5-50 per transaction (varies with network congestion)
- Polygon Network: $0.01-0.10 per transaction
- Testnet: Free (for development)

#### **7. Supported Networks**

The platform can be deployed on:
- **Ethereum Mainnet**: Production, highest security
- **Ethereum Testnets**: Sepolia, Goerli (development/testing)
- **Polygon**: Lower fees, faster transactions
- **Binance Smart Chain**: Alternative with lower costs
- **Arbitrum/Optimism**: Layer 2 scaling solutions

#### **8. Transaction Verification**

Users can verify their transactions on blockchain explorers:

**Etherscan (Ethereum):**
```
https://etherscan.io/tx/[TRANSACTION_HASH]
```

**Information Available:**
- Transaction status (Success/Failed)
- Block number and confirmations
- From/To addresses
- Amount transferred
- Gas fees paid
- Timestamp
- Input data (order details)

### **Advantages Over Traditional E-commerce**

| Feature | Traditional | Blockchain-Based |
|---------|-------------|------------------|
| **Settlement Time** | 3-5 business days | Minutes |
| **Transaction Fees** | 2-3% + fixed fee | Gas fees only (~$1-10) |
| **Chargebacks** | Possible (fraud risk) | Not possible |
| **International** | Complex, high fees | Borderless, same cost |
| **Transparency** | Limited | Fully transparent |
| **Intermediaries** | Banks, processors | None (peer-to-peer) |
| **Censorship** | Possible | Resistant |
| **Privacy** | Data collected | Pseudonymous |

### **Real-World Use Cases**

1. **Digital Goods**: Instant delivery with blockchain proof
2. **International Sales**: No currency conversion fees
3. **High-Value Items**: Immutable proof of purchase
4. **Subscription Services**: Automated recurring payments
5. **Marketplace**: Trustless escrow between buyers/sellers

## 🏗️ Architecture

### **System Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  Pages   │  │Components│  │ Context  │  │  Utils   │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST API
┌────────────────────┴────────────────────────────────────────┐
│                      Backend (Express)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  Routes  │  │  Models  │  │   Auth   │  │   API    │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
└────────┬───────────────────────────────────────┬────────────┘
         │                                       │
         │ Mongoose                              │ Ethers.js
         ▼                                       ▼
┌─────────────────┐                    ┌──────────────────────┐
│    MongoDB      │                    │  Ethereum Blockchain │
│   (Database)    │                    │   (Smart Contract)   │
└─────────────────┘                    └──────────────────────┘
                                                 ▲
                                                 │ MetaMask
                                                 │
                                        ┌────────┴─────────┐
                                        │   User Wallet    │
                                        └──────────────────┘
```

### **Data Flow**

1. **User Authentication**: JWT tokens stored in localStorage
2. **Product Browsing**: REST API fetches from MongoDB
3. **Cart Management**: React Context API (client-side state)
4. **Payment**: Ethers.js → MetaMask → Ethereum → Smart Contract
5. **Order Recording**: Blockchain (immutable) + MongoDB (queryable)

## 🚀 Setup Instructions

### **Prerequisites**

- Node.js v16 or higher
- MongoDB v5 or higher
- MetaMask browser extension
- Git

### **1. Clone Repository**

```bash
git clone https://github.com/M-O0O-M/ChainCommerce.git
cd chaincommerce-platform
```

### **2. Backend Setup**

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Environment Variables:**
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/chaincommerce
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
```

```bash
# Start MongoDB
mongod

# Seed database with sample products
npm run seed

# Start server
npm run dev
```

Server runs at: `http://localhost:5001`

### **3. Frontend Setup**

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start React app
npm start
```

App opens at: `http://localhost:3000`

### **4. Smart Contract Setup (Optional)**

```bash
# Install Hardhat dependencies
npm install

# Compile contracts
npx hardhat compile

# Deploy to local network
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost

# Deploy to testnet (Sepolia)
npx hardhat run scripts/deploy.js --network sepolia

# Update contract address in client/src/utils/contractHelper.js
```

### **5. MetaMask Configuration**

1. Install MetaMask extension
2. Create or import wallet
3. Add test network (if using testnet)
4. Get test ETH from faucet: https://sepoliafaucet.com/

## 📖 Usage Guide

### **For Users**

1. **Sign Up/Sign In**
   - Create account with email/password or Google
   - Secure authentication with JWT

2. **Browse Products**
   - View product catalog
   - Filter by category
   - See prices in USD and ETH

3. **Shopping Cart**
   - Add products to cart
   - Adjust quantities
   - View total in both currencies

4. **Checkout**
   - Select payment method (Crypto/Card/PayPal)
   - For crypto: Connect MetaMask wallet
   - Confirm transaction
   - Receive order confirmation

5. **Profile Management**
   - View account details
   - Check wallet connection status
   - See wallet balance
   - Manage settings

### **For Developers**

**Add New Products:**
```javascript
POST /api/products
{
  "name": "Product Name",
  "description": "Description",
  "priceUsd": 999.99,
  "priceEth": 0.5,
  "category": "Electronics",
  "image": "https://example.com/image.jpg",
  "stock": 50
}
```

**Deploy Smart Contract:**
```bash
npx hardhat run scripts/deploy.js --network <network-name>
```

**Run Tests:**
```bash
# Backend tests
cd server && npm test

# Smart contract tests
npx hardhat test

# Frontend tests
cd client && npm test
```

## 📜 Smart Contract Details

### **Contract: EcommercePayment.sol**

**Location:** `contracts/EcommercePayment.sol`

**Functions:**

```solidity
// Create new order with payment
function createOrder(string[] memory productIds) 
    public payable returns (uint256)

// Get order details
function getOrder(uint256 orderId) 
    public view returns (Order memory)

// Get all orders by buyer
function getOrdersByBuyer(address buyer) 
    public view returns (uint256[] memory)

// Update order status (owner only)
function updateOrderStatus(uint256 orderId, OrderStatus status) 
    public onlyOwner
```

**Events:**
```solidity
event OrderCreated(
    uint256 indexed orderId,
    address indexed buyer,
    uint256 amount,
    uint256 timestamp
);

event OrderStatusUpdated(
    uint256 indexed orderId,
    OrderStatus status
);
```

**Security Features:**
- ReentrancyGuard protection
- Owner-only administrative functions
- Input validation
- Safe math operations

## 📡 API Documentation

### **Authentication Endpoints**

```
POST /api/auth/signup
POST /api/auth/signin
POST /api/auth/google-signin
```

### **Product Endpoints**

```
GET    /api/products          - Get all products
GET    /api/products/:id      - Get single product
POST   /api/products          - Create product (admin)
PUT    /api/products/:id      - Update product (admin)
DELETE /api/products/:id      - Delete product (admin)
```

### **Order Endpoints**

```
POST   /api/orders            - Create new order
GET    /api/orders            - Get user's orders
GET    /api/orders/:id        - Get order details
```

## 🔒 Security Considerations

### **Best Practices Implemented**

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ CORS protection
- ✅ Input validation and sanitization
- ✅ Environment variable protection
- ✅ HTTPS in production
- ✅ Rate limiting on API endpoints
- ✅ MongoDB injection prevention
- ✅ XSS protection

### **Blockchain Security**

- ✅ Private keys never leave MetaMask
- ✅ Transaction signing client-side
- ✅ Smart contract audited patterns
- ✅ ReentrancyGuard implementation
- ✅ Access control modifiers

### **Recommendations**

- Always test on testnet first
- Use hardware wallet for large amounts
- Verify contract addresses
- Check gas prices before transactions
- Keep private keys secure
- Regular security audits

## 📝 License

MIT License - feel free to use this project for learning and commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review smart contract code

## 🎯 Future Enhancements

- [ ] Multi-currency support (BTC, USDT, etc.)
- [ ] NFT integration for digital products
- [ ] Decentralized storage (IPFS) for product images
- [ ] Layer 2 scaling solutions
- [ ] Mobile app (React Native)
- [ ] Admin dashboard
- [ ] Order tracking system
- [ ] Review and rating system
- [ ] Wishlist functionality
- [ ] Advanced search and filters

---

**⛓️🛍️ ChainCommerce - Built with ❤️ using React, Node.js, MongoDB, and Ethereum**
