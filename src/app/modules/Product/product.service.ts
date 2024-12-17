import { JwtPayload } from "jsonwebtoken";
import prisma from "../../utils/prisma";
import { IProduct, IUpdateProduct } from "./product.interface";
import { Prisma } from "@prisma/client";
import { IPaginationOptions } from "../../interface/pagination.interface";
import { paginationHelper } from "../../utils/paginationHelper";
import ApiError from "../../errors/ApiError";

const addProduct = async (data: IProduct) => {
  const shopInfo = await prisma.shop.findUnique({
    where: { shopId: data.shopId },
  });

  if (shopInfo?.isBlackListed) {
    throw new ApiError(500, "Shop is blacklisted");
  }

  const result = await prisma.product.create({
    data: {
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
      discounts: Number(data.discounts),
    },
  });

  return result;
};

const cloneProduct = async (data: IProduct) => {
  const baseName = data.name;

  // Fetch all products with similar names
  const similarProducts = await prisma.product.findMany({
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
  const result = await prisma.product.create({
    data: {
      ...data,
      name: uniqueName, // Use the unique name
      price: Number(data.price),
      stock: Number(data.stock),
      discounts: Number(data.discounts),
    },
  });

  return result;
};

const allProduct = async (
  paginationData: IPaginationOptions,
  params: Record<string, unknown>
) => {
  const { page, limit, skip } =
    paginationHelper.calculatePagination(paginationData);

  const { searchTerm, ...filterData } = params;
  let andCondtion: Prisma.ProductWhereInput[] = [];
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
        [field]: { contains: params.searchTerm as string, mode: "insensitive" },
      })),
    });
  }
  andCondtion.push({
    shop: { isBlackListed: false },
  });
  const whereConditons: Prisma.ProductWhereInput = { AND: andCondtion };

  const result = await prisma.product.findMany({
    where: whereConditons,
    include: {
      category: true,
      shop: true,
      flashSale: true,
    },

    skip: skip,
    take: limit,
    orderBy: paginationData?.sort
      ? {
          [paginationData.sort.split("-")[0]]:
            paginationData.sort.split("-")[1],
        }
      : {
          createdAt: "desc",
        },
  });

  const productsWithAverageRating = await Promise.all(
    result.map(async (product) => {
      const avgRating = await prisma.review.aggregate({
        where: { productId: product.productId },
        _avg: { rating: true },
      });

      return {
        ...product,
        averageRating: avgRating._avg.rating || 0, // Default to 0 if no ratings
      };
    })
  );

  const total = await prisma.product.count({
    where: whereConditons,
  });

  return {
    meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
    data: !!result ? productsWithAverageRating : null,
  };
};

const singleProduct = async (id: string) => {
  const result = await prisma.product.findUnique({
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
  const avgRating = await prisma.review.aggregate({
    where: { productId: id },
    _avg: { rating: true },
    _count: true,
  });

  const relatedProduct = await prisma.product.findMany({
    where: {
      categoryId: result?.categoryId,
      name: { not: result?.name },
      shop: { isBlackListed: false },
    },
  });
  const randomProducts = relatedProduct
    .sort(() => Math.random() - 0.5) // Shuffle array
    .slice(0, 30);
  const data2 = {
    ...result,
    totalReview: avgRating._count,
    averageRating: avgRating._avg.rating || 0,
    relatedProduct: randomProducts,
  };

  return !!result ? data2 : null;
};

const updateProduct = async (
  data: Partial<IUpdateProduct>,
  id: string,
  user: JwtPayload & { userEmail: string; role: string }
) => {
  await prisma.vendor.findUniqueOrThrow({
    where: { email: user.userEmail },
  });

  const result = await prisma.product.update({
    where: { productId: id },
    data: {
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
      discounts: Number(data.discounts),
    },
  });

  return result;
};


const deleteProduct = async (
  id: string,
  user: JwtPayload & { userEmail: string; role: string }
) => {
  await prisma.vendor.findUniqueOrThrow({
    where: { email: user.userEmail },
  });

  const result = await prisma.product.delete({
    where: { productId: id },
  });

  return result;
};

const flashProduct = async () => {
  // Check if there's any active flash sale data
  const existingFlashSale = await prisma.flashSale.findFirst({
    where: { endAt: { gte: new Date() } },
  });

  if (!existingFlashSale) {
    // Delete old flash sale data
    await prisma.flashSale.deleteMany();

    // Fetch a larger number of products to randomize
    const allProducts = await prisma.product.findMany({
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
    await prisma.flashSale.createMany({ data: flashSaleData });

    const result = await prisma.flashSale.findMany({
      include: { product: { include: { category: true, shop: true } } },
    });
    return result;
  } else {
    const result = await prisma.flashSale.findMany({
      include: { product: { include: { category: true, shop: true } } },
    });
    return result;
  }
};

export const ProductService = {
  addProduct,
  updateProduct,
  deleteProduct,
  allProduct,
  singleProduct,
  flashProduct,
  cloneProduct,
};