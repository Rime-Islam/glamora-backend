/*
  Warnings:

  - Added the required column `address` to the `vendor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "vendor" ADD COLUMN     "address" TEXT NOT NULL;
