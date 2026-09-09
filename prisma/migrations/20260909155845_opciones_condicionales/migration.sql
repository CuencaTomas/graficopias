-- AlterTable
ALTER TABLE "ProductoOpcion" ADD COLUMN     "dependeDeValorOpcionId" TEXT;

-- CreateIndex
CREATE INDEX "ProductoOpcion_dependeDeValorOpcionId_idx" ON "ProductoOpcion"("dependeDeValorOpcionId");

-- AddForeignKey
ALTER TABLE "ProductoOpcion" ADD CONSTRAINT "ProductoOpcion_dependeDeValorOpcionId_fkey" FOREIGN KEY ("dependeDeValorOpcionId") REFERENCES "ValorOpcion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
