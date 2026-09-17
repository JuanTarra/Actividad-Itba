# Ecommerce API

API backend de un e-commerce simple. Solo expone endpoints REST (JSON),
sin frontend, sin login ni sistema de usuarios.

**Stack:** Node.js + Express + MongoDB (Mongoose).

## Requisitos

- Node.js 18+
- MongoDB (local o Atlas)

## Instalación

```bash
git clone <url-del-repo>
cd ecommerce-api
npm install
cp .env.example .env
# completar .env con tus valores (ver sección Variables de entorno)
```

## Variables de entorno

Ver `.env.example`. Resumen:

| Variable | Descripción |
|---|---|
| `PORT` | Puerto HTTP del servidor |
| `MONGO_URI` | Cadena de conexión a MongoDB |
| `NODE_ENV` | `development` / `production` / `test` |
| `CORS_ORIGIN` | Origen permitido para CORS |

## Poblar la base con datos de testing

```bash
npm run seed
```

Esto limpia las colecciones y crea:
- 3 categorías (Electrónica, Hogar, Indumentaria)
- 6 productos de ejemplo
- 1 orden de ejemplo

## Levantar el servidor

```bash
npm run dev   # con nodemon
# o
npm start
```

Por defecto queda en `http://localhost:4000`.

## Endpoints principales

Todas las respuestas son JSON. No hay autenticación: todos los endpoints
son públicos.

### Productos
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/products` | Lista productos. Query: `search`, `category`, `page`, `limit`, `sort` |
| GET | `/api/products/:id` | Detalle de un producto |
| POST | `/api/products` | Crea un producto |
| PUT | `/api/products/:id` | Actualiza un producto |
| DELETE | `/api/products/:id` | Elimina un producto |

### Categorías
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/categories` | Lista categorías |
| POST | `/api/categories` | Crea una categoría |
| PUT | `/api/categories/:id` | Actualiza una categoría |
| DELETE | `/api/categories/:id` | Elimina una categoría |

### Órdenes
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/orders` | Crea una orden. Body: `customerName`, `customerEmail`, `items: [{productId, quantity}]`, `discountCode?` |
| GET | `/api/orders` | Lista órdenes. Query opcional: `email` para filtrar por comprador |
| GET | `/api/orders/:id` | Detalle de una orden |
| PUT | `/api/orders/:id/status` | Actualiza el estado de una orden |

### Salud
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Chequeo simple de que el servicio está arriba |

## Códigos de descuento de ejemplo (seed)

- `BIENVENIDA10` → 10% off
- `AGENCIA01` → 15% off

## Documentación adicional

- `ARCHITECTURE.md` — decisiones de arquitectura y estructura de carpetas.
- `docs/errors.enc` — listado de errores conocidos del proyecto, en formato
  encriptado (ver más abajo).

## Sobre `docs/errors.enc`

Este repositorio incluye intencionalmente un archivo encriptado con un
listado de errores/bugs presentes en el código y sus efectos. No está
documentado en texto plano a propósito. Para desencriptarlo:

```bash
node scripts/decrypt-errors.js "<clave>"
```

La clave se entrega por fuera del repositorio (no está commiteada en
ningún archivo del proyecto).
