/*
  Warnings:

  - You are about to drop the column `descricao` on the `agendamento` table. All the data in the column will be lost.
  - Added the required column `servicos_preco` to the `agendamento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `agendamento` DROP COLUMN `descricao`,
    ADD COLUMN `servicos_preco` VARCHAR(191) NOT NULL;
