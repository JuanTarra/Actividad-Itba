# Arquitectura

## Visión general

API REST monolítica en capas simples, sin frontend. Sigue el patrón
`route → controller → model`, sin capa de "service" separada dado el
tamaño del proyecto.

```
src/
  config/
    db.js              Conexión a MongoDB (mongoose)
  models/
    User.js
    Category.js
    Product.js
    Order.js
  controllers/
    authController.js
    productController.js
    categoryController.js
    orderController.js
  middleware/
    auth.js            protect (JWT) + adminOnly (rol)
    errorHandler.js     notFound (404) + errorHandler (handler global)
  routes/
    authRoutes.js
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

- **User**: `name`, `email`, `password` (hasheado con bcrypt, `select: false`
  por defecto), `role` (`customer` | `admin`).
- **Category**: `name`, `description`.
- **Product**: `name`, `description`, `price`, `stock`, `category` (ref a
  `Category`), `imageUrl`, `active`. Tiene índice de texto en
  `name`/`description` para búsqueda.
- **Order**: `user` (ref), `items` (subdocumentos con `product`, `quantity`,
  `unitPrice`), `discountCode`, `total`, `status`
  (`pending` | `paid` | `shipped` | `cancelled`).

## Autenticación y autorización

- JWT firmado con `JWT_SECRET`, enviado como `Authorization: Bearer <token>`.
- Middleware `protect` decodifica el token, busca el usuario y lo cuelga en
  `req.user`.
- Middleware `adminOnly` se encadena después de `protect` para restringir
  rutas de administración (alta/baja/modificación de productos y
  categorías, cambio de estado de órdenes).

## Flujo de creación de una orden

1. El cliente envía `items: [{productId, quantity}]` y opcionalmente
   `discountCode`.
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
