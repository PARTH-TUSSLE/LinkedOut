-- AlterTable: Change Education startYear/endYear to startDate/endDate
ALTER TABLE "Education" RENAME COLUMN "startYear" TO "startDate";
ALTER TABLE "Education" RENAME COLUMN "endYear" TO "endDate";
ALTER TABLE "Education" ALTER COLUMN "startDate" TYPE TIMESTAMP(3) USING to_timestamp("startDate");
ALTER TABLE "Education" ALTER COLUMN "endDate" TYPE TIMESTAMP(3) USING to_timestamp("endDate");

-- AlterTable: Add createdAt to Connection
ALTER TABLE "Connection" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
