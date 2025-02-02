import ApiError from "../../errors/ApiError";
import { generateToken, verifyToken } from "../../utils/jwtToken";
import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";
import { resetPasswordEmail } from "../../utils/sendEmail";
import { config } from "../../configs";
import { JwtPayload, Secret } from "jsonwebtoken";


const userSignin = async (data: { email: string; password: string }) => {
  
  const user = await prisma.user.findUnique({
      where: { email: data.email },
    });
  
    if (!user) {
      throw new ApiError(404, "User not find");
    }
  
    if (!(await bcrypt.compare(data.password, user.password))) {
      throw new ApiError(404, "Invalid password");
    }
  
    const token = generateToken({ userEmail: user.email, role: user.role });
  
    if (!token) {
      throw new ApiError(404, "Something Went Wrong!! Try again.");
    }
  
    return { token };
};
  
const forgetPassword = async (userEmail: string) => {
    const findUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });
  
    const name = findUser?.name as string;
    const email = userEmail;

    if (!findUser) {
      throw new ApiError(500, "User not found");
    }
  
    const accessToken = generateToken(
      {
        userEmail: userEmail,
        role: "",
      },
      "5min"
    );
    const token = `${accessToken}`;

      const url = config.URL;
      const URL = `${url}/auth/reset-password?email=${userEmail}&token=${token}`;
   
    await resetPasswordEmail(email, URL, name);
  
    return "";
};

const setUserNewPassword = async (token: string, password: string) => {
  // Use the utility to decode the token
  const decoded = verifyToken(token);
console.log(decoded)
  const isUserExist = await prisma.user.findUnique({
    where: { email: decoded.userEmail },
  });

  if (!isUserExist) {
    throw new ApiError(404, "User not Found");
  }
  const hashedPassword = await bcrypt.hash(password, Number(config.saltRounds));

  const result = await prisma.user.update({
    where: { email: decoded.userEmail },
    data: { password: hashedPassword },
  });
  console.log(result)
  return result;
};

  const getUserDashboard = async (
    userData: JwtPayload & { userEmail: string; role: string }
  ) => {
    if (userData.role !== "CUSTOMER") {
      throw new Error(
        "Unauthorized access: Dashboard is available only for customers."
      );
    }
  
    // Fetch customer data
    const customer = await prisma.customer.findUnique({
      where: { email: userData.userEmail },
      select: {
        customerId: true,
        orders: {
          select: {
            total: true,
            discounts: true,
            paymentStatus: true,
            status: true,
          },
        },
        name: true,
        email: true,
        image: true,
        followers: true,
        address: true,
        gender: true,    
        mobile: true, 
        Review: true,
      },
    });
  
    if (!customer) {
      throw new Error("Customer not found.");
    }
  
    const totalOrders = customer.orders.length;
    const totalSpent = customer.orders.reduce(
      (sum, order) => sum + order.total,
      0
    );
    const totalDiscounts = customer.orders.reduce(
      (sum, order) => sum + (order.discounts || 0),
      0
    );
  
    const orderStatus = customer.orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
    const paymentStatus = customer.orders.reduce((acc, order) => {
      acc[order.paymentStatus] = (acc[order.paymentStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
    const totalFollowers = customer.followers.length;
    const totalReviews = customer.Review.length;
  
    return {
      customer,
      totalOrders,
      totalSpent,
      totalDiscounts,
      orderStatus,
      paymentStatus,
      totalFollowers,
      totalReviews,
    };
  };
  
  const getVendorDashboard = async (
    userData: JwtPayload & { userEmail: string; role: string }
  ) => {
    // First, get vendor details (vendorId) based on email
    const vendor = await prisma.vendor.findUnique({
      where: {
        email: userData.userEmail,
      },
      select: {
        vendorId: true,
        image: true,
        name: true,
        email: true,
        address: true,
        gender: true,    
        mobile: true, 
      },
    });
  
    if (!vendor) {
      throw new Error("Vendor not found");
    }
  
    // Run all other queries in parallel using Promise.all
    const [totalShops, totalProducts, totalCompletedOrders, totalEarnings] =
      await Promise.all([
        prisma.shop.count({
          where: {
            vendorId: vendor.vendorId,
          },
        }),
  
        prisma.product.count({
          where: {
            shop: {
              vendorId: vendor.vendorId,
            },
          },
        }),
  
        // Here, we're counting the orders based on the vendor's shop and the related products
        prisma.orderItem.count({
          where: {
            product: {
              shop: {
                vendorId: vendor.vendorId,
              },
            },
            order: {
              paymentStatus: "COMPLETED",
              status: "DELIVERED",
            },
          },
        }),
  
        // Aggregate earnings based on the vendor's products in orders
        prisma.order.aggregate({
          _sum: {
            subTotal: true,
          },
          where: {
            items: {
              some: {
                product: {
                  shop: {
                    vendorId: vendor.vendorId,
                  },
                },
              },
            },
            paymentStatus: "COMPLETED",
            status: "DELIVERED",
          },
        }),
      ]);
  
    return {
      vendor,
      totalShops,
      totalProducts,
      totalCompletedOrders,
      totalEarnings: totalEarnings._sum.subTotal || 0, // Fallback if no earnings
    };
  };
  
  const getAdminDashboard = async (
    userData: JwtPayload & { userEmail: string; role: string }
  )  => {
    try {
       // First, get vendor details (vendorId) based on email
    const admin = await prisma.admin.findUnique({
      where: {
        email: userData.userEmail,
      },
      select: {
        adminId: true,
        image: true,
        name: true,
        email: true,
        address: true,
        gender: true,    
        mobile: true, 
      },
    });
      // Fetch delivered orders and total earnings
      const deliveredOrders = await prisma.order.findMany({
        where: {
          status: "DELIVERED", // Only fetch orders with 'DELIVERED' status
        },
        include: {
          customer: true, // Include customer details
          items: {
            include: {
              product: true, // Include product details for each order item
              shop: true, // Include shop details for each order item
            },
          },
        },
      });
  
      // Calculate total earnings from delivered orders
      const totalEarnings = deliveredOrders.reduce((accum, order) => {
        return accum + order.total; // Sum up the total price of each delivered order
      }, 0);
  
      // Fetch the count of different entities
      const totalUsers = await prisma.user.count();
      const totalCustomers = await prisma.customer.count();
      const totalVendors = await prisma.vendor.count();
      const totalProducts = await prisma.product.count();
      const totalOrders = await prisma.order.count();
      const totalReviews = await prisma.review.count();
  
      // Combine all the data
      return {
        admin,
        deliveredOrders,
        totalEarnings,
        totalUsers,
        totalCustomers,
        totalVendors,
        totalProducts,
        totalOrders,
        totalReviews,
      };
    } catch (error) {
      console.error("Error getting dashboard data:", error);
      throw new Error("Unable to fetch dashboard data.");
    }
  };


export const AuthService = {
    userSignin,
    forgetPassword,
    setUserNewPassword,
    getUserDashboard,
    getAdminDashboard,
    getVendorDashboard,

}