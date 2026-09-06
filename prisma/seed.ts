import { PrismaClient, TipoCalculo, TipoModificador } from "@prisma/client";

const prisma = new PrismaClient();

async function upsertOpcion(nombre: string, valores: { nombre: string; tipoModificador: TipoModificador; valorModificador: number }[]) {
  const existente = await prisma.opcion.findFirst({ where: { nombre } });
  if (existente) return existente;

  return prisma.opcion.create({
    data: {
      nombre,
      valores: { create: valores },
    },
  });
}

async function main() {
  const tipoPapel = await upsertOpcion("Tipo de papel", [
    { nombre: "Obra", tipoModificador: TipoModificador.PORCENTAJE, valorModificador: 0 },
    { nombre: "Ilustración", tipoModificador: TipoModificador.PORCENTAJE, valorModificador: 15 },
    { nombre: "Fotográfico", tipoModificador: TipoModificador.PORCENTAJE, valorModificador: 30 },
  ]);

  const terminacionSimple = await upsertOpcion("Terminación", [
    { nombre: "Sin terminación", tipoModificador: TipoModificador.FIJO, valorModificador: 0 },
    { nombre: "Plastificado brillante", tipoModificador: TipoModificador.FIJO, valorModificador: 500 },
    { nombre: "Plastificado mate", tipoModificador: TipoModificador.FIJO, valorModificador: 600 },
  ]);

  const terminacionBanner = await upsertOpcion("Terminación banner", [
    { nombre: "Sin terminación", tipoModificador: TipoModificador.FIJO, valorModificador: 0 },
    { nombre: "Con bolsillo para caño", tipoModificador: TipoModificador.FIJO, valorModificador: 800 },
  ]);

  const a4 = await prisma.producto.upsert({
    where: { id: "seed-impresion-a4" },
    update: {},
    create: {
      id: "seed-impresion-a4",
      nombre: "Impresión A4",
      categoria: "Impresión digital",
      descripcion: "Impresión digital a color u blanco y negro en hoja A4.",
      tipoCalculo: TipoCalculo.UNIDAD,
      precioBase: 150,
      cantidadMinima: 1,
      opciones: {
        create: [{ opcionId: tipoPapel.id, requerida: true, orden: 0 }],
      },
    },
  });

  const a3 = await prisma.producto.upsert({
    where: { id: "seed-impresion-a3" },
    update: {},
    create: {
      id: "seed-impresion-a3",
      nombre: "Impresión A3",
      categoria: "Impresión digital",
      descripcion: "Impresión digital a color u blanco y negro en hoja A3.",
      tipoCalculo: TipoCalculo.UNIDAD,
      precioBase: 280,
      cantidadMinima: 1,
      opciones: {
        create: [{ opcionId: tipoPapel.id, requerida: true, orden: 0 }],
      },
    },
  });

  const cartel = await prisma.producto.upsert({
    where: { id: "seed-cartel" },
    update: {},
    create: {
      id: "seed-cartel",
      nombre: "Cartel",
      categoria: "Gran formato",
      descripcion: "Cartel de gran formato impreso por metro cuadrado.",
      tipoCalculo: TipoCalculo.M2,
      precioBase: 3500,
      opciones: {
        create: [{ opcionId: terminacionSimple.id, requerida: false, orden: 0 }],
      },
    },
  });

  const banner = await prisma.producto.upsert({
    where: { id: "seed-banner" },
    update: {},
    create: {
      id: "seed-banner",
      nombre: "Banner",
      categoria: "Gran formato",
      descripcion: "Banner de lona impreso por metro cuadrado.",
      tipoCalculo: TipoCalculo.M2,
      precioBase: 4200,
      opciones: {
        create: [{ opcionId: terminacionBanner.id, requerida: false, orden: 0 }],
      },
    },
  });

  const volantes = await prisma.producto.upsert({
    where: { id: "seed-volantes" },
    update: {},
    create: {
      id: "seed-volantes",
      nombre: "Volantes",
      categoria: "Imprenta",
      descripcion: "Volantes impresos, precio por tramo de cantidad.",
      tipoCalculo: TipoCalculo.ESCALONADO,
      precioBase: 0,
      cantidadMinima: 50,
      opciones: {
        create: [{ opcionId: tipoPapel.id, requerida: true, orden: 0 }],
      },
      tramosPrecio: {
        create: [
          { cantidadDesde: 50, cantidadHasta: 99, precioUnitario: 12 },
          { cantidadDesde: 100, cantidadHasta: 249, precioUnitario: 9 },
          { cantidadDesde: 250, cantidadHasta: 499, precioUnitario: 7 },
          { cantidadDesde: 500, cantidadHasta: null, precioUnitario: 5.5 },
        ],
      },
    },
  });

  console.log("Seed listo:", [a4, a3, cartel, banner, volantes].map((p) => p.nombre).join(", "));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
