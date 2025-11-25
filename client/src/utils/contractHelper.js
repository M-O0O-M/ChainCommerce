import { ethers } from 'ethers';

// Import deployment info (will be created after deployment)
let deploymentInfo;
try {
  deploymentInfo = require('../contracts/deployment.json');
} catch (error) {
  console.warn('Deployment info not found. Please deploy contracts first.');
  deploymentInfo = null;
}

export const getEcommerceContract = (signerOrProvider) => {
  if (!deploymentInfo) {
    throw new Error('Contract not deployed. Run: npm run deploy:local');
  }

  const { address, abi } = deploymentInfo.contracts.EcommercePayment;
  return new ethers.Contract(address, abi, signerOrProvider);
};

export const createOrderOnChain = async (signer, productIds, totalEth) => {
  try {
    const contract = getEcommerceContract(signer);
    const tx = await contract.createOrder(productIds, {
      value: ethers.parseEther(totalEth.toString())
    });
    
    const receipt = await tx.wait();
    
    // Extract orderId from event
    const event = receipt.logs.find(log => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed.name === 'OrderCreated';
      } catch {
        return false;
      }
    });
    
    if (event) {
      const parsed = contract.interface.parseLog(event);
      return {
        orderId: parsed.args.orderId.toString(),
        txHash: receipt.hash,
        success: true
      };
    }
    
    return {
      txHash: receipt.hash,
      success: true
    };
  } catch (error) {
    console.error('Error creating order on chain:', error);
    throw error;
  }
};

export const getOrderDetails = async (provider, orderId) => {
  try {
    const contract = getEcommerceContract(provider);
    const order = await contract.getOrder(orderId);
    
    return {
      orderId: order.orderId.toString(),
      buyer: order.buyer,
      amount: ethers.formatEther(order.amount),
      productIds: order.productIds,
      timestamp: new Date(Number(order.timestamp) * 1000),
      status: ['Pending', 'Completed', 'Refunded', 'Cancelled'][order.status]
    };
  } catch (error) {
    console.error('Error getting order details:', error);
    throw error;
  }
};

export const getUserOrders = async (provider, userAddress) => {
  try {
    const contract = getEcommerceContract(provider);
    const orderIds = await contract.getUserOrders(userAddress);
    
    const orders = await Promise.all(
      orderIds.map(id => getOrderDetails(provider, id))
    );
    
    return orders;
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  }
};

export const cancelOrder = async (signer, orderId) => {
  try {
    const contract = getEcommerceContract(signer);
    const tx = await contract.cancelOrder(orderId);
    const receipt = await tx.wait();
    
    return {
      txHash: receipt.hash,
      success: true
    };
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
};

export const getContractBalance = async (provider) => {
  try {
    const contract = getEcommerceContract(provider);
    const balance = await contract.getContractBalance();
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error getting contract balance:', error);
    throw error;
  }
};

export const getContractAddress = () => {
  return deploymentInfo?.contracts?.EcommercePayment?.address || null;
};
