"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const jwtToken_1 = require("../../utils/jwtToken");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const sendEmail_1 = require("../../utils/sendEmail");
const configs_1 = require("../../configs");
const userSignin = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { email: data.email },
    });
    if (!user) {
        throw new ApiError_1.default(404, "User not find");
    }
    if (!(yield bcrypt_1.default.compare(data.password, user.password))) {
        throw new ApiError_1.default(404, "Invalid password");
    }
    const token = (0, jwtToken_1.generateToken)({ userEmail: user.email, role: user.role });
    if (!token) {
        throw new ApiError_1.default(404, "Something Went Wrong!! Try again.");
    }
    return { token };
});
const forgetPassword = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const findUser = yield prisma_1.default.user.findUnique({
        where: { email: userEmail },
    });
    const name = findUser === null || findUser === void 0 ? void 0 : findUser.name;
    const email = userEmail;
    if (!findUser) {
        throw new ApiError_1.default(500, "User not found");
    }
    const accessToken = (0, jwtToken_1.generateToken)({
        userEmail: userEmail,
        role: "",
    }, "5min");
    const token = `${accessToken}`;
    const url = configs_1.config.URL;
    const URL = `${url}/auth/reset-password?email=${userEmail}&token=${token}`;
    yield (0, sendEmail_1.resetPasswordEmail)(email, URL, name);
    return "";
});
const setUserNewPassword = (token, password) => __awaiter(void 0, void 0, void 0, function* () {
    // Use the utility to decode the token
    const decoded = (0, jwtToken_1.verifyToken)(token);
    console.log(decoded);
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { email: decoded.userEmail },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(404, "User not Found");
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, Number(configs_1.config.saltRounds));
    const result = yield prisma_1.default.user.update({
        where: { email: decoded.userEmail },
        data: { password: hashedPassword },
    });
    console.log(result);
    return result;
});
const getUserDashboard = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    if (userData.role !== "CUSTOMER") {
        throw new Error("Unauthorized access: Dashboard is available only for customers.");
    }
    // Fetch customer data
    const customer = yield prisma_1.default.customer.findUnique({
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
    const totalSpent = customer.orders.reduce((sum, order) => sum + order.total, 0);
    const totalDiscounts = customer.orders.reduce((sum, order) => sum + (order.discounts || 0), 0);
    const orderStatus = customer.orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {});
    const paymentStatus = customer.orders.reduce((acc, order) => {
        acc[order.paymentStatus] = (acc[order.paymentStatus] || 0) + 1;
        return acc;
    }, {});
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
});
const getVendorDashboard = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    // First, get vendor details (vendorId) based on email
    const vendor = yield prisma_1.default.vendor.findUnique({
        where: {
            email: userData.userEmail,
        },
        select: {
            vendorId: true,
            image: true,
            address: true,
            gender: true,
            mobile: true,
        },
    });
    if (!vendor) {
        throw new Error("Vendor not found");
    }
    // Run all other queries in parallel using Promise.all
    const [totalShops, totalProducts, totalCompletedOrders, totalEarnings] = yield Promise.all([
        prisma_1.default.shop.count({
            where: {
                vendorId: vendor.vendorId,
            },
        }),
        prisma_1.default.product.count({
            where: {
                shop: {
                    vendorId: vendor.vendorId,
                },
            },
        }),
        // Here, we're counting the orders based on the vendor's shop and the related products
        prisma_1.default.orderItem.count({
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
        prisma_1.default.order.aggregate({
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
});
const getAdminDashboard = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // First, get vendor details (vendorId) based on email
        const admin = yield prisma_1.default.admin.findUnique({
            where: {
                email: userData.userEmail,
            },
            select: {
                adminId: true,
                image: true,
                address: true,
                gender: true,
                mobile: true,
            },
        });
        // Fetch delivered orders and total earnings
        const deliveredOrders = yield prisma_1.default.order.findMany({
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
        const totalUsers = yield prisma_1.default.user.count();
        const totalCustomers = yield prisma_1.default.customer.count();
        const totalVendors = yield prisma_1.default.vendor.count();
        const totalProducts = yield prisma_1.default.product.count();
        const totalOrders = yield prisma_1.default.order.count();
        const totalReviews = yield prisma_1.default.review.count();
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
    }
    catch (error) {
        console.error("Error getting dashboard data:", error);
        throw new Error("Unable to fetch dashboard data.");
    }
});
exports.AuthService = {
    userSignin,
    forgetPassword,
    setUserNewPassword,
    getUserDashboard,
    getAdminDashboard,
    getVendorDashboard,
};
