# Arquitectura

## Visión general

API REST monolítica en capas simples, sin frontend y sin sistema de
usuarios/login. Sigue el patrón `route → controller → model`, sin capa
de "service" separada dado el tamaño del proyecto.

```
src/
  config/
    db.js              Conexión a MongoDB (mongoose)
  models/
    Category.js
    Product.js
    Order.js
  controllers/
    productController.js
    categoryController.js
    orderController.js
  middleware/
    errorHandler.js     notFound (404) + errorHandler (handler global)
  routes/
    productRoutes.js
    categoryRoutes.js
    orderRoutes.js
  app.js                Configuración de Express (middlewares, rutas)
  server.js              Entry point: conecta DB y levanta el server
scripts/
  seed.js                Poblado de datos de testing
  decrypt-errors.js       Utilidad para leer docs/errors.enc
docs/
  errors.enc              Listado de errores conocidos (encriptado)
```

## Modelo de datos

- **Category**: `name`, `description`.
- **Product**: `name`, `description`, `price`, `stock`, `category` (ref a
  `Category`), `imageUrl`, `active`. Tiene índice de texto en
  `name`/`description` para búsqueda.
- **Order**: `customerName`, `customerEmail` (datos sueltos del
  comprador, sin cuenta ni login), `items` (subdocumentos con `product`,
  `quantity`, `unitPrice`), `discountCode`, `total`, `status`
  (`pending` | `paid` | `shipped` | `cancelled`).

## Autenticación

No hay. Todos los endpoints son públicos; no existe modelo de usuario ni
JWT. Cualquier control de acceso queda fuera del alcance de este
proyecto.

## Flujo de creación de una orden

1. El cliente envía `customerName`, `customerEmail`,
   `items: [{productId, quantity}]` y opcionalmente `discountCode`.
2. Por cada item se busca el producto, se arma el subdocumento de la orden
   y se acumula el `total`.
3. Se descuenta stock del producto.
4. Si el `discountCode` es válido, se aplica el porcentaje sobre el total.
5. Se persiste la orden con `status: 'pending'`.

## Manejo de errores

Todas las rutas delegan errores no controlados a `next(err)`, que cae en
el middleware global `errorHandler`. Las rutas inexistentes son
capturadas por `notFound` antes de llegar ahí.

## Decisiones / limitaciones conocidas

Este proyecto prioriza tener una base funcional simple sobre cobertura
exhaustiva de casos borde. El detalle de errores conocidos y sus efectos
está documentado por separado y de forma encriptada en `docs/errors.enc`
(ver README para instrucciones de desencriptado) — no se listan acá a
propósito.
