import prisma from "../../utils/prisma";



const createCategory = async (data: { name: string }) => {
    const result = await prisma.category.create({ data: data });
    return result;
  };
  
  const getAllCategory = async () => {
    const result = await prisma.category.findMany({
      where: {
        isDeleted: false,
      },
    });
    return result;
  };
  
  const updateCategory = async (id: string, data: { name: string }) => {
    const result = await prisma.category.update({
      where: { categoryId: id },
      data: data,
    });
    return result;
  };
  
  const deleteCategory = async (id: string) => {
    const result = await prisma.category.update({
      where: { categoryId: id },
      data: {
        isDeleted: true,
      },
    });
    return result;
  };
  
  export const CategoryService = {
    createCategory,
    getAllCategory,
    updateCategory,
    deleteCategory,
  };