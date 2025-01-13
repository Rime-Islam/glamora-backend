import { JwtPayload } from "jsonwebtoken";
import prisma from "../../utils/prisma";
import ApiError from "../../errors/ApiError";
import { IPaginationOptions } from "../../interface/pagination.interface";
import { paginationHelper } from "../../utils/paginationHelper";

const createShop = async (
  data: {
    name: string;
    location: string;
  },
  user: JwtPayload
) => {
  const userData = await prisma.vendor.findUnique({
    where: { email: user?.userEmail },
  });

  if (!userData) {
    throw new ApiError(404, "Failed to create Shop. User not found.");
  }

  const result = await prisma.shop.create({
    data: { ...data, vendorId: userData.vendorId },
  });
  return result;
};
// for all
const getAllVendorShop = async (paginationData: IPaginationOptions) => {
  const { page, limit, skip } =
    paginationHelper.calculatePagination(paginationData);
  const result = await prisma.shop.findMany({
    where: { isBlackListed: false },
    include: { vendor: true, followers: true, products: true },
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
  const total = await prisma.shop.count();

  return {
    meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
    data: result,
  };
};

const getSingleVendorShop = async (id: string) => {
  const result = await prisma.shop.findUnique({
    where: {
      shopId: id,
    },
    include: {
      products: { include: { category: true } },
      followers: { include: { customer: { select: { email: true } } } },
    },
  });

  return result;
};

//for vendor
const getVendorShop = async (user: JwtPayload) => {
  const userData = await prisma.vendor.findUnique({
    where: { email: user?.userEmail },
  });

  const result = await prisma.shop.findMany({
    where: { vendorId: userData?.vendorId },
  });

  return result;
};

const getVendorSingleShop = async (user: JwtPayload, id: string) => {
  const data = await prisma.vendor.findUniqueOrThrow({
    where: { email: user?.userEmail },
  });
  const result = await prisma.shop.findFirst({
    where: { shopId: id, vendorId: data.vendorId },
    include: { products: { include: { category: true } } },
  });

  return result;
};

const blockShop = async (id: string) => {
  const previous = await prisma.shop.findUnique({
    where: {
      shopId: id,
    },
  });
  const result = await prisma.shop.update({
    where: { shopId: id },
    data: { isBlackListed: !previous?.isBlackListed },
  });
  return result;
};

const followShop = async (
  id: string,
  user: JwtPayload & { userEmail: string; role: string }
) => {
  const userData = await prisma.customer.findUnique({
    where: { email: user.userEmail },
  });
  if (!userData) {
    throw new ApiError(404, "Shop not listed to follow list.Try again.");
  }

  const result = await prisma.follower.create({
    data: { customerId: userData?.customerId, shopId: id },
  });

  return result;
};

const unfollowShop = async (
  id: string,
  user: JwtPayload & { userEmail: string; role: string }
) => {
  const userData = await prisma.customer.findUnique({
    where: { email: user.userEmail },
  });
  if (!userData) {
    throw new ApiError(404, "Shop not listed to follow list.Try again.");
  }
  const result = await prisma.follower.delete({
    where: {
      shopId_customerId: {
        customerId: userData.customerId,
        shopId: id,
      },
    },
  });

  return result;
};




export const ShopService = {
  createShop,
  getVendorShop,
  getVendorSingleShop,
  getAllVendorShop,
  getSingleVendorShop,
  followShop,
  unfollowShop,
  blockShop,
};