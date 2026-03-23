-- AlterTable
ALTER TABLE `categories` ADD COLUMN `full_path` VARCHAR(500) NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX `categories_full_path_key` ON `categories`(`full_path`);
