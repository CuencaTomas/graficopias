-- Reemplaza la imagen única por una lista de imágenes por producto (para el carrusel)
ALTER TABLE "Producto" DROP COLUMN "imagenUrl";
ALTER TABLE "Producto" ADD COLUMN "imagenesUrl" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
