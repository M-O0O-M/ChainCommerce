const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Smart Contract Quick Start\n');

// Check if contracts are compiled
const artifactsPath = path.join(__dirname, '../artifacts');
if (!fs.existsSync(artifactsPath)) {
  console.log('📦 Compiling contracts...');
  exec('npx hardhat compile', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Compilation failed:', error);
      return;
    }
    console.log('✅ Contracts compiled successfully!\n');
    checkDeployment();
  });
} else {
  checkDeployment();
}

function checkDeployment() {
  const deploymentPath = path.join(__dirname, '../client/src/contracts/deployment.json');
  
  if (!fs.existsSync(deploymentPath)) {
    console.log('⚠️  Contracts not deployed yet.\n');
    console.log('To deploy contracts:');
    console.log('1. Start Hardhat node: npm run node');
    console.log('2. Deploy contracts: npm run deploy:local\n');
  } else {
    const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
    console.log('✅ Contracts are deployed!\n');
    console.log('Contract Addresses:');
    console.log('- EcommercePayment:', deployment.contracts.EcommercePayment.address);
    console.log('- PaymentContract:', deployment.contracts.PaymentContract.address);
    console.log('\nNetwork:', deployment.network);
    console.log('Chain ID:', deployment.chainId);
    console.log('\n🎉 Ready to use smart contracts in your app!');
  }
}
