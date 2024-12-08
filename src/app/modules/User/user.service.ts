import bcrypt from "bcrypt";
import { config } from "../../configs";
import prisma from "../../utils/prisma";
import { generateToken, verifyToken, } from "../../utils/jwtToken";
import { paginationHelper } from "../../utils/paginationHelper";
import { IPaginationOptions } from "../../interface/pagination.interface";
import { Prisma } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import { Secret } from "jsonwebtoken";



const createUser = async(data: IUser) => {
    const { address, email, password, mobile, name, accountType } = data;

    const hashedPassword = await bcrypt.hash(
        password,
        Number(config.saltRounds as string)
    );

    const result = await prisma.$transaction(async (prisma) => {
        const user = await prisma.user.create({
            data: {
                email: email,
                name: name,
                password: hashedPassword,
                role: accountType,
            },
        });

        if (accountType === "CUSTOMER") {
            await prisma.customer.create({
                data: {
                    email: user.email,
                    name,
                    mobile: Number(mobile),
                    address,
                    userId: user.userId,
                },
            });
        }

        if (accountType === "VENDOR") {
            await prisma.vendor.create({
                data: {
                    email: user.email,
                    name,
                    mobile: Number(mobile),
                    address,
                    userId: user.userId,
                },
            });
        }

        await prisma.user.findUnique({
            where: { email: user.email },
          });
          const token = generateToken({ userEmail: user.email, role: user.role });
      
          return token;
        });
      
        return result;
};

const getAllUsers = async (
    paginationData: IPaginationOptions,
    params: Record<string, unknown>
  ) => {
    const { page, limit, skip } =
      paginationHelper.calculatePagination(paginationData);
    const { searchTerm, ...filterData } = params;
    let andCondtion: Prisma.UserWhereInput[] = [];
  
    if (Object.keys(filterData).length > 0) {
      andCondtion.push({
        AND: Object.keys(filterData)
          .filter((field) => Boolean(filterData[field])) 
          .map((field) => {
            const value =
              filterData[field] === "true"
                ? true
                : filterData[field] === "false"
                ? false
                : filterData[field];
  
            return {
              [field]: {
                equals: value,
                mode: "insensitive", 
              },
            };
          }),
      });
    }
  
    const searchField = ["email"];
    if (params.searchTerm) {
      andCondtion.push({
        OR: searchField.map((field) => ({
          [field]: { contains: params.searchTerm as string, mode: "insensitive" },
        })),
      });
    }
    const whereConditons: Prisma.UserWhereInput = { AND: andCondtion };
  
    andCondtion.push({
      AND: [{ isDeleted: false }, { role: { not: "ADMIN" } }],
    });
  
    const result = await prisma.user.findMany({
      where: whereConditons,
      select: {
        userId: true,
        email: true,
        role: true,
        isBlocked: true,
        Admin: true,
        vendor: true,
        customer: true,
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
  
    const total = await prisma.user.count({ where: whereConditons });
  
    return {
      meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
      data: result,
    };
  };

const getSingleUser = async (user: any) => {
    const result = await prisma.user.findUniqueOrThrow({
      where: {
        email: user.email,
      }
    });
  
    return result;
  };

const userBlocked = async (id: string) => {
    const previous = await prisma.user.findUnique({
      where: {
        userId: id,
      },
    });
    const result = await prisma.user.update({
      where: { userId: id },
      data: { isBlocked: !previous?.isBlocked },
      select: { isBlocked: true },
    });
  
    return result;
};

const deleteUser = async (id: string) => {
    const previous = await prisma.user.findUnique({
      where: {
        userId: id,
      },
    });
    const result = await prisma.user.update({
      where: { userId: id },
      data: { isDeleted: !previous?.isDeleted },
      select: { isDeleted: true },
    });
  
    return result;
  };


export const userService = {
 createUser,
 getAllUsers,
 userBlocked,
 deleteUser,
 getSingleUser,

};