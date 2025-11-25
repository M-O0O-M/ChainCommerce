// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EcommercePayment {
    address public owner;
    uint256 public orderCount;
    
    struct Order {
        uint256 orderId;
        address buyer;
        uint256 amount;
        string[] productIds;
        uint256 timestamp;
        OrderStatus status;
    }
    
    enum OrderStatus { Pending, Completed, Refunded, Cancelled }
    
    mapping(uint256 => Order) public orders;
    mapping(address => uint256[]) public userOrders;
    
    event OrderCreated(uint256 indexed orderId, address indexed buyer, uint256 amount, uint256 timestamp);
    event OrderCompleted(uint256 indexed orderId, address indexed buyer);
    event OrderRefunded(uint256 indexed orderId, address indexed buyer, uint256 amount);
    event OrderCancelled(uint256 indexed orderId, address indexed buyer);
    event Withdrawal(address indexed owner, uint256 amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        orderCount = 0;
    }
    
    function createOrder(string[] memory _productIds) public payable returns (uint256) {
        require(msg.value > 0, "Payment must be greater than 0");
        require(_productIds.length > 0, "Must have at least one product");
        
        orderCount++;
        
        orders[orderCount] = Order({
            orderId: orderCount,
            buyer: msg.sender,
            amount: msg.value,
            productIds: _productIds,
            timestamp: block.timestamp,
            status: OrderStatus.Pending
        });
        
        userOrders[msg.sender].push(orderCount);
        
        emit OrderCreated(orderCount, msg.sender, msg.value, block.timestamp);
        
        return orderCount;
    }
    
    function completeOrder(uint256 _orderId) public onlyOwner {
        require(_orderId > 0 && _orderId <= orderCount, "Invalid order ID");
        require(orders[_orderId].status == OrderStatus.Pending, "Order is not pending");
        
        orders[_orderId].status = OrderStatus.Completed;
        
        emit OrderCompleted(_orderId, orders[_orderId].buyer);
    }
    
    function refundOrder(uint256 _orderId) public onlyOwner {
        require(_orderId > 0 && _orderId <= orderCount, "Invalid order ID");
        require(orders[_orderId].status == OrderStatus.Pending || orders[_orderId].status == OrderStatus.Completed, "Cannot refund this order");
        
        Order storage order = orders[_orderId];
        order.status = OrderStatus.Refunded;
        
        payable(order.buyer).transfer(order.amount);
        
        emit OrderRefunded(_orderId, order.buyer, order.amount);
    }
    
    function cancelOrder(uint256 _orderId) public {
        require(_orderId > 0 && _orderId <= orderCount, "Invalid order ID");
        require(orders[_orderId].buyer == msg.sender, "Only buyer can cancel");
        require(orders[_orderId].status == OrderStatus.Pending, "Can only cancel pending orders");
        
        orders[_orderId].status = OrderStatus.Cancelled;
        
        payable(msg.sender).transfer(orders[_orderId].amount);
        
        emit OrderCancelled(_orderId, msg.sender);
    }
    
    function getOrder(uint256 _orderId) public view returns (
        uint256 orderId,
        address buyer,
        uint256 amount,
        string[] memory productIds,
        uint256 timestamp,
        OrderStatus status
    ) {
        require(_orderId > 0 && _orderId <= orderCount, "Invalid order ID");
        Order memory order = orders[_orderId];
        return (
            order.orderId,
            order.buyer,
            order.amount,
            order.productIds,
            order.timestamp,
            order.status
        );
    }
    
    function getUserOrders(address _user) public view returns (uint256[] memory) {
        return userOrders[_user];
    }
    
    function withdraw(uint256 _amount) public onlyOwner {
        require(_amount <= address(this).balance, "Insufficient balance");
        payable(owner).transfer(_amount);
        emit Withdrawal(owner, _amount);
    }
    
    function withdrawAll() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(owner).transfer(balance);
        emit Withdrawal(owner, balance);
    }
    
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}
