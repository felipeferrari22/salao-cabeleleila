/*
  Warnings:

  - You are about to alter the column `servicos_preco` on the `agendamento` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `preco` on the `servicos` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `agendamento` MODIFY `servicos_preco` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `servicos` MODIFY `preco` INTEGER NOT NULL;
