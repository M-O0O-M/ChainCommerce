const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EcommercePayment", function () {
  let ecommercePayment;
  let owner;
  let buyer;
  let addr2;

  beforeEach(async function () {
    [owner, buyer, addr2] = await ethers.getSigners();
    
    const EcommercePayment = await ethers.getContractFactory("EcommercePayment");
    ecommercePayment = await EcommercePayment.deploy();
    await ecommercePayment.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await ecommercePayment.owner()).to.equal(owner.address);
    });

    it("Should start with order count of 0", async function () {
      expect(await ecommercePayment.orderCount()).to.equal(0);
    });
  });

  describe("Order Creation", function () {
    it("Should create an order successfully", async function () {
      const productIds = ["product1", "product2"];
      const paymentAmount = ethers.parseEther("0.5");

      await expect(
        ecommercePayment.connect(buyer).createOrder(productIds, { value: paymentAmount })
      ).to.emit(ecommercePayment, "OrderCreated");

      expect(await ecommercePayment.orderCount()).to.equal(1);
    });

    it("Should fail if payment is 0", async function () {
      const productIds = ["product1"];
      
      await expect(
        ecommercePayment.connect(buyer).createOrder(productIds, { value: 0 })
      ).to.be.revertedWith("Payment must be greater than 0");
    });

    it("Should fail if no products", async function () {
      const productIds = [];
      const paymentAmount = ethers.parseEther("0.5");
      
      await expect(
        ecommercePayment.connect(buyer).createOrder(productIds, { value: paymentAmount })
      ).to.be.revertedWith("Must have at least one product");
    });
  });

  describe("Order Management", function () {
    beforeEach(async function () {
      const productIds = ["product1", "product2"];
      const paymentAmount = ethers.parseEther("0.5");
      await ecommercePayment.connect(buyer).createOrder(productIds, { value: paymentAmount });
    });

    it("Should complete an order", async function () {
      await expect(
        ecommercePayment.connect(owner).completeOrder(1)
      ).to.emit(ecommercePayment, "OrderCompleted");

      const order = await ecommercePayment.getOrder(1);
      expect(order.status).to.equal(1); // Completed
    });

    it("Should refund an order", async function () {
      const buyerBalanceBefore = await ethers.provider.getBalance(buyer.address);
      
      await expect(
        ecommercePayment.connect(owner).refundOrder(1)
      ).to.emit(ecommercePayment, "OrderRefunded");

      const order = await ecommercePayment.getOrder(1);
      expect(order.status).to.equal(2); // Refunded
    });

    it("Should allow buyer to cancel pending order", async function () {
      await expect(
        ecommercePayment.connect(buyer).cancelOrder(1)
      ).to.emit(ecommercePayment, "OrderCancelled");

      const order = await ecommercePayment.getOrder(1);
      expect(order.status).to.equal(3); // Cancelled
    });

    it("Should not allow non-buyer to cancel order", async function () {
      await expect(
        ecommercePayment.connect(addr2).cancelOrder(1)
      ).to.be.revertedWith("Only buyer can cancel");
    });
  });

  describe("User Orders", function () {
    it("Should track user orders", async function () {
      const productIds1 = ["product1"];
      const productIds2 = ["product2", "product3"];
      const paymentAmount = ethers.parseEther("0.5");

      await ecommercePayment.connect(buyer).createOrder(productIds1, { value: paymentAmount });
      await ecommercePayment.connect(buyer).createOrder(productIds2, { value: paymentAmount });

      const userOrders = await ecommercePayment.getUserOrders(buyer.address);
      expect(userOrders.length).to.equal(2);
    });
  });

  describe("Withdrawals", function () {
    beforeEach(async function () {
      const productIds = ["product1"];
      const paymentAmount = ethers.parseEther("1.0");
      await ecommercePayment.connect(buyer).createOrder(productIds, { value: paymentAmount });
    });

    it("Should allow owner to withdraw", async function () {
      const contractBalance = await ecommercePayment.getContractBalance();
      expect(contractBalance).to.equal(ethers.parseEther("1.0"));

      await expect(
        ecommercePayment.connect(owner).withdrawAll()
      ).to.emit(ecommercePayment, "Withdrawal");

      expect(await ecommercePayment.getContractBalance()).to.equal(0);
    });

    it("Should not allow non-owner to withdraw", async function () {
      await expect(
        ecommercePayment.connect(buyer).withdrawAll()
      ).to.be.revertedWith("Only owner can call this function");
    });
  });
});
