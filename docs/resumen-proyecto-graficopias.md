# Graficopias — Tienda online (canal de ventas)

## Contexto del negocio

Graficopias es una gráfica/imprenta ("Gráfica digital & gran formato") que ofrece
impresiones digitales, banners, ploteos, vinilos e imprenta. El objetivo de este
proyecto es sumar un canal de ventas online que le saque trabajo manual al local
(atender pedidos, cotizar, cobrar señas) sin necesitar que el cliente final se
registre ni vaya presencialmente.

Contacto público del negocio: WhatsApp 11 2669 5842 · graficopias.10@gmail.com

## Audiencia

Personas particulares y negocios, sin rango etario definido. El uso es
mayormente mobile, pero el sitio debe ser responsive (mobile + web).

## Flujo principal (cliente)

1. Entra al catálogo **sin necesidad de registrarse**.
2. Elige un producto (ej: Impresión A4, Impresión A3, Cartel, Banner).
3. Selecciona opciones del producto (tipo de papel, terminación, tamaño, o
   "que lo diseñen" con nota) — **el presupuesto se recalcula en vivo** con
   cada selección.
4. Pasa a confirmación: dejar nombre + teléfono o email de contacto, y elegir
   si paga **seña parcial o el total**.
5. Checkout: paga con **Mercado Pago** (Checkout Pro). No hace falta cuenta.
6. El pedido recién entra a la cola cuando el pago se confirma — **por
   webhook de Mercado Pago, nunca por el regreso del navegador**.
7. Se notifica por mail a la gráfica cuando entra un pedido nuevo.

## Flujo principal (Admin)

- Login propio (usuario/contraseña), separado del catálogo público, protegiendo
  las rutas `/admin/*` con middleware.
- Cola de pedidos con estados: `Señado → En preparación → Comenzado →
  Terminado → Entregado`.
- Al marcar "Entregado", el pedido pasa a una sección aparte de finalizados
  (no se borra, solo se separa de la cola activa).

## Decisiones de alcance para la v1 (MVP)

El presupuesto de esta primera entrega es acotado, así que se recortó
deliberadamente el alcance. Lo que **no** entra en la v1 (queda para fases
futuras, ya conversadas y presupuestadas aparte):

- Sin panel Admin de alta/edición de productos y opciones — los productos y
  precios se cargan directo en la base de datos (o un seed), no hay CRUD.
- Sin registro/cuenta de cliente (ya estaba pensado como opcional, se sacó
  entero).
- Un solo medio de pago: **Mercado Pago únicamente**. La opción de
  transferencia + comprobante (con verificación manual en el Admin) queda
  planificada pero no se construye en esta v1.
- Sin subida de archivo para "que lo diseñen" — solo un checkbox + campo de
  notas en esta versión.
- Cola de pedidos como tabla simple con filtro por estado, no un panel kanban
  con lógica de archivado compleja.

El modelo de datos (ver `schema.prisma` adjunto) ya está preparado para estas
fases futuras sin necesitar romper migraciones (ej: el enum de medios de pago
ya incluye `TRANSFERENCIA`, con sus campos listos pero sin usar todavía).

## Identidad de marca

- Paleta: negro (`#0A0A0A`), rojo (`#E2231A`), blanco.
- Isotipo: punto rojo pequeño al centro, luego un semicírculo rojo (con
  hueco), luego otro semicírculo rojo más grande — abiertos hacia la
  derecha, no son círculos concéntricos completos. Va al costado del
  wordmark "GRAFICOPIAS".
- Elemento gráfico secundario: franjas diagonales rojas.
- El wordmark real de la marca usa una tipografía cromada/plateada (no
  replicable en UI plana); en pantalla usar el texto en blanco o rojo sólido
  sobre fondo negro.

## Stack técnico decidido

- **Next.js (App Router) + TypeScript** — frontend y backend (API routes) en
  el mismo proyecto.
- **PostgreSQL + Prisma** — ver `schema.prisma` adjunto para el modelo de
  datos completo (productos configurables, opciones con modificadores de
  precio, pedidos, pagos con soporte para Mercado Pago vía webhook).
- **NextAuth (Credentials)** para el login de Admin — sesión simple,
  protegiendo `/admin/*` vía middleware.
- **Mercado Pago SDK oficial de Node** — Checkout Pro, con preferencia +
  webhook (usar `external_reference` = id del pedido para cruzar la
  notificación).
- **Resend o Nodemailer** para el mail de notificación de pedido nuevo a la
  gráfica.
- **Cloudflare R2** (o Supabase Storage) para almacenamiento de imágenes —
  no usado en la v1 (no hay subida de archivos todavía), pero es la elección
  para cuando se sume en fase 2. Se descartó Google Drive como backend de
  storage por no estar pensado para servir archivos públicos en producción.
- **Hosting**: Vercel (plan Pro, ya que el Hobby no permite uso comercial).
- **Base de datos hosteada**: Supabase o Neon (capa gratuita alcanza para el
  volumen inicial).
- **Dominio**: `.com.ar` vía NIC Argentina.

## Orden de construcción sugerido

1. Scaffolding del proyecto (Next.js + Prisma conectado a Postgres) y primera
   migración con el schema adjunto.
2. Seed de productos con datos de prueba (no hace falta esperar la lista de
   precios real del cliente para arrancar).
3. Catálogo + página de producto con cálculo dinámico de presupuesto (ver
   pantallas de referencia).
4. Checkout: datos de contacto + elección seña/total, guardando el pedido en
   estado `PENDIENTE_PAGO` (todavía sin Mercado Pago conectado).
5. Integración de Mercado Pago (preferencia + webhook) — aislarla y probarla
   con credenciales de test antes de conectarla al resto del flujo.
6. Panel Admin: login + cola de pedidos con cambio de estado y sección de
   entregados.

## Pantallas ya diseñadas (referencia visual)

Se armaron wireframes funcionales (mobile + web) de: Inicio/catálogo,
Producto (con cálculo en vivo), Confirmación de pedido, Checkout (Mercado
Pago), Login de Admin, y Cola de pedidos del Admin. Sirven como referencia de
layout y de qué elementos debe tener cada pantalla — se pueden reconstruir
directamente en código a partir de esta descripción, sin depender de un
archivo de diseño externo.

## Pendiente de relevar antes de cargar datos reales

Falta la planilla de precios completada por la gráfica: cómo se calcula cada
producto (por unidad, por m², por tramos), precios base, opciones y sus
modificadores, seña típica, y datos de la cuenta para transferencias (fase
futura). Hasta tenerla, se puede avanzar todo el desarrollo con datos de
prueba.
