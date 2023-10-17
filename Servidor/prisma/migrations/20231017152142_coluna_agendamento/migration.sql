-- CreateTable
CREATE TABLE `agendamento` (
    `numero_agendamento` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(191) NOT NULL,
    `data` VARCHAR(191) NOT NULL,
    `hora` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `servicos` VARCHAR(191) NOT NULL,
    `servicos_id` INTEGER NOT NULL,
    `cliente_id` INTEGER NOT NULL,

    PRIMARY KEY (`numero_agendamento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
