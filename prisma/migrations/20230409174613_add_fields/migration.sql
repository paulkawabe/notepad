/*
  Warnings:

  - Changed the type of `time_start` on the `focus` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `time_end` on the `focus` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `time_end` on the `session` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `time_start` on the `session` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "focus" DROP COLUMN "time_start",
ADD COLUMN     "time_start" TIMESTAMP(3) NOT NULL,
DROP COLUMN "time_end",
ADD COLUMN     "time_end" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "session" DROP COLUMN "time_end",
ADD COLUMN     "time_end" TIMESTAMP(3) NOT NULL,
DROP COLUMN "time_start",
ADD COLUMN     "time_start" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "recording" (
    "recording_id" TEXT NOT NULL,
    "recording_name" TEXT NOT NULL,
    "focus_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" BYTEA NOT NULL,

    CONSTRAINT "recording_pkey" PRIMARY KEY ("recording_id")
);

-- AddForeignKey
ALTER TABLE "recording" ADD CONSTRAINT "recording_focus_id_fkey" FOREIGN KEY ("focus_id") REFERENCES "focus"("focus_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recording" ADD CONSTRAINT "recording_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "session"("session_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recording" ADD CONSTRAINT "recording_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
