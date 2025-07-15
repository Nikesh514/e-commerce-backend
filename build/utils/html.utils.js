"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.order_confirmation_html = void 0;
const order_confirmation_html = (items, totalAmount, user, order, req) => {
    var _a, _b;
    const html = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background: #f9f9f9;">
    <h1 style="color: #4CAF50; text-align: center;">Order Placed Successfully!</h1>
    <p style="font-size: 16px; color: #333;">Hi ${(_a = user.full_name) !== null && _a !== void 0 ? _a : 'Customer'},</p>
    <p style="font-size: 16px; color: #333;">Thank you for your purchase! Your order has been placed successfully and is now being processed.</p>

    <h2 style="color: #333; margin-top: 30px;">Order Details</h2>
    <p style="margin: 8px 0;"><strong>Order ID:</strong> ${order.id}</p>
    <p style="margin: 8px 0;"><strong>Order Date:</strong> ${order.date}</p>
    <p style="margin: 8px 0;"><strong>Total Amount:</strong> $${order.total}</p>

    <h3 style="margin-top: 30px;">Shipping Address</h3>
    <p style="margin: 8px 0;">${(_b = order.shipping_address) !== null && _b !== void 0 ? _b : 'Not provided'}</p>

    <div style="text-align: center; margin-top: 40px;">
      <a href="${req.protocol}://${req.hostname}/orders/${order.id}" 
         style="display: inline-block; background: #4CAF50; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold;">
        View Your Order
      </a>
    </div>

    <p style="margin-top: 40px; font-size: 14px; color: #555;">If you have any questions, feel free to reply to this email.</p>
    <p style="font-size: 14px; color: #555;">Thank you for shopping with us!</p>
  </div>
`;
    return html;
};
exports.order_confirmation_html = order_confirmation_html;
