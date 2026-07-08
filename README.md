# Sistema de Pedidos Online - Backend de Trabajadores (Mr Sushi)

Este repositorio contiene el **Backend Serverless** para la gestión operativa y el panel de trabajadores de Mr Sushi. Forma parte de una arquitectura basada en eventos (EDA) y utiliza Node.js con el Serverless Framework.

---

## Arquitectura y Tecnologías

- **Runtime:** Node.js 18.x
- **Framework:** Serverless Framework (v3)
- **Infraestructura AWS:** Lambda, API Gateway (HTTP API), DynamoDB
- **Autenticación:** JWT (JSON Web Tokens)
- **Multi-tenancy:** Particionado por `tenantId` (ej. `mrsushi`)

El backend de trabajadores comparte tablas de DynamoDB (órdenes) y el bus de eventos de EventBridge con el backend de clientes (`backend_cliente`), pero mantiene su propia tabla de trabajadores (`WorkersTable`) y maneja la autenticación de manera independiente.

---

## Endpoints (API de Trabajadores)

El backend expone las siguientes rutas a través de AWS API Gateway:

### Autenticación
| Endpoint | Método | Descripción |
|---|---|---|
| `/workers/auth/login` | `POST` | Autenticación exclusiva para trabajadores (admin, cocinero, empacador, repartidor). Devuelve un token JWT. |

### Panel de Pedidos
Requieren un token JWT válido en el header `Authorization`.

| Endpoint | Método | Descripción |
|---|---|---|
| `/workers/orders` | `GET` | Lista todos los pedidos activos para el panel del trabajador. |
| `/workers/orders/{orderId}` | `GET` | Obtiene el detalle completo de un pedido, incluyendo el progreso (steps) y los task tokens asociados de Step Functions. |

### Flujo de Trabajo (Workflow)
Estos endpoints permiten al trabajador avanzar el estado de preparación y entrega de un pedido.

| Endpoint | Método | Descripción |
|---|---|---|
| `/workers/orders/{orderId}/steps/{step}/iniciar` | `POST` | El trabajador toma y asigna un paso específico del pedido (ej. empezar a cocinar). |
| `/workers/orders/{orderId}/steps/{step}/completar` | `POST` | El trabajador completa un paso, lo que envía la señal a AWS Step Functions para avanzar el flujo del pedido. |

---

## Estructura de DynamoDB

- **WorkersTable:** Almacena los perfiles y credenciales de los trabajadores. 
  - `Partition Key (PK):` `tenantId`
  - `Sort Key (SK):` `email`
- **OrdersTable:** (Compartida) Almacena el estado y detalle de los pedidos.

---

## Configuración y Despliegue

### 1. Variables de Entorno
Copia el archivo `.env.example` a `.env` y configura el secreto JWT. Este secreto debe coincidir con el utilizado en `backend_cliente` para que los tokens sean compatibles.
```bash
cp backend/.env.example backend/.env
```

### 2. Instalación de Dependencias
```bash
cd backend
npm install
```

### 3. Despliegue
Antes de desplegar, asegúrate de:
1. Reemplazar `TU_ACCOUNT_ID` en `backend/serverless.yml` con tu ID de cuenta AWS (si usas el LabRole).
2. Haber desplegado primero el `backend_cliente` (ya que este servicio asume que las tablas y el bus de eventos compartidos ya existen).

Despliegue a AWS:
```bash
npx sls deploy
```

*(Opcional) Puedes desplegar a un stage específico:*
```bash
npx sls deploy --stage dev
```

### 4. Creación del Primer Trabajador
Una vez desplegado, puedes crear un trabajador de prueba usando el script proporcionado:
```bash
node scripts/seedWorker.js
```
