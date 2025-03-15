import bcrypt from "bcryptjs";
import crypto from "crypto-js";
import { Request, Response, NextFunction } from "express";

import Order from "../models/Order.js";
import User from "../models/User.js";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      userId,
      recipient,
      products,
      totalPrice,
      currency,
      shippingAddress,
      status,
      checked,
      paymentMethod,
      orderNotes,
      trackingNumber,
    } = req.body;
    let user;

    if (!userId) {
      // Check if user with the provided email exists
      user = await User.findOne({ email: recipient.email });

      if (user) {
        // If user with the provided email already exists, throw an error
        res.status(400).json({
          success: false,
          message: "Email is already in use. Please log in to continue.",
        });
        return;
      } else {
        // If user does not exist, create a new user
        const password = crypto.lib.WordArray.random(8).toString();
        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({
          email: recipient.email,
          password: hashedPassword,
          name: recipient.name,
          surname: recipient.surname,
          phone: recipient.phone,
          deliveryData: shippingAddress,
        });

        user = await user.save();

        // Optionally, send the generated password to the user's email
        // sendEmail(recipient.email, password);
      }
    } else {
      user = await User.findById(userId);

      if (!user) {
        res.status(400).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      // Update user information if not filled or if there is new information
      if (!user.name || user.name !== recipient.name)
        user.name = recipient.name;
      if (!user.surname || user.surname !== recipient.surname)
        user.surname = recipient.surname;
      if (!user.phone || user.phone !== recipient.phone)
        user.phone = recipient.phone;

      if (
        !user.deliveryData ||
        JSON.stringify(user.deliveryData) !== JSON.stringify(shippingAddress)
      ) {
        user.deliveryData = shippingAddress;
      }

      await user.save();
    }

    // Create the order
    const order = new Order({
      userId: user._id,
      products,
      totalPrice,
      currency,
      shippingAddress,
      recipient,
      status,
      checked,
      paymentMethod,
      orderNotes,
      trackingNumber,
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "New order was successfully created",
      order,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrdersByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ userId });

    if (!orders) {
      res.status(404).json({
        success: false,
        message: "No orders found for this user",
      });
      return;
    }

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};
