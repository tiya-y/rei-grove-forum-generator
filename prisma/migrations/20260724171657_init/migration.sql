-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('RESOURCE', 'GENERAL');

-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('QUESTION', 'POLL', 'SHARE_YOUR_STORY', 'DISCUSSION', 'TIPS_THREAD');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'POSTED');

-- CreateTable
CREATE TABLE "ForumPost" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "sourceType" "SourceType" NOT NULL,
    "sourceRef" TEXT,
    "postType" "PostType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "aiGenerated" BOOLEAN NOT NULL DEFAULT true,
    "status" "PostStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "batchId" TEXT NOT NULL,
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "postedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ForumPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForumCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ForumCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ForumCategory_name_key" ON "ForumCategory"("name");
