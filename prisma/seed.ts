import { PrismaClient, TipoCalculo, TipoModificador } from "@prisma/client";

const prisma = new PrismaClient();

type ValorOpcionInput = { nombre: string; modificador: number };
type GrupoOpcionesInput = { nombre: string; valores: ValorOpcionInput[] };

type ProductoInput = {
  id: string;
  nombre: string;
  categoria: "Imprenta" | "Gráfica";
  descripcion?: string;
  imagenUrl?: string;
  tipoCalculo: TipoCalculo;
  precioBase: number;
  cantidadMinima?: number;
  grupoOpciones?: GrupoOpcionesInput;
  tramosPrecio?: { cantidadDesde: number; cantidadHasta: number | null; precioUnitario: number }[];
};

async function crearProducto(input: ProductoInput) {
  let opcionesCreate:
    | { create: { opcionId: string; requerida: boolean; orden: number }[] }
    | undefined;

  if (input.grupoOpciones) {
    const opcion = await prisma.opcion.create({
      data: {
        nombre: input.grupoOpciones.nombre,
        valores: {
          create: input.grupoOpciones.valores.map((v) => ({
            nombre: v.nombre,
            tipoModificador: TipoModificador.FIJO,
            valorModificador: v.modificador,
          })),
        },
      },
    });
    opcionesCreate = { create: [{ opcionId: opcion.id, requerida: true, orden: 0 }] };
  }

  await prisma.producto.create({
    data: {
      id: input.id,
      nombre: input.nombre,
      categoria: input.categoria,
      descripcion: input.descripcion,
      imagenUrl: input.imagenUrl,
      tipoCalculo: input.tipoCalculo,
      precioBase: input.precioBase,
      cantidadMinima: input.cantidadMinima,
      opciones: opcionesCreate,
      tramosPrecio: input.tramosPrecio ? { create: input.tramosPrecio } : undefined,
    },
  });
}

async function crearViniloImpreso() {
  const producto = await prisma.producto.create({
    data: {
      id: "grafica-vinilo-impreso",
      nombre: "Vinilo impreso",
      categoria: "Gráfica",
      descripcion: "Vinilo impreso por metro cuadrado.",
      imagenUrl: "/productos/vinilo-impreso.jpg",
      tipoCalculo: TipoCalculo.M2,
      precioBase: 18000,
    },
  });

  const acabado = await prisma.opcion.create({
    data: {
      nombre: "Acabado",
      valores: {
        create: [
          { nombre: "Brillo", tipoModificador: TipoModificador.FIJO, valorModificador: 0 },
          { nombre: "Mate", tipoModificador: TipoModificador.FIJO, valorModificador: 0 },
        ],
      },
    },
  });
  await prisma.productoOpcion.create({
    data: { productoId: producto.id, opcionId: acabado.id, requerida: true, orden: 0 },
  });

  const troquelado = await prisma.opcion.create({
    data: {
      nombre: "Troquelado",
      valores: {
        create: [
          { nombre: "Sin troquelar", tipoModificador: TipoModificador.FIJO, valorModificador: 0 },
          { nombre: "Con troquelado", tipoModificador: TipoModificador.FIJO, valorModificador: 2000 },
        ],
      },
    },
    include: { valores: true },
  });
  await prisma.productoOpcion.create({
    data: { productoId: producto.id, opcionId: troquelado.id, requerida: true, orden: 1 },
  });
  const conTroquelado = troquelado.valores.find((v) => v.nombre === "Con troquelado")!;

  // Sub-tipo de troquelado: sólo aparece si se elige "Con troquelado".
  // TODO: modificadores en $0 — falta el precio real de cada tipo.
  const tipoTroquelado = await prisma.opcion.create({
    data: {
      nombre: "Tipo de troquelado",
      valores: {
        create: [
          { nombre: "Despuntillado", tipoModificador: TipoModificador.FIJO, valorModificador: 0 },
          { nombre: "Sin despuntillar", tipoModificador: TipoModificador.FIJO, valorModificador: 0 },
          { nombre: "Cortado por plancha", tipoModificador: TipoModificador.FIJO, valorModificador: 0 },
          { nombre: "Por unidad", tipoModificador: TipoModificador.FIJO, valorModificador: 0 },
        ],
      },
    },
  });
  await prisma.productoOpcion.create({
    data: {
      productoId: producto.id,
      opcionId: tipoTroquelado.id,
      requerida: true,
      orden: 2,
      dependeDeValorOpcionId: conTroquelado.id,
    },
  });

  // Laminado: también depende de "Con troquelado". +10000 sobre troquelado
  // simple para llegar a los $30000 de "troquelado + laminado" original.
  const laminado = await prisma.opcion.create({
    data: {
      nombre: "Laminado",
      valores: {
        create: [
          { nombre: "Sin laminar", tipoModificador: TipoModificador.FIJO, valorModificador: 0 },
          { nombre: "Laminado", tipoModificador: TipoModificador.FIJO, valorModificador: 10000 },
        ],
      },
    },
  });
  await prisma.productoOpcion.create({
    data: {
      productoId: producto.id,
      opcionId: laminado.id,
      requerida: true,
      orden: 3,
      dependeDeValorOpcionId: conTroquelado.id,
    },
  });
}

async function limpiarDatos() {
  await prisma.itemPedidoOpcion.deleteMany();
  await prisma.pago.deleteMany();
  await prisma.itemPedido.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.productoOpcion.deleteMany();
  await prisma.valorOpcion.deleteMany();
  await prisma.tramoPrecio.deleteMany();
  await prisma.opcion.deleteMany();
  await prisma.producto.deleteMany();
}

async function main() {
  await limpiarDatos();

  // ------------------------------------------------------------
  // IMPRENTA
  // ------------------------------------------------------------

  await crearProducto({
    id: "imprenta-a4",
    nombre: "Impresión A4",
    categoria: "Imprenta",
    descripcion: "Impresión por carilla A4, papel común o especial.",
    imagenUrl: "/productos/adhesivo.jpg",
    tipoCalculo: TipoCalculo.UNIDAD,
    precioBase: 100,
    cantidadMinima: 1,
    grupoOpciones: {
      nombre: "Tipo de papel / impresión",
      valores: [
        { nombre: "Blanco y negro (papel común)", modificador: 0 },
        { nombre: "Color inkjet (papel común)", modificador: 100 },
        { nombre: "Láser (papel común)", modificador: 400 },
        { nombre: "150gr Brillo", modificador: 700 },
        { nombre: "150gr Mate", modificador: 700 },
        { nombre: "Opalina 240gr", modificador: 900 },
        { nombre: "300gr Brillo", modificador: 1400 },
        { nombre: "300gr Mate", modificador: 1400 },
        { nombre: "Autoadhesivo Brillo", modificador: 1400 },
        { nombre: "Autoadhesivo Mate", modificador: 1400 },
        { nombre: "Kraft Fino", modificador: 700 },
        { nombre: "Kraft Grueso", modificador: 1400 },
      ],
    },
  });

  await crearProducto({
    id: "imprenta-a3",
    nombre: "Impresión A3",
    categoria: "Imprenta",
    descripcion: "Impresión por carilla A3 en papeles especiales.",
    imagenUrl: "/productos/adhesivo.jpg",
    tipoCalculo: TipoCalculo.UNIDAD,
    precioBase: 1600,
    cantidadMinima: 1,
    grupoOpciones: {
      nombre: "Tipo de papel",
      valores: [
        { nombre: "150gr Brillo", modificador: 0 },
        { nombre: "150gr Mate", modificador: 0 },
        { nombre: "Opalina 240gr", modificador: 400 },
        { nombre: "300gr Brillo", modificador: 1400 },
        { nombre: "300gr Mate", modificador: 1400 },
        { nombre: "Autoadhesivo Brillo", modificador: 1400 },
        { nombre: "Autoadhesivo Mate", modificador: 1400 },
        { nombre: "Kraft Fino", modificador: 0 },
        { nombre: "Kraft Grueso", modificador: 1400 },
      ],
    },
  });

  await crearProducto({
    id: "imprenta-tarjetas",
    nombre: "Tarjetas personales 5x9",
    categoria: "Imprenta",
    descripcion: "Tarjetas 5x9, pedido mínimo 100 unidades.",
    imagenUrl: "/productos/tarjetas.jpg",
    tipoCalculo: TipoCalculo.UNIDAD,
    precioBase: 120,
    cantidadMinima: 100,
    grupoOpciones: {
      nombre: "Faz",
      valores: [
        { nombre: "Simple faz", modificador: 0 },
        { nombre: "Doble faz", modificador: 60 },
      ],
    },
  });

  await crearProducto({
    id: "imprenta-adhesivo-a3",
    nombre: "Adhesivo A3 troquelado",
    categoria: "Imprenta",
    descripcion: "Hoja de adhesivos A3 troquelados a medida.",
    tipoCalculo: TipoCalculo.UNIDAD,
    precioBase: 5000,
    cantidadMinima: 1,
  });

  // ------------------------------------------------------------
  // GRÁFICA
  // ------------------------------------------------------------

  await crearProducto({
    id: "grafica-vinilo-corte",
    nombre: "Vinilo de corte",
    categoria: "Gráfica",
    descripcion: "Rollo de 58cm de ancho — precio por metro lineal.",
    tipoCalculo: TipoCalculo.UNIDAD,
    precioBase: 30000,
    cantidadMinima: 1,
  });

  // "Vinilo impreso" es un árbol de opciones: Acabado siempre visible;
  // "Troquelado" siempre visible; recién si se elige "Con troquelado" se
  // despliegan "Tipo de troquelado" y "¿Laminado?". Los sub-tipos de
  // troquelado quedan en $0 hasta tener el precio real de cada uno.
  await crearViniloImpreso();

  await crearProducto({
    id: "grafica-figura-troquelada",
    nombre: "Figuras troqueladas",
    categoria: "Gráfica",
    descripcion:
      "Figuras y personajes troquelados a medida (ej: muñecos, carteles con silueta). Precio a confirmar según diseño.",
    imagenUrl: "/productos/figura-troquelada.jpg",
    tipoCalculo: TipoCalculo.UNIDAD,
    precioBase: 0,
    cantidadMinima: 1,
  });

  await crearProducto({
    id: "grafica-lona",
    nombre: "Lona",
    categoria: "Gráfica",
    descripcion: "Lona por metro cuadrado. Mínimo 1 m², después se cobra la proporción exacta.",
    tipoCalculo: TipoCalculo.M2,
    precioBase: 18000,
    cantidadMinima: 1,
    grupoOpciones: {
      nombre: "Acabado",
      valores: [
        { nombre: "Brillo", modificador: 0 },
        { nombre: "Mate", modificador: 0 },
      ],
    },
  });

  await crearProducto({
    id: "grafica-papel-gigantografia",
    nombre: "Papel para gigantografía",
    categoria: "Gráfica",
    descripcion: "Papel para gigantografía por metro cuadrado.",
    tipoCalculo: TipoCalculo.M2,
    precioBase: 10000,
    grupoOpciones: {
      nombre: "Tipo de papel",
      valores: [
        { nombre: "Obra", modificador: 0 },
        { nombre: "City", modificador: 15000 },
        { nombre: "Foto", modificador: 15000 },
      ],
    },
  });

  await crearProducto({
    id: "grafica-cartel-corrugado",
    nombre: "Cartel corrugado",
    categoria: "Gráfica",
    descripcion: "Cartel de corrugado en tamaños estándar.",
    tipoCalculo: TipoCalculo.UNIDAD,
    precioBase: 30000,
    cantidadMinima: 1,
    grupoOpciones: {
      nombre: "Tamaño",
      valores: [
        { nombre: "1 x 0,70m", modificador: 0 },
        { nombre: "2 x 1m", modificador: 40000 },
      ],
    },
  });

  await crearProducto({
    id: "grafica-cartel-pvc",
    nombre: "Cartel PVC 2,40 x 1,20m",
    categoria: "Gráfica",
    descripcion: "Cartel de PVC en tamaño estándar 2,40 x 1,20m.",
    tipoCalculo: TipoCalculo.UNIDAD,
    precioBase: 240000,
    cantidadMinima: 1,
  });

  await crearProducto({
    id: "grafica-cartel-pai",
    nombre: "Cartel PAI 2 x 1m",
    categoria: "Gráfica",
    descripcion: "Cartel de PAI en tamaño estándar 2 x 1m.",
    tipoCalculo: TipoCalculo.UNIDAD,
    precioBase: 80000,
    cantidadMinima: 1,
  });

  await crearProducto({
    id: "grafica-bastidor",
    nombre: "Bastidor",
    categoria: "Gráfica",
    descripcion: "Bastidor armado por metro cuadrado.",
    imagenUrl: "/productos/bastidor.jpg",
    tipoCalculo: TipoCalculo.M2,
    precioBase: 50000,
    grupoOpciones: {
      nombre: "Material",
      valores: [
        { nombre: "Madera", modificador: 0 },
        { nombre: "Hierro", modificador: 30000 },
      ],
    },
  });

  await crearProducto({
    id: "grafica-terminaciones",
    nombre: "Terminaciones especiales",
    categoria: "Gráfica",
    descripcion: "Terminaciones para impresiones de gran formato, por metro cuadrado.",
    tipoCalculo: TipoCalculo.M2,
    precioBase: 25000,
    grupoOpciones: {
      nombre: "Tipo",
      valores: [
        { nombre: "Esmerilado impreso", modificador: 0 },
        { nombre: "Microperforado", modificador: 0 },
        { nombre: "Holográfico troquelado", modificador: 35000 },
      ],
    },
  });

  const total = await prisma.producto.count();
  console.log(`Seed listo: ${total} productos cargados.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
