const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const { artworkId, buyerId, price } = req.body;
    // validate input
    if (!artworkId || !buyerId || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const order = new Order({ artworkId, buyerId, price, status: "pending" });
    // save order to database
    await order.save();
    // return order to client
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    // validate input
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const orders = await Order.find({ buyerId: userId }).populate("artworkId");
    // fetch orders from database

    // return orders to client

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
