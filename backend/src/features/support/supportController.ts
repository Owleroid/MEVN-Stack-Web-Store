import { Request, Response } from "express";

import SupportModel from "./SupportModel.js";

import { sendEmail } from "../../utils/emailService.js";

/**
 * Submit a new support message from a user
 */
export const submitSupportMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, subject, message } = req.body;

    // Validate required fields
    if (!email || !message) {
      res.status(400).json({ error: "Email and message are required" });
      return;
    }

    // Create new support message
    const supportMessage = new SupportModel({
      email,
      subject: subject || "Support Request",
      message,
    });

    await supportMessage.save();

    // Send confirmation email to user
    try {
      await sendEmail({
        to: email,
        subject: "We received your support request",
        html: `
          <h1>Thank you for contacting us</h1>
          <p>We have received your support request and will get back to you as soon as possible.</p>
          <p><strong>Your message:</strong></p>
          <p>${message}</p>
        `,
      });
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error("Failed to send confirmation email:", emailError);
    }

    res.status(201).json({
      success: true,
      message: "Support message submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting support message:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Get all support messages (admin only)
 */
export const getAllSupportMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Implement pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Filter by status if provided
    const statusFilter = req.query.status ? { status: req.query.status } : {};

    const [messages, total] = await Promise.all([
      SupportModel.find(statusFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      SupportModel.countDocuments(statusFilter),
    ]);

    res.status(200).json({
      success: true,
      messages,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching support messages:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Get a single support message by ID (admin only)
 */
export const getSupportMessageById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const message = await SupportModel.findById(id);

    if (!message) {
      res.status(404).json({ error: "Support message not found" });
      return;
    }

    res.status(200).json({ success: true, message });
  } catch (error) {
    console.error("Error fetching support message:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Update a support message status or add a response (admin only)
 */
export const updateSupportMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, response } = req.body;

    const message = await SupportModel.findById(id);
    if (!message) {
      res.status(404).json({ error: "Support message not found" });
      return;
    }

    // Update fields
    if (status) message.status = status;
    if (response) message.response = response;

    await message.save();

    // Send response email to user if a response was provided
    if (response) {
      try {
        await sendEmail({
          to: message.email,
          subject: `Re: ${message.subject}`,
          html: `
            <h1>Response to your support request</h1>
            <p><strong>Your message:</strong></p>
            <p>${message.message}</p>
            <p><strong>Our response:</strong></p>
            <p>${response}</p>
            <p>Thank you for contacting us.</p>
          `,
        });
      } catch (emailError) {
        // Log email error but don't fail the request
        console.error("Failed to send response email:", emailError);
      }
    }

    res.status(200).json({
      success: true,
      message: "Support message updated successfully",
      data: message,
    });
  } catch (error) {
    console.error("Error updating support message:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Delete a support message (admin only)
 */
export const deleteSupportMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await SupportModel.findByIdAndDelete(id);

    if (!result) {
      res.status(404).json({ error: "Support message not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Support message deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting support message:", error);
    res.status(500).json({ error: "Server error" });
  }
};
