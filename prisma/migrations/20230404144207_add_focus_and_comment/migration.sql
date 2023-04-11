/*
  Warnings:

  - Added the required column `session_name` to the `session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time_end` to the `session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time_start` to the `session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "session" ADD COLUMN     "session_name" TEXT NOT NULL,
ADD COLUMN     "time_end" INTEGER NOT NULL,
ADD COLUMN     "time_start" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "focus" (
    "focus_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "focus_title" TEXT NOT NULL,
    "time_start" INTEGER NOT NULL,
    "time_end" INTEGER NOT NULL,

    CONSTRAINT "focus_pkey" PRIMARY KEY ("focus_id")
);

-- CreateTable
CREATE TABLE "comment" (
    "comment_id" TEXT NOT NULL,
    "focus_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("comment_id")
);

-- AddForeignKey
ALTER TABLE "focus" ADD CONSTRAINT "focus_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "session"("session_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_focus_id_fkey" FOREIGN KEY ("focus_id") REFERENCES "focus"("focus_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "session"("session_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
