# Smart Contract Setup Guide

This project includes Solidity smart contracts for secure, decentralized payment processing.

## Contracts

### 1. EcommercePayment.sol
Advanced e-commerce contract with features:
- Order creation and tracking
- Order status management (Pending, Completed, Refunded, Cancelled)
- Buyer order history
- Refund functionality
- Owner withdrawal controls

### 2. PaymentContract.sol
Simple payment contract for basic transactions.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install:
- Hardhat (Ethereum development environment)
- Ethers.js (Ethereum library)
- Hardhat Toolbox (testing and deployment tools)

### 2. Compile Contracts

```bash
npm run compile
```

This compiles the Solidity contracts and generates ABIs.

### 3. Start Local Blockchain

Open a new terminal and run:

```bash
npm run node
```

This starts a local Hardhat node on `http://127.0.0.1:8545`

### 4. Deploy Contracts

In another terminal:

```bash
npm run deploy:local
```

This will:
- Deploy both contracts to the local network
- Save contract addresses and ABIs to `client/src/contracts/deployment.json`
- Display contract addresses in the console

### 5. Configure MetaMask

1. Open MetaMask
2. Add a new network:
   - Network Name: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 1337
   - Currency Symbol: ETH

3. Import a test account:
   - Copy a private key from the Hardhat node terminal
   - Import it into MetaMask

## Testing Contracts

Run the test suite:

```bash
npm test
```

## Deploy to Testnet

### Sepolia Testnet

1. Get Sepolia ETH from a faucet
2. Add your private key to `.env`:
   ```
   PRIVATE_KEY=your_private_key_here
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
   ```

3. Deploy:
   ```bash
   npm run deploy:sepolia
   ```

## Contract Features

### EcommercePayment Contract

**Create Order**
```javascript
createOrder(productIds) payable
```
- Creates a new order on the blockchain
- Emits OrderCreated event
- Returns order ID

**Complete Order** (Owner only)
```javascript
completeOrder(orderId)
```

**Refund Order** (Owner only)
```javascript
refundOrder(orderId)
```

**Cancel Order** (Buyer only)
```javascript
cancelOrder(orderId)
```

**Get Order Details**
```javascript
getOrder(orderId) view returns (Order)
```

**Get User Orders**
```javascript
getUserOrders(userAddress) view returns (uint256[])
```

## Frontend Integration

The frontend automatically uses the smart contract when:
1. Contracts are deployed
2. User selects "Crypto (ETH)" payment
3. "Use Smart Contract" checkbox is enabled

Benefits:
- ✅ On-chain order tracking
- ✅ Transparent transaction history
- ✅ Refund capabilities
- ✅ Decentralized order management

## Contract Addresses

After deployment, contract addresses are saved in:
```
client/src/contracts/deployment.json
```

## Security Notes

- Never commit private keys to version control
- Use environment variables for sensitive data
- Test thoroughly on testnets before mainnet deployment
- Consider getting a professional audit for production use

## Troubleshooting

**"Contract not deployed" error:**
- Make sure you've run `npm run deploy:local`
- Check that the Hardhat node is running
- Verify `deployment.json` exists in `client/src/contracts/`

**Transaction fails:**
- Ensure you have enough ETH in your wallet
- Check that you're connected to the correct network
- Verify the contract address is correct

**MetaMask not connecting:**
- Make sure you're on the Hardhat Local network (Chain ID: 1337)
- Try resetting your MetaMask account (Settings > Advanced > Reset Account)
