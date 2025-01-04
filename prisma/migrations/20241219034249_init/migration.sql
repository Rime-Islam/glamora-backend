/*
  Warnings:

  - Changed the type of `mobile` on the `admin` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "admin" DROP COLUMN "mobile",
ADD COLUMN     "mobile" INTEGER NOT NULL;
