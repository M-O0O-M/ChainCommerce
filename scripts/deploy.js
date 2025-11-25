const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting deployment...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy EcommercePayment contract
  console.log("\nDeploying EcommercePayment contract...");
  const EcommercePayment = await hre.ethers.getContractFactory("EcommercePayment");
  const ecommercePayment = await EcommercePayment.deploy();
  await ecommercePayment.waitForDeployment();

  const ecommerceAddress = await ecommercePayment.getAddress();
  console.log("EcommercePayment deployed to:", ecommerceAddress);

  // Deploy PaymentContract (legacy)
  console.log("\nDeploying PaymentContract...");
  const PaymentContract = await hre.ethers.getContractFactory("PaymentContract");
  const paymentContract = await PaymentContract.deploy();
  await paymentContract.waitForDeployment();

  const paymentAddress = await paymentContract.getAddress();
  console.log("PaymentContract deployed to:", paymentAddress);

  // Save contract addresses and ABIs
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      EcommercePayment: {
        address: ecommerceAddress,
        abi: JSON.parse(ecommercePayment.interface.formatJson())
      },
      PaymentContract: {
        address: paymentAddress,
        abi: JSON.parse(paymentContract.interface.formatJson())
      }
    }
  };

  // Save to client directory
  const clientDir = path.join(__dirname, "../client/src/contracts");
  if (!fs.existsSync(clientDir)) {
    fs.mkdirSync(clientDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(clientDir, "deployment.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n✅ Deployment complete!");
  console.log("Contract addresses saved to client/src/contracts/deployment.json");
  console.log("\nContract Addresses:");
  console.log("- EcommercePayment:", ecommerceAddress);
  console.log("- PaymentContract:", paymentAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
