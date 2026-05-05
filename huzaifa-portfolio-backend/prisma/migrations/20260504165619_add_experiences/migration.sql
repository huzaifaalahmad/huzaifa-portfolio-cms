-- CreateTable
CREATE TABLE `experiences` (
    `id` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `employment_type` VARCHAR(191) NOT NULL DEFAULT 'Freelance',
    `start_date` VARCHAR(191) NOT NULL,
    `end_date` VARCHAR(191) NULL,
    `is_current` BOOLEAN NOT NULL DEFAULT false,
    `description` TEXT NOT NULL,
    `achievements` JSON NULL,
    `technologies` JSON NULL,
    `is_visible` BOOLEAN NOT NULL DEFAULT true,
    `is_featured` BOOLEAN NOT NULL DEFAULT false,
    `order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
