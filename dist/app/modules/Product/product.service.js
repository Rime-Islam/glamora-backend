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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const paginationHelper_1 = require("../../utils/paginationHelper");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const addProduct = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const shopInfo = yield prisma_1.default.shop.findUnique({
        where: { shopId: data.shopId },
    });
    if (shopInfo === null || shopInfo === void 0 ? void 0 : shopInfo.isBlackListed) {
        throw new ApiError_1.default(500, "Shop is blacklisted");
    }
    const result = yield prisma_1.default.product.create({
        data: Object.assign(Object.assign({}, data), { price: Number(data.price), stock: Number(data.stock), discounts: Number(data.discounts) }),
    });
    return result;
});
const cloneProduct = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const baseName = data.name;
    // Fetch all products with similar names
    const similarProducts = yield prisma_1.default.product.findMany({
        where: {
            name: {
                startsWith: baseName,
            },
        },
        select: {
            name: true,
        },
    });
    //Determine a unique name
    let uniqueName = baseName;
    if (similarProducts.length > 0) {
        const nameSet = new Set(similarProducts.map((product) => product.name));
        let count = 1;
        while (nameSet.has(`${baseName} copy ${count}`)) {
            count++;
        }
        uniqueName = `${baseName} copy ${count}`;
    }
    // Create a new product with the unique name
    const result = yield prisma_1.default.product.create({
        data: Object.assign(Object.assign({}, data), { name: uniqueName, price: Number(data.price), stock: Number(data.stock), discounts: Number(data.discounts) }),
    });
    return result;
});
const allProduct = (paginationData, params) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(paginationData);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    let andCondtion = [];
    if (Object.keys(filterData).length > 0) {
        andCondtion.push({
            AND: Object.keys(filterData)
                .filter((field) => Boolean(filterData[field])) // Exclude all falsy values
                .map((field) => ({
                [field]: {
                    equals: filterData[field],
                    // mode: "insensitive", // Uncomment if needed for case-insensitive search
                },
            })),
        });
    }
    const searchField = ["description", "name"];
    if (params.searchTerm) {
        andCondtion.push({
            OR: searchField.map((field) => ({
                [field]: { contains: params.searchTerm, mode: "insensitive" },
            })),
        });
    }
    andCondtion.push({
        shop: { isBlackListed: false },
    });
    const whereConditons = { AND: andCondtion };
    const result = yield prisma_1.default.product.findMany({
        where: whereConditons,
        include: {
            category: true,
            shop: true,
            flashSale: true,
        },
        skip: skip,
        take: limit,
        orderBy: (paginationData === null || paginationData === void 0 ? void 0 : paginationData.sort)
            ? {
                [paginationData.sort.split("-")[0]]: paginationData.sort.split("-")[1],
            }
            : {
                createdAt: "desc",
            },
    });
    const productsWithAverageRating = yield Promise.all(result.map((product) => __awaiter(void 0, void 0, void 0, function* () {
        const avgRating = yield prisma_1.default.review.aggregate({
            where: { productId: product.productId },
            _avg: { rating: true },
        });
        return Object.assign(Object.assign({}, product), { averageRating: avgRating._avg.rating || 0 });
    })));
    const total = yield prisma_1.default.product.count({
        where: whereConditons,
    });
    return {
        meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
        data: !!result ? productsWithAverageRating : null,
    };
});
const singleProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.findUnique({
        where: {
            productId: id,
        },
        include: {
            category: true,
            shop: true,
            flashSale: true,
            Review: {
                include: {
                    customer: { select: { name: true, customerId: true, email: true } },
                },
            },
        },
    });
    const avgRating = yield prisma_1.default.review.aggregate({
        where: { productId: id },
        _avg: { rating: true },
        _count: true,
    });
    const relatedProduct = yield prisma_1.default.product.findMany({
        where: {
            categoryId: result === null || result === void 0 ? void 0 : result.categoryId,
            name: { not: result === null || result === void 0 ? void 0 : result.name },
            shop: { isBlackListed: false },
        },
    });
    const randomProducts = relatedProduct
        .sort(() => Math.random() - 0.5) // Shuffle array
        .slice(0, 30);
    const data2 = Object.assign(Object.assign({}, result), { totalReview: avgRating._count, averageRating: avgRating._avg.rating || 0, relatedProduct: randomProducts });
    return !!result ? data2 : null;
});
const updateProduct = (data, id, user) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.vendor.findUniqueOrThrow({
        where: { email: user.userEmail },
    });
    const result = yield prisma_1.default.product.update({
        where: { productId: id },
        data: Object.assign(Object.assign({}, data), { price: Number(data.price), stock: Number(data.stock), discounts: Number(data.discounts) }),
    });
    return result;
});
const deleteProduct = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.vendor.findUniqueOrThrow({
        where: { email: user.userEmail },
    });
    const result = yield prisma_1.default.product.delete({
        where: { productId: id },
    });
    return result;
});
const flashProduct = () => __awaiter(void 0, void 0, void 0, function* () {
    // Check if there's any active flash sale data
    const existingFlashSale = yield prisma_1.default.flashSale.findFirst({
        where: { endAt: { gte: new Date() } },
    });
    if (!existingFlashSale) {
        // Delete old flash sale data
        yield prisma_1.default.flashSale.deleteMany();
        // Fetch a larger number of products to randomize
        const allProducts = yield prisma_1.default.product.findMany({
            where: { stock: { gt: 0 }, shop: { isBlackListed: false } },
            select: { productId: true }, // Fetch only necessary fields
        });
        // Shuffle the array to pick random products
        const shuffledProducts = allProducts.sort(() => 0.5 - Math.random());
        // Select up to 10 random products
        const selectedProducts = shuffledProducts.slice(0, 30);
        // Prepare flash sale data
        const flashSaleData = selectedProducts.map((product) => ({
            productId: product.productId,
            discount: Math.floor(Math.random() * (25 - 15 + 1)) + 15, // Random discount between 15% and 25%
            startAt: new Date(),
            endAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Valid for 24 hours
        }));
        // Insert flash sale data
        yield prisma_1.default.flashSale.createMany({ data: flashSaleData });
        const result = yield prisma_1.default.flashSale.findMany({
            include: { product: { include: { category: true, shop: true } } },
        });
        return result;
    }
    else {
        const result = yield prisma_1.default.flashSale.findMany({
            include: { product: { include: { category: true, shop: true } } },
        });
        return result;
    }
});
const searchProduct = (text) => __awaiter(void 0, void 0, void 0, function* () {
    if (!text.trim()) {
        console.log("Search text is empty.");
        return [];
    }
    console.log(text, "ds");
    const product = yield prisma_1.default.product.findMany({
        where: {
            OR: [
                {
                    name: {
                        contains: text,
                        mode: "insensitive",
                    },
                },
                {
                    description: {
                        contains: text,
                        mode: "insensitive",
                    },
                },
            ],
        },
    });
    console.log(product);
    return product;
});
exports.ProductService = {
    addProduct,
    updateProduct,
    deleteProduct,
    allProduct,
    singleProduct,
    flashProduct,
    cloneProduct,
    searchProduct,
};
