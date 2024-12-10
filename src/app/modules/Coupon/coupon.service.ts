import prisma from "../../utils/prisma";

const createCupon = async (data: any) => {
    const result = await prisma.coupon.create({
      data: {
        ...data,
        discount: Number(data.discount),
        expiresAt: new Date(data.expiresAt),
      },
    });
    return result;
  };
  
  const getShopCupon = async (shopId: string) => {
    const result = await prisma.coupon.findMany({ where: { shopId } });
    return result;
  };
  
  export const CuponService = { createCupon, getShopCupon };