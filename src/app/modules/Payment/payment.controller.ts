import catchAsync from "../../utils/catchAsync";
import prisma from "../../utils/prisma";

export const paymentConfirm = catchAsync(async (req, res): Promise<void> => {
    const { id } = req.query;
    if (!id) {
      res.status(404).send("<h1>Order Id Not Found</h1>");
      return; 
    }
  
    const orderData: any = await prisma.order.findUnique({
      where: { id: id as string },
      include: {
        customer: true,
        items: {
          include: {
           
            product: true, 
          },
        },
      },
    });
  
    if (!orderData) {
      res.status(404).send("<h1>Order not found</h1>");
      return; 
    }
  
    if (orderData) {
      await prisma.order.update({
        where: { id: id as string },
        data: { paymentStatus: "COMPLETED" },
      });
    }
  
    const htmlContent = `
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 800px;
            margin: 30px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          h1, h2, h3 {
            color: #333;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            text-align: left;
            padding: 10px;
            border: 1px solid #ddd;
          }
          th {
            background-color: #333;
            color: #fff;
          }
          .order-summary {
            margin-top: 20px;
            padding: 10px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
          .product-img {
            max-width: 100px;
            height: auto;
            border-radius: 8px;
          }
          .customer-info, .order-info, .item-info {
            margin-bottom: 20px;
          }
          .item-info img {
            width: 80px;
            height: 80px;
            object-fit: cover;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Order Confirmation</h1>
          <p>Thank you for your purchase, <strong>${
            orderData.customer.name
          }</strong>!</p>
  
          <div class="customer-info">
            <h2>Customer Information</h2>
            <p><strong>Email:</strong> ${orderData.customer.email}</p>
            <p><strong>Address:</strong> ${orderData.customer.address}</p>
            <p><strong>Mobile:</strong> ${orderData.customer.mobile}</p>
          </div>
  
          <div class="order-info">
            <h2>Order Details</h2>
            <table>
              <tr>
                <th>Order ID</th>
                <td>${orderData.id}</td>
              </tr>
              <tr>
                <th>Order Status</th>
                <td>${orderData.status}</td>
              </tr>
              <tr>
                <th>Payment Status</th>
                <td>${orderData.paymentStatus}</td>
              </tr>
              <tr>
                <th>Transaction ID</th>
                <td>${orderData.transactionId}</td>
              </tr>
            </table>
          </div>
  
          <div class="item-info">
            <h3>Items Purchased</h3>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderData.items
                  .map((item: any) => {
                    return `
                      <tr>
             <td style="display: flex; align-items: center; font-weight: bold;">
    <img src="${item.product.images[0]}" class="product-img" alt="${
                      item.product.name
                    }" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;" />
    ${item.product.name}
  </td>
                        <td>${item.quantity}</td>
                        <td>$${item.price}</td>
                        <td>$${item.discount}</td>
                        <td>$${(item.price - item.discount) * item.quantity}</td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>
          </div>
  
          <div class="order-summary">
            <h3>Order Summary</h3>
            <p><strong>Total:</strong> $${orderData.total}</p>
            <p><strong>Discount:</strong> $${orderData.discounts}</p>
            <p><strong>Subtotal:</strong> $${orderData.subTotal}</p>
          </div>
           <div class="back-to-home">
            <a href="/">Back to Home</a>
          </div>
        </div>
      </body>
    </html>
  `;
  
    res.send(htmlContent);
  
    return;
  });