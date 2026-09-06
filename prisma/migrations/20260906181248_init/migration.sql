-- CreateEnum
CREATE TYPE "TipoCalculo" AS ENUM ('UNIDAD', 'M2', 'ESCALONADO');

-- CreateEnum
CREATE TYPE "TipoModificador" AS ENUM ('PORCENTAJE', 'FIJO');

-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('PENDIENTE_PAGO', 'SENADO', 'EN_PREPARACION', 'COMENZADO', 'TERMINADO', 'ENTREGADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "MedioContacto" AS ENUM ('TELEFONO', 'EMAIL');

-- CreateEnum
CREATE TYPE "MedioPago" AS ENUM ('MERCADO_PAGO', 'TRANSFERENCIA');

-- CreateEnum
CREATE TYPE "TipoPago" AS ENUM ('SENA', 'TOTAL');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO');

-- CreateTable
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoria" TEXT,
    "descripcion" TEXT,
    "imagenUrl" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "tipoCalculo" "TipoCalculo" NOT NULL,
    "precioBase" DECIMAL(12,2) NOT NULL,
    "cantidadMinima" INTEGER,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TramoPrecio" (
    "id" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "cantidadDesde" INTEGER NOT NULL,
    "cantidadHasta" INTEGER,
    "precioUnitario" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "TramoPrecio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opcion" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Opcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValorOpcion" (
    "id" TEXT NOT NULL,
    "opcionId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipoModificador" "TipoModificador" NOT NULL,
    "valorModificador" DECIMAL(12,2) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ValorOpcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductoOpcion" (
    "id" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "opcionId" TEXT NOT NULL,
    "requerida" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductoOpcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" TEXT NOT NULL,
    "nombreCliente" TEXT NOT NULL,
    "contacto" TEXT NOT NULL,
    "medioContacto" "MedioContacto" NOT NULL,
    "estado" "EstadoPedido" NOT NULL DEFAULT 'PENDIENTE_PAGO',
    "montoTotal" DECIMAL(12,2) NOT NULL,
    "montoSenado" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "esPagoTotal" BOOLEAN NOT NULL DEFAULT false,
    "notasInternas" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,
    "entregadoEn" TIMESTAMP(3),

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemPedido" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioCalculado" DECIMAL(12,2) NOT NULL,
    "quiereDiseno" BOOLEAN NOT NULL DEFAULT false,
    "comentario" TEXT,

    CONSTRAINT "ItemPedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemPedidoOpcion" (
    "id" TEXT NOT NULL,
    "itemPedidoId" TEXT NOT NULL,
    "valorOpcionId" TEXT NOT NULL,
    "modificadorAplicado" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "ItemPedidoOpcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "medioPago" "MedioPago" NOT NULL,
    "tipoPago" "TipoPago" NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL,
    "estado" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
    "mpPreferenceId" TEXT,
    "mpPaymentId" TEXT,
    "mpExternalReference" TEXT,
    "comprobanteUrl" TEXT,
    "verificadoPorUsuario" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Producto_activo_idx" ON "Producto"("activo");

-- CreateIndex
CREATE INDEX "TramoPrecio_productoId_idx" ON "TramoPrecio"("productoId");

-- CreateIndex
CREATE INDEX "ValorOpcion_opcionId_idx" ON "ValorOpcion"("opcionId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductoOpcion_productoId_opcionId_key" ON "ProductoOpcion"("productoId", "opcionId");

-- CreateIndex
CREATE INDEX "Pedido_estado_idx" ON "Pedido"("estado");

-- CreateIndex
CREATE INDEX "Pedido_entregadoEn_idx" ON "Pedido"("entregadoEn");

-- CreateIndex
CREATE INDEX "ItemPedido_pedidoId_idx" ON "ItemPedido"("pedidoId");

-- CreateIndex
CREATE INDEX "ItemPedidoOpcion_itemPedidoId_idx" ON "ItemPedidoOpcion"("itemPedidoId");

-- CreateIndex
CREATE INDEX "Pago_pedidoId_idx" ON "Pago"("pedidoId");

-- CreateIndex
CREATE INDEX "Pago_mpExternalReference_idx" ON "Pago"("mpExternalReference");

-- AddForeignKey
ALTER TABLE "TramoPrecio" ADD CONSTRAINT "TramoPrecio_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValorOpcion" ADD CONSTRAINT "ValorOpcion_opcionId_fkey" FOREIGN KEY ("opcionId") REFERENCES "Opcion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductoOpcion" ADD CONSTRAINT "ProductoOpcion_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductoOpcion" ADD CONSTRAINT "ProductoOpcion_opcionId_fkey" FOREIGN KEY ("opcionId") REFERENCES "Opcion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPedido" ADD CONSTRAINT "ItemPedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPedido" ADD CONSTRAINT "ItemPedido_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPedidoOpcion" ADD CONSTRAINT "ItemPedidoOpcion_itemPedidoId_fkey" FOREIGN KEY ("itemPedidoId") REFERENCES "ItemPedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPedidoOpcion" ADD CONSTRAINT "ItemPedidoOpcion_valorOpcionId_fkey" FOREIGN KEY ("valorOpcionId") REFERENCES "ValorOpcion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
